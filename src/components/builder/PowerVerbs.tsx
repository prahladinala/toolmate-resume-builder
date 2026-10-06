"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const VERB_CATEGORIES = {
  Leadership: ["Spearheaded", "Orchestrated", "Directed", "Mentored", "Cultivated"],
  Engineering: ["Architected", "Engineered", "Refactored", "Deployed", "Optimized"],
  Results: ["Accelerated", "Maximized", "Generated", "Outperformed", "Pioneered"],
  Communication: ["Articulated", "Negotiated", "Persuaded", "Clarified", "Facilitated"],
  Analysis: ["Diagnosed", "Evaluated", "Quantified", "Investigated", "Forecasted"],
};

export function PowerVerbs({ onSelect }: { onSelect: (verb: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-7 px-2 text-xs flex items-center gap-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 rounded-md cursor-pointer dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-400">
          <Sparkles className="w-3 h-3" />
          Power Verbs
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <h4 className="font-semibold text-sm">Action Verbs Library</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Click a verb to insert it</p>
        </div>
        <ScrollArea className="h-64">
          <div className="p-3 space-y-4">
            {Object.entries(VERB_CATEGORIES).map(([category, verbs]) => (
              <div key={category}>
                <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-300 mb-2">{category}</h5>
                <div className="flex flex-wrap gap-1.5">
                  {verbs.map(verb => (
                    <button
                      key={verb}
                      onClick={(e) => { e.preventDefault(); onSelect(verb); }}
                      className="text-xs px-2 py-1 rounded-md bg-zinc-100 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-zinc-800 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 transition-colors"
                    >
                      {verb}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
