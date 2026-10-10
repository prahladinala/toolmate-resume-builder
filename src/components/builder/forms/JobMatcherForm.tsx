"use client";

import { useState } from "react";
import {
  Target,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  analyzeJobDescriptionWithNano,
  type JDMatchResult,
} from "@/lib/jdMatcher";
import { ChromeAISetupModal } from "../ChromeAISetupModal";
import { notify } from "@/lib/toast";

export function JobMatcherForm() {
  const { data, updateSummary, addSkill } = useResumeStore();
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JDMatchResult | null>(null);
  const [showSetup, setShowSetup] = useState(false);

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
    <div className="space-y-6">
      <div className="border-b border-zinc-200 dark:border-[#27272a] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              Target Job Description Matcher
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                On-Device AI
              </span>
            </h3>
            <p className="text-sm text-zinc-500">
              Paste your target job posting below to evaluate ATS compatibility,
              uncover missing keywords, and tailor your resume.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Job Description (Paste Here)
          </label>
          <textarea
            rows={8}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the target job description, requirements, and responsibilities here..."
            className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setJdText("");
              setResult(null);
            }}
            disabled={!jdText && !result}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline disabled:opacity-30"
          >
            Clear
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing with Gemini Nano...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Scan Match & Missing Keywords
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-8 space-y-6 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-bottom-2">
          {/* Match Score Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                ATS Compatibility
              </span>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {result.matchScore}% Match
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {result.matchScore >= 80
                  ? "🎉 Outstanding alignment! Your background closely mirrors this job post."
                  : result.matchScore >= 60
                    ? "⚡ Moderate match. Add the missing keywords below to maximize recruiter screening."
                    : "⚠️ Low keyword overlap. Tailor your skills and summary with the missing terms below."}
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-indigo-500 font-black text-lg text-indigo-600 dark:text-indigo-400 shrink-0">
              {result.matchScore}%
            </div>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Keywords */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <h5 className="font-semibold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Check className="w-4 h-4 text-emerald-600" />
                Matched Keywords ({result.matchedKeywords.length})
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedKeywords.length > 0 ? (
                  result.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-xs bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">
                    None detected yet.
                  </span>
                )}
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
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-xs bg-white dark:bg-zinc-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-medium"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">
                    All major keywords present!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tailored Summary */}
          {result.tailoredSummarySuggestion && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Suggested Professional Summary for this Role
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
        </div>
      )}

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={handleAnalyze}
      />
    </div>
  );
}
