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
  Download,
  Undo2,
  Redo2,
  WifiOff,
  Target,
  History,
  Printer,
} from "lucide-react";
import { useStore } from "zustand";
import { useHotkeys } from "react-hotkeys-hook";
import { useResumeStore } from "@/store/useResumeStore";

import { BuilderSidebar } from "./ui/BuilderSidebar";
import { BuilderFormContainer } from "./ui/BuilderFormContainer";
import { PrintPortal } from "./PrintPortal";

const ResumeProfileModal = dynamic(
  () => import("./ResumeProfileModal").then((mod) => mod.ResumeProfileModal),
  { ssr: false },
);

const SmartImportModal = dynamic(
  () => import("./SmartImportModal").then((mod) => mod.SmartImportModal),
  { ssr: false },
);

const HistoryDrawerModal = dynamic(
  () => import("./HistoryDrawerModal").then((mod) => mod.HistoryDrawerModal),
  { ssr: false },
);

const MobileAppShell = dynamic(
  () => import("./mobile/MobileAppShell").then((mod) => mod.MobileAppShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-[#fafafa] dark:bg-[#111113]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    ),
  },
);

const Preview = dynamic(
  () => import("@/components/builder/Preview").then((mod) => mod.Preview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-zinc-500">
        Loading preview...
      </div>
    ),
  },
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
  { id: "job-match", label: "Job Match", icon: Target },
  { id: "style", label: "Style", icon: Palette },
];

