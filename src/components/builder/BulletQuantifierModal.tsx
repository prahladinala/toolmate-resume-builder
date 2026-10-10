"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight, Check } from "lucide-react";
import { runChromeAIPrompt, checkChromeAIAvailability } from "@/lib/chromeAI";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { notify } from "@/lib/toast";

interface BulletQuantifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onApply: (quantifiedText: string) => void;
}

export function BulletQuantifierModal({
  isOpen,
  onClose,
  currentText,
  onApply,
}: BulletQuantifierModalProps) {
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestions([]);
    setSelectedIdx(null);

    const avail = await checkChromeAIAvailability();
    if (!avail.isAvailable) {
      setShowSetup(true);
      setLoading(false);
      return;
    }

    const prompt = `You are a world-class ATS resume bullet point quantifier.
Take the following candidate resume bullet point or task:
"${currentText}"

Generate 3 distinct, high-impact bullet points that add realistic, quantifiable metrics (e.g. percentages like 35%, throughput like 10k+ req/sec, latency reduction by 40%, team size, or revenue gains) using realistic placeholders like [X%] or concrete benchmarks.

Format your response as 3 separate bullet points starting with "- " only.
Do not add any greetings, conversational remarks, or preambles.`;

    try {
      const response = await runChromeAIPrompt(prompt, {
        tone: "metrics",
      });

      const bullets = response
        .split("\n")
        .map((line) => line.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter(
          (line) => line.length > 15 && !line.toLowerCase().startsWith("okay"),
        );

      if (bullets.length > 0) {
        setSuggestions(bullets.slice(0, 3));
      } else {
        // Fallback realistic metrics
        setSuggestions([
          `Engineered scalable solution, improving application throughput by 35% and reducing p95 latency.`,
          `Orchestrated end-to-end implementation across 3 cross-functional teams, cutting deployment turnaround time by 40%.`,
          `Refactored core workflows, driving a 25% efficiency boost and saving an estimated 10+ engineering hours weekly.`,
        ]);
      }
    } catch (e) {
      console.error("Quantifier failed:", e);
      notify.error("Failed to generate quantified bullet points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
                  Quantify & Add Metrics
                </h3>
                <p className="text-xs text-zinc-500">
                  Turn tasks into measurable achievements with Gemini Nano
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Original Bullet Point
              </label>
              <div className="mt-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                {currentText || "No bullet text provided yet."}
              </div>
            </div>

            {suggestions.length === 0 && !loading && (
              <div className="text-center py-4">
                <button
                  onClick={handleGenerate}
                  disabled={!currentText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Metric Options
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-sm">
                  Gemini Nano is crafting metric-rich bullets...
                </span>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Select Quantified Alternative
                </label>
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 ${
                      selectedIdx === idx
                        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                        selectedIdx === idx
                          ? "bg-emerald-600 text-white"
                          : "border border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {selectedIdx === idx && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                    <span className="leading-relaxed flex-1">{sug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              disabled={selectedIdx === null}
              onClick={() => {
                if (selectedIdx !== null) {
                  onApply(suggestions[selectedIdx]);
                  notify.success(
                    "Updated bullet point with quantified metrics!",
                  );
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm"
            >
              Apply to Resume
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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
