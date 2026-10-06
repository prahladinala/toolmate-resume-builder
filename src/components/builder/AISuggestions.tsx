"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function AISuggestions({
  currentText,
  onSelect,
  contextPrompt,
}: {
  currentText: string;
  onSelect: (suggestion: string) => void;
  contextPrompt: string;
}) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Check availability
  useEffect(() => {
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
      setIsAvailable(false);
    };
    checkAI();
  }, []);

  // Generate suggestion on debounce
  useEffect(() => {
    // Only trigger if we have a reasonable amount of text and user paused typing
    if (!isAvailable || !currentText || currentText.trim().length < 15) {
      setSuggestion("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsGenerating(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ai = (window as any).ai;
        const session = await ai.languageModel.create({
          systemPrompt: `You are a resume autocomplete engine. The user is writing their ${contextPrompt}. Based on the partial text, suggest the next 3-8 words to complete the sentence professionally. ONLY return the suggested words, no quotes, no explanations, no prefix.`,
        });
        const result = await session.prompt(`Current text: "${currentText}"`);
        
        let cleanResult = result.replace(/^["']|["']$/g, "").trim();
        // Remove "Suggestion:" prefix if the AI hallucinated it
        cleanResult = cleanResult.replace(/^suggestion:\s*/i, "");
        
        if (cleanResult) {
          setSuggestion(cleanResult);
        }
      } catch (e) {
        console.error("AI autocomplete failed", e);
      } finally {
        setIsGenerating(false);
      }
    }, 1500); // 1.5s debounce to avoid spamming the model while typing

    return () => clearTimeout(timer);
  }, [currentText, isAvailable, contextPrompt]);

  if (!isAvailable) {
    return null;
  }

  // Only render if we have a suggestion or are currently loading one
  if (!suggestion && !isGenerating) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-2 text-xs animate-in fade-in slide-in-from-top-1">
      <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
      {isGenerating ? (
        <span className="text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" /> Analyzing context...
        </span>
      ) : (
        <button
          type="button"
          onClick={() => {
            onSelect(suggestion);
            setSuggestion("");
          }}
          className="text-left max-w-full truncate text-zinc-600 dark:text-zinc-300 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 px-2.5 py-1.5 rounded-md transition-colors border border-purple-100 dark:border-purple-800/30"
          title="Click to append"
        >
          <span className="opacity-60 mr-1">Suggest:</span>
          <span className="font-medium">{suggestion}</span>
        </button>
      )}
    </div>
  );
}
