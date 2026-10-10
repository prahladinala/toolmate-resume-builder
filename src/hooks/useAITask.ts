"use client";

import { useState, useRef, useCallback } from "react";
import { aiSessionManager } from "@/lib/ai/sessionManager";
import {
  detectAICapabilities,
  type ModelReadiness,
} from "@/lib/ai/capabilities";

export type AITaskStatus =
  "idle" | "checking" | "generating" | "completed" | "cancelled" | "error";

export interface AITaskState {
  status: AITaskStatus;
  readiness: ModelReadiness;
  result: string | null;
  error: string | null;
  durationMs: number;
}

export function useAITask() {
  const [state, setState] = useState<AITaskState>({
    status: "idle",
    readiness: "checking",
    result: null,
    error: null,
    durationMs: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState((prev) => ({
        ...prev,
        status: "cancelled",
        error: "Generation cancelled by user.",
      }));
    }
  }, []);

  const execute = useCallback(
    async (
      promptText: string,
      options?: {
        systemPrompt?: string;
      },
    ): Promise<string | null> => {
      // Abort any existing ongoing execution
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const startTime = performance.now();

      setState((prev) => ({
        ...prev,
        status: "checking",
        error: null,
        result: null,
      }));

      try {
        // Step 1: Detect capability
        const caps = await detectAICapabilities();
        if (!caps.isAvailable) {
          setState((prev) => ({
            ...prev,
            status: "error",
            readiness: caps.readiness,
            error: caps.message,
          }));
          return null;
        }

        setState((prev) => ({
          ...prev,
          status: "generating",
          readiness: "ready",
        }));

        // Step 2: Execute with pooled session and abort signal
        const output = await aiSessionManager.executePrompt(promptText, {
          systemPrompt: options?.systemPrompt,
          signal: controller.signal,
        });

        const duration = Math.round(performance.now() - startTime);

        setState({
          status: "completed",
          readiness: "ready",
          result: output,
          error: null,
          durationMs: duration,
        });

        return output;
      } catch (err: unknown) {
        const duration = Math.round(performance.now() - startTime);

        if (err instanceof DOMException && err.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            status: "cancelled",
            durationMs: duration,
            error: "Prompt cancelled by user.",
          }));
          return null;
        }

        const errorMsg =
          err instanceof Error ? err.message : "AI generation failed.";

        setState((prev) => ({
          ...prev,
          status: "error",
          durationMs: duration,
          error: errorMsg,
        }));

        return null;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState({
      status: "idle",
      readiness: "ready",
      result: null,
      error: null,
      durationMs: 0,
    });
  }, []);

  return {
    ...state,
    execute,
    cancel,
    reset,
  };
}
