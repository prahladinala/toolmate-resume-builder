"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Check,
  Briefcase,
  GraduationCap,
  Wrench,
  ShieldCheck,
  X,
} from "lucide-react";
import { checkChromeAIAvailability } from "@/lib/chromeAI";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import {
  buildGuidedExperiencePrompt,
  type GuidedExperienceContext,
} from "@/lib/ai/prompts";
import { aiSessionManager } from "@/lib/ai/sessionManager";
import { parseAIResponse, type AIParsedResult } from "@/lib/aiParser";
import { notify } from "@/lib/toast";

interface GuidedExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
  onApply: (bullets: string[]) => void;
}

export function GuidedExperienceModal({
  isOpen,
  onClose,
  defaultRole = "",
  onApply,
}: GuidedExperienceModalProps) {
  const [targetRole, setTargetRole] = useState(defaultRole || "");
  const [isGraduate, setIsGraduate] = useState(false);
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [technologiesUsed, setTechnologiesUsed] = useState("");
  const [achievementsOrScale, setAchievementsOrScale] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [parsedResult, setParsedResult] = useState<AIParsedResult | null>(null);
  const [selectedBullets, setSelectedBullets] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!targetRole.trim() && !keyResponsibilities.trim()) {
      notify.info(
        "Please provide at least a role or rough notes on your tasks.",
      );
      return;
    }

    setLoading(true);
    setParsedResult(null);
    setSelectedBullets([]);

    const avail = await checkChromeAIAvailability();
    if (!avail.isAvailable) {
      setShowSetup(true);
      setLoading(false);
      return;
    }

    const ctx: GuidedExperienceContext = {
      targetRole: targetRole.trim() || "Software Engineer",
      keyResponsibilities:
        keyResponsibilities.trim() ||
        "Built UI components and API integrations",
      technologiesUsed:
        technologiesUsed.trim() ||
        "Modern web development frameworks and tools",
      achievementsOrScale: achievementsOrScale.trim() || undefined,
      isGraduateOrStudent: isGraduate,
    };

    const prompt = buildGuidedExperiencePrompt(ctx);

    try {
      const rawResponse = await aiSessionManager.executePrompt(prompt, {
        systemPrompt:
          "You are a Principal Resume Architect helping a candidate turn raw notes into 3 structured, high-impact resume bullet points.",
      });

      const parsed = parseAIResponse(rawResponse);
      setParsedResult(parsed);

      if (parsed.options.length > 0) {
        // By default select all generated bullets
        setSelectedBullets(parsed.options.map((o) => o.text));
      }
    } catch (e) {
      console.error("Guided Experience Creator failed:", e);
      notify.error("Failed to generate structured experience bullets.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBullet = (text: string) => {
    if (selectedBullets.includes(text)) {
      setSelectedBullets(selectedBullets.filter((b) => b !== text));
    } else {
      setSelectedBullets([...selectedBullets, text]);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
                    Guided Experience Creator
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Zero Blank Page Friction
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Answer 3 quick prompts to convert rough notes into ATS-ready
                  bullets
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Persona Toggle */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGraduate(false)}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                !isGraduate
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Experienced Professional
            </button>
            <button
              type="button"
              onClick={() => setIsGraduate(true)}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                isGraduate
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student / Fresh Graduate
            </button>
          </div>

          {/* Form Fields */}
          <div className="mt-4 space-y-3.5">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Job Title / Project Role:
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer, QA Engineer, Project Lead"
                className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Rough Notes (What did you do or build?):
              </label>
              <textarea
                rows={3}
                value={keyResponsibilities}
                onChange={(e) => setKeyResponsibilities(e.target.value)}
                placeholder="e.g. worked on user authentication, wrote unit tests, fixed checkout bugs, helped redesign the landing page..."
                className="mt-1 w-full text-xs p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-purple-600" />
                  Tools & Technologies:
                </label>
                <input
                  type="text"
                  value={technologiesUsed}
                  onChange={(e) => setTechnologiesUsed(e.target.value)}
                  placeholder="e.g. Next.js, React, Tailwind, Jest"
                  className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Impact / Numbers (Optional):
                </label>
                <input
                  type="text"
                  value={achievementsOrScale}
                  onChange={(e) => setAchievementsOrScale(e.target.value)}
                  placeholder="e.g. cut load time by 30%, 5k users"
                  className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating ATS Bullets...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Transform Into Resume Bullets
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Preview */}
          {parsedResult && parsedResult.options.length > 0 && (
            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Bullets to Insert ({selectedBullets.length} selected):
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedBullets(
                      selectedBullets.length === parsedResult.options.length
                        ? []
                        : parsedResult.options.map((o) => o.text),
                    )
                  }
                  className="text-[11px] text-purple-600 hover:underline"
                >
                  {selectedBullets.length === parsedResult.options.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="space-y-2">
                {parsedResult.options.map((opt) => {
                  const isSelected = selectedBullets.includes(opt.text);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleBullet(opt.text)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider block text-purple-700 dark:text-purple-300 mb-0.5">
                          {opt.title}
                        </span>
                        <p className="leading-relaxed">{opt.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedBullets.length === 0}
                  onClick={() => {
                    onApply(selectedBullets);
                    notify.success(
                      `Inserted ${selectedBullets.length} bullet points!`,
                    );
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm"
                >
                  Apply to Experience
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={handleGenerate}
      />
    </>
  );
}
