"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { AIParsedResult } from "@/lib/aiParser";

interface AIOptionsCardProps {
  result: AIParsedResult | null;
  currentText: string;
  onSelectOption: (text: string) => void;
  onClose: () => void;
  targetId?: string;
}

export function AIOptionsCard({
  result,
  currentText,
  onSelectOption,
  onClose,
  targetId,
}: AIOptionsCardProps) {
  const [showExplanation, setShowExplanation] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!result || result.options.length === 0) {
    return null;
  }

  const content = (
    <div className="mt-3 p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-b from-purple-50/60 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-100 dark:border-purple-900/40">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-600 text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold tracking-tight text-foreground">
                Gemini Nano ATS Suggestions
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3" /> On-Device Private
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select any alternative below to instantly update your input.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {result.originalText && result.originalText !== currentText && (
            <button
              type="button"
              onClick={() => onSelectOption(result.originalText || "")}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
              title="Restore your original unedited text"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Original</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Dismiss suggestions"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {result.options.map((option, idx) => {
          const isSelected = currentText.trim() === option.text.trim();

          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.text)}
              className={`group relative p-3 rounded-lg border transition-all cursor-pointer text-left ${
                isSelected
                  ? "border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm ring-1 ring-purple-600/20"
                  : "border-border/80 hover:border-purple-300 dark:hover:border-purple-750 bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-foreground">
                    {option.title || `Option ${idx + 1}`}
                  </span>

                  {option.focus && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                      {option.focus}
                    </span>
                  )}

                  {option.isRecommended && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      Recommended for ATS
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-900/50 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3 stroke-[3]" /> Applied
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 font-medium">
                      Click to Apply →
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                {option.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Explanation / ATS Insights */}
      {result.explanation && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-[11px] font-medium text-muted-foreground hover:text-foreground py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              💡 Why this was optimized (ATS Insights)
            </span>
            {showExplanation ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showExplanation && (
            <div className="mt-1.5 p-2.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/60 text-[11px] text-muted-foreground space-y-1 leading-relaxed">
              {result.explanation
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, lIdx) => {
                  const cleanBullet = line.replace(/^[-*]\s*/, "");
                  return (
                    <div key={lIdx} className="flex items-start gap-1.5">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: cleanBullet.replace(
                            /\*\*([^*]+)\*\*/g,
                            '<strong class="text-foreground">$1</strong>',
                          ),
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // If a portal targetId is specified, render into that container
  if (targetId && mounted && typeof document !== "undefined") {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      return createPortal(content, targetEl);
    }
  }

  // Fallback: render in place
  return content;
}
