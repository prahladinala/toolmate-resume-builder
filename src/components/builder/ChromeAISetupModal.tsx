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

  const openOrCopyLink = (url: string, key: string) => {
    // Attempt to open link (browsers may restrict chrome:// from web pages)
    try {
      window.open(url, "_blank");
    } catch {}
    // Also copy to clipboard so user can instantly paste it in address bar
    copyToClipboard(url, key);
  };

  const handleUseNow = () => {
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-3 text-purple-600 dark:text-purple-400 ring-4 ring-purple-50 dark:ring-purple-950/50">
            <Bot className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Enable Gemini Nano (Local AI)
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 pt-1">
            This app uses Chrome&apos;s built-in{" "}
            <strong className="text-purple-600 dark:text-purple-400 font-semibold">
              Gemini Nano
            </strong>{" "}
            model to generate instant, privacy-friendly AI suggestions locally
            on your computer with zero cost.
          </DialogDescription>
        </DialogHeader>

        {/* Live Status Diagnostic Card */}
        <div className="mt-4 p-4 rounded-xl border transition-all duration-300 bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {isChecking ? (
                <RefreshCw className="w-5 h-5 text-purple-500 animate-spin shrink-0" />
              ) : status?.status === "ready" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : status?.status === "downloading" ? (
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {isChecking
                    ? "Checking Gemini Nano status..."
                    : status?.status === "ready"
                      ? "Gemini Nano is Ready! 🎉"
                      : status?.status === "downloading"
                        ? "Enabled, Downloading Model ⏳"
                        : "Not Enabled Yet"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {isChecking
                    ? "Querying browser local AI engine..."
                    : status?.message ||
                      "Follow the quick steps below to activate."}
                </p>
              </div>
            </div>

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
          </div>

          {status?.status === "ready" && (
            <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> All local AI features are
                unlocked!
              </span>
              <button
                type="button"
                onClick={handleUseNow}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                Use AI Now
              </button>
            </div>
          )}
        </div>

        {/* Setup Steps with 1-click links and copy actions */}
        <div className="space-y-3 mt-4">
          {/* Step 1: Prompt API Flag */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Step 1: Enable Prompt API Flag
              </span>
              <button
                type="button"
                onClick={() =>
                  openOrCopyLink(
                    "chrome://flags/#prompt-api-for-gemini-nano",
                    "flag1",
                  )
                }
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
              >
                {copiedKey === "flag1" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">
                      Copied URL!
                    </span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3 h-3" />
                    <span>Open / Copy Flag Link</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Open a new tab, paste the link below in your address bar, and set
              it to{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                Enabled
              </strong>
              :
            </p>

            <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300">
              <span className="truncate flex-1 select-all">
                chrome://flags/#prompt-api-for-gemini-nano
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    "chrome://flags/#prompt-api-for-gemini-nano",
                    "flag1",
                  )
                }
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                title="Copy flag URL"
              >
                {copiedKey === "flag1" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Optimization Guide Flag */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Step 2: Enable Optimization Guide
              </span>
              <button
                type="button"
                onClick={() =>
                  openOrCopyLink(
                    "chrome://flags/#optimization-guide-on-device-model",
                    "flag2",
                  )
                }
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
              >
                {copiedKey === "flag2" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">
                      Copied URL!
                    </span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3 h-3" />
                    <span>Open / Copy Flag Link</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Set this flag to{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                Enabled BypassPerfRequirement
              </strong>
              :
            </p>

            <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300">
              <span className="truncate flex-1 select-all">
                chrome://flags/#optimization-guide-on-device-model
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    "chrome://flags/#optimization-guide-on-device-model",
                    "flag2",
                  )
                }
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                title="Copy flag URL"
              >
                {copiedKey === "flag2" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Step 3: Relaunch & Model Download */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Step 3: Relaunch & Download Model
              </span>
              <button
                type="button"
                onClick={() => openOrCopyLink("chrome://components", "comp")}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
              >
                {copiedKey === "comp" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">
                      Copied URL!
                    </span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3 h-3" />
                    <span>Open / Copy chrome://components</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              1. Click the{" "}
              <strong className="text-zinc-900 dark:text-white">
                Relaunch
              </strong>{" "}
              button at the bottom of the flags page.
              <br />
              2. Navigate to{" "}
              <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">
                chrome://components
              </code>{" "}
              and click <strong>Check for update</strong> on &quot;Optimization
              Guide On Device Model&quot;.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={async () => {
              const res = await performCheck();
              if (res.isAvailable) {
                handleUseNow();
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`}
            />
            Check & Activate
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
