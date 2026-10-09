"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Bot, Sparkles } from "lucide-react";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { checkChromeAIAvailability, runChromeAIPrompt } from "@/lib/chromeAI";
import { notify } from "@/lib/toast";

export function AIHelper({
  currentText,
  onUpdate,
}: {
  currentText: string;
  onUpdate: (text: string) => void;
}) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const verifyAI = useCallback(async () => {
    try {
      const res = await checkChromeAIAvailability();
      setIsAvailable(res.isAvailable);
      return res.isAvailable;
    } catch {
      setIsAvailable(false);
      return false;
    }
  }, []);

  useEffect(() => {
    verifyAI();

    // Re-check automatically when user switches tabs/focus back to this window
    const handleFocus = () => {
      verifyAI();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [verifyAI]);

  const executeImprove = async () => {
    if (!currentText.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const systemPrompt =
        "You are an expert ATS resume writer. Rewrite the following text to be more impactful, professional, and action-oriented. Keep it concise. Do not add markdown unless it was already present in the source.";

      const result = await runChromeAIPrompt(currentText, systemPrompt);
      if (result && result.trim()) {
        onUpdate(result.trim());
        notify.aiSuccess("ATS-optimized rewrite applied successfully.");
      }
    } catch (e) {
      console.error("AI Generation failed", e);
      const errMsg = e instanceof Error ? e.message : undefined;
      notify.aiError(
        errMsg ||
          "Ensure Chrome flags are enabled and model download is complete in chrome://components.",
        () => setShowSetup(true),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveClick = async () => {
    if (!currentText.trim()) {
      notify.info(
        "No text to improve",
        "Type your experience bullet or summary first, then click Improve AI.",
      );
      return;
    }

    // Perform a live, dynamic check so we never show the popup if AI is already enabled!
    const available = await verifyAI();

    if (!available) {
      setShowSetup(true);
      return;
    }

    // AI is confirmed available - proceed immediately!
    executeImprove();
  };

  return (
    <>
      <div
        onClick={handleImproveClick}
        className={`h-7 w-7 xl:w-auto px-0 xl:px-2 flex items-center justify-center xl:justify-start gap-1.5 border rounded-md cursor-pointer transition-colors select-none ${
          isGenerating || (!currentText.trim() && isAvailable)
            ? "opacity-50 cursor-not-allowed border-purple-200 text-purple-400 bg-purple-50 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-600"
            : "border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-400"
        }`}
        title={
          isAvailable ? "Enhance with Gemini Nano AI" : "Enable Gemini Nano AI"
        }
      >
        {isGenerating ? (
          <Loader2 className="w-3 h-3 animate-spin shrink-0" />
        ) : isAvailable ? (
          <Sparkles className="w-3 h-3 shrink-0 text-purple-600 dark:text-purple-400" />
        ) : (
          <Bot className="w-3 h-3 shrink-0" />
        )}
        <span className="hidden xl:inline text-xs whitespace-nowrap">
          {isGenerating ? "Improving..." : "Improve AI"}
        </span>
      </div>

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={() => {
          verifyAI();
          executeImprove();
        }}
      />
    </>
  );
}
