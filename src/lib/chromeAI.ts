/* eslint-disable @typescript-eslint/no-explicit-any */
// Comprehensive Prompt API / Gemini Nano engine supporting Chrome 127-133+ specifications

export type ChromeAIAvailability =
  "ready" | "downloading" | "not_available" | "checking";

export interface ChromeAIStatus {
  isAvailable: boolean;
  status: ChromeAIAvailability;
  message: string;
  details?: string;
}

/**
 * Access the LanguageModel class or namespace across various Chrome versions:
 * - Chrome 131+: window.LanguageModel or global LanguageModel
 * - Chrome 128-130: window.ai.languageModel
 * - Chrome 127: window.ai.assistant
 */
export function getLanguageModelAPI(): any {
  if (typeof window !== "undefined") {
    // 1. Direct Chrome 131+ global LanguageModel
    if ("LanguageModel" in window && (window as any).LanguageModel) {
      return (window as any).LanguageModel;
    }
    // 2. window.ai.languageModel
    if ("ai" in window && (window as any).ai?.languageModel) {
      return (window as any).ai.languageModel;
    }
    // 3. window.ai.assistant
    if ("ai" in window && (window as any).ai?.assistant) {
      return (window as any).ai.assistant;
    }
  }

  // Check globalThis
  if (typeof globalThis !== "undefined") {
    if ((globalThis as any).LanguageModel) {
      return (globalThis as any).LanguageModel;
    }
    if ((globalThis as any).ai?.languageModel) {
      return (globalThis as any).ai.languageModel;
    }
  }

  // Check self
  if (typeof self !== "undefined") {
    if ((self as any).LanguageModel) return (self as any).LanguageModel;
    if ((self as any).ai?.languageModel) return (self as any).ai.languageModel;
    if ((self as any).ai?.assistant) return (self as any).ai.assistant;
  }

  return null;
}

/**
 * Helper to check legacy window.ai session creator
 */
export function getLegacyAIApi(): any {
  if (typeof window !== "undefined") {
    if ("ai" in window && (window as any).ai) return (window as any).ai;
  }
  if (typeof self !== "undefined" && "ai" in self && (self as any).ai) {
    return (self as any).ai;
  }
  return null;
}

/**
 * Robustly checks if Chrome's Built-in Gemini Nano model is available
 */
export async function checkChromeAIAvailability(): Promise<ChromeAIStatus> {
  if (typeof window === "undefined") {
    return {
      isAvailable: false,
      status: "not_available",
      message: "Window object is not available (running in SSR).",
    };
  }

  const LM = getLanguageModelAPI();

  if (LM) {
    try {
      // Chrome 131+ Prompt API: LanguageModel.availability()
      if (typeof LM.availability === "function") {
        const availability = await LM.availability();
        console.log("LanguageModel.availability result:", availability);
        if (
          availability === "readily" ||
          availability === "available" ||
          availability === true
        ) {
          return {
            isAvailable: true,
            status: "ready",
            message: "Gemini Nano is active and ready on-device.",
          };
        }
        if (availability === "after-download") {
          return {
            isAvailable: true,
            status: "downloading",
            message:
              "Gemini Nano flags are enabled; model is finishing download.",
            details:
              "Navigate to chrome://components and check for update on 'Optimization Guide On Device Model'.",
          };
        }
        if (availability !== "no") {
          return {
            isAvailable: true,
            status: "ready",
            message: `Gemini Nano available (${String(availability)}).`,
          };
        }
      }

      // Chrome 128-130: LanguageModel.capabilities()
      if (typeof LM.capabilities === "function") {
        const capabilities = await LM.capabilities();
        const available = capabilities?.available;
        console.log("LanguageModel.capabilities result:", capabilities);
        if (
          available === "readily" ||
          available === "available" ||
          available === true
        ) {
          return {
            isAvailable: true,
            status: "ready",
            message: "Gemini Nano is active and ready on-device.",
          };
        }
        if (available === "after-download") {
          return {
            isAvailable: true,
            status: "downloading",
            message:
              "Gemini Nano flags are enabled; model is finishing download.",
            details:
              "Navigate to chrome://components and check for update on 'Optimization Guide On Device Model'.",
          };
        }
        if (available !== "no") {
          return {
            isAvailable: true,
            status: "ready",
            message: "Gemini Nano is active and ready on-device.",
          };
        }
      }

      // If LM.create function exists, model is supported
      if (typeof LM.create === "function") {
        return {
          isAvailable: true,
          status: "ready",
          message: "Gemini Nano LanguageModel.create is accessible.",
        };
      }
    } catch (err: any) {
      console.warn("Error probing LanguageModel:", err);
      if (typeof LM.create === "function") {
        return {
          isAvailable: true,
          status: "ready",
          message: "Gemini Nano LanguageModel is accessible.",
        };
      }
    }
  }

  // Fallback: Check legacy canCreateTextSession / createTextSession
  const legacyAi = getLegacyAIApi();
  if (legacyAi && typeof legacyAi.canCreateTextSession === "function") {
    try {
      const state = await legacyAi.canCreateTextSession();
      if (state === "readily" || state === "after-download" || state !== "no") {
        return {
          isAvailable: true,
          status: state === "after-download" ? "downloading" : "ready",
          message: "Chrome AI text session API is available.",
        };
      }
    } catch (err) {
      console.warn("Legacy canCreateTextSession error:", err);
    }
  }

  return {
    isAvailable: false,
    status: "not_available",
    message: "Gemini Nano is not detected in this browser session.",
    details:
      "Ensure Chrome version >= 127, enable required flags in chrome://flags, and relaunch Chrome.",
  };
}

