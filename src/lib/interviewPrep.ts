import { runChromeAIPrompt, checkChromeAIAvailability } from "./chromeAI";
import type { ResumeData } from "@/types/resume";

export interface InterviewQuestion {
  id: string;
  category: "technical" | "behavioral" | "situational";
  question: string;
  context: string;
  suggestedAnswerPoints: string[];
}

export async function generateInterviewQuestionsWithNano(
  resumeData: ResumeData,
): Promise<InterviewQuestion[]> {
  const availability = await checkChromeAIAvailability();
  const targetRole = resumeData.personalInfo.title || "Software Engineer";
  const skillsList =
    resumeData.skills.map((s) => s.name).join(", ") || "General Engineering";

  const experienceSnippet = resumeData.experience
    .slice(0, 2)
    .map((e) => `${e.role} at ${e.company}: ${e.description.slice(0, 120)}`)
    .join(" | ");

  const prompt = `You are a Principal Tech Lead and Executive Recruiter conducting a high-caliber interview for a ${targetRole}.

Candidate's Background:
- Key Skills: ${skillsList}
- Key Projects / Experiences: ${experienceSnippet || "Full-stack application development"}

Generate exactly 5 targeted interview questions (3 Technical/System Design questions, 2 Behavioral/STAR questions) based directly on their real background.

Format as STRICT JSON ONLY:
[
  {
    "id": "q1",
    "category": "technical",
    "question": "How did you design and scale the architecture for...",
    "context": "Focuses on their experience with ${resumeData.skills[0]?.name || "architecture"}.",
    "suggestedAnswerPoints": [
      "Explain the problem constraint and system throughput",
      "Mention tradeoffs between SQL vs NoSQL or caching strategies",
      "Share how you monitored and measured latency"
    ]
  }
]
Output STRICT JSON array only. No conversational commentary.`;

  if (availability.isAvailable) {
    try {
      const raw = await runChromeAIPrompt(prompt, {
        systemPrompt:
          "You are an executive tech interviewer outputting strict JSON array format.",
      });

      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn(
        "Interview questions generation failed, using tailored fallback:",
        e,
      );
    }
  }

  // Fallback high-value questions based on resume
  const firstSkill = resumeData.skills[0]?.name || "Core Technologies";
  const secondSkill = resumeData.skills[1]?.name || "System Architecture";

  return [
    {
      id: "q1",
      category: "technical",
      question: `In your role as a ${targetRole}, how do you leverage ${firstSkill} to ensure high performance and maintainability?`,
      context: `Tests deep understanding and real-world application of ${firstSkill}.`,
      suggestedAnswerPoints: [
        "Outline architectural design choices and standard best practices.",
        "Highlight how you tackled bottlenecks or performance issues.",
        "Demonstrate how you ensure clean code and test coverage.",
      ],
    },
    {
      id: "q2",
      category: "technical",
      question: `Can you walk through a complex project where you had to integrate ${secondSkill} under tight performance or timeline constraints?`,
      context:
        "Demonstrates practical problem solving and engineering execution.",
      suggestedAnswerPoints: [
        "Set the stage: requirements and initial hurdles.",
        "Detail your technical strategy and design decisions.",
        "Highlight measurable outcomes (e.g. latency, scale, user adoption).",
      ],
    },
    {
      id: "q3",
      category: "behavioral",
      question:
        "Tell me about a time when a critical bug or production incident occurred. How did you diagnose, resolve, and prevent it from recurring?",
      context:
        "Evaluates incident handling, debugging rigor, and blameless post-mortem approach.",
      suggestedAnswerPoints: [
        "Situation: what was impacted and what was at stake.",
        "Action: how you isolated the root cause without panic.",
        "Result: resolution timeline, tests added, and CI/CD safeguards implemented.",
      ],
    },
    {
      id: "q4",
      category: "situational",
      question:
        "How do you handle disagreements on technical architecture or design decisions with teammates or stakeholders?",
      context:
        "Tests cross-functional collaboration, technical communication, and pragmatism.",
      suggestedAnswerPoints: [
        "Focus on data, benchmarks, and prototype proof-of-concepts rather than opinions.",
        "Show respect for team consensus while advocating for scalability.",
        "Demonstrate commitment to the chosen direction once decided.",
      ],
    },
    {
      id: "q5",
      category: "technical",
      question:
        "What strategies do you employ when refactoring legacy code while actively releasing new features?",
      context:
        "Evaluates risk management and maintainability in fast-paced teams.",
      suggestedAnswerPoints: [
        "Strangler fig pattern or incremental component migration.",
        "Comprehensive regression tests and feature flags.",
        "Minimizing disruption to team velocity.",
      ],
    },
  ];
}
