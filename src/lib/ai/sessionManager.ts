/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Reusable Session Manager for Chrome Gemini Nano
 * Pools active model sessions to eliminate 300-1500ms cold-start instantiation latency.
 * Supports cancellation, auto-cleanup on idle, and graceful fallback.
 */

import { probeLanguageModelNamespace } from "./capabilities";

class AISessionManager {
  private activeSession: any = null;
  private currentSystemPrompt: string = "";
  private idleTimeoutId: any = null;
  private readonly IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Acquires or reuses an existing LanguageModel session
   */
  public async getSession(systemPrompt?: string): Promise<any> {
    const requiredPrompt =
      systemPrompt || "You are an expert ATS resume writer and career coach.";

    // Reset idle cleanup timer
    this.resetIdleTimer();

    // If session exists with matching system prompt, reuse it
    if (this.activeSession && this.currentSystemPrompt === requiredPrompt) {
      return this.activeSession;
    }

    // Otherwise, clean up old session before creating new
    this.destroySession();

    const { api } = probeLanguageModelNamespace();
    if (!api) {
      throw new Error("Chrome Gemini Nano LanguageModel API is not available.");
    }

    try {
      if (typeof api.create === "function") {
        try {
          this.activeSession = await api.create({
            systemPrompt: requiredPrompt,
          });
        } catch {
          try {
            this.activeSession = await api.create({
              initialPrompts: [{ role: "system", content: requiredPrompt }],
            });
          } catch {
            this.activeSession = await api.create();
          }
        }
      } else if (typeof api.createTextSession === "function") {
        this.activeSession = await api.createTextSession();
      }

      if (
        !this.activeSession ||
        typeof this.activeSession.prompt !== "function"
      ) {
        throw new Error("Failed to initialize active prompt session.");
      }

      this.currentSystemPrompt = requiredPrompt;
      return this.activeSession;
    } catch (err: any) {
      this.destroySession();
      throw new Error(
        `Failed to create Gemini Nano session: ${err?.message || "Unknown error"}`,
      );
    }
  }

  /**
   * Executes a prompt with optional AbortSignal cancellation
   */
  public async executePrompt(
    prompt: string,
    options?: {
      systemPrompt?: string;
      signal?: AbortSignal;
    },
  ): Promise<string> {
    if (options?.signal?.aborted) {
      throw new DOMException("AI prompt cancelled by user", "AbortError");
    }

    const session = await this.getSession(options?.systemPrompt);

    try {
      // Support signal in prompt options if supported by browser
      const promptPromise = session.prompt(prompt, { signal: options?.signal });
      const response = await promptPromise;
      return typeof response === "string" ? response : String(response || "");
    } catch (err: any) {
      // If session got corrupted or closed, invalidate active session
      if (err?.name === "AbortError" || err?.message?.includes("aborted")) {
        throw new DOMException("AI prompt cancelled", "AbortError");
      }
      this.destroySession();
      throw err;
    }
  }

  /**
   * Resets the inactivity timer to prevent memory leaks in background tabs
   */
  private resetIdleTimer(): void {
    if (this.idleTimeoutId) {
      clearTimeout(this.idleTimeoutId);
    }
    this.idleTimeoutId = setTimeout(() => {
      this.destroySession();
    }, this.IDLE_TIMEOUT_MS);
  }

  /**
   * Destroys active session and frees model memory
   */
  public destroySession(): void {
    if (this.idleTimeoutId) {
      clearTimeout(this.idleTimeoutId);
      this.idleTimeoutId = null;
    }
    if (this.activeSession) {
      if (typeof this.activeSession.destroy === "function") {
        try {
          this.activeSession.destroy();
        } catch {}
      }
      this.activeSession = null;
      this.currentSystemPrompt = "";
    }
  }
}

// Global Singleton Export
export const aiSessionManager = new AISessionManager();
