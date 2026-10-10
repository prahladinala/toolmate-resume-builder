"use client";

import { ChevronLeft, Upload, Save, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface BuilderSidebarProps {
  steps: { id: string; label: string; icon: React.ElementType }[];
  activeStep: number;
  setActiveStep: (idx: number) => void;
  handleBack: () => void;
  importJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportJSON: () => void;
  onOpenProfiles?: () => void;
}

export function BuilderSidebar({
  steps,
  activeStep,
  setActiveStep,
  handleBack,
  importJSON,
  exportJSON,
  onOpenProfiles,
}: BuilderSidebarProps) {
  return (
    <nav className="hidden md:flex w-[88px] h-full flex-col items-center py-8 border-r border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] shrink-0 justify-between z-30 print:hidden">
      <div className="flex flex-col gap-6 w-full items-center">
        <button
          onClick={handleBack}
          className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-all hover:scale-105"
          aria-label="Go back"
          title="Back to Templates"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="w-10 h-[1px] bg-zinc-200 dark:bg-[#27272a] rounded-full" />

        <div className="flex flex-col gap-3 w-full px-3">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`group relative flex items-center justify-center h-12 w-full rounded-xl transition-all duration-200 ${
                activeStep === idx
                  ? "bg-zinc-200 dark:bg-[#fafafa] text-[#09090b] shadow-sm"
                  : "text-zinc-500 dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-[#27272a] hover:text-zinc-900 dark:hover:text-[#fafafa]"
              }`}
              title={step.label}
            >
              <step.icon
                className={`h-5 w-5 transition-transform ${activeStep === idx ? "scale-110" : "group-hover:scale-110"}`}
              />
              <span className="absolute left-14 bg-zinc-800 dark:bg-[#27272a] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full items-center">
        <button
          onClick={onOpenProfiles}
          className="h-10 w-10 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-blue-600 dark:text-blue-400"
          title="Manage Resume Profiles & Versions"
        >
          <Layers className="h-4 w-4" />
        </button>
        <div className="relative group">
          <input
            type="file"
            accept=".json"
            onChange={importJSON}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Import JSON Backup"
          />
          <button className="h-10 w-10 rounded-full border border-zinc-200 dark:border-[#27272a] flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-colors text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#fafafa]">
            <Upload className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={exportJSON}
          className="h-10 w-10 rounded-full border border-zinc-200 dark:border-[#27272a] flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-colors text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#fafafa]"
          title="Export JSON Backup"
        >
          <Save className="h-4 w-4" />
        </button>
        <div className="w-10 h-[1px] bg-zinc-200 dark:bg-[#27272a] rounded-full my-1" />
        <ThemeToggle />
      </div>
    </nav>
  );
}
