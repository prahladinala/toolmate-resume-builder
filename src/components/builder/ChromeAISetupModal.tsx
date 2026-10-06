import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bot, Globe, Settings, FlaskConical, CheckCircle2 } from "lucide-react";

export function ChromeAISetupModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-950">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
            <Bot className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-xl">Enable Local AI Features</DialogTitle>
          <DialogDescription className="text-center pt-2">
            This app uses Chrome&apos;s built-in <strong className="text-zinc-900 dark:text-zinc-100">Gemini Nano</strong> model to generate privacy-first AI suggestions completely offline and for free.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-3 items-start p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <Globe className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Step 1: Update Chrome</span>
              <p className="text-zinc-500 mt-0.5">Ensure you are using Google Chrome version 127 or newer.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <FlaskConical className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Step 2: Enable Chrome Flags</span>
              <p className="text-zinc-500 mt-0.5">Navigate to <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs select-all">chrome://flags</code> in your URL bar.</p>
              <ul className="list-disc ml-4 mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Search for <strong>Prompt API for Gemini Nano</strong> and set it to <span className="text-emerald-600 dark:text-emerald-400 font-medium">Enabled</span>.</li>
                <li>Search for <strong>Enables optimization guide on device</strong> and set it to <span className="text-emerald-600 dark:text-emerald-400 font-medium">Enabled BypassPerfRequirement</span>.</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <Settings className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Step 3: Download Model</span>
              <p className="text-zinc-500 mt-0.5">Navigate to <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs select-all">chrome://components</code> and click <strong>Check for update</strong> on the &quot;Optimization Guide On Device Model&quot; to download the AI.</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">Step 4: Relaunch Browser</span>
              <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">Restart your browser and refresh this page. The AI features will magically unlock!</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
