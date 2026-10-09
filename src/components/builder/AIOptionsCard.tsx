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
  Copy,
  Loader2,
  TrendingUp,
  Zap,
  Briefcase,
  Scissors,
  Wrench,
} from "lucide-react";
import type { AIParsedResult } from "@/lib/aiParser";
import type { SectionContextType, OptimizationTone } from "@/lib/chromeAI";
import { notify } from "@/lib/toast";

interface AIOptionsCardProps {
  result: AIParsedResult | null;
  currentText: string;
  onSelectOption: (text: string) => void;
  onClose: () => void;
  targetId?: string;
  sectionType?: SectionContextType;
  activeTone?: OptimizationTone;
  onRegenerateTone?: (tone: OptimizationTone) => void;
  isRegenerating?: boolean;
}

const TONE_OPTIONS: {
  id: OptimizationTone;
  label: string;
  icon: typeof Sparkles;
}[] = [
  { id: "metrics", label: "Metrics & Impact", icon: TrendingUp },
  { id: "action", label: "Action-Driven", icon: Zap },
  { id: "executive", label: "Executive Tone", icon: Briefcase },
  { id: "concise", label: "Ultra-Concise", icon: Scissors },
  { id: "technical", label: "Technical Depth", icon: Wrench },
];

function getSectionLabel(sectionType?: SectionContextType): string {
  switch (sectionType) {
    case "summary":
      return "Professional Summary";
    case "experience":
      return "Experience Bullet";
    case "project":
      return "Project Showcase";
    case "cover_letter":
      return "Cover Letter Paragraph";
    case "custom":
      return "Custom Section Item";
    default:
      return "Resume Content";
  }
}

function countWords(str: string): number {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

export function AIOptionsCard({
  result,
  currentText,
  onSelectOption,
  onClose,
  targetId,
  sectionType = "general",
  activeTone = "default",
  onRegenerateTone,
  isRegenerating = false,
}: AIOptionsCardProps) {
  const [showExplanation, setShowExplanation] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!result || result.options.length === 0) {
    return null;
  }

  const originalWordCount = result.originalText
    ? countWords(result.originalText)
    : 0;

  const handleCopy = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      notify.info("Copied to clipboard", text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      notify.aiError("Failed to copy to clipboard.");
    }
  };

  const content = (
    <div className="mt-3 p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-b from-purple-50/70 via-background to-background dark:from-purple-950/25 dark:via-background dark:to-background shadow-sm space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-100 dark:border-purple-900/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-semibold tracking-tight text-foreground">
                Optimized Options for {getSectionLabel(sectionType)}
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3" /> Private On-Device
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select any alternative below to replace the input, or switch style
              angles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {result.originalText && result.originalText !== currentText && (
            <button
              type="button"
              onClick={() => onSelectOption(result.originalText || "")}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/60"
              title="Restore your original unedited text"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore Original</span>
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

      {/* Tone Presets Chips */}
      {onRegenerateTone && (
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Switch Tone / Focus Angle:
            </span>
            {isRegenerating && (
              <span className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1 font-medium">
                <Loader2 className="w-2.5 h-2.5 animate-spin" /> Generating
                fresh options...
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {TONE_OPTIONS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={isRegenerating}
                  onClick={() => onRegenerateTone(t.id)}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all ${
                    isActive
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-background/80 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/40 text-muted-foreground border-border/70"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 pt-1">
        {result.options.map((option, idx) => {
          const isSelected = currentText.trim() === option.text.trim();
          const wordCount = countWords(option.text);
          const diff = wordCount - originalWordCount;
          const isCopied = copiedId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.text)}
              className={`group relative p-3 rounded-lg border transition-all cursor-pointer text-left ${
                isSelected
                  ? "border-purple-600 dark:border-purple-500 bg-purple-50/80 dark:bg-purple-950/45 shadow-sm ring-1 ring-purple-600/30"
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

                  <span className="text-[10px] text-muted-foreground/80">
                    {wordCount} words
                    {originalWordCount > 0 && diff !== 0 && (
                      <span className="ml-1 opacity-75">
                        ({diff > 0 ? `+${diff}` : diff})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(option.text, option.id, e)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                    title="Copy option text"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3 stroke-[3]" /> Applied
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 font-medium">
                      Apply →
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

  if (targetId && mounted && typeof document !== "undefined") {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      return createPortal(content, targetEl);
    }
  }

  return content;
}
