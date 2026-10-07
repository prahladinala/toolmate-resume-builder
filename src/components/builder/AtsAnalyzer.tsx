"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { useState, useEffect } from "react";
import { Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AtsAnalyzer() {
  const { data } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(100);
  const [feedback, setFeedback] = useState<{ type: "error" | "warning" | "success"; text: string }[]>([]);

  useEffect(() => {
    let newScore = 100;
    const newFeedback: { type: "error" | "warning" | "success"; text: string }[] = [];

    // Personal Info Checks
    if (!data.personalInfo.email) {
      newScore -= 10;
      newFeedback.push({ type: "error", text: "Missing email address." });
    }
    if (!data.personalInfo.phone) {
      newScore -= 5;
      newFeedback.push({ type: "warning", text: "Missing phone number." });
    }
    if (!data.personalInfo.linkedin && !data.personalInfo.github && !data.personalInfo.website) {
      newScore -= 10;
      newFeedback.push({ type: "warning", text: "Add a LinkedIn, GitHub, or Portfolio link." });
    } else {
      newFeedback.push({ type: "success", text: "Good use of professional links." });
    }

    // Summary Checks
    if (!data.summary || data.summary.trim().length < 50) {
      newScore -= 15;
      newFeedback.push({ type: "error", text: "Professional summary is too short or missing." });
    } else if (data.summary.split(".").length > 5) {
      newScore -= 5;
      newFeedback.push({ type: "warning", text: "Summary is too long (over 4 sentences)." });
    } else {
      newFeedback.push({ type: "success", text: "Summary length is optimal." });
    }

    // Experience Checks
    if (!data.experience || data.experience.length === 0) {
      newScore -= 20;
      newFeedback.push({ type: "error", text: "Missing work experience." });
    } else {
      let hasMetrics = false;
      let hasParagraphs = false;
      let hasActionVerbs = false;
      let hasPronouns = false;
      let hasBuzzwords = false;
      let missingDates = false;

      const actionVerbs = /\b(led|managed|developed|created|designed|implemented|orchestrated|increased|improved|reduced|optimized|achieved|coordinated)\b/i;
      const pronouns = /\b(i|me|my|we|our)\b/i;
      const buzzwords = /\b(hard worker|team player|think outside the box|synergy|detail oriented|go-getter|self-starter)\b/i;

      data.experience.forEach(exp => {
        if (!exp.startDate || (!exp.endDate && !exp.current)) {
          missingDates = true;
        }

        if (exp.description) {
          if (/\d+%|\d+x|\$\d+/i.test(exp.description)) hasMetrics = true;
          if (!exp.description.includes("-") && !exp.description.includes("*")) hasParagraphs = true;
          if (actionVerbs.test(exp.description)) hasActionVerbs = true;
          if (pronouns.test(exp.description)) hasPronouns = true;
          if (buzzwords.test(exp.description)) hasBuzzwords = true;
        }
      });

      if (!hasMetrics) {
        newScore -= 10;
        newFeedback.push({ type: "warning", text: "Consider adding numbers/metrics to your experience." });
      } else {
        newFeedback.push({ type: "success", text: "Experience includes strong metrics/numbers." });
      }

      if (hasParagraphs) {
        newScore -= 10;
        newFeedback.push({ type: "warning", text: "Use bullet points instead of paragraphs in experience." });
      }
      
      if (!hasActionVerbs) {
        newScore -= 5;
        newFeedback.push({ type: "warning", text: "Start bullets with strong action verbs (e.g. Developed, Managed)." });
      } else {
        newFeedback.push({ type: "success", text: "Good use of strong action verbs." });
      }

      if (hasPronouns) {
        newScore -= 5;
        newFeedback.push({ type: "warning", text: "Avoid personal pronouns (I, me, my) in your resume." });
      }

      if (hasBuzzwords) {
        newScore -= 5;
        newFeedback.push({ type: "warning", text: "Remove clichés/buzzwords (e.g. 'team player', 'hard worker')." });
      }

      if (missingDates) {
        newScore -= 10;
        newFeedback.push({ type: "error", text: "One or more experience entries are missing start/end dates." });
      }
    }

    // Education Checks
    if (!data.education || data.education.length === 0) {
      newScore -= 10;
      newFeedback.push({ type: "error", text: "Missing education section." });
    } else {
      let missingDates = false;
      data.education.forEach(edu => {
        if (!edu.startDate || (!edu.endDate && !edu.current)) missingDates = true;
      });
      if (missingDates) {
        newScore -= 5;
        newFeedback.push({ type: "warning", text: "Education is missing start/end dates." });
      }
    }

    // Projects Checks
    if (data.projects && data.projects.length > 0) {
      let hasLinks = false;
      data.projects.forEach(proj => {
        if (proj.url || proj.github) hasLinks = true;
      });
      if (!hasLinks) {
        newScore -= 5;
        newFeedback.push({ type: "warning", text: "Add live links or GitHub repos to your projects." });
      } else {
        newFeedback.push({ type: "success", text: "Projects include external links." });
      }
    }

    // Skills Checks
    if (!data.skills || data.skills.length < 3) {
      newScore -= 10;
      newFeedback.push({ type: "error", text: "List at least 3 key skills." });
    } else if (data.skills.length > 15) {
      newScore -= 5;
      newFeedback.push({ type: "warning", text: "Too many skills listed. Keep it focused (under 15)." });
    } else {
      newFeedback.push({ type: "success", text: "Optimal number of skills listed." });
    }

    setScore(Math.max(0, newScore));
    setFeedback(newFeedback.sort((a, b) => {
      const weight = { error: 0, warning: 1, success: 2 };
      return weight[a.type] - weight[b.type];
    }));
  }, [data]);

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[60vh]"
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Live ATS Analyzer
              </h3>
              <div className={`font-bold text-lg ${score >= 90 ? 'text-emerald-500' : score >= 70 ? 'text-amber-500' : 'text-rose-500'}`}>
                {score}/100
              </div>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {feedback.map((fb, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  {fb.type === "error" && <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                  {fb.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                  {fb.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                  <span className="leading-tight text-zinc-600 dark:text-zinc-400">{fb.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center gap-2 font-medium transition-transform hover:scale-105 active:scale-95"
      >
        <Activity className="w-5 h-5" />
        <span className="hidden sm:inline">ATS Score</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-white/20`}>
          {score}
        </span>
      </button>
    </div>
  );
}
