"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target,
  HelpCircle,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const JDMatcherModal = dynamic(
  () => import("./JDMatcherModal").then((mod) => mod.JDMatcherModal),
  { ssr: false },
);

const InterviewPrepModal = dynamic(
  () => import("./InterviewPrepModal").then((mod) => mod.InterviewPrepModal),
  { ssr: false },
);

interface AtsAnalyzerProps {
  onNavigateStep?: (stepIndex: number) => void;
}

export function AtsAnalyzer({ onNavigateStep }: AtsAnalyzerProps = {}) {
  const { data } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showJDMatcher, setShowJDMatcher] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [score, setScore] = useState(100);
  const [feedback, setFeedback] = useState<
    {
      type: "error" | "warning" | "success";
      text: string;
      stepIndex?: number;
    }[]
  >([]);

  useEffect(() => {
    let newScore = 100;
    const newFeedback: {
      type: "error" | "warning" | "success";
      text: string;
      stepIndex?: number;
    }[] = [];

    // Personal Info Checks
    if (!data.personalInfo.email) {
      newScore -= 10;
      newFeedback.push({
        type: "error",
        text: "Missing email address.",
        stepIndex: 0,
      });
    }
    if (!data.personalInfo.phone) {
      newScore -= 5;
      newFeedback.push({
        type: "warning",
        text: "Missing phone number.",
        stepIndex: 0,
      });
    }
    if (
      !data.personalInfo.linkedin &&
      !data.personalInfo.github &&
      !data.personalInfo.website
    ) {
      newScore -= 10;
      newFeedback.push({
        type: "warning",
        text: "Add a LinkedIn, GitHub, or Portfolio link.",
        stepIndex: 0,
      });
    } else {
      newFeedback.push({
        type: "success",
        text: "Good use of professional links.",
        stepIndex: 0,
      });
    }

    // Summary Checks
    if (!data.summary || data.summary.trim().length < 50) {
      newScore -= 15;
      newFeedback.push({
        type: "error",
        text: "Professional summary is too short or missing.",
        stepIndex: 1,
      });
    } else if (data.summary.split(".").length > 5) {
      newScore -= 5;
      newFeedback.push({
        type: "warning",
        text: "Summary is too long (over 4 sentences).",
        stepIndex: 1,
      });
    } else {
      newFeedback.push({
        type: "success",
        text: "Summary length is optimal.",
        stepIndex: 1,
      });
    }

    // Experience Checks
    if (!data.experience || data.experience.length === 0) {
      newScore -= 20;
      newFeedback.push({
        type: "error",
        text: "Missing work experience.",
        stepIndex: 2,
      });
    } else {
      let hasMetrics = false;
      let hasParagraphs = false;
      let hasActionVerbs = false;
      let hasPronouns = false;
      let hasBuzzwords = false;
      let missingDates = false;

      const actionVerbs =
        /\b(led|managed|developed|created|designed|implemented|orchestrated|increased|improved|reduced|optimized|achieved|coordinated)\b/i;
      const pronouns = /\b(i|me|my|we|our)\b/i;
      const buzzwords =
        /\b(hard worker|team player|think outside the box|synergy|detail oriented|go-getter|self-starter)\b/i;

      let repeatedVerbWarning: string | null = null;
      let hasPassiveVoice = false;

      // Track verb repetitions across all bullets
      const verbCounts: Record<string, number> = {};
      const passiveVoiceRegex =
        /\b(was|were|been|being)\s+(developed|created|assigned|given|tasked|made|asked)\b/i;

      data.experience.forEach((exp) => {
        if (!exp.startDate || (!exp.endDate && !exp.current)) {
          missingDates = true;
        }

        if (exp.description) {
          if (/\d+%|\d+x|\$\d+/i.test(exp.description)) hasMetrics = true;
          if (!exp.description.includes("-") && !exp.description.includes("*"))
            hasParagraphs = true;
          if (actionVerbs.test(exp.description)) hasActionVerbs = true;
          if (pronouns.test(exp.description)) hasPronouns = true;
          if (buzzwords.test(exp.description)) hasBuzzwords = true;
          if (passiveVoiceRegex.test(exp.description)) hasPassiveVoice = true;

          // Split bullets to find leading verbs
          const bullets = exp.description.split(/\n+/);
          bullets.forEach((b) => {
            const firstWord = b
              .replace(/^[-*•\d.]+\s*/, "")
              .trim()
              .split(/\s+/)[0]
              ?.toLowerCase();
            if (
              firstWord &&
              firstWord.length > 3 &&
              actionVerbs.test(firstWord)
            ) {
              verbCounts[firstWord] = (verbCounts[firstWord] || 0) + 1;
              if (verbCounts[firstWord] >= 3) {
                repeatedVerbWarning = firstWord;
              }
            }
          });
        }
      });

      if (repeatedVerbWarning) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: `Action verb "${repeatedVerbWarning}" repeated 3+ times. Diversify with synonyms.`,
          stepIndex: 2,
        });
      }

      if (hasPassiveVoice) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: "Passive voice detected (e.g. 'was tasked with'). Use direct active verbs.",
          stepIndex: 2,
        });
      }

      if (!hasMetrics) {
        newScore -= 10;
        newFeedback.push({
          type: "warning",
          text: "Consider adding numbers/metrics to your experience.",
          stepIndex: 2,
        });
      } else {
        newFeedback.push({
          type: "success",
          text: "Experience includes strong metrics/numbers.",
          stepIndex: 2,
        });
      }

      if (hasParagraphs) {
        newScore -= 10;
        newFeedback.push({
          type: "warning",
          text: "Use bullet points instead of paragraphs in experience.",
          stepIndex: 2,
        });
      }

      if (!hasActionVerbs) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: "Start bullets with strong action verbs (e.g. Developed, Managed).",
          stepIndex: 2,
        });
      } else {
        newFeedback.push({
          type: "success",
          text: "Good use of strong action verbs.",
          stepIndex: 2,
        });
      }

      if (hasPronouns) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: "Avoid personal pronouns (I, me, my) in your resume.",
          stepIndex: 2,
        });
      }

      if (hasBuzzwords) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: "Remove clichés/buzzwords (e.g. 'team player', 'hard worker').",
          stepIndex: 2,
        });
      }

      if (missingDates) {
        newScore -= 10;
        newFeedback.push({
          type: "error",
          text: "One or more experience entries are missing start/end dates.",
          stepIndex: 2,
        });
      }
    }

    // Education Checks
    if (!data.education || data.education.length === 0) {
      newScore -= 10;
      newFeedback.push({
        type: "error",
        text: "Missing education section.",
        stepIndex: 3,
      });
    } else {
      let missingDates = false;
      data.education.forEach((edu) => {
        if (!edu.startDate || (!edu.endDate && !edu.current))
          missingDates = true;
      });
      if (missingDates) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: "Education is missing start/end dates.",
          stepIndex: 3,
        });
      }
    }

    // Projects Checks
    if (data.projects && data.projects.length > 0) {
      let hasLinks = false;
      data.projects.forEach((proj) => {
        if (proj.url || proj.github) hasLinks = true;
      });
      if (!hasLinks) {
        newScore -= 5;
        newFeedback.push({
          type: "warning",
          text: "Add live links or GitHub repos to your projects.",
          stepIndex: 5,
        });
      } else {
        newFeedback.push({
          type: "success",
          text: "Projects include external links.",
          stepIndex: 5,
        });
      }
    }

    // Skills Checks
    if (!data.skills || data.skills.length < 3) {
      newScore -= 10;
      newFeedback.push({
        type: "error",
        text: "List at least 3 key skills.",
        stepIndex: 4,
      });
    } else if (data.skills.length > 15) {
      newScore -= 5;
      newFeedback.push({
        type: "warning",
        text: "Too many skills listed. Keep it focused (under 15).",
        stepIndex: 4,
      });
    } else {
      newFeedback.push({
        type: "success",
        text: "Optimal number of skills listed.",
        stepIndex: 4,
      });
    }

    setScore(Math.max(0, newScore));
    setFeedback(
      newFeedback.sort((a, b) => {
        const weight = { error: 0, warning: 1, success: 2 };
        return weight[a.type] - weight[b.type];
      }),
    );
  }, [data]);

  const handleAutoPolish = async () => {
    const { polishEntireResume } = await import("@/lib/resumePolish");
    const { polishedData, totalFixes } = polishEntireResume(data);
    if (totalFixes > 0) {
      useResumeStore.setState({ data: polishedData });
      toast.success(
        `Polished & standardized ${totalFixes} technical term casing & spacing issues across your resume!`,
      );
    } else {
      toast.info(
        "All technical terms, capitalization, and bullet points are already standardized!",
      );
    }
  };

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-40 print:hidden flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[60vh]"
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Live ATS Analyzer
              </h3>
              <div
                className={`font-bold text-lg ${score >= 90 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-rose-500"}`}
              >
                {score}/100
              </div>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {feedback.map((fb, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  {fb.type === "error" && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  {fb.type === "warning" && (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  {fb.type === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-tight text-zinc-600 dark:text-zinc-400 flex-1">
                    {fb.text}
                  </span>
                  {fb.stepIndex !== undefined &&
                    fb.type !== "success" &&
                    onNavigateStep && (
                      <button
                        onClick={() => {
                          onNavigateStep(fb.stepIndex!);
                          setIsOpen(false);
                        }}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 px-1 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                        title={`Jump to section to fix this issue`}
                      >
                        Fix →
                      </button>
                    )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleAutoPolish();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Spellcheck & Polish Tech Terms
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowJDMatcher(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Target className="w-3.5 h-3.5" />
                Match Against Job Description
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowInterviewPrep(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Generate Interview Questions
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={handleAutoPolish}
          className="h-10 w-10 sm:h-12 sm:w-auto sm:px-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg flex items-center justify-center gap-2 font-medium text-xs transition-transform hover:scale-105 active:scale-95"
          title="Scan and standardize technical buzzwords, capitalization, and punctuation"
        >
          <Wand2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="hidden sm:inline">Polish & Fix</span>
        </button>

        <button
          onClick={() => setShowJDMatcher(true)}
          className="h-10 w-10 sm:h-12 sm:w-auto sm:px-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg flex items-center justify-center gap-2 font-medium text-xs transition-transform hover:scale-105 active:scale-95"
          title="Paste Job Description to check ATS match & keywords"
        >
          <Target className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="hidden sm:inline">Job Matcher</span>
        </button>

        <button
          onClick={() => setShowInterviewPrep(true)}
          className="h-10 w-10 sm:h-12 sm:w-auto sm:px-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg flex items-center justify-center gap-2 font-medium text-xs transition-transform hover:scale-105 active:scale-95"
          title="Generate top 5 interview questions from your resume"
        >
          <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="hidden sm:inline">Interview Prep</span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 px-3 sm:h-12 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 font-medium transition-transform hover:scale-105 active:scale-95"
        >
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="hidden sm:inline text-xs sm:text-sm">ATS Score</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/20`}
          >
            {score}
          </span>
        </button>
      </div>

      <JDMatcherModal
        isOpen={showJDMatcher}
        onClose={() => setShowJDMatcher(false)}
      />

      <InterviewPrepModal
        isOpen={showInterviewPrep}
        onClose={() => setShowInterviewPrep(false)}
      />
    </div>
  );
}
