import type { ResumeData } from "@/types/resume";
import { runChromeAIPrompt } from "./chromeAI";
import { parseAIResponse, type AIParsedResult } from "./aiParser";

export interface CoverLetterParams {
  data: ResumeData;
  targetCompany?: string;
  targetRole?: string;
}

/**
 * Builds a prompt for Gemini Nano to generate 3 tailored, professional cover letters.
 */
export function buildCoverLetterGenerationPrompt(
  params: CoverLetterParams,
): string {
  const { data, targetCompany, targetRole } = params;
  const fullName =
    `${data.personalInfo?.firstName || ""} ${data.personalInfo?.lastName || ""}`.trim() ||
    "Candidate";
  const role = targetRole || data.personalInfo?.title || "Professional";
  const company = targetCompany || "the hiring team";

  const expHighlights = (data.experience || [])
    .slice(0, 3)
    .map(
      (e) =>
        `- ${e.role} at ${e.company}: ${
          e.description ? e.description.replace(/\n+/g, " ").slice(0, 220) : ""
        }`,
    )
    .join("\n");

  const topSkills = (data.skills || [])
    .slice(0, 8)
    .map((s) => s.name)
    .join(", ");

  return `You are an elite career coach and executive cover letter strategist.
Write 3 complete, professional cover letters for ${fullName} applying for the position of ${role} at ${company}.

Candidate Information:
- Candidate Name: ${fullName}
- Professional Summary: ${
    data.summary?.trim() ||
    "Experienced professional with a proven track record of delivering impactful results and driving technical excellence."
  }
- Work Experience Highlights:
${expHighlights || "- Led high-priority initiatives and executed strategic projects with measurable success."}
- Core Skills & Technologies: ${topSkills || "Technical execution, strategic problem solving, team leadership"}

Requirements:
- Each cover letter must be complete and ready-to-send with professional paragraphs (Salutation, Engaging Opening Hook, 1-2 Compelling Evidence/Impact Body Paragraphs referencing their real background, Strong Closing with Call to Action, and Professional Sign-off).
- Output exactly 3 distinct styles:

**Option 1 (Impact & Results-Driven - Recommended):**
> Dear Hiring Team,
> 
> I am writing to express my strong interest in the ${role} position at ${company}. With my background in ${
    data.personalInfo?.title || "technology"
  } and proven track record of delivering measurable outcomes, I am excited about the opportunity to contribute immediately to your team.
> 
> Throughout my career, I have focused on solving high-impact challenges. At my recent roles, I led key initiatives that improved system reliability and efficiency. My experience with ${
    topSkills || "modern tools and best practices"
  } allows me to bridge technical execution with business objectives.
> 
> I would welcome the opportunity to discuss how my experience and passion align with ${company}'s goals. Thank you for your time and consideration.
> 
> Sincerely,
> ${fullName}

**Option 2 (Technical Depth & Problem Solver):**
> Dear Hiring Team,
> 
> As an experienced ${role}, I was immediately drawn to the opportunity at ${company}. My background centers on building scalable systems, optimizing performance, and engineering robust solutions.
> 
> Having worked extensively with ${
    topSkills || "core technologies"
  }, I have diagnosed complex problems and delivered resilient architectures. I thrive in collaborative environments where engineering rigor and customer focus drive every sprint.
> 
> I am eager to bring this hands-on technical expertise to ${company} and help accelerate your engineering roadmap. I look forward to connecting soon.
> 
> Sincerely,
> ${fullName}

**Option 3 (Strategic Leadership & Vision):**
> Dear Hiring Team,
> 
> It is with great enthusiasm that I submit my application for the ${role} role at ${company}. Over the course of my career, I have dedicated myself to driving forward-thinking innovation and fostering cross-functional alignment.
> 
> My leadership and problem-solving experience have enabled me to guide teams through ambitious milestones. I am deeply impressed by ${company}'s mission and would be thrilled to contribute to your ongoing growth and organizational success.
> 
> Thank you for considering my application. I look forward to the possibility of an interview to explore how I can add tangible value.
> 
> Sincerely,
> ${fullName}

**Explanation:**
* Tailored to Experience: Weaves candidate summary and work history into narrative.
* High Recruiter Appeal: Clear 3-paragraph structure with strong opening hooks and professional call to action.
* ATS Keyword Match: Embeds target role title and technical competencies.`;
}

/**
 * Generates 3 distinct cover letters using Gemini Nano and parses them into structured options.
 */
export async function generateCoverLetterFromResume(
  params: CoverLetterParams,
): Promise<AIParsedResult> {
  const prompt = buildCoverLetterGenerationPrompt(params);

  const rawOutput = await runChromeAIPrompt(prompt, {
    systemPrompt:
      "You are an executive cover letter writer. Output strictly formatted cover letter options with paragraphs preserved.",
  });

  return parseAIResponse(rawOutput, undefined, true);
}
