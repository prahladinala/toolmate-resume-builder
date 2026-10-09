"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bot,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { checkChromeAIAvailability, type ChromeAIStatus } from "@/lib/chromeAI";
import { notify } from "@/lib/toast";

interface ChromeAISetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ChromeAISetupModal({
  open,
  onOpenChange,
  onSuccess,
}: ChromeAISetupModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [status, setStatus] = useState<ChromeAIStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const performCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const res = await checkChromeAIAvailability();
      setStatus(res);
      return res;
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Run check when modal opens, and auto re-check when user focuses back to the window
  useEffect(() => {
    if (open) {
      performCheck();

      const handleFocus = () => {
        performCheck();
      };

      window.addEventListener("focus", handleFocus);
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [open, performCheck]);

  const copyToClipboard = (text: string, key: string, label = "Flag URL") => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      notify.copied(label);
      setTimeout(() => setCopiedKey(null), 3000);
    }
  };

  const openOrCopyLink = (url: string, key: string, label = "Flag URL") => {
    try {
      window.open(url, "_blank");
    } catch {}
    copyToClipboard(url, key, label);
  };

  const handleUseNow = () => {
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="text-center sm:text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-3 text-purple-600 dark:text-purple-400 ring-4 ring-purple-50 dark:ring-purple-950/50">
            <Bot className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Enable Gemini Nano (On-Device AI)
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 pt-1 max-w-xl mx-auto">
            Chrome runs{" "}
            <strong className="text-purple-600 dark:text-purple-400 font-semibold">
              Gemini Nano
            </strong>{" "}
            directly inside your browser. Your data never leaves your device —
            100% private, offline, and free forever.
          </DialogDescription>
        </DialogHeader>

        {/* Live Status Diagnostic Card */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            status?.isAvailable
              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
              : status?.status === "downloading"
                ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60"
                : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {isChecking ? (
                <RefreshCw className="w-5 h-5 text-purple-500 animate-spin shrink-0" />
              ) : status?.isAvailable ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              ) : status?.status === "downloading" ? (
                <Clock className="w-6 h-6 text-amber-500 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  {isChecking
                    ? "Testing Gemini Nano connection..."
                    : status?.isAvailable
                      ? "Gemini Nano is Active & Ready! 🎉"
                      : status?.status === "downloading"
                        ? "Flags Enabled — Downloading Model ⏳"
                        : "Gemini Nano Not Detected Yet"}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {isChecking
                    ? "Querying browser LanguageModel..."
                    : status?.message ||
                      "Follow the 3 quick steps below to activate."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => performCheck()}
                disabled={isChecking}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 shrink-0"
                title="Test connection"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`}
                />
                Check Status
              </button>

              {status?.isAvailable && (
                <button
                  type="button"
                  onClick={handleUseNow}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Use AI Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3-Column Responsive Setup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
          {/* Step 1: Prompt API Flag */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 1: Flag
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Set: Enabled
                </span>
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Prompt API for Gemini Nano
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Enables the on-device LanguageModel API for web applications.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-950 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="truncate flex-1 select-all text-[10px]">
                  chrome://flags/#prompt-api-for-gemini-nano
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      "chrome://flags/#prompt-api-for-gemini-nano",
                      "flag1",
                      "Step 1 Flag URL",
                    )
                  }
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white shrink-0"
                  title="Copy flag link"
                >
                  {copiedKey === "flag1" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  openOrCopyLink(
                    "chrome://flags/#prompt-api-for-gemini-nano",
                    "flag1",
                    "Step 1 Flag URL",
                  )
                }
                className="w-full py-1.5 px-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open / Copy Flag 1</span>
              </button>
            </div>
          </div>

          {/* Step 2: Optimization Guide Flag */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 2: Flag
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  BypassPerfRequirement
                </span>
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Optimization Guide On Device
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Allows Gemini Nano to run on your device without hardware locks.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-950 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="truncate flex-1 select-all text-[10px]">
                  chrome://flags/#optimization-guide-on-device-model
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      "chrome://flags/#optimization-guide-on-device-model",
                      "flag2",
                      "Step 2 Flag URL",
                    )
                  }
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white shrink-0"
                  title="Copy flag link"
                >
                  {copiedKey === "flag2" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  openOrCopyLink(
                    "chrome://flags/#optimization-guide-on-device-model",
                    "flag2",
                    "Step 2 Flag URL",
                  )
                }
                className="w-full py-1.5 px-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open / Copy Flag 2</span>
              </button>
            </div>
          </div>

          {/* Step 3: Relaunch & Model Download */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Step 3: Component
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Check Update
                </span>
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Relaunch & Download Model
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Click <strong>Relaunch</strong>, then check component update for
                &quot;Optimization Guide On Device Model&quot;.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-950 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="truncate flex-1 select-all text-[10px]">
                  chrome://components
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      "chrome://components",
                      "comp",
                      "Components URL",
                    )
                  }
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white shrink-0"
                  title="Copy components link"
                >
                  {copiedKey === "comp" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  openOrCopyLink(
                    "chrome://components",
                    "comp",
                    "Components URL",
                  )
                }
                className="w-full py-1.5 px-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open / Copy Components</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            Once enabled in flags, simply return to this tab — detection updates
            automatically.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={async () => {
                const res = await performCheck();
                if (res.isAvailable) {
                  handleUseNow();
                } else {
                  notify.info(
                    "Detection in progress",
                    "Relaunch Chrome if you just enabled the flags in another tab.",
                  );
                }
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`}
              />
              Check & Activate
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
