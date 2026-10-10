/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useStore } from "zustand";
import { useResumeStore } from "@/store/useResumeStore";
import { History, RotateCw, Trash2, X, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HistoryDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryDrawerModal({
  isOpen,
  onClose,
}: HistoryDrawerModalProps) {
  const { undo, redo, pastStates, futureStates, clear } = useStore(
    useResumeStore.temporal,
  );
  const currentData = useResumeStore((state) => state.data);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleJumpToPast = (indexFromTop: number) => {
    // If user clicks on past state at index i (where 0 is most recent past)
    // We undo (indexFromTop + 1) times
    const steps = indexFromTop + 1;
    undo(steps);
    toast.success(`Jumped back ${steps} version${steps > 1 ? "s" : ""}!`);
    onClose();
  };

  const handleJumpToFuture = (indexFromTop: number) => {
    // Redo (indexFromTop + 1) times
    const steps = indexFromTop + 1;
    redo(steps);
    toast.success(`Advanced forward ${steps} version${steps > 1 ? "s" : ""}!`);
    onClose();
  };

  const handleClearHistory = () => {
    clear();
    toast.info("Undo/Redo timeline history cleared.");
  };

  const getSnapshotSummary = (snapshot: any): string => {
    if (!snapshot || !snapshot.data) return "Resume Draft";
    const d = snapshot.data;
    const name = [d.personalInfo?.firstName, d.personalInfo?.lastName]
      .filter(Boolean)
      .join(" ");
    const expCount = d.experience?.length || 0;
    const skillsCount = d.skills?.length || 0;
    return `${name || "Draft"} • ${expCount} Exp • ${skillsCount} Skills`;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#111113] rounded-2xl border border-zinc-200 dark:border-[#27272a] shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-[#27272a] flex items-center justify-between bg-zinc-50 dark:bg-[#18181b]/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="history-modal-title"
                className="font-bold text-base text-zinc-900 dark:text-white"
              >
                Edit History Timeline
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Jump back to any previous version or draft in your editing
                session.
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

        {/* Timeline List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* FUTURE STATES (Redoable) */}
          {futureStates.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Future / Redoable Changes ({futureStates.length})
              </span>
              <div className="space-y-1.5 pl-2 border-l-2 border-purple-300 dark:border-purple-800">
                {futureStates.map((fs, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
                      <RotateCw className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                      <span>{getSnapshotSummary(fs)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleJumpToFuture(idx)}
                      className="h-6 px-2 text-[10px] text-purple-600 hover:text-purple-700"
                    >
                      Redo Here
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CURRENT ACTIVE STATE */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Current Live Draft: {getSnapshotSummary({ data: currentData })}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
              Active
            </span>
          </div>

          {/* PAST STATES (Undoable) */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Past Revisions ({pastStates.length})
            </span>
            {pastStates.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-[#27272a] text-center text-zinc-400">
                No past revisions recorded yet in this session.
              </div>
            ) : (
              <div className="space-y-1.5 pl-2 border-l-2 border-zinc-200 dark:border-zinc-800">
                {pastStates
                  .slice()
                  .reverse()
                  .map((ps, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] hover:border-indigo-400 dark:hover:border-indigo-600 flex items-center justify-between transition-colors group cursor-pointer"
                      onClick={() => handleJumpToPast(idx)}
                    >
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-indigo-500" />
                        <span>{getSnapshotSummary(ps)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[10px] text-zinc-500 group-hover:text-indigo-600"
                      >
                        Revert
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#18181b]/50 flex items-center justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearHistory}
            disabled={pastStates.length === 0 && futureStates.length === 0}
            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Session History
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
