/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Utilities for Google Chrome Built-in AI (Gemini Nano)

export type ChromeAIAvailability =
  "ready" | "downloading" | "not_available" | "checking";

export interface ChromeAIStatus {
  isAvailable: boolean;
  status: ChromeAIAvailability;
  message: string;
  details?: string;
}

// Helper to access the AI object safely from window or self
function getChromeAI(): any {
  if (typeof window !== "undefined") {
    if ("ai" in window && (window as any).ai) return (window as any).ai;
    if ("model" in window && (window as any).model)
      return (window as any).model;
  }
  if (typeof self !== "undefined" && "ai" in self && (self as any).ai) {
    return (self as any).ai;
  }
  return null;
}

/**
 * Robustly checks if Chrome's Built-in Gemini Nano model is available
 * Supports all Prompt API versions (languageModel, assistant, canCreateTextSession)
 */
export async function checkChromeAIAvailability(): Promise<ChromeAIStatus> {
  if (typeof window === "undefined") {
    return {
      isAvailable: false,
      status: "not_available",
      message: "Window object is not available (running in SSR).",
    };
  }

  const ai = getChromeAI();

  if (!ai) {
    return {
      isAvailable: false,
      status: "not_available",
      message: "Chrome AI (window.ai) is not detected.",
      details:
        "Ensure Chrome version >= 127, enable required flags in chrome://flags, and relaunch Chrome.",
    };
  }

  try {
    // 1. Check window.ai.languageModel (Current standard Prompt API)
    if (ai.languageModel) {
      // Newer API: availability()
      if (typeof ai.languageModel.availability === "function") {
        const availability = await ai.languageModel.availability();
        if (availability === "readily") {
          return {
            isAvailable: true,
            status: "ready",
            message: "Gemini Nano is ready and available on-device.",
          };
        }
        if (availability === "after-download") {
          return {
            isAvailable: true,
            status: "downloading",
            message:
              "Gemini Nano is enabled, but the model needs to finish downloading.",
            details:
              "Open chrome://components and check for update on 'Optimization Guide On Device Model'.",
          };
        }
      }

      // Preceding API: capabilities()
      if (typeof ai.languageModel.capabilities === "function") {
        const capabilities = await ai.languageModel.capabilities();
        const available = capabilities?.available;
        if (available === "readily" || available === true) {
          return {
            isAvailable: true,
            status: "ready",
            message: "Gemini Nano is ready and available on-device.",
          };
        }
        if (available === "after-download") {
          return {
            isAvailable: true,
            status: "downloading",
            message:
              "Gemini Nano is enabled, but the model needs to finish downloading.",
            details:
              "Open chrome://components and check for update on 'Optimization Guide On Device Model'.",
          };
        }
        if (available !== "no") {
          return {
            isAvailable: true,
            status: "ready",
            message: "Gemini Nano appears available.",
          };
        }
      }

      // Fallback: if languageModel.create exists
      if (typeof ai.languageModel.create === "function") {
        return {
          isAvailable: true,
          status: "ready",
          message: "Gemini Nano languageModel.create is accessible.",
        };
      }
    }

    // 2. Check window.ai.assistant (Early Chrome 127/128 implementation)
    if (ai.assistant) {
      if (typeof ai.assistant.capabilities === "function") {
        const capabilities = await ai.assistant.capabilities();
        const available = capabilities?.available;
        if (
          available === "readily" ||
          available === true ||
          available !== "no"
        ) {
          return {
            isAvailable: true,
            status: available === "after-download" ? "downloading" : "ready",
            message: "Gemini Nano assistant API is available.",
          };
        }
      }
      if (typeof ai.assistant.create === "function") {
        return {
          isAvailable: true,
          status: "ready",
          message: "Gemini Nano assistant.create is accessible.",
        };
      }
    }

    // 3. Check legacy canCreateTextSession
    if (typeof ai.canCreateTextSession === "function") {
      const state = await ai.canCreateTextSession();
      if (state === "readily" || state === "after-download" || state !== "no") {
        return {
          isAvailable: true,
          status: state === "after-download" ? "downloading" : "ready",
          message: "Gemini Nano text session API is available.",
        };
      }
    }
  } catch (err: any) {
    console.warn("Chrome AI availability check encountered an error:", err);
    // If an error happened during capabilities check, but ai.languageModel or ai exists, try create
    if (
      ai.languageModel?.create ||
      ai.assistant?.create ||
      ai.createTextSession
    ) {
      return {
        isAvailable: true,
        status: "ready",
        message: "Gemini Nano session creation API is present.",
      };
    }
    return {
      isAvailable: false,
      status: "not_available",
      message: err?.message || "Failed to query Gemini Nano capabilities.",
    };
  }

  return {
    isAvailable: false,
    status: "not_available",
    message: "Gemini Nano flags are not enabled or model is not downloaded.",
    details:
      "Ensure Prompt API and Optimization Guide flags are enabled, then check chrome://components.",
  };
}

/**
 * Runs a prompt using Gemini Nano on-device
 */
export async function runChromeAIPrompt(
  promptText: string,
  systemPrompt = "You are a professional ATS resume expert. Rewrite the text concisely and professionally.",
): Promise<string> {
  const ai = getChromeAI();
  if (!ai) {
    throw new Error("Chrome AI is not available in this browser session.");
  }

  let session: any = null;

  try {
    if (ai.languageModel && typeof ai.languageModel.create === "function") {
      try {
        session = await ai.languageModel.create({
          systemPrompt,
        });
      } catch (createErr) {
        // Fallback for versions using initialPrompts
        session = await ai.languageModel.create({
          initialPrompts: [{ role: "system", content: systemPrompt }],
        });
      }
    } else if (ai.assistant && typeof ai.assistant.create === "function") {
      session = await ai.assistant.create({
        systemPrompt,
      });
    } else if (typeof ai.createTextSession === "function") {
      session = await ai.createTextSession();
    } else {
      throw new Error("No compatible Gemini Nano creation API found.");
    }

    if (!session || typeof session.prompt !== "function") {
      throw new Error("Created session is not a valid prompt session.");
    }

    const result = await session.prompt(promptText);

    // Clean up session if destroy is available
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
