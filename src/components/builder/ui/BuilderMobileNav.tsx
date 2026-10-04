"use client";

import { ChevronLeft } from "lucide-react";

interface BuilderMobileNavProps {
  steps: { id: string; label: string; icon: React.ElementType }[];
  activeStep: number;
  setActiveStep: (idx: number) => void;
  handleBack: () => void;
  setShowPreviewMobile: (show: boolean) => void;
}

export function BuilderMobileNav({
  steps,
  activeStep,
  setActiveStep,
  handleBack,
  setShowPreviewMobile,
}: BuilderMobileNavProps) {
  return (
    <>
      <header className="md:hidden flex h-14 items-center justify-between border-b border-zinc-200 dark:border-[#27272a] px-4 shrink-0 bg-white dark:bg-[#09090b]">
        <button
          onClick={handleBack}
          className="h-8 w-8 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-semibold tracking-wide text-sm">Builder.</span>
        <button
          onClick={() => setShowPreviewMobile(true)}
          className="h-8 px-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-500/20"
        >
          Preview
        </button>
      </header>

      <div className="md:hidden px-4 py-3 border-b border-zinc-200 dark:border-[#27272a] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white dark:bg-[#09090b]">
        <div className="flex gap-2 min-w-max">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                activeStep === idx
                  ? "bg-zinc-200 dark:bg-[#27272a] text-[#09090b] dark:text-[#fafafa]"
                  : "bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] border border-zinc-200 dark:border-[#27272a]"
              }`}
            >
              <step.icon className="h-3.5 w-3.5" />
              {step.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
