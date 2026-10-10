/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResumeData, Experience, Education, Skill } from "@/types/resume";

/**
 * Extracts plain text from an uploaded PDF file in the browser using pdfjs-dist.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import pdfjs-dist to avoid SSR / node bundling issues
  const pdfjs = await import("pdfjs-dist");

  // Use local same-origin worker to avoid cross-origin unpkg / CDN module worker restrictions
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
  });
  const pdfDoc = await loadingTask.promise;

  let extractedText = "";

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      .map((item: any) => item.str || "")
      .join(" ");
    extractedText += pageStrings + "\n\n";
  }

  return extractedText.trim();
}

/**
 * Attempts to parse raw resume text or LinkedIn text into structured ResumeData.
 * Uses on-device Gemini Nano if available, falling back to algorithmic regex heuristics.
 */
export async function parseResumeText(rawText: string): Promise<ResumeData> {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error("No text provided to parse.");
  }

  // 1. Try On-Device Gemini Nano
  try {
    const ai =
      typeof window !== "undefined"
        ? (window as any).ai || (window as any).model
        : null;

    if (ai?.languageModel) {
      const session = await ai.languageModel.create({
        systemPrompt:
          "You are an ATS resume parser. Output ONLY valid JSON without markdown fences, comments, or extra text.",
      });

      const prompt = `Extract all structured resume data from this text into a JSON object matching this TypeScript structure:
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "title": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string"
  },
  "summary": "string",
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "YYYY-MM or string",
      "endDate": "YYYY-MM or string",
      "current": boolean,
      "description": "bullet points formatted with •"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "score": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "Languages | Frameworks & Libraries | Cloud & DevOps | Databases & Tools"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ]
}

Resume Text:
${rawText.slice(0, 5000)}`;

      const response = await session.prompt(prompt);
      session.destroy?.();

      const cleaned = response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return normalizeParsedData(parsed);
    }
  } catch (err) {
    console.warn(
      "Gemini Nano parser failed or unavailable, falling back to heuristic parser:",
      err,
    );
  }

  // 2. Fallback Heuristic & Regular Expression Parser
  return parseWithHeuristics(rawText);
}

/**
 * Robust regex-based heuristic extractor for offline environments.
 */
function parseWithHeuristics(text: string): ResumeData {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Email
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  const email = emailMatch ? emailMatch[0] : "";

  // Phone
  const phoneMatch = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  );
  const phone = phoneMatch ? phoneMatch[0] : "";

  // LinkedIn
  const linkedinMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
  );
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";

  // GitHub
  const githubMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i,
  );
  const github = githubMatch ? githubMatch[0] : "";

  // First and Last Name (usually in first 2 non-empty lines)
  let firstName = "";
  let lastName = "";
  let title = "";

  if (lines.length > 0) {
    const candidateName = lines[0].replace(/[|•,].*$/, "").trim();
    const parts = candidateName.split(/\s+/);
    if (parts.length >= 2 && parts[0].length < 20 && parts[1].length < 20) {
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    } else if (parts.length === 1) {
      firstName = parts[0];
    }
  }

  if (
    lines.length > 1 &&
    !lines[1].includes("@") &&
    !lines[1].includes("http")
  ) {
    title = lines[1].slice(0, 50);
  }

  // Section Boundaries
  const sectionKeywords = [
    {
      key: "experience",
      regex:
        /^(?:work\s+experience|experience|employment\s+history|professional\s+experience)/i,
    },
    { key: "education", regex: /^(?:education|academic\s+background)/i },
    {
      key: "skills",
      regex: /^(?:skills|technical\s+skills|core\s+competencies)/i,
    },
    {
      key: "projects",
      regex: /^(?:projects|personal\s+projects|key\s+projects)/i,
    },
    {
      key: "summary",
      regex: /^(?:summary|professional\s+summary|profile|about\s+me)/i,
    },
  ];

  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
  };

  let currentSection = "summary";

  for (const line of lines.slice(2)) {
    let matchedNewSection = false;
    for (const sec of sectionKeywords) {
      if (sec.regex.test(line)) {
        currentSection = sec.key;
        matchedNewSection = true;
        break;
      }
    }
    if (!matchedNewSection && currentSection) {
      sections[currentSection].push(line);
    }
  }

  // Parse Summary
  const summary = sections.summary.join(" ").slice(0, 1000);

  // Parse Skills
  const skillsList: Skill[] = [];
  const rawSkillsText = sections.skills.join(", ");
  const rawSkillTokens = rawSkillsText
    .split(/[,•|·\n]/)
    .map((s) => s.trim())
    .filter(
      (s) => s.length > 1 && s.length < 35 && !/skills|competencies/i.test(s),
    );

  // Deduplicate skills
  const seenSkills = new Set<string>();
  for (const s of rawSkillTokens) {
    const lower = s.toLowerCase();
    if (!seenSkills.has(lower)) {
      seenSkills.add(lower);
      skillsList.push({
        id: crypto.randomUUID(),
        name: s,
        category: categorizeSkillQuick(s),
      });
    }
  }

  // Parse Experience
  const experienceList: Experience[] = [];
  const expLines = sections.experience;
  let currentExp: Partial<Experience> | null = null;

  for (const l of expLines) {
    // Check if line looks like a date or new role header (e.g. "2020 - 2023" or "Company - Role")
    const hasDate = /\b(20\d\d|19\d\d|present|current)\b/i.test(l);
    if (hasDate && l.length < 100) {
      if (currentExp && currentExp.company) {
        experienceList.push(finalizeExp(currentExp));
      }
      currentExp = {
        id: crypto.randomUUID(),
        company: l.split(/[-–|]/)[0]?.trim() || "Company",
        role: l.split(/[-–|]/)[1]?.trim() || "Software Engineer",
        startDate: "",
        endDate: "",
        current: /present|current/i.test(l),
        description: "",
      };
    } else if (currentExp) {
      currentExp.description = currentExp.description
        ? `${currentExp.description}\n• ${l.replace(/^[•\s*-]+/, "")}`
        : `• ${l.replace(/^[•\s*-]+/, "")}`;
    }
  }
  if (currentExp && currentExp.company) {
    experienceList.push(finalizeExp(currentExp));
  }

  // Parse Education
  const educationList: Education[] = [];
  if (sections.education.length > 0) {
    const eduText = sections.education.join(" ");
    educationList.push({
      id: crypto.randomUUID(),
      degree: sections.education[0] || "Bachelor of Science",
      institution: sections.education[1] || "University",
      startDate: "",
      endDate: "",
      current: false,
      score: eduText.match(/GPA:\s*([\d.]+)/i)?.[1] || "",
    });
  }

  return {
    personalInfo: {
      firstName,
      lastName,
      email,
      phone,
      location: "",
      title,
      linkedin,
      github,
      website: "",
    },
    summary,
    experience: experienceList,
    projects: [],
    education: educationList,
    skills: skillsList,
    customSections: [],
  };
}

