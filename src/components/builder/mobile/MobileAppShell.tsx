"use client";

import React, { useState } from "react";
import {
  FileText,
  Palette,
  Eye,
  Sparkles,
  Download,
  ChevronLeft,
  Undo2,
  Redo2,
  History,
  Users,
  ChevronRight,
  Printer,
  FileCode,
  Target,
  HelpCircle,
  Wand2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { BuilderFormContainer } from "../ui/BuilderFormContainer";
import { Preview } from "../Preview";
import { StyleForm } from "../forms/StyleForm";
import { JDMatcherModal } from "../JDMatcherModal";
import { InterviewPrepModal } from "../InterviewPrepModal";
import { polishEntireResume } from "@/lib/resumePolish";
import { toast } from "sonner";

export type MobileTab = "editor" | "design" | "preview" | "ai" | "export";

interface MobileAppShellProps {
  activeStep: number;
  setActiveStep: (idx: number) => void;
  handleBack: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenProfiles: () => void;
  onOpenImport: () => void;
  onOpenHistory: () => void;
  handleDownload: () => void;
  handleDownloadWord: () => void;
  exportJSON: () => void;
  isOnline: boolean;
}

const EDITOR_STEPS = [
  { id: 0, label: "Personal", short: "Info" },
  { id: 1, label: "Summary", short: "Summary" },
  { id: 2, label: "Experience", short: "Work" },
  { id: 3, label: "Education", short: "Edu" },
  { id: 4, label: "Skills", short: "Skills" },
  { id: 5, label: "Projects", short: "Projects" },
  { id: 6, label: "Custom", short: "Custom" },
  { id: 7, label: "Cover Letter", short: "Letter" },
];

export function MobileAppShell({
  activeStep,
  setActiveStep,
  handleBack,
  undo,
  redo,
  canUndo,
  canRedo,
  onOpenProfiles,
  onOpenImport,
  onOpenHistory,
  handleDownload,
  handleDownloadWord,
  exportJSON,
  isOnline,
}: MobileAppShellProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("editor");
  const [showJDMatcher, setShowJDMatcher] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [previewMode, setPreviewMode] = useState<"resume" | "cover-letter">(
    "resume",
  );
  const { data } = useResumeStore();

  // Compute live ATS score for the AI tab
  const calculateScore = () => {
    let score = 100;
    const checks: { type: "error" | "warning" | "success"; text: string }[] =
      [];

    if (!data.personalInfo.email) {
      score -= 10;
      checks.push({ type: "error", text: "Missing email address." });
    }
    if (!data.personalInfo.phone) {
      score -= 5;
      checks.push({ type: "warning", text: "Missing phone number." });
    }
    if (
      !data.personalInfo.linkedin &&
      !data.personalInfo.github &&
      !data.personalInfo.website
    ) {
      score -= 10;
      checks.push({
        type: "warning",
        text: "Add a LinkedIn or portfolio link.",
      });
    } else {
      checks.push({ type: "success", text: "Professional links present." });
    }

    if (!data.summary || data.summary.length < 50) {
      score -= 10;
      checks.push({ type: "warning", text: "Summary is short or missing." });
    } else {
      checks.push({ type: "success", text: "Professional summary included." });
    }

    if (!data.experience || data.experience.length === 0) {
      score -= 20;
      checks.push({ type: "error", text: "No work experience listed." });
    } else {
      checks.push({
        type: "success",
        text: `${data.experience.length} work experience entries.`,
      });
    }

    if (!data.skills || data.skills.length < 3) {
      score -= 10;
      checks.push({ type: "error", text: "Add at least 3 technical skills." });
    } else {
      checks.push({
        type: "success",
        text: `${data.skills.length} skills listed.`,
      });
    }

    if (!data.education || data.education.length === 0) {
      score -= 10;
      checks.push({ type: "warning", text: "No education entry listed." });
    } else {
      checks.push({ type: "success", text: "Education section populated." });
    }

    return { score: Math.max(0, score), checks };
  };

  const { score: atsScore, checks: atsChecks } = calculateScore();

  const handleAutoPolish = () => {
    const { polishedData, totalFixes } = polishEntireResume(data);
    if (totalFixes > 0) {
      useResumeStore.setState({ data: polishedData });
      toast.success(
        `Polished & standardized ${totalFixes} technical term casing & spacing issues across your resume! 🎉`,
      );
    } else {
      toast.info(
        "All technical terms and capitalization are already standardized! ✨",
      );
    }
  };

  const currentEditorStep =
    EDITOR_STEPS.find((s) => s.id === activeStep) || EDITOR_STEPS[0];
  const isFirstStep = activeStep === 0;
  const isLastEditorStep = activeStep === 7;

  return (
    <div className="md:hidden flex flex-col h-screen w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans select-none">
      {/* 1. NATIVE MOBILE APP TOP BAR */}
      <header className="h-14 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBack}
            className="h-9 w-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-90 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-none text-zinc-900 dark:text-zinc-50">
              {data.personalInfo.firstName
                ? `${data.personalInfo.firstName}'s Resume`
                : "Resume Builder"}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isOnline ? "Auto-saved locally" : "Working offline"}
            </span>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenImport}
            className="h-8 w-8 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 active:scale-95"
            title="Smart Import PDF / LinkedIn"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenProfiles}
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
            title="Switch Targeted Profiles"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenHistory}
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
            title="History Timeline"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT (BASED ON ACTIVE TAB) */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* TAB 1: EDITOR */}
        {mobileTab === "editor" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Step Stepper Pill Bar */}
            <div className="bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-1.5 px-0.5">
                <span>
                  Section {activeStep + 1} of {EDITOR_STEPS.length}:{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    {currentEditorStep.label}
                  </strong>
                </span>
                <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-mono">
                  {Math.round(((activeStep + 1) / EDITOR_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((activeStep + 1) / EDITOR_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Horizontal Scrollable Step Pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                {EDITOR_STEPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(s.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      activeStep === s.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Form */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
              <BuilderFormContainer activeStep={activeStep} />
            </div>

            {/* Sticky Bottom Form Navigation Bar */}
            <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-2.5 flex items-center justify-between gap-2 shadow-lg">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={isFirstStep}
                className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1 disabled:opacity-30 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <button
                onClick={() => setMobileTab("preview")}
                className="h-10 px-3 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>

              <button
                onClick={() => {
                  if (isLastEditorStep) {
                    setMobileTab("preview");
                  } else {
                    setActiveStep(activeStep + 1);
                  }
                }}
                className="h-10 flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95"
              >
                {isLastEditorStep ? (
                  <>
                    Done & Preview <CheckCircle2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next: {EDITOR_STEPS[activeStep + 1]?.short || "Next"}{" "}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DESIGN & TEMPLATES */}
        {mobileTab === "design" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Design & Templates</h3>
                <p className="text-xs text-zinc-500">
                  Pick template, custom color palette & fonts
                </p>
              </div>
              <button
                onClick={() => setMobileTab("preview")}
                className="h-8 px-3 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
              <StyleForm />
            </div>
          </div>
        )}

        {/* TAB 3: LIVE PREVIEW */}
        {mobileTab === "preview" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Live Preview Mode Switcher */}
            <div className="bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 flex items-center justify-between z-30 shrink-0">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-full flex items-center border border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setPreviewMode("resume")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    previewMode === "resume"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Resume
                </button>
                <button
                  onClick={() => setPreviewMode("cover-letter")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    previewMode === "cover-letter"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Cover Letter
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDownload}
                  className="h-8 px-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={handleDownloadWord}
                  className="h-8 px-2.5 rounded-full border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                  title="Download Word (.docx)"
                >
                  <FileText className="w-3.5 h-3.5" /> DOCX
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Preview mode={previewMode} onModeChange={setPreviewMode} />
            </div>
          </div>
        )}

        {/* TAB 4: AI TOOLS & ATS OPTIMIZER */}
        {mobileTab === "ai" && (
          <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 py-4 pb-28">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                AI Resume Intelligence
              </h3>
              <p className="text-xs text-zinc-500">
                On-device optimization, ATS scoring & interview prep
              </p>
            </div>

            {/* ATS Score Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  ATS Health Score
                </div>
                <div
                  className={`text-2xl font-black ${
                    atsScore >= 90
                      ? "text-emerald-500"
                      : atsScore >= 70
                        ? "text-amber-500"
                        : "text-rose-500"
                  }`}
                >
                  {atsScore}
                  <span className="text-xs font-normal text-zinc-400">
                    /100
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    atsScore >= 90
                      ? "bg-emerald-500"
                      : atsScore >= 70
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                  style={{ width: `${atsScore}%` }}
                />
              </div>

              {/* Checks summary */}
              <div className="space-y-2 mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                {atsChecks.map((chk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {chk.type === "success" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {chk.type === "warning" && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    {chk.type === "error" && (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {chk.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Action Cards */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      1-Click Auto-Polish
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Standardize capitalization & tech term casing
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAutoPolish}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm active:scale-95 shrink-0"
                >
                  Run
                </button>
              </div>

              <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      Job Description Matcher
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Scan against target role & extract missing keywords
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowJDMatcher(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm active:scale-95 shrink-0"
                >
                  Match
                </button>
              </div>

              <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    Interview Prep Generator
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Top 5 technical & behavioral questions with STAR answers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInterviewPrep(true)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <HelpCircle className="w-4 h-4" /> Generate Interview Questions
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: EXPORT & SHARE */}
        {mobileTab === "export" && (
          <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 py-4 pb-28">
            <div className="mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-500" />
                Export & Download
              </h3>
              <p className="text-xs text-zinc-500">
                Choose format for recruiters, job portals & print
              </p>
            </div>

            <div className="space-y-3">
              {/* PDF Option */}
              <div
                onClick={handleDownload}
                className="bg-white dark:bg-[#111113] border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">Download PDF</h4>
                      <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      ATS-compliant vector PDF with selectable text
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>

              {/* Word DOCX Option */}
              <div
                onClick={handleDownloadWord}
                className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-600 text-white shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Download Word (.docx)</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Editable Microsoft Word file requested by staffing
                      agencies
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>

              {/* JSON Resume Option */}
              <div
                onClick={exportJSON}
                className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Export JSON Resume</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Standardized open schema backup (jsonresume.org)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>

              {/* Print Option */}
              <div
                onClick={handleDownload}
                className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Print Resume</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Direct print via AirPrint or connected Wi-Fi printer
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. NATIVE MOBILE APP BOTTOM NAVIGATION BAR */}
      <nav className="h-16 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-1 shrink-0 z-50">
        {/* TAB 1: Editor */}
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            mobileTab === "editor"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-zinc-500 dark:text-zinc-400 font-medium"
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5" />
            {mobileTab === "editor" && (
              <motion.div
                layoutId="mobileNavDot"
                className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mx-auto mt-0.5"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5">Editor</span>
        </button>

        {/* TAB 2: Design */}
        <button
          onClick={() => setMobileTab("design")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            mobileTab === "design"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-zinc-500 dark:text-zinc-400 font-medium"
          }`}
        >
          <div className="relative">
            <Palette className="w-5 h-5" />
            {mobileTab === "design" && (
              <motion.div
                layoutId="mobileNavDot"
                className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mx-auto mt-0.5"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5">Design</span>
        </button>

        {/* TAB 3: Preview */}
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            mobileTab === "preview"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-zinc-500 dark:text-zinc-400 font-medium"
          }`}
        >
          <div className="relative">
            <Eye className="w-5 h-5" />
            {mobileTab === "preview" && (
              <motion.div
                layoutId="mobileNavDot"
                className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mx-auto mt-0.5"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5">Preview</span>
        </button>

        {/* TAB 4: AI Tools */}
        <button
          onClick={() => setMobileTab("ai")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            mobileTab === "ai"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-zinc-500 dark:text-zinc-400 font-medium"
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            <span
              className={`absolute -top-1 -right-2 text-[9px] font-bold px-1 rounded-full text-white ${
                atsScore >= 90
                  ? "bg-emerald-500"
                  : atsScore >= 70
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
            >
              {atsScore}
            </span>
            {mobileTab === "ai" && (
              <motion.div
                layoutId="mobileNavDot"
                className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mx-auto mt-0.5"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5">AI Tools</span>
        </button>

        {/* TAB 5: Export */}
        <button
          onClick={() => setMobileTab("export")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            mobileTab === "export"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-zinc-500 dark:text-zinc-400 font-medium"
          }`}
        >
          <div className="relative">
            <Download className="w-5 h-5" />
            {mobileTab === "export" && (
              <motion.div
                layoutId="mobileNavDot"
                className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mx-auto mt-0.5"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5">Export</span>
        </button>
      </nav>

      {/* Modals */}
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