export type SectionContextType =
  "summary" | "experience" | "project" | "cover_letter" | "custom" | "general";

export type OptimizationTone =
  | "default"
  | "metrics"
  | "action"
  | "executive"
  | "concise"
  | "technical"
  | "entry_level"
  | "mid_senior"
  | "staff_principal"
  | "manager_lead";

export interface AIOptimizeOptions {
  sectionType?: SectionContextType;
  tone?: OptimizationTone;
  systemPrompt?: string;
}

function buildOptimizedPrompt(
  promptText: string,
  sectionType: SectionContextType = "general",
  tone: OptimizationTone = "default",
  customSystemPrompt?: string,
): string {
  if (
    customSystemPrompt &&
    (customSystemPrompt.includes("autocomplete") ||
      customSystemPrompt.includes("3-8 words"))
  ) {
    return `${customSystemPrompt}\n\n${promptText}`;
  }

  let roleContext = "";
  let option1Desc = "";
  let option2Desc = "";
  let option3Desc = "";
  let explanationGuide = "";

  switch (sectionType) {
    case "summary":
      roleContext =
        "You are an executive resume coach specializing in compelling, high-converting Professional Summaries.";
      option1Desc =
        "Option 1 (Focus on Leadership & Vision):\n> <engaging executive summary emphasizing domain leadership and career trajectory>";
      option2Desc =
        "Option 2 (Focus on Technical Competencies):\n> <skills-forward summary emphasizing modern technologies, tools, and engineering methodologies>";
      option3Desc =
        "Option 3 (High Impact & Measurable Results - Recommended):\n> <achievement-driven summary highlighting career milestones and quantifiable business outcomes>";
      explanationGuide =
        "* Eliminated Ambiguity: <how generic statements were replaced with specific authority>\n* Action Verbs: <strategic keywords applied>\n* Quantifiable Results: <how accomplishments and metrics stand out>";
      break;

    case "experience":
      roleContext =
        "You are an expert ATS resume writer specializing in high-impact job experience bullets using the Challenge-Action-Result (CAR) method.";
      option1Desc =
        "Option 1 (Action-Verb Driven):\n> <starts with high-power action verb, clearly describing the task and technical execution>";
      option2Desc =
        "Option 2 (Problem & Solution Focus):\n> <highlights complex business or technical challenge overcome with strategic solution>";
      option3Desc =
        "Option 3 (High Impact & Quantifiable Metrics - Recommended):\n> <impact-first bullet point featuring quantifiable metrics (e.g. % improvement, time saved, revenue or scale)>";
      explanationGuide =
        "* Eliminated Ambiguity: <how vague tasks were turned into concrete achievements>\n* Action Verbs: <strong verbs like Architected, Spearheaded, Optimized>\n* Quantifiable Results: <metrics and measurable outcomes added>";
      break;

    case "project":
      roleContext =
        "You are an expert technical resume coach specializing in project showcase descriptions that impress hiring managers.";
      option1Desc =
        "Option 1 (Architecture & Tech Stack):\n> <highlights architectural decisions, modern frameworks, and engineering best practices>";
      option2Desc =
        "Option 2 (Problem Solved & Product Features):\n> <clearly outlines the user problem solved, product features built, and user experience>";
      option3Desc =
        "Option 3 (Performance & Scale - Recommended):\n> <emphasizes performance benchmarks, latency reduction, test coverage, or adoption metrics>";
      explanationGuide =
        "* Architecture Clarity: <technical decisions highlighted>\n* Value Delivered: <how the project showcases real-world problem-solving skills>\n* Metric Impact: <performance or scalability improvements highlighted>";
      break;

    case "cover_letter":
      roleContext =
        "You are an expert career strategist optimizing a Cover Letter paragraph to maximize interview callback rates.";
      option1Desc =
        "Option 1 (Enthusiastic & Culturally Aligned):\n> <warm, engaging paragraph conveying deep company interest and alignment>";
      option2Desc =
        "Option 2 (Skills & Direct Role Fit):\n> <evidence-based paragraph demonstrating direct mapping of skills to role requirements>";
      option3Desc =
        "Option 3 (High-Impact Accomplishments - Recommended):\n> <results-driven narrative demonstrating proven past track record of success>";
      explanationGuide =
        "* Tone & Polish: <engaging, confident professional narrative>\n* Relevance: <alignment with employer expectations>\n* Impact: <clear value proposition>";
      break;

    default:
      roleContext =
        "You are an expert resume editor specializing in precision proofreading, tone enhancement, and ATS optimization.";
      option1Desc =
        "Option 1 (Grammar, Flow & Polish):\n> <corrects all grammar and phrasing into smooth, flawless resume language>";
      option2Desc =
        "Option 2 (Concise & Direct):\n> <removes fluff and wordiness, delivering maximum clarity in minimal words>";
      option3Desc =
        "Option 3 (High-Impact Executive Tone - Recommended):\n> <authoritative professional rewrite elevated for senior recruiter appeal>";
      explanationGuide =
        "* Flow & Polish: <sentence structure and clarity improvements>\n* Word Choice: <strong professional vocabulary applied>\n* ATS Appeal: <optimized for scanning algorithms>";
      break;
  }

  let toneDirective = "";
  if (tone === "metrics") {
    toneDirective =
      "\nTONE FOCUS: Emphasize quantifiable metrics, estimated percentage improvements (e.g. 35%), latency reduction, or efficiency gains in all options.";
  } else if (tone === "action") {
    toneDirective =
      "\nTONE FOCUS: Start every option with a high-power active verb (e.g. Spearheaded, Engineered, Orchestrated, Overhauled) and keep phrasing dynamic.";
  } else if (tone === "executive") {
    toneDirective =
      "\nTONE FOCUS: Use strategic, executive-level language highlighting cross-functional leadership, vision, governance, and business alignment.";
  } else if (tone === "concise") {
    toneDirective =
      "\nTONE FOCUS: Keep each option ultra-concise, punchy, and under 20 words without losing core impact.";
  } else if (tone === "technical") {
    toneDirective =
      "\nTONE FOCUS: Emphasize deep technical rigor, systems architecture, design patterns, testing, and modern developer tooling.";
  } else if (tone === "entry_level") {
    toneDirective =
      "\nSENIORITY FOCUS: Entry Level / Associate. Highlight foundational technical skills, eagerness to learn, coursework, collaborative team contributions, and rapid onboarding ability.";
  } else if (tone === "mid_senior") {
    toneDirective =
      "\nSENIORITY FOCUS: Mid-to-Senior Level. Highlight independent ownership, technical problem solving, delivering features end-to-end, and cross-functional collaboration.";
  } else if (tone === "staff_principal") {
    toneDirective =
      "\nSENIORITY FOCUS: Staff / Principal Level. Emphasize multi-system technical architecture, cross-team technical strategy, engineering velocity influence, and long-term tech roadmaps.";
  } else if (tone === "manager_lead") {
    toneDirective =
      "\nSENIORITY FOCUS: Engineering Manager / Team Lead. Emphasize people leadership, mentoring, agile delivery, stakeholder alignment, hiring, and team business impact.";
  }

  return `${roleContext}${toneDirective}

STRICT OUTPUT RULES:
- Output ONLY the clean options that belong on a resume.
- DO NOT include conversational filler, greetings, or preambles (e.g. DO NOT say "Okay, I'm ready", "Here are alternatives", or repeat the original input).
- DO NOT include conversational sign-offs (e.g. "I am ready for another segment", "Let me know").
- Begin output IMMEDIATELY with "**Option 1".

Input to optimize:
"${promptText}"

Rewrite it into 3 distinct ATS-optimized alternatives followed by brief insights in this exact structure:

**${option1Desc}

**${option2Desc}

**${option3Desc}

**Explanation:**
${explanationGuide}`;
}

/**
 * Runs a prompt using Gemini Nano on-device
 */
export async function runChromeAIPrompt(
  promptText: string,
  options?: string | AIOptimizeOptions,
): Promise<string> {
  const sectionType: SectionContextType =
    typeof options === "object" && options.sectionType
      ? options.sectionType
      : "general";

  const tone: OptimizationTone =
    typeof options === "object" && options.tone ? options.tone : "default";

  const customSystemPrompt =
    typeof options === "string"
      ? options
      : typeof options === "object"
        ? options.systemPrompt
        : undefined;

  const systemPrompt =
    customSystemPrompt ||
    "You are an expert ATS resume writer and career coach.";

  const fullPrompt = buildOptimizedPrompt(
    promptText,
    sectionType,
    tone,
    customSystemPrompt,
  );

  // Use centralized AISessionManager for session pooling and reuse
  const { aiSessionManager } = await import("@/lib/ai/sessionManager");
  return await aiSessionManager.executePrompt(fullPrompt, { systemPrompt });
}
