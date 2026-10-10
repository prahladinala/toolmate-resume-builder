"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  BookOpen,
  Check,
  AlertCircle,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.05 1.53 1.53 0 0 0 0 3.05m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/store/useResumeStore";
import { extractTextFromPdf, parseResumeText } from "@/lib/pdfResumeParser";
import { STARTER_PROFILES, StarterProfile } from "@/lib/starterProfiles";
import { ResumeData } from "@/types/resume";
import { validateAndSanitizeResumeData } from "@/lib/validation";
import { toast } from "sonner";

interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartImportModal({ isOpen, onClose }: SmartImportModalProps) {
  const { data, updatePersonalInfo, updateSummary } = useResumeStore();
  const [activeTab, setActiveTab] = useState<"pdf" | "linkedin" | "starters">(
    "pdf",
  );

  // State for parsing
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [linkedinText, setLinkedinText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<ResumeData | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage("Extracting text from PDF via on-device PDF engine...");
      const text = await extractTextFromPdf(file);

      setStatusMessage("Parsing resume sections with Gemini AI...");
      const parsed = await parseResumeText(text);

      setParsedPreview(parsed);
      toast.success("Resume parsed successfully!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to parse PDF resume", {
        description:
          err instanceof Error ? err.message : "Unknown parsing error",
      });
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
      e.target.value = "";
    }
  };

  const handleParseLinkedInText = async () => {
    if (!linkedinText.trim()) {
      toast.error("Please paste your LinkedIn profile text or resume text.");
      return;
    }

    if (linkedinText.length > 100_000) {
      toast.error("Text exceeds maximum allowed length of 100,000 characters.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage(
        "Parsing LinkedIn text into structured resume fields...",
      );
      const parsed = await parseResumeText(linkedinText);
      setParsedPreview(parsed);
      toast.success("Parsed LinkedIn content successfully!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Parsing failed", {
        description:
          err instanceof Error ? err.message : "Could not extract fields",
      });
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  const applyParsedData = (parsed: ResumeData, merge: boolean = false) => {
    try {
      const validation = validateAndSanitizeResumeData(parsed);
      if (!validation.success || !validation.data) {
        toast.error("Resume format validation failed", {
          description: validation.error || "Malformed resume fields detected",
        });
        return;
      }
      const safeData = validation.data as ResumeData;

      if (merge) {
        // Merge personal info
        updatePersonalInfo(safeData.personalInfo);
        if (safeData.summary) updateSummary(safeData.summary);

        useResumeStore.setState((state) => ({
          data: {
            ...state.data,
            experience: [...state.data.experience, ...safeData.experience],
            education: [...state.data.education, ...safeData.education],
            projects: [...state.data.projects, ...safeData.projects],
            skills: [...state.data.skills, ...safeData.skills],
          },
        }));
        toast.success("Merged into your current resume!");
      } else {
        // Replace
        useResumeStore.setState({
          data: {
            ...safeData,
            coverLetter: data.coverLetter,
          },
        });
        toast.success("Applied to resume successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply parsed resume");
    }
  };

  const loadStarter = (starter: StarterProfile) => {
    useResumeStore.setState({
      data: {
        ...starter.data,
        coverLetter: data.coverLetter,
      },
    });
    toast.success(`Loaded "${starter.roleTitle}" profile!`, {
      description:
        "Feel free to customize each bullet point and personal detail.",
    });
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-import-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#111113] rounded-2xl border border-zinc-200 dark:border-[#27272a] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-[#27272a] flex items-center justify-between bg-zinc-50 dark:bg-[#18181b]/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="smart-import-title"
                className="font-bold text-lg text-zinc-900 dark:text-white"
              >
                Smart Resume Importer & Starters
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Zero-friction onboarding: import an existing PDF, paste
                LinkedIn, or load a pre-built starter.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-[#27272a] px-5 bg-zinc-50/50 dark:bg-[#111113]">
          <button
            onClick={() => {
              setActiveTab("pdf");
              setParsedPreview(null);
            }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "pdf"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            Upload PDF Resume
          </button>
          <button
            onClick={() => {
              setActiveTab("linkedin");
              setParsedPreview(null);
            }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "linkedin"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            <LinkedInIcon className="w-4 h-4" />
            LinkedIn / Raw Text
          </button>
          <button
            onClick={() => {
              setActiveTab("starters");
              setParsedPreview(null);
            }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "starters"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Industry Starters
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: PDF Upload */}
          {activeTab === "pdf" && !parsedPreview && (
            <div className="space-y-4">
              <label
                htmlFor="pdf-upload"
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-[#18181b]/30 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-semibold text-zinc-900 dark:text-white text-base">
                  Click or drag your existing PDF resume
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                  PDF text is extracted in-browser with complete privacy, and
                  parsed into work experience, skills, and education.
                </p>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>

              {isProcessing && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 flex items-center gap-3 text-purple-700 dark:text-purple-300 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LinkedIn / Paste Text */}
          {activeTab === "linkedin" && !parsedPreview && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Paste LinkedIn &quot;About&quot;, Experience, and Skills:
                </label>
                <Textarea
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                  placeholder="Paste your LinkedIn profile text or copy from your old doc here...&#10;&#10;e.g.&#10;Software Engineer at Google (2021 - Present)&#10;• Built distributed backend systems...&#10;Skills: TypeScript, React, Go, Docker"
                  rows={8}
                  className="font-mono text-xs bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-[#27272a]"
                />
              </div>

              <Button
                onClick={handleParseLinkedInText}
                disabled={isProcessing || !linkedinText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract & Structure Resume Fields</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* PARSED PREVIEW CONFIRMATION */}
          {parsedPreview && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200">
                    Successfully Extracted Resume Profile!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Review the extracted fields below before updating your
                    resume builder.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-50 dark:bg-[#18181b] rounded-xl border border-zinc-200 dark:border-[#27272a]">
                  <span className="text-zinc-500 block mb-0.5 font-medium">
                    Candidate Name:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {parsedPreview.personalInfo.firstName}{" "}
                    {parsedPreview.personalInfo.lastName || "(Not detected)"}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-[#18181b] rounded-xl border border-zinc-200 dark:border-[#27272a]">
                  <span className="text-zinc-500 block mb-0.5 font-medium">
                    Job Title:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {parsedPreview.personalInfo.title || "(Not detected)"}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-[#18181b] rounded-xl border border-zinc-200 dark:border-[#27272a]">
                  <span className="text-zinc-500 block mb-0.5 font-medium">
                    Work History:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {parsedPreview.experience.length} experiences detected
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-[#18181b] rounded-xl border border-zinc-200 dark:border-[#27272a]">
                  <span className="text-zinc-500 block mb-0.5 font-medium">
                    Skills Detected:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {parsedPreview.skills.length} skills identified
                  </span>
                </div>
              </div>

              {parsedPreview.summary && (
                <div className="p-3 bg-zinc-50 dark:bg-[#18181b] rounded-xl border border-zinc-200 dark:border-[#27272a] text-xs">
                  <span className="text-zinc-500 block mb-1 font-medium">
                    Detected Summary:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 line-clamp-3 italic">
                    &ldquo;{parsedPreview.summary}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setParsedPreview(null)}
                  className="flex-1 rounded-xl"
                >
                  Cancel / Re-upload
                </Button>
                <Button
                  onClick={() => applyParsedData(parsedPreview, false)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold"
                >
                  Replace Resume
                </Button>
                <Button
                  onClick={() => applyParsedData(parsedPreview, true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
                >
                  Merge into Current
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: STARTER PROFILES */}
          {activeTab === "starters" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Selecting a starter profile will load a pre-filled, ATS-tested
                  resume layout with bullet point metrics.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROFILES.map((starter) => (
                  <div
                    key={starter.id}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b]/40 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {starter.badge}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {starter.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                        {starter.roleTitle}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {starter.description}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => loadStarter(starter)}
                      className="mt-4 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <span>Load This Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
