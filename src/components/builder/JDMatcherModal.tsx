"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Target,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  analyzeJobDescriptionWithNano,
  type JDMatchResult,
} from "@/lib/jdMatcher";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { notify } from "@/lib/toast";

interface JDMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JDMatcherModal({ isOpen, onClose }: JDMatcherModalProps) {
  const { data, updateSummary, addSkill, updateTargetJobDescription } =
    useResumeStore();
  const [jdText, setJdText] = useState(data.targetJobDescription || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JDMatchResult | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setLoading(true);

    try {
      const matchResult = await analyzeJobDescriptionWithNano(jdText, data);
      setResult(matchResult);
      notify.success(
        `Analysis complete! ATS match score: ${matchResult.matchScore}%`,
      );
    } catch (e) {
      console.error("JD Matcher error:", e);
      notify.error("Failed to analyze job description.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMissingSkills = () => {
    if (!result || !result.missingKeywords.length) return;
    let addedCount = 0;
    const existingNames = new Set(data.skills.map((s) => s.name.toLowerCase()));

    result.missingKeywords.slice(0, 6).forEach((kw) => {
      if (!existingNames.has(kw.toLowerCase())) {
        addSkill({
          id: `jd-skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: kw,
        });
        addedCount++;
      }
    });

    notify.success(`Added ${addedCount} missing skills to your resume!`);
  };

  const handleApplyTailoredSummary = () => {
    if (!result?.tailoredSummarySuggestion) return;
    updateSummary(result.tailoredSummarySuggestion);
    notify.success("Professional Summary updated with JD-tailored version!");
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jd-modal-title"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="jd-modal-title"
                  className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
                >
                  Target Job Description Matcher
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    On-Device Nano
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Scan any job posting to uncover missing keywords and tailor
                  your resume
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold p-1 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!result ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Paste Target Job Description (JD)
                </label>
                <textarea
                  rows={8}
                  value={jdText}
                  onChange={(e) => {
                    setJdText(e.target.value);
                    updateTargetJobDescription(e.target.value);
                  }}
                  placeholder="Paste the job requirements, responsibilities, and required qualifications here..."
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-200 resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={!jdText.trim() || loading}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 shadow-md transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Scanning Resume vs JD...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Match & Keywords
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Estimated Keyword Alignment Checklist
                    </span>
                    <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                      ~{result.matchScore}% Match
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {result.matchScore >= 80
                        ? "🎉 Strong keyword overlap with this job posting's key requirements."
                        : result.matchScore >= 60
                          ? "⚡ Moderate match checklist. Review the missing keywords below to strengthen relevant bullet points."
                          : "⚠️ Low keyword overlap. Consider highlighting relevant skills from the checklist below."}
                    </p>
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      Note: This is an estimated keyword alignment checklist to
                      guide your editing—not a guaranteed ATS score or hiring
                      prediction.
                    </span>
                  </div>
                  <div className="radial-score flex items-center justify-center w-16 h-16 rounded-full border-4 border-indigo-500 font-black text-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                    {result.matchScore}%
                  </div>
                </div>

                {/* Keywords Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched Keywords */}
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                    <h5 className="font-semibold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Matched Keywords ({result.matchedKeywords.length})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-xs bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-xs text-rose-800 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Missing Keywords ({result.missingKeywords.length})
                      </h5>
                      {result.missingKeywords.length > 0 && (
                        <button
                          onClick={handleApplyMissingSkills}
                          className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          + Add to Skills
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-xs bg-white dark:bg-zinc-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tailored Summary Recommendation */}
                {result.tailoredSummarySuggestion && (
                  <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Tailored Professional Summary for this JD
                      </h5>
                      <button
                        onClick={handleApplyTailoredSummary}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                      >
                        Apply to Summary
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 italic bg-white dark:bg-zinc-800/60 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      &quot;{result.tailoredSummarySuggestion}&quot;
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
                  >
                    ← Test Another Job Description
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={handleAnalyze}
      />
    </>
  );
}
