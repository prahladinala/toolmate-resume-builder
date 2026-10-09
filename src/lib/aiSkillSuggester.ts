import type { ResumeData } from "@/types/resume";
import { runChromeAIPrompt } from "./chromeAI";

export interface SuggestedSkill {
  id: string;
  name: string;
  category: string;
  reason: string;
  isAtsCrucial: boolean;
}

export interface SkillSuggestionResult {
  suggestions: SuggestedSkill[];
  atsInsights: string[];
}

/**
 * Compiles entered resume information into a concise summary for AI analysis.
 */
export function buildResumeContext(data: ResumeData): string {
  const parts: string[] = [];

  if (data.personalInfo?.title) {
    parts.push(`Target Role: ${data.personalInfo.title}`);
  }

  if (data.summary) {
    parts.push(`Professional Summary: ${data.summary.trim()}`);
  }

  if (data.experience && data.experience.length > 0) {
    const expText = data.experience
      .map(
        (exp) =>
          `- ${exp.role || "Role"} at ${exp.company || "Company"}: ${exp.description || ""}`,
      )
      .join("\n");
    parts.push(`Work Experience:\n${expText}`);
  }

  if (data.projects && data.projects.length > 0) {
    const projText = data.projects
      .map(
        (proj) =>
          `- ${proj.name || "Project"}: Tech: ${
            Array.isArray(proj.technologies)
              ? proj.technologies.join(", ")
              : String(proj.technologies || "")
          }. ${proj.description || ""}`,
      )
      .join("\n");
    parts.push(`Projects:\n${projText}`);
  }

  if (data.education && data.education.length > 0) {
    const eduText = data.education
      .map(
        (edu) =>
          `- ${edu.degree || "Degree"} from ${edu.institution || "Institution"}`,
      )
      .join("\n");
    parts.push(`Education:\n${eduText}`);
  }

  if (data.skills && data.skills.length > 0) {
    parts.push(
      `Current Skills Already Listed: ${data.skills.map((s) => s.name).join(", ")}`,
    );
  }

  return parts.join("\n\n");
}

/**
 * Uses Gemini Nano on-device to suggest missing skills and ATS keywords based on all entered resume data.
 */
export async function generateSkillSuggestions(
  data: ResumeData,
): Promise<SkillSuggestionResult> {
  const context = buildResumeContext(data);
  const existingSkillNames = new Set(
    (data.skills || []).map((s) => s.name.toLowerCase().trim()),
  );

  const targetTitle = data.personalInfo?.title || "Professional";

  const prompt = `You are an elite ATS (Applicant Tracking System) specialist and technical recruiter.
Analyze the candidate's resume data below.

Candidate Background:
${context || `Target Role: ${targetTitle}`}

Based on the work experience, projects, summary, and target role, recommend 8 to 14 high-impact skills, modern tools, and ATS keywords that are MISSING from their current skills list to dramatically boost their ATS score.

Format your response in this exact format:

**Category: Technical & Core Skills**
- [Skill Name] | [Brief reason why it boosts ATS match]
- [Skill Name] | [Brief reason why it boosts ATS match]

**Category: Tools, Frameworks & Cloud**
- [Tool Name] | [Brief reason why it boosts ATS match]
- [Tool Name] | [Brief reason why it boosts ATS match]

**Category: Methodologies & ATS Keywords**
- [Keyword/Methodology] | [Crucial ATS keyword for recruiter matching]
- [Keyword/Methodology] | [Crucial ATS keyword for recruiter matching]

**ATS Score Insights:**
* [Tip 1 on how these keywords increase parsing score]
* [Tip 2 on keyword placement]`;

  const rawOutput = await runChromeAIPrompt(prompt, {
    systemPrompt:
      "You are an expert ATS resume keyword scanner. Output strictly formatted skill recommendations.",
  });

  return parseSkillResponse(rawOutput, existingSkillNames);
}

/**
 * Parses Gemini Nano skill recommendations output into structured SuggestedSkill objects.
 */
function parseSkillResponse(
  raw: string,
  existingSkillNames: Set<string>,
): SkillSuggestionResult {
  const suggestions: SuggestedSkill[] = [];
  const atsInsights: string[] = [];

  if (!raw || !raw.trim()) {
    return { suggestions: [], atsInsights: [] };
  }

  const lines = raw.split("\n");
  let currentCategory = "Technical Skills";
  let inInsights = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check for ATS Insights section
    if (/^(?:\*{0,2}ATS Score Insights|\*{0,2}ATS Insights)/i.test(line)) {
      inInsights = true;
      continue;
    }

    if (inInsights) {
      if (line.startsWith("*") || line.startsWith("-")) {
        const insightText = line.replace(/^[-*]\s*/, "").trim();
        if (insightText) atsInsights.push(insightText);
      }
      continue;
    }

    // Check for category headers
    const categoryMatch = line.match(/(?:\*{0,2}Category:\s*([^*:]+)\*{0,2})/i);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Check for skill bullet lines: "- Skill Name | Reason" or "- Skill Name: Reason"
    if (line.startsWith("-") || line.startsWith("*") || /^\d+\./.test(line)) {
      const cleanBullet = line.replace(/^[-*\d.]+\s*/, "").trim();
      let skillName = "";
      let reason = "";

      if (cleanBullet.includes("|")) {
        const parts = cleanBullet.split("|");
        skillName = parts[0].trim();
        reason = parts.slice(1).join("|").trim();
      } else if (cleanBullet.includes(" - ")) {
        const parts = cleanBullet.split(" - ");
        skillName = parts[0].trim();
        reason = parts.slice(1).join(" - ").trim();
      } else if (cleanBullet.includes(":")) {
        const parts = cleanBullet.split(":");
        skillName = parts[0].trim();
        reason = parts.slice(1).join(":").trim();
      } else {
        skillName = cleanBullet;
        reason = "Recommended ATS match for your experience";
      }

      // Remove markdown brackets, bolding, or quotes from skill name
      skillName = skillName.replace(/[[\]*`"']/g, "").trim();
      reason = reason.replace(/[[\]*`"']/g, "").trim();

      if (
        skillName &&
        skillName.length >= 2 &&
        skillName.length <= 40 &&
        !existingSkillNames.has(skillName.toLowerCase())
      ) {
        const isAtsCrucial =
          /ats|crucial|essential|ranking|keyword|industry/i.test(reason) ||
          /methodolog|keyword/i.test(currentCategory);

        suggestions.push({
          id: `suggest-${skillName.toLowerCase().replace(/\s+/g, "-")}-${suggestions.length}`,
          name: skillName,
          category: currentCategory,
          reason: reason || "High-priority ATS keyword",
          isAtsCrucial,
        });
      }
    }
  }

  // Fallback: If formatted parsing yielded nothing, extract comma-separated or simple list
  if (suggestions.length === 0) {
    const items = raw
      .replace(/\*\*.*?\*\*/g, "")
      .split(/[,\n]/)
      .map((item) => item.replace(/^[-*•\d.]+\s*/, "").trim())
      .filter((item) => item.length >= 2 && item.length <= 35);

    items.forEach((item, idx) => {
      if (!existingSkillNames.has(item.toLowerCase())) {
        suggestions.push({
          id: `suggest-fallback-${idx}`,
          name: item,
          category: "Relevant Skills",
          reason: "Identified from your resume context",
          isAtsCrucial: idx < 3,
        });
      }
    });
  }

  return { suggestions, atsInsights };
}