export function BuilderClient() {
  const router = useRouter();
  const { data } = useResumeStore();
  const [activeStep, setActiveStep] = useState(0);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [previewMode, setPreviewMode] = useState<"resume" | "cover-letter">(
    "resume",
  );
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
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
  const { undo, redo, pastStates, futureStates } = useStore(
    useResumeStore.temporal,
  );

  useHotkeys(
    "mod+z",
    (e) => {
      e.preventDefault();
      if (pastStates.length > 0) undo();
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    ["mod+y", "mod+shift+z"],
    (e) => {
      e.preventDefault();
      if (futureStates.length > 0) redo();
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    "mod+p",
    (e) => {
      e.preventDefault();
      handleDirectPdfDownload();
    },
    { enableOnFormTags: true },
  );

  const handleDownload = () => {
    toast.info("Opening Print & PDF Dialog 📄", {
      description:
        "Select 'Save as PDF' with Background Graphics checked for ATS output.",
      duration: 3500,
    });
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleDirectPdfDownload = async () => {
    try {
      setIsExportingPdf(true);
      toast.info("Generating PDF Document... 📄", {
        description: "Rendering high-resolution vector layout.",
      });
      const { downloadDirectPdf } = await import("@/lib/pdfDownloader");
      await downloadDirectPdf(data);
      toast.success("PDF Downloaded successfully! 🎉");
    } catch (err) {
      console.warn("Direct PDF generation fallback to print dialog:", err);
      handleDownload();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    try {
      setIsExportingWord(true);
      const { data, activeTemplate, themeConfig } = useResumeStore.getState();
      toast.info("Generating Word (.docx) Document... 📝", {
        description: `Applying ${(activeTemplate || "modern").toUpperCase()} template layout, colors & typography.`,
      });
      const { downloadDocxResume } = await import("@/lib/docxResumeGenerator");
      await downloadDocxResume(data, activeTemplate || "dev-1", themeConfig);
      toast.success("Word Document (.docx) downloaded successfully!");
    } catch (err) {
      console.error("Word export error:", err);
      toast.error("Failed to generate Word document. Please try again.");
    } finally {
      setIsExportingWord(false);
    }
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

  const exportJSON = async () => {
    try {
      const data = useResumeStore.getState().data;
      const { exportToJsonResume } = await import("@/lib/jsonResumeConverter");
      const jsonResume = exportToJsonResume(data);
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(jsonResume, null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "resume-standard.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success("JSON Resume Exported! 💾", {
        description:
          "Downloaded in official JSON Resume standard (jsonresume.org).",
      });
    } catch {
      toast.error("Export Failed", {
        description: "Could not export resume backup. Please try again.",
      });
    }
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".json")) {
        toast.error("Unsupported File Format", {
          description: "Please upload a .json resume backup file.",
        });
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (!json || typeof json !== "object") {
            throw new Error("Invalid structure");
          }

          const { importFromJsonResume } =
            await import("@/lib/jsonResumeConverter");

          // Check if it's JSON Resume format (has basics) or native ToolMate format
          let convertedData;
          if (json.basics) {
            convertedData = importFromJsonResume(json);
          } else if (json.personalInfo) {
            convertedData = json;
          } else {
            throw new Error("Unrecognized JSON format");
          }

          useResumeStore.setState({ data: convertedData });
          toast.success("Resume Imported! 🚀", {
            description:
              "Your resume sections and details have been successfully restored.",
          });
        } catch {
          toast.error("Invalid Resume File", {
            description:
              "The file must be a standard JSON Resume or ToolMate backup file.",
          });
        }
      };
      reader.onerror = () => {
        toast.error("File Read Error", {
          description: "Failed to read the selected file from disk.",
        });
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
    <>
      {/* 1. 100% NATIVE MOBILE APP SHELL (Mobile screens < 768px) */}
      <div className="md:hidden h-screen w-full overflow-hidden print:hidden">
        <MobileAppShell
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          handleBack={handleBack}
          undo={() => undo()}
          redo={() => redo()}
          canUndo={pastStates.length > 0}
          canRedo={futureStates.length > 0}
          onOpenProfiles={() => setShowProfiles(true)}
          onOpenImport={() => setShowImport(true)}
          onOpenHistory={() => setShowHistory(true)}
          handleDownload={handleDownload}
          handleDirectPdfDownload={handleDirectPdfDownload}
          handleDownloadWord={handleDownloadWord}
          exportJSON={exportJSON}
          isOnline={isOnline}
        />
      </div>

      {/* 2. DESKTOP WORKSTATION (Desktop & Tablet screens >= 768px) */}
      <div className="hidden md:flex h-screen w-full bg-[#fafafa] dark:bg-[#111113] overflow-hidden font-sans print:h-auto print:overflow-visible">
        <BuilderSidebar
          steps={STEPS}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          handleBack={handleBack}
          importJSON={importJSON}
          exportJSON={exportJSON}
          onOpenProfiles={() => setShowProfiles(true)}
          onOpenImport={() => setShowImport(true)}
          onOpenHistory={() => setShowHistory(true)}
        />

        {/* MIDDLE: Form Panel (Desktop) */}
        <div className="w-[450px] lg:w-[480px] h-full flex flex-col border-r border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#fafafa] shrink-0 transition-all z-20 print:hidden shadow-2xl">
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

        {/* RIGHT: Live Preview Panel (Desktop) */}
        <div className="flex-1 h-full relative bg-zinc-100 dark:bg-[#111113] print:bg-white print:!m-0 print:!p-0 print:static print:h-auto print:!block">
          {/* DESKTOP TOP ACTIONS (Undo, Redo, History, Word Export, PDF Export) */}
          <div className="hidden md:flex absolute top-8 right-8 z-20 gap-2 sm:gap-3 print:hidden">
            <Button
              onClick={() => undo()}
              disabled={pastStates.length === 0}
              variant="outline"
              size="icon"
              className="rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-11 w-11"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => redo()}
              disabled={futureStates.length === 0}
              variant="outline"
              size="icon"
              className="rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-11 w-11"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => setShowHistory(true)}
              variant="outline"
              size="icon"
              className="rounded-full bg-white dark:bg-[#09090b] shadow-sm border-zinc-200 dark:border-[#27272a] h-11 w-11 text-zinc-600 dark:text-zinc-300"
              title="Session History Timeline"
            >
              <History className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              variant="outline"
              size="lg"
              className="rounded-full bg-white dark:bg-[#09090b] hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-md border-zinc-200 dark:border-[#27272a] h-11 px-5 font-semibold text-blue-600 dark:text-blue-400"
              title="Download editable Microsoft Word .docx file"
            >
              <FileText className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              {isExportingWord ? "Exporting..." : "Word (.docx)"}
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              size="lg"
              className="rounded-full bg-white dark:bg-[#09090b] hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-md border-zinc-200 dark:border-[#27272a] h-11 px-5 font-semibold text-zinc-700 dark:text-zinc-200"
              title="Open Browser Print & AirPrint Dialog"
            >
              <Printer className="mr-2 h-4 w-4 text-zinc-500" />
              Print
            </Button>

            <Button
              onClick={handleDirectPdfDownload}
              disabled={isExportingPdf}
              size="lg"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-0 h-11 px-6 font-semibold"
              title="Instant Vector PDF Download"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExportingPdf ? "Generating PDF..." : "Download PDF"}
            </Button>
          </div>

          {/* The PDF Preview container */}
          <div className="h-full w-full overflow-y-auto print:h-auto print:overflow-visible p-8 flex justify-center print:!p-0 pb-32 print:pb-0">
            <div className="w-full max-w-[794px] print:max-w-none transition-all duration-300 print:h-auto">
              <Preview mode={previewMode} onModeChange={setPreviewMode} />
            </div>
          </div>
        </div>
      </div>

      <ResumeProfileModal
        isOpen={showProfiles}
        onClose={() => setShowProfiles(false)}
      />

      <SmartImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
      />

      <HistoryDrawerModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* 3. DEDICATED PRINT PORTAL (Direct child of body, 100% immune to overflow-hidden and parent scaling) */}
      <PrintPortal mode={previewMode} />
    </>
  );
}
