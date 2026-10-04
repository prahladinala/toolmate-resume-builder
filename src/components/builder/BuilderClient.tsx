"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Cpu,
  Code,
  Palette,
  ChevronLeft,
  Download,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";

import { BuilderSidebar } from "./ui/BuilderSidebar";
import { BuilderMobileNav } from "./ui/BuilderMobileNav";
import { BuilderFormContainer } from "./ui/BuilderFormContainer";

const Preview = dynamic(
  () => import("@/components/builder/Preview").then((mod) => mod.Preview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-zinc-500">
        Loading preview...
      </div>
    ),
  }
);

const STEPS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "projects", label: "Projects", icon: Code },
  { id: "custom", label: "Custom", icon: FileText },
  { id: "cover-letter", label: "Cover Letter", icon: FileText },
  { id: "style", label: "Style", icon: Palette },
];

export function BuilderClient() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

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
    const data = useResumeStore.getState().data;
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
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
    e.target.value = ""; // Reset input
  };

  return (
    <div className="flex h-screen w-full bg-[#fafafa] dark:bg-[#111113] overflow-hidden font-sans">
      <BuilderSidebar
        steps={STEPS}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleBack={handleBack}
        importJSON={importJSON}
        exportJSON={exportJSON}
      />

      {/* MIDDLE: Form Panel (Desktop & Mobile) */}
      <div
        className={`w-full md:w-[450px] lg:w-[480px] h-full flex flex-col border-r border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#fafafa] shrink-0 transition-all z-20 print:hidden shadow-2xl ${
          showPreviewMobile ? "hidden md:flex" : "flex"
        }`}
      >
        <BuilderMobileNav
          steps={STEPS}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          handleBack={handleBack}
          setShowPreviewMobile={setShowPreviewMobile}
        />

        {/* Desktop Header for the Form Panel */}
        <div className="hidden md:flex h-[72px] items-center px-8 border-b border-zinc-200 dark:border-[#27272a] shrink-0 bg-white dark:bg-[#09090b]">
          <h2 className="text-xl font-bold tracking-tight">
            {STEPS[activeStep].label}
          </h2>
        </div>

        <BuilderFormContainer activeStep={activeStep} />
      </div>

      {/* RIGHT: Live Preview Panel */}
      <div
        className={`flex-1 h-full relative bg-zinc-100 dark:bg-[#111113] print:bg-white print:!m-0 print:!p-0 print:absolute print:inset-0 print:z-50 ${
          !showPreviewMobile ? "hidden md:block" : "block"
        }`}
      >
        {/* Top actions (Download, Mobile Back) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex gap-3 print:hidden">
          <Button
            onClick={() => setShowPreviewMobile(false)}
            variant="outline"
            className="md:hidden rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-12 px-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Edit
          </Button>

          {/* Desktop small button, Mobile hidden */}
          <div className="hidden lg:block xl:hidden">
            <Button
              onClick={handleDownload}
              size="sm"
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-0"
            >
              <Download className="mr-2 h-3 w-3" /> PDF
            </Button>
          </div>
          {/* Desktop large button, Mobile large button */}
          <div className="lg:hidden xl:block">
            <Button
              onClick={handleDownload}
              size="lg"
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg border-0 h-12 px-6 font-semibold"
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* The PDF Preview container */}
        <div className="h-full w-full overflow-y-auto print:overflow-visible p-4 md:p-8 flex justify-center print:!p-0 pb-32">
          <div className="w-full max-w-[794px] print:max-w-none transition-all duration-300">
            <Preview />
          </div>
        </div>
      </div>
    </div>
  );
}
