"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  User,
} from "lucide-react";
import { checkChromeAIAvailability } from "@/lib/chromeAI";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import {
  buildGuidedSummaryPrompt,
  type GuidedSummaryContext,
} from "@/lib/ai/prompts";
import { aiSessionManager } from "@/lib/ai/sessionManager";
import { parseAIResponse, type AIParsedResult } from "@/lib/aiParser";
import { notify } from "@/lib/toast";

interface GuidedSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
  onApply: (summaryText: string) => void;
}

export function GuidedSummaryModal({
  isOpen,
  onClose,
  defaultRole = "",
  onApply,
}: GuidedSummaryModalProps) {
  const [targetRole, setTargetRole] = useState(defaultRole || "");
  const [yearsExperience, setYearsExperience] = useState("");
  const [primaryStack, setPrimaryStack] = useState("");
  const [domainOrCoreStrength, setDomainOrCoreStrength] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [parsedResult, setParsedResult] = useState<AIParsedResult | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!primaryStack.trim() && !domainOrCoreStrength.trim()) {
      notify.info(
        "Please provide at least your primary stack or core strength.",
      );
      return;
    }

    setLoading(true);
    setParsedResult(null);
    setSelectedText(null);

    const avail = await checkChromeAIAvailability();
    if (!avail.isAvailable) {
      setShowSetup(true);
      setLoading(false);
      return;
    }

    const ctx: GuidedSummaryContext = {
      targetRole: targetRole.trim() || "Software Engineer",
      yearsExperience: yearsExperience.trim() || undefined,
      primaryStack: primaryStack.trim() || "Full-stack web technologies",
      domainOrCoreStrength:
        domainOrCoreStrength.trim() ||
        "High-performance application engineering",
    };

    const prompt = buildGuidedSummaryPrompt(ctx);

    try {
      const rawResponse = await aiSessionManager.executePrompt(prompt, {
        systemPrompt:
          "You are an Executive Career Coach crafting a 2-3 sentence Professional Summary.",
      });

      const parsed = parseAIResponse(rawResponse);
      setParsedResult(parsed);

      if (parsed.options.length > 0) {
        setSelectedText(
          parsed.options[parsed.recommendedIndex]?.text ||
            parsed.options[0].text,
        );
      }
    } catch (e) {
      console.error("Guided Summary Creator failed:", e);
      notify.error("Failed to generate summary options.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
                    Guided Summary Assistant
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> No Writer&apos;s Block
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Quick guided questions to generate an executive-grade summary
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Target Professional Title:
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Years of Experience:
                </label>
                <input
                  type="text"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="e.g. 5+ years, 2 years, Recent grad"
                  className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Primary Technical Stack / Technologies:
              </label>
              <input
                type="text"
                value={primaryStack}
                onChange={(e) => setPrimaryStack(e.target.value)}
                placeholder="e.g. TypeScript, React, Next.js, Node.js, PostgreSQL, AWS"
                className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Core Strengths &amp; Accomplishments:
              </label>
              <input
                type="text"
                value={domainOrCoreStrength}
                onChange={(e) => setDomainOrCoreStrength(e.target.value)}
                placeholder="e.g. Scaling microservices, leading agile sprints, optimizing UI Core Web Vitals"
                className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Professional Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {parsedResult && parsedResult.options.length > 0 && (
            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                Select Your Summary:
              </span>

              <div className="space-y-2.5">
                {parsedResult.options.map((opt) => {
                  const isSelected = selectedText === opt.text;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedText(opt.text)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px]">
                          {opt.title}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                            <Check className="w-3 h-3 stroke-[3]" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed">{opt.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={!selectedText}
                  onClick={() => {
                    if (selectedText) {
                      onApply(selectedText);
                      notify.success("Applied guided summary to your resume!");
                      onClose();
                    }
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm"
                >
                  Apply to Summary
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={handleGenerate}
      />
    </>
  );
}
