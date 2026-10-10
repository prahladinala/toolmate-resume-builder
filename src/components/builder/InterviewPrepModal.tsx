"use client";

import { useState } from "react";
import {
  HelpCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  generateInterviewQuestionsWithNano,
  type InterviewQuestion,
} from "@/lib/interviewPrep";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { notify } from "@/lib/toast";

interface InterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InterviewPrepModal({
  isOpen,
  onClose,
}: InterviewPrepModalProps) {
  const { data } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateInterviewQuestionsWithNano(data);
      setQuestions(result);
      if (result.length > 0) {
        setExpandedId(result[0].id);
      }
      notify.success(
        "Generated tailored interview questions based on your resume!",
      );
    } catch (e) {
      console.error("Interview prep error:", e);
      notify.error("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  AI Interview Prep Generator
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    STAR Method
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Targeted technical and behavioral questions generated directly
                  from your experience
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {questions.length === 0 && !loading && (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Prepare for Interviews with Confidence
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                    Gemini Nano analyzes your entered skills, roles, and project
                    highlights to predict the top 5 questions recruiters and
                    hiring managers will ask you.
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate 5 Interview Questions
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-sm font-medium">
                  Analyzing your resume & formulating questions...
                </span>
              </div>
            )}

            {questions.length > 0 && !loading && (
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Targeted Questions for{" "}
                    {data.personalInfo.title || "Your Profile"}
                  </span>
                  <button
                    onClick={handleGenerate}
                    className="text-xs text-purple-600 dark:text-purple-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>

                {questions.map((q, idx) => {
                  const isExpanded = expandedId === q.id;
                  return (
                    <div
                      key={q.id || idx}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all bg-zinc-50/50 dark:bg-zinc-800/30"
                    >
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                q.category === "technical"
                                  ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                  : q.category === "behavioral"
                                    ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                                    : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                              }`}
                            >
                              {q.category}
                            </span>
                            <span className="text-xs text-zinc-400">
                              Question #{idx + 1}
                            </span>
                          </div>
                          <h5 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                            {q.question}
                          </h5>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 space-y-3">
                          {q.context && (
                            <p className="text-xs text-zinc-500 italic">
                              💡 <strong>Interviewer intent:</strong>{" "}
                              {q.context}
                            </p>
                          )}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                              Suggested Answer Points (STAR Outline)
                            </label>
                            <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                              {q.suggestedAnswerPoints.map((point, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="flex items-start gap-2 leading-relaxed"
                                >
                                  <span className="text-purple-500 font-bold">
                                    •
                                  </span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium"
            >
              Close
            </button>
          </div>
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
