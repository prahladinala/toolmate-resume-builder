"use client";

import { useState } from "react";
import {
  HelpCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Code2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useResumeStore } from "@/store/useResumeStore";
import {
  generateInterviewQuestionsWithNano,
  type InterviewQuestion,
} from "@/lib/interviewPrep";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { toast } from "sonner";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateInterviewQuestionsWithNano(data);
      setQuestions(result);
      if (result.length > 0) {
        setExpandedId(result[0].id);
      }
      toast.success(
        "Generated tailored interview questions & answers from your resume!",
      );
    } catch (e) {
      console.error("Interview prep error:", e);
      toast.error("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  AI Interview Questions & Answers
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    With Code & Answers
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Technical, system design, and behavioral questions generated
                  with model answers
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
                    highlights to generate targeted technical and STAR
                    behavioral questions along with complete model answers.
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Questions & Answers
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-sm font-medium">
                  Analyzing your resume & formulating questions and code
                  solutions...
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
                                  : q.category === "system-design"
                                    ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                                    : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {q.category}
                            </span>
                            {q.topic && (
                              <span className="text-[10px] text-zinc-500 font-medium">
                                • {q.topic}
                              </span>
                            )}
                            <span className="text-xs text-zinc-400">
                              #{idx + 1}
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
                        <div className="p-4 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 space-y-4 animate-in fade-in duration-150">
                          {q.context && (
                            <p className="text-xs text-zinc-500 italic bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                              💡 <strong>Interviewer intent:</strong>{" "}
                              {q.context}
                            </p>
                          )}

                          {/* Full In-Depth Answer */}
                          {q.fullAnswer && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  Comprehensive Model Answer
                                </label>
                                <button
                                  onClick={() =>
                                    copyToClipboard(q.fullAnswer, `ans-${q.id}`)
                                  }
                                  className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                                >
                                  {copiedId === `ans-${q.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Answer</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                                {q.fullAnswer}
                              </div>
                            </div>
                          )}

                          {/* Code Snippet if Available */}
                          {q.codeSnippet && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                                  <Code2 className="w-3.5 h-3.5" />
                                  Code Walkthrough ({q.codeSnippet.language})
                                </label>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      q.codeSnippet!.code,
                                      `code-${q.id}`,
                                    )
                                  }
                                  className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                                >
                                  {copiedId === `code-${q.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span>Copied Code</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Code</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0d1117] text-zinc-100 text-xs">
                                <pre className="p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed">
                                  <code>{q.codeSnippet.code}</code>
                                </pre>
                                {q.codeSnippet.explanation && (
                                  <div className="p-2.5 bg-zinc-900/80 border-t border-zinc-800 text-[11px] text-zinc-400">
                                    💡 {q.codeSnippet.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Suggested Answer Bullet Points */}
                          {q.suggestedAnswerPoints &&
                            q.suggestedAnswerPoints.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                  Key Takeaways & STAR Highlights
                                </label>
                                <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                                  {q.suggestedAnswerPoints.map(
                                    (point, pIdx) => (
                                      <li
                                        key={pIdx}
                                        className="flex items-start gap-2 leading-relaxed"
                                      >
                                        <span className="text-purple-500 font-bold">
                                          •
                                        </span>
                                        <span>{point}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Link to dedicated /interview-prep page */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <Link
              href="/interview-prep"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Practice by Custom Skills on Interview Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

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
