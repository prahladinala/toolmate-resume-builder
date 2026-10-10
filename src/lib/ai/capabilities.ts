/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Chrome Built-in AI (Gemini Nano) Runtime Capabilities & Model Detection
 * Detects LanguageModel across Chrome 127 to 133+ specifications.
 */

export type ModelReadiness =
  | "ready" // Model is present on device and ready for immediate inference
  | "downloading" // Flags enabled, model component is currently downloading
  | "downloadable" // Model can be downloaded on user trigger
  | "unavailable" // Browser does not support on-device AI or flags are disabled
  | "checking"; // Actively probing browser API status

export interface AICapabilityInfo {
  isAvailable: boolean;
  readiness: ModelReadiness;
  apiType:
    "LanguageModel" | "ai.languageModel" | "ai.assistant" | "legacy" | "none";
  supportedFeatures: {
    prompt: boolean;
    streaming: boolean;
    systemPrompt: boolean;
    cancellation: boolean;
  };
  message: string;
  details?: string;
}

/**
 * Access the LanguageModel constructor or namespace across Chrome versions
 */
export function probeLanguageModelNamespace(): {
  api: any;
  type: AICapabilityInfo["apiType"];
} {
  if (typeof window !== "undefined") {
    // 1. Chrome 131+ Prompt API Standard: window.LanguageModel
    if ("LanguageModel" in window && (window as any).LanguageModel) {
      return { api: (window as any).LanguageModel, type: "LanguageModel" };
    }
    // 2. Chrome 128-130: window.ai.languageModel
    if ("ai" in window && (window as any).ai?.languageModel) {
      return {
        api: (window as any).ai.languageModel,
        type: "ai.languageModel",
      };
    }
    // 3. Chrome 127: window.ai.assistant
    if ("ai" in window && (window as any).ai?.assistant) {
      return { api: (window as any).ai.assistant, type: "ai.assistant" };
    }
  }

  if (typeof globalThis !== "undefined") {
    if ((globalThis as any).LanguageModel) {
      return { api: (globalThis as any).LanguageModel, type: "LanguageModel" };
    }
    if ((globalThis as any).ai?.languageModel) {
      return {
        api: (globalThis as any).ai.languageModel,
        type: "ai.languageModel",
      };
    }
  }

  // 4. Legacy window.ai text session
  if (
    typeof window !== "undefined" &&
    "ai" in window &&
    (window as any).ai?.createTextSession
  ) {
    return { api: (window as any).ai, type: "legacy" };
  }

  return { api: null, type: "none" };
}

/**
 * Checks runtime model availability without launching long-running tasks
 */
export async function detectAICapabilities(): Promise<AICapabilityInfo> {
  if (typeof window === "undefined") {
    return {
      isAvailable: false,
      readiness: "unavailable",
      apiType: "none",
      supportedFeatures: {
        prompt: false,
        streaming: false,
        systemPrompt: false,
        cancellation: false,
      },
      message: "Server-side rendering environment (window is undefined).",
    };
  }

  const { api, type } = probeLanguageModelNamespace();

  if (!api) {
    return {
      isAvailable: false,
      readiness: "unavailable",
      apiType: "none",
      supportedFeatures: {
        prompt: false,
        streaming: false,
        systemPrompt: false,
        cancellation: false,
      },
      message: "Gemini Nano on-device AI is not enabled in this browser.",
      details:
        "Ensure Chrome version >= 127, enable 'Prompt API for Gemini Nano' in chrome://flags, and relaunch.",
    };
  }

  try {
    // Chrome 131+: LanguageModel.availability()
    if (typeof api.availability === "function") {
      const state = await api.availability();
      if (state === "readily" || state === "available" || state === true) {
        return {
          isAvailable: true,
          readiness: "ready",
          apiType: type,
          supportedFeatures: {
            prompt: true,
            streaming: true,
            systemPrompt: true,
            cancellation: true,
          },
          message:
            "On-device Gemini Nano is ready for instant local execution.",
        };
      }
      if (state === "after-download") {
        return {
          isAvailable: true,
          readiness: "downloading",
          apiType: type,
          supportedFeatures: {
            prompt: true,
            streaming: false,
            systemPrompt: true,
            cancellation: false,
          },
          message: "Model download in progress in Chrome components.",
          details:
            "Check chrome://components under 'Optimization Guide On Device Model'.",
        };
      }
    }

    // Chrome 128-130: capabilities()
    if (typeof api.capabilities === "function") {
      const caps = await api.capabilities();
      const state = caps?.available;
      if (state === "readily" || state === "available" || state === true) {
        return {
          isAvailable: true,
          readiness: "ready",
          apiType: type,
          supportedFeatures: {
            prompt: true,
            streaming: true,
            systemPrompt: true,
            cancellation: true,
          },
          message:
            "On-device Gemini Nano is ready for instant local execution.",
        };
      }
      if (state === "after-download") {
        return {
          isAvailable: true,
          readiness: "downloading",
          apiType: type,
          supportedFeatures: {
            prompt: true,
            streaming: false,
            systemPrompt: true,
            cancellation: false,
          },
          message: "Model download in progress in Chrome components.",
        };
      }
    }

    // Factory method check
    if (
      typeof api.create === "function" ||
      typeof api.createTextSession === "function"
    ) {
      return {
        isAvailable: true,
        readiness: "ready",
        apiType: type,
        supportedFeatures: {
          prompt: true,
          streaming: false,
          systemPrompt: true,
          cancellation: true,
        },
        message: "Gemini Nano API detected and accessible.",
      };
    }
  } catch (err) {
    console.warn("Probe failed for LanguageModel API:", err);
  }

  return {
    isAvailable: false,
    readiness: "unavailable",
    apiType: type,
    supportedFeatures: {
      prompt: false,
      streaming: false,
      systemPrompt: false,
      cancellation: false,
    },
    message:
      "Gemini Nano is not ready. Chrome on-device flags must be enabled.",
  };
}
