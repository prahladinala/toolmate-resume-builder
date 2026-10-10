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

interface BuilderFormContainerProps {
  activeStep: number;
}

export function BuilderFormContainer({
  activeStep,
}: BuilderFormContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth no-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="pb-24"
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
