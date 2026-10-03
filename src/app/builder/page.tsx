"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "@/components/builder/forms/PersonalInfoForm";
import { SummaryForm } from "@/components/builder/forms/SummaryForm";
import { ExperienceForm } from "@/components/builder/forms/ExperienceForm";
import { SkillsForm } from "@/components/builder/forms/SkillsForm";
import { ProjectsForm } from "@/components/builder/forms/ProjectsForm";
import { EducationForm } from "@/components/builder/forms/EducationForm";
import { StyleForm } from "@/components/builder/forms/StyleForm";
import dynamic from "next/dynamic";
const Preview = dynamic(
  () => import("@/components/builder/Preview").then((mod) => mod.Preview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        Loading preview...
      </div>
    ),
  },
);
import {
  ChevronLeft,
  Download,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Cpu,
  Upload,
  Save,
  Palette,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const STEPS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "projects", label: "Projects", icon: Code },
  { id: "style", label: "Style", icon: Palette },
];

export default function BuilderPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const data = useResumeStore((state) => state.data);

  const handleDownload = () => {
    window.print();
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      if (document.referrer.includes(window.location.host)) {
        router.back();
      } else {
        router.push("/templates");
      }
    }
  };

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Backup Saved! 💾", {
      description: "Your JSON file has been downloaded.",
    });
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          useResumeStore.setState({ data: json });
          toast.success("Resume Loaded! 🚀", {
            description: "Your data has been successfully imported.",
          });
        } catch {
          toast.error("Invalid JSON file ❌", {
            description: "The file you uploaded is not a valid backup.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const ActiveForm = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <SummaryForm />;
      case 2:
        return <ExperienceForm />;
      case 3:
        return <EducationForm />;
      case 4:
        return <SkillsForm />;
      case 5:
        return <ProjectsForm />;
      case 6:
        return <StyleForm />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex font-sans overflow-hidden bg-stone-100 dark:bg-[#09090b] print:bg-transparent print:h-auto print:block">
      {/* EXTREME LEFT: Slim Toolbar (Desktop Only) */}
      <nav className="hidden md:flex flex-col w-[72px] h-full border-r border-[#27272a] bg-[#09090b] text-[#fafafa] z-30 shrink-0 py-4 items-center justify-between shadow-2xl">
        <div className="flex flex-col gap-6 w-full items-center">
          <button
            onClick={handleBack}
            className="h-10 w-10 rounded-xl bg-[#111113] border border-[#27272a] flex items-center justify-center hover:bg-[#27272a] transition-all hover:scale-105"
            aria-label="Go back"
            title="Back to Templates"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="w-10 h-[1px] bg-[#27272a] rounded-full" />

          <div className="flex flex-col gap-3 w-full px-3">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`group relative flex items-center justify-center h-12 w-full rounded-xl transition-all duration-200 ${
                  activeStep === idx
                    ? "bg-[#fafafa] text-[#09090b] shadow-sm"
                    : "text-[#a1a1aa] hover:bg-[#27272a] hover:text-[#fafafa]"
                }`}
                title={step.label}
              >
                <step.icon
                  className={`h-5 w-5 transition-transform ${activeStep === idx ? "scale-110" : "group-hover:scale-110"}`}
                />
                {/* Tooltip for desktop */}
                <span className="absolute left-14 bg-[#27272a] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full items-center">
          <div className="relative group">
            <input
              type="file"
              accept=".json"
              onChange={importJSON}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Import JSON Backup"
            />
            <button className="h-10 w-10 rounded-full border border-[#27272a] flex items-center justify-center hover:bg-[#27272a] transition-colors text-[#a1a1aa] hover:text-[#fafafa]">
              <Upload className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={exportJSON}
            className="h-10 w-10 rounded-full border border-[#27272a] flex items-center justify-center hover:bg-[#27272a] transition-colors text-[#a1a1aa] hover:text-[#fafafa]"
            title="Export JSON Backup"
          >
            <Save className="h-4 w-4" />
          </button>
          <div className="w-10 h-[1px] bg-[#27272a] rounded-full my-1" />
          <ThemeToggle />
        </div>
      </nav>

      {/* MIDDLE: Form Panel (Desktop & Mobile) */}
      <div
        className={`dark w-full md:w-[450px] lg:w-[480px] h-full flex flex-col border-r border-[#27272a] bg-[#111113] text-[#fafafa] shrink-0 transition-all z-20 print:hidden shadow-2xl ${showPreviewMobile ? "hidden md:flex" : "flex"}`}
      >
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex h-14 items-center justify-between border-b border-[#27272a] px-4 shrink-0 bg-[#09090b]">
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

        {/* Desktop Header for the Form Panel */}
        <div className="hidden md:flex h-[72px] items-center px-8 border-b border-[#27272a] shrink-0 bg-[#09090b]">
          <h2 className="text-xl font-bold tracking-tight">
            {STEPS[activeStep].label}
          </h2>
        </div>

        {/* Mobile Horizontal Step Nav */}
        <div className="md:hidden px-4 py-3 border-b border-[#27272a] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#09090b]">
          <div className="flex gap-2 min-w-max">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  activeStep === idx
                    ? "bg-[#27272a] text-[#fafafa]"
                    : "bg-[#111113] text-[#a1a1aa] border border-[#27272a]"
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Form Itself */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="pb-24 md:pb-0"
            >
              <ActiveForm />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Live Preview Canvas */}
      <main
        className={`flex-1 relative bg-stone-100 dark:bg-zinc-900 overflow-hidden print:block print:w-full print:h-full print:bg-transparent print:absolute print:inset-0 print:m-0 print:p-0 ${showPreviewMobile ? "block" : "hidden md:block"}`}
      >
        {/* Mobile Preview Header */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-[#09090b] text-white border-b border-[#27272a] flex items-center justify-between px-4 z-50 print:hidden">
          <button
            onClick={() => setShowPreviewMobile(false)}
            className="text-sm font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Edit
          </button>
          <Button
            onClick={handleDownload}
            size="sm"
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-0"
          >
            <Download className="mr-2 h-3 w-3" /> PDF
          </Button>
        </div>

        {/* Desktop Download Button */}
        <div className="absolute top-6 right-8 z-10 hidden md:flex items-center gap-3 print:hidden">
          <Button
            onClick={handleDownload}
            size="lg"
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg border-0 h-12 px-6 font-semibold"
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

        <div className="h-full pt-16 md:pt-0">
          <Preview />
        </div>
      </main>
    </div>
  );
}
