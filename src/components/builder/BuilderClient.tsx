"use client";

import { useState, useEffect } from "react";
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
  Undo2,
  Redo2,
  WifiOff,
} from "lucide-react";
import { useStore } from "zustand";
import { useHotkeys } from "react-hotkeys-hook";
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
  const [isOnline, setIsOnline] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    useResumeStore.persist.onFinishHydration(() => setHasHydrated(true));
    setHasHydrated(useResumeStore.persist.hasHydrated());
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Undo/Redo state
  const { undo, redo, pastStates, futureStates } = useStore(useResumeStore.temporal);

  useHotkeys("mod+z", (e) => {
    e.preventDefault();
    if (pastStates.length > 0) undo();
  }, { enableOnFormTags: true });

  useHotkeys(["mod+y", "mod+shift+z"], (e) => {
    e.preventDefault();
    if (futureStates.length > 0) redo();
  }, { enableOnFormTags: true });

  useHotkeys("mod+p", (e) => {
    e.preventDefault();
    handleDownload();
  }, { enableOnFormTags: true });

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

  if (!hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fafafa] dark:bg-[#111113]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#fafafa] dark:bg-[#111113] overflow-hidden font-sans print:h-auto print:overflow-visible">
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
        <div className="hidden md:flex h-[72px] items-center justify-between px-8 border-b border-zinc-200 dark:border-[#27272a] shrink-0 bg-white dark:bg-[#09090b]">
          <h2 className="text-xl font-bold tracking-tight">
            {STEPS[activeStep].label}
          </h2>
          {!isOnline && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              <WifiOff className="w-3.5 h-3.5" />
              Working Offline
            </div>
          )}
        </div>

        <BuilderFormContainer activeStep={activeStep} />
      </div>

      {/* RIGHT: Live Preview Panel */}
      <div
        className={`flex-1 h-full relative bg-zinc-100 dark:bg-[#111113] print:bg-white print:!m-0 print:!p-0 print:static print:h-auto print:!block ${
          !showPreviewMobile ? "hidden md:block" : "block"
        }`}
      >
        {/* Top actions (Undo, Redo, Download, Mobile Back) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex gap-2 sm:gap-3 print:hidden">
          <Button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            variant="outline"
            size="icon"
            className="rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-10 w-10 sm:h-12 sm:w-12"
            title="Undo"
          >
            <Undo2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            variant="outline"
            size="icon"
            className="rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-10 w-10 sm:h-12 sm:w-12"
            title="Redo"
          >
            <Redo2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            onClick={() => setShowPreviewMobile(false)}
            variant="outline"
            className="md:hidden rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-10 sm:h-12 px-4 sm:px-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Edit
          </Button>

          {/* Desktop small button, Mobile hidden */}
          <div className="hidden lg:block xl:hidden">
            <Button
              onClick={handleDownload}
              size="sm"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border-0"
            >
              <Download className="mr-2 h-3 w-3" /> PDF
            </Button>
          </div>
          {/* Desktop large button, Mobile large button */}
          <div className="lg:hidden xl:block">
            <Button
              onClick={handleDownload}
              size="lg"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-0 h-12 px-6 font-semibold"
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* The PDF Preview container */}
        <div className="h-full w-full overflow-y-auto print:h-auto print:overflow-visible p-4 md:p-8 flex justify-center print:!p-0 pb-32 print:pb-0">
          <div className="w-full max-w-[794px] print:max-w-none transition-all duration-300 print:h-auto">
            <Preview />
          </div>
        </div>
      </div>
    </div>
  );
}
