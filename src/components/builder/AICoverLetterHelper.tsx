"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Sparkles,
  Loader2,
  Check,
  Star,
  Copy,
  Building2,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateCoverLetterFromResume } from "@/lib/coverLetterGenerator";
import { checkChromeAIAvailability } from "@/lib/chromeAI";
import type { AIParsedResult, AIOption } from "@/lib/aiParser";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { notify } from "@/lib/toast";

interface AICoverLetterHelperProps {
  currentText: string;
  onUpdate: (text: string) => void;
}

function countWords(str: string): number {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

export function AICoverLetterHelper({
  currentText,
  onUpdate,
}: AICoverLetterHelperProps) {
  const { data } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [parsedResult, setParsedResult] = useState<AIParsedResult | null>(null);
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState(data.personalInfo?.title || "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const status = await checkChromeAIAvailability();
      if (!status.isAvailable) {
        setShowSetup(true);
        setIsGenerating(false);
        return;
      }

      const result = await generateCoverLetterFromResume({
        data,
        targetCompany: targetCompany.trim() || undefined,
        targetRole: targetRole.trim() || undefined,
      });

      setParsedResult(result);

      if (result.options.length > 0) {
        const recommended = result.options[result.recommendedIndex];

        // If the current input field is empty, auto-prefill with the recommended option!
        if (!currentText.trim()) {
          onUpdate(recommended.text);
          notify.aiSuccess(
            "Prefilled input with Recommended Cover Letter (Impact & Results-Driven)!",
          );
        } else {
          notify.aiSuccess(
            "Generated 3 tailored cover letters. Review or select an option below.",
          );
        }
      }
    } catch (err: unknown) {
      console.error("Cover letter generation failed:", err);
      const msg = err instanceof Error ? err.message : undefined;
      notify.aiError(
        msg || "Ensure Gemini Nano is active in chrome://components.",
        () => setShowSetup(true),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (option: AIOption) => {
    onUpdate(option.text);
    notify.aiSuccess(
      `Applied "${option.title} (${option.focus})" to cover letter.`,
    );
  };

  const handleCopy = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      notify.info("Copied to clipboard", "Cover letter text copied.");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      notify.aiError("Failed to copy to clipboard.");
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Banner / Generator Trigger */}
        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-background dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-background shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold tracking-tight text-foreground">
                    AI Cover Letter Generator (Gemini Nano)
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <ShieldCheck className="w-3 h-3" /> Private On-Device
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Crafts 3 complete, personalized cover letters directly from
                  your Professional Summary and Work Experience.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-border/70 hover:bg-muted text-muted-foreground transition-colors"
              >
                {showCustomizer ? "Hide Customizer" : "Target Specific Company"}
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Summary & Experience...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {currentText.trim()
                        ? "Generate Alternative Options"
                        : "Generate Cover Letter with AI"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Optional Company & Role Target Customizer */}
          {showCustomizer && (
            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                  <Building2 className="w-3 h-3" /> Applying to Company
                  (Optional)
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, Acme Corp..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                  <Briefcase className="w-3 h-3" /> Target Job Role (Optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generated Options Card */}
        {parsedResult && parsedResult.options.length > 0 && (
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-card shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/70">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-semibold text-foreground">
                  Select a Cover Letter Style ({parsedResult.options.length}{" "}
                  options)
                </h4>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setParsedResult(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Close options"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {parsedResult.options.map((option, idx) => {
                const isSelected = currentText.trim() === option.text.trim();
                const wordCount = countWords(option.text);
                const isCopied = copiedId === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className={`group relative p-3.5 rounded-lg border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm ring-1 ring-purple-600/30"
                        : "border-border/80 hover:border-purple-300 dark:hover:border-purple-750 bg-background hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/40">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">
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
                            Recommended
                          </span>
                        )}

                        <span className="text-[10px] text-muted-foreground">
                          {wordCount} words • ~
                          {Math.max(1, Math.round(wordCount / 200))} min read
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleCopy(option.text, option.id, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                          title="Copy cover letter"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3 stroke-[3]" /> Applied to
                            Input
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 font-medium">
                            Apply to Input →
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Formatted Paragraphs Preview */}
                    <div className="text-xs text-foreground/90 space-y-2 leading-relaxed whitespace-pre-line font-normal">
                      {option.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ATS Insights dropdown */}
            {parsedResult.explanation && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowInsights(!showInsights)}
                  className="flex items-center justify-between w-full text-[11px] font-medium text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    💡 Why these cover letter styles convert
                  </span>
                  {showInsights ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showInsights && (
                  <div className="mt-1.5 p-2.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/60 text-[11px] text-muted-foreground space-y-1 leading-relaxed">
                    {parsedResult.explanation
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-1.5">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>{line.replace(/^[-*]\s*/, "")}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={handleGenerate}
      />
    </>
  );
}
