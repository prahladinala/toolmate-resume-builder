"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Check,
  Target,
  Wrench,
  BarChart2,
  ShieldCheck,
  X,
} from "lucide-react";
import { checkChromeAIAvailability } from "@/lib/chromeAI";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import {
  buildAchievementSynthesisPrompt,
  type AchievementDiscoveryContext,
} from "@/lib/ai/prompts";
import { aiSessionManager } from "@/lib/ai/sessionManager";
import { parseAIResponse, type AIParsedResult } from "@/lib/aiParser";
import { notify } from "@/lib/toast";

interface AchievementAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onApply: (synthesizedText: string) => void;
}

export function AchievementAssistantModal({
  isOpen,
  onClose,
  currentText,
  onApply,
}: AchievementAssistantModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // Guided STAR input states
  const [problemSolved, setProblemSolved] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [verifiedMetric, setVerifiedMetric] = useState("");

  // Results
  const [parsedResult, setParsedResult] = useState<AIParsedResult | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSynthesize = async () => {
    setLoading(true);
    setParsedResult(null);
    setSelectedText(null);

    const avail = await checkChromeAIAvailability();
    if (!avail.isAvailable) {
      setShowSetup(true);
      setLoading(false);
      return;
    }

    const discoveryContext: AchievementDiscoveryContext = {
      originalBullet: currentText,
      problemSolved:
        problemSolved.trim() ||
        "Improved workflow efficiency and delivery quality",
      toolsUsed:
        toolsUsed.trim() ||
        "Modern tools and automated engineering best practices",
      verifiedMetric: verifiedMetric.trim() || undefined,
    };

    const prompt = buildAchievementSynthesisPrompt(discoveryContext);

    try {
      const rawResponse = await aiSessionManager.executePrompt(prompt, {
        systemPrompt:
          "You are a Principal Technical Resume Coach specializing in evidence-based STAR accomplishments.",
      });

      const parsed = parseAIResponse(rawResponse, currentText);
      setParsedResult(parsed);
      if (parsed.options.length > 0) {
        setSelectedText(
          parsed.options[parsed.recommendedIndex]?.text ||
            parsed.options[0].text,
        );
      }
      setStep(3);
    } catch (e) {
      console.error("Achievement synthesis failed:", e);
      notify.error("Failed to generate STAR accomplishment options.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setProblemSolved("");
    setToolsUsed("");
    setVerifiedMetric("");
    setParsedResult(null);
    setSelectedText(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
                    Evidence-Based STAR Assistant
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> No Fake Metrics
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Transform raw tasks into verified impact using Gemini Nano
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

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between gap-2 my-4 px-1">
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? "bg-purple-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? "bg-purple-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${step >= 3 ? "bg-purple-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
          </div>

          {/* Step 1: Evidence Discovery */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                  Draft Bullet Point
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 italic">
                  &ldquo;{currentText || "No bullet text provided."}&rdquo;
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    What specific bottleneck, problem, or goal were you
                    addressing?
                  </label>
                  <input
                    type="text"
                    value={problemSolved}
                    onChange={(e) => setProblemSolved(e.target.value)}
                    placeholder="e.g. Slow CI/CD build pipelines blocking daily team releases"
                    className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-purple-600" />
                    What tools, technologies, or architecture did you employ?
                  </label>
                  <input
                    type="text"
                    value={toolsUsed}
                    onChange={(e) => setToolsUsed(e.target.value)}
                    placeholder="e.g. Docker caching, GitHub Actions matrix builds, Turborepo"
                    className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  Next: Add Metric
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Metric Verification (Zero Hallucination) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/60 dark:border-purple-900/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-900 dark:text-purple-300">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <span>Real Metrics Verification</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  We will never invent fake numbers or % improvements. Only
                  enter verified metrics you can defend in an interview, or skip
                  to focus on qualitative outcomes.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
                  Candidate Verified Metric (Optional):
                </label>
                <input
                  type="text"
                  value={verifiedMetric}
                  onChange={(e) => setVerifiedMetric(e.target.value)}
                  placeholder="e.g. Reduced pipeline runtimes from 28min to 6min (78% faster)"
                  className="mt-1 w-full text-xs px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Tip: Leave blank if you do not have exact numbers; AI will
                  craft a high-impact narrative without fabricating metrics.
                </span>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-800"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSynthesize}
                  className="px-5 py-2.5 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Synthesizing STAR Bullets...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Synthesize Accomlishments
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Apply */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Your Synthesized Bullet:
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Adjust Inputs
                </button>
              </div>

              {parsedResult && parsedResult.options.length > 0 ? (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {parsedResult.options.map((opt, idx) => {
                    const isSelected = selectedText === opt.text;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedText(opt.text)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px]">
                            {opt.title || `Option ${idx + 1}`}
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
              ) : (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No options generated. Click &ldquo;Adjust Inputs&rdquo; to
                  re-try.
                </div>
              )}

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
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
                      notify.success(
                        "Added evidence-based accomplishment to resume!",
                      );
                      onClose();
                    }
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm"
                >
                  Apply to Resume
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
        onSuccess={handleSynthesize}
      />
    </>
  );
}
