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

/**
 * Runs a prompt using Gemini Nano on-device
 */
export async function runChromeAIPrompt(
  promptText: string,
  systemPrompt = "You are an expert ATS resume writer. Rewrite the text to be impactful, concise, and professional.",
): Promise<string> {
  const LM = getLanguageModelAPI();
  let session: any = null;

  try {
    if (LM && typeof LM.create === "function") {
      try {
        session = await LM.create({ systemPrompt });
      } catch {
        try {
          session = await LM.create({
            initialPrompts: [{ role: "system", content: systemPrompt }],
          });
        } catch {
          // Direct create() as in Chrome 131+ standard
          session = await LM.create();
        }
      }
    } else {
      const legacyAi = getLegacyAIApi();
      if (legacyAi && typeof legacyAi.createTextSession === "function") {
        session = await legacyAi.createTextSession();
      } else {
        throw new Error("No compatible Chrome Gemini Nano API found.");
      }
    }

    if (!session || typeof session.prompt !== "function") {
      throw new Error("Failed to initialize Gemini Nano prompt session.");
    }

    // Build instruction prompt to guide ATS rewrite
    let fullPrompt = "";
    if (
      systemPrompt &&
      (systemPrompt.includes("autocomplete") ||
        systemPrompt.includes("3-8 words"))
    ) {
      fullPrompt = `${systemPrompt}\n\n${promptText}`;
    } else {
      fullPrompt = `You are an expert ATS resume optimizer and career coach.
Given this resume text:
"${promptText}"

Rewrite it into 3 distinct ATS-optimized alternatives followed by brief insights in this exact structure:

**Option 1 (Focus on Improvement):**
> <concise, professional rewrite emphasizing continuous enhancement>

**Option 2 (Focus on Expertise):**
> <strong action-oriented rewrite highlighting technical skills & problem solving>

**Option 3 (High Impact & Metrics - Recommended):**
> <maximum impact rewrite with quantifiable metrics, efficiency gains, or tangible results>

**Explanation:**
* Eliminated Ambiguity: <clarity improvements>
* Action Verbs: <action-oriented verbs applied>
* Quantifiable Results: <impact and ATS advantages>`;
    }

    const result = await session.prompt(fullPrompt);

    if (typeof session.destroy === "function") {
      try {
        session.destroy();
      } catch {}
    }

    return typeof result === "string" ? result : String(result || "");
  } catch (err: any) {
    if (session && typeof session.destroy === "function") {
      try {
        session.destroy();
      } catch {}
    }
    throw err;
  }
}
