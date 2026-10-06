"use client";

import { useState, useEffect } from "react";
import { Loader2, Bot } from "lucide-react";

export function AIHelper({
  currentText,
  onUpdate,
}: {
  currentText: string;
  onUpdate: (text: string) => void;
}) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Check if window.ai exists (Chrome Local AI)
    const checkAI = async () => {
      if (typeof window !== "undefined" && "ai" in window) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ai = (window as any).ai;
          if (ai.languageModel) {
            const capabilities = await ai.languageModel.capabilities();
            if (capabilities.available !== "no") {
              setIsAvailable(true);
              return;
            }
          }
        } catch (e) {
          console.error("AI check failed", e);
        }
      }
      // If we reach here, it's not available
      setIsAvailable(false);
    };
    checkAI();
  }, []);

  const handleImprove = async () => {
    if (!currentText.trim() || isGenerating) return;
    setIsGenerating(true);
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ai = (window as any).ai;
      const session = await ai.languageModel.create({
        systemPrompt: "You are an expert ATS resume writer. Rewrite the following text to be more impactful, professional, and action-oriented. Keep it concise. Do not add markdown unless it was already present in the source.",
      });
      const result = await session.prompt(currentText);
      onUpdate(result);
    } catch (e) {
      console.error("AI Generation failed", e);
      alert("AI generation failed. Please ensure Chrome AI features are enabled.");
    } finally {
      setIsGenerating(false);
    }
  };

  // If Chrome AI is not available, we can either hide the button or show a tooltip.
  // For now, we hide it completely so it doesn't clutter the UI on non-Chrome browsers.
  if (!isAvailable) {
    return null;
  }

  return (
    <div 
      onClick={handleImprove}
      className={`h-7 px-2 text-xs flex items-center gap-1.5 border rounded-md cursor-pointer transition-colors ${
        isGenerating || !currentText.trim()
          ? "opacity-50 cursor-not-allowed border-purple-200 text-purple-400 bg-purple-50 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-600"
          : "border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-400"
      }`}
    >
      {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
      {isGenerating ? "Improving..." : "Improve AI"}
    </div>
  );
}