function finalizeExp(partial: Partial<Experience>): Experience {
  return {
    id: partial.id || crypto.randomUUID(),
    company: partial.company || "Company",
    role: partial.role || "Software Engineer",
    startDate: partial.startDate || "2022-01",
    endDate: partial.endDate || "",
    current: partial.current ?? true,
    description:
      partial.description ||
      "• Led key development initiatives and delivered scalable features.",
  };
}

function categorizeSkillQuick(skillName: string): string {
  const lower = skillName.toLowerCase();
  if (
    /typescript|javascript|python|go|java|c\+\+|ruby|rust|php|swift|kotlin|c#/i.test(
      lower,
    )
  ) {
    return "Languages";
  }
  if (
    /react|next|vue|angular|svelte|node|express|nestjs|django|flask|spring|tailwind/i.test(
      lower,
    )
  ) {
    return "Frameworks & Libraries";
  }
  if (
    /docker|kubernetes|aws|gcp|azure|ci\/cd|terraform|linux|jenkins|github actions/i.test(
      lower,
    )
  ) {
    return "Cloud & DevOps";
  }
  if (
    /postgres|mysql|mongo|redis|sql|sqlite|elasticsearch|cassandra|prisma/i.test(
      lower,
    )
  ) {
    return "Databases & Tools";
  }
  return "Technical Skills";
}

function normalizeParsedData(raw: any): ResumeData {
  return {
    personalInfo: {
      firstName: raw.personalInfo?.firstName || "",
      lastName: raw.personalInfo?.lastName || "",
      email: raw.personalInfo?.email || "",
      phone: raw.personalInfo?.phone || "",
      location: raw.personalInfo?.location || "",
      title: raw.personalInfo?.title || "",
      linkedin: raw.personalInfo?.linkedin || "",
      github: raw.personalInfo?.github || "",
      website: raw.personalInfo?.website || "",
    },
    summary: raw.summary || "",
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((e: any) => ({
          id: crypto.randomUUID(),
          company: e.company || "",
          role: e.role || "",
          startDate: e.startDate || "",
          endDate: e.endDate || "",
          current: !!e.current,
          description: e.description || "",
        }))
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((p: any) => ({
          id: crypto.randomUUID(),
          name: p.name || "",
          description: p.description || "",
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
        }))
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((ed: any) => ({
          id: crypto.randomUUID(),
          degree: ed.degree || "",
          institution: ed.institution || "",
          startDate: ed.startDate || "",
          endDate: ed.endDate || "",
          current: !!ed.current,
          score: ed.score || "",
        }))
      : [],
    skills: Array.isArray(raw.skills)
      ? raw.skills.map((s: any) => ({
          id: crypto.randomUUID(),
          name: typeof s === "string" ? s : s.name || "",
          category:
            typeof s === "object" ? s.category : categorizeSkillQuick(s),
        }))
      : [],
    customSections: [],
  };
}
