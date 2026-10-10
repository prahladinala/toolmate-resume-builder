import { runChromeAIPrompt, checkChromeAIAvailability } from "./chromeAI";
import type { ResumeData } from "@/types/resume";

export interface JDMatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  recommendations: string[];
  tailoredSummarySuggestion?: string;
  tailoredSkillsSuggestion?: string[];
}

/**
 * Extracts clean words and tokens from text for fallback keyword comparison.
 */
function extractTokens(text: string): Set<string> {
  const stopWords = new Set([
    "the",
    "and",
    "or",
    "in",
    "at",
    "to",
    "for",
    "with",
    "on",
    "of",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "can",
    "could",
    "will",
    "would",
    "shall",
    "should",
    "may",
    "might",
    "must",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "am",
    "any",
    "as",
    "because",
    "before",
    "below",
    "between",
    "both",
    "but",
    "by",
    "during",
    "each",
    "few",
    "from",
    "further",
    "here",
    "how",
    "if",
    "into",
    "it",
    "its",
    "more",
    "most",
    "no",
    "nor",
    "not",
    "off",
    "only",
    "other",
    "our",
    "out",
    "over",
    "own",
    "same",
    "so",
    "than",
    "that",
    "their",
    "then",
    "there",
    "these",
    "they",
    "this",
    "those",
    "through",
    "too",
    "under",
    "until",
    "up",
    "very",
    "what",
    "when",
    "where",
    "which",
    "while",
    "who",
    "whom",
    "why",
    "you",
    "your",
    "years",
    "experience",
    "work",
    "responsibilities",
    "requirements",
    "skills",
    "job",
    "candidate",
    "role",
    "team",
    "company",
    "ability",
  ]);

  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, " ")
    .split(/\s+/);

  const tokens = new Set<string>();
  clean.forEach((w) => {
    const trimmed = w.trim();
    if (trimmed.length > 2 && !stopWords.has(trimmed)) {
      tokens.add(trimmed);
    }
  });

  return tokens;
}

/**
 * Fallback keyword matching when on-device LLM output is not structured JSON.
 */
export function calculateFallbackJDMatch(
  jdText: string,
  resumeData: ResumeData,
): JDMatchResult {
  const resumeTextParts: string[] = [
    resumeData.summary || "",
    resumeData.personalInfo.title || "",
    ...resumeData.skills.map((s) => s.name),
    ...resumeData.experience.map(
      (e) => `${e.role} ${e.company} ${e.description}`,
    ),
    ...resumeData.projects.map(
      (p) => `${p.name} ${p.description} ${(p.technologies || []).join(" ")}`,
    ),
  ];

  const resumeFull = resumeTextParts.join(" ").toLowerCase();
  const jdTokens = Array.from(extractTokens(jdText));

  // Heuristic common tech/industry keywords
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdTokens.forEach((token) => {
    if (token.length < 3) return;
    // test exact word boundary match
    const regex = new RegExp(
      `\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    if (regex.test(resumeFull)) {
      matchedKeywords.push(token);
    } else {
      missingKeywords.push(token);
    }
  });

  const total = matchedKeywords.length + missingKeywords.length;
  const matchScore =
    total > 0
      ? Math.min(
          95,
          Math.max(25, Math.round((matchedKeywords.length / total) * 100)),
        )
      : 70;

  return {
    matchScore,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 12),
    strengths: [
      `Your resume matches ${matchedKeywords.length} key technical & domain terms from the job post.`,
      resumeData.experience.length > 0
        ? "Solid professional experience structure."
        : "Clear project background.",
    ],
    recommendations: [
      `Consider incorporating keywords like "${missingKeywords.slice(0, 4).join('", "')}" into your bullet points.`,
      "Tailor your Professional Summary to mirror the core mission statement in the job post.",
    ],
  };
}

/**
 * Runs on-device Gemini Nano to match and score a target Job Description against the user's resume.
 */
export async function analyzeJobDescriptionWithNano(
  jdText: string,
  resumeData: ResumeData,
): Promise<JDMatchResult> {
  const availability = await checkChromeAIAvailability();
  if (!availability.isAvailable) {
    return calculateFallbackJDMatch(jdText, resumeData);
  }

  const resumeSummary = `
Candidate Target Role: ${resumeData.personalInfo.title || "Software Professional"}
Professional Summary: ${resumeData.summary || "None provided"}
Skills: ${resumeData.skills.map((s) => s.name).join(", ") || "None"}
Experience Highlights:
${resumeData.experience
  .map((e) => `- ${e.role} at ${e.company}: ${e.description?.slice(0, 150)}...`)
  .join("\n")}
Projects:
${resumeData.projects.map((p) => `- ${p.name}: ${p.description?.slice(0, 100)}...`).join("\n")}
`.trim();

  const prompt = `You are an expert ATS (Applicant Tracking System) recruiter and resume optimization engineer.

Analyze this target Job Description against the Candidate's Resume.

[TARGET JOB DESCRIPTION]
${jdText.slice(0, 1500)}

[CANDIDATE RESUME PROFILE]
${resumeSummary}

INSTRUCTIONS:
1. Calculate an accurate ATS Match Score percentage from 0 to 100 based on keyword and qualifications alignment.
2. List 4 to 10 matched keywords found in both.
3. List 4 to 10 critical missing keywords/skills from the Job Description that the candidate should add.
4. Provide 2 strengths.
5. Provide 2 actionable recommendations.
6. Provide an ATS-tailored 2-3 sentence Professional Summary optimized specifically for this Job Description.

FORMAT YOUR RESPONSE AS STRICT JSON ONLY:
{
  "matchScore": 78,
  "matchedKeywords": ["React", "TypeScript", "Next.js", "CI/CD"],
  "missingKeywords": ["Docker", "GraphQL", "AWS Lambda", "Kubernetes"],
  "strengths": ["Strong frontend foundation", "Hands-on Next.js experience"],
  "recommendations": ["Incorporate containerization keywords", "Highlight scalable API design"],
  "tailoredSummary": "<optimized 2-3 sentence summary>"
}
Do not include any conversational preamble or text outside the JSON.`;

  try {
    const raw = await runChromeAIPrompt(prompt, {
      systemPrompt:
        "You are a precise ATS scoring engine that outputs strict JSON.",
    });

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        matchScore:
          typeof parsed.matchScore === "number"
            ? Math.min(100, Math.max(0, parsed.matchScore))
            : 75,
        matchedKeywords: Array.isArray(parsed.matchedKeywords)
          ? parsed.matchedKeywords
          : [],
        missingKeywords: Array.isArray(parsed.missingKeywords)
          ? parsed.missingKeywords
          : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [],
        tailoredSummarySuggestion: parsed.tailoredSummary || undefined,
      };
    }
  } catch (err) {
    console.warn(
      "Gemini Nano JD parse failed, falling back to heuristic matcher:",
      err,
    );
  }

  return calculateFallbackJDMatch(jdText, resumeData);
}
