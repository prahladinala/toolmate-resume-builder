"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PersonalInfoForm } from "@/components/builder/forms/PersonalInfoForm";
import { SummaryForm } from "@/components/builder/forms/SummaryForm";
import { ExperienceForm } from "@/components/builder/forms/ExperienceForm";
import { SkillsForm } from "@/components/builder/forms/SkillsForm";
import { ProjectsForm } from "@/components/builder/forms/ProjectsForm";
import { EducationForm } from "@/components/builder/forms/EducationForm";
import { StyleForm } from "@/components/builder/forms/StyleForm";
import { CustomSectionForm } from "@/components/builder/forms/CustomSectionForm";
import { CoverLetterForm } from "@/components/builder/forms/CoverLetterForm";
import { JobMatcherForm } from "@/components/builder/forms/JobMatcherForm";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";

interface BuilderFormContainerProps {
  activeStep: number;
  setActiveStep?: (idx: number) => void;
  steps?: { id: string; label: string }[];
  onOpenImport?: () => void;
  onOpenProfiles?: () => void;
}

export function BuilderFormContainer({
  activeStep,
  setActiveStep,
  steps,
  onOpenImport,
  onOpenProfiles,
}: BuilderFormContainerProps) {
  const { data } = useResumeStore();

  const isFreshResume =
    !data.personalInfo.firstName &&
    !data.personalInfo.lastName &&
    data.experience.length === 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth no-scrollbar">
      {/* FTUX: Quick-Start Banner for empty resumes on Step 0 */}
      {isFreshResume && activeStep === 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Save time with a 1-click import!
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Upload an existing resume or pre-fill with an industry starter
              example.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenImport && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenImport}
                className="rounded-full text-xs font-semibold h-7.5 px-3 bg-white dark:bg-zinc-900 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50"
              >
                <Upload className="w-3 h-3 mr-1" /> Import PDF
              </Button>
            )}
            {onOpenProfiles && (
              <Button
                size="sm"
                onClick={onOpenProfiles}
                className="rounded-full text-xs font-semibold h-7.5 px-3 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Users className="w-3 h-3 mr-1" /> Load Example
              </Button>
            )}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="pb-8"
        >
          {activeStep === 0 && <PersonalInfoForm />}
          {activeStep === 1 && <SummaryForm />}
          {activeStep === 2 && <ExperienceForm />}
          {activeStep === 3 && <EducationForm />}
          {activeStep === 4 && <SkillsForm />}
          {activeStep === 5 && <ProjectsForm />}
          {activeStep === 6 && <CustomSectionForm />}
          {activeStep === 7 && <CoverLetterForm />}
          {activeStep === 8 && <JobMatcherForm />}
          {activeStep === 9 && <StyleForm />}

          {/* Stepper Flow Footer: Eliminates dead-end form friction */}
          {steps && setActiveStep && (
            <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-[#27272a] flex items-center justify-between">
              {activeStep > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="rounded-full text-xs font-semibold h-9 px-4 gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back:{" "}
                  {steps[activeStep - 1]?.label}
                </Button>
              ) : (
                <div />
              )}

              <span className="text-xs font-medium text-zinc-400">
                Step {activeStep + 1} of {steps.length}
              </span>

              {activeStep < steps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white text-xs font-bold h-9 px-5 gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  Next: {steps[activeStep + 1]?.label}{" "}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setActiveStep(0)}
                  variant="outline"
                  className="rounded-full text-xs font-semibold h-9 px-4"
                >
                  Review from Start ↺
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
