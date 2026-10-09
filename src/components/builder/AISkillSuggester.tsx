"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Sparkles,
  Loader2,
  Check,
  Plus,
  ShieldCheck,
  TrendingUp,
  Star,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  generateSkillSuggestions,
  type SuggestedSkill,
  type SkillSuggestionResult,
} from "@/lib/aiSkillSuggester";
import { checkChromeAIAvailability } from "@/lib/chromeAI";
import { ChromeAISetupModal } from "./ChromeAISetupModal";
import { notify } from "@/lib/toast";

export function AISkillSuggester() {
  const { data, addSkill } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SkillSuggestionResult | null>(null);
  const [addedSkillNames, setAddedSkillNames] = useState<Set<string>>(
    new Set(),
  );
  const [showSetup, setShowSetup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showInsights, setShowInsights] = useState(true);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const status = await checkChromeAIAvailability();
      if (!status.isAvailable) {
        setShowSetup(true);
        setIsGenerating(false);
        return;
      }

      const res = await generateSkillSuggestions(data);
      setResult(res);

      if (res.suggestions.length > 0) {
        notify.aiSuccess(
          `Identified ${res.suggestions.length} high-value skills and ATS keywords from your background.`,
        );
      } else {
        notify.info(
          "All core skills identified",
          "Your resume already covers key skills for your background. Try adding more project or experience details.",
        );
      }
    } catch (err: unknown) {
      console.error("Skill suggestion error:", err);
      const msg = err instanceof Error ? err.message : undefined;
      notify.aiError(
        msg || "Ensure Gemini Nano is downloaded in chrome://components.",
        () => setShowSetup(true),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSingle = (skill: SuggestedSkill) => {
    // Check if already in store
    const alreadyExists = (data.skills || []).some(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase(),
    );

    if (!alreadyExists) {
      addSkill({
        id: crypto.randomUUID(),
        name: skill.name,
        category: skill.category || "Technical Skills",
      });
      notify.aiSuccess(`Added "${skill.name}" to your skills.`);
    }

    setAddedSkillNames((prev) => new Set(prev).add(skill.name.toLowerCase()));
  };

  const handleAddAll = (skillsToAdd: SuggestedSkill[]) => {
    let count = 0;
    const existingNames = new Set(
      (data.skills || []).map((s) => s.name.toLowerCase()),
    );
    const newAdded = new Set(addedSkillNames);

    skillsToAdd.forEach((skill) => {
      const lower = skill.name.toLowerCase();
      if (!existingNames.has(lower) && !newAdded.has(lower)) {
        addSkill({
          id: crypto.randomUUID(),
          name: skill.name,
          category: skill.category || "Technical Skills",
        });
        newAdded.add(lower);
        count++;
      }
    });

    setAddedSkillNames(newAdded);
    notify.aiSuccess(`Added ${count} skills to your resume.`);
  };

  const categories = result?.suggestions
    ? ["all", ...new Set(result.suggestions.map((s) => s.category))]
    : [];

  const filteredSuggestions = result?.suggestions.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.category === selectedCategory;
  });

  return (
    <>
      <div className="space-y-3">
        {/* Main Trigger Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-background dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-background shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold tracking-tight text-foreground">
                  AI Skill & ATS Keyword Matcher
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <ShieldCheck className="w-3 h-3" /> Gemini Nano On-Device
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Analyzes all your entered experience, projects, and summary to
                uncover missing ATS keywords.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Resume Data...</span>
              </>
            ) : result ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Analyze Resume</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Suggest Skills & Keywords</span>
              </>
            )}
          </button>
        </div>

        {/* Suggestions Panel */}
        {result && (
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-card shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Header & Batch Add */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/70">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  Recommended Skills ({result.suggestions.length})
                </span>

                {/* Filter Tabs */}
                {categories.length > 2 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                          selectedCategory === cat
                            ? "bg-purple-600 text-white"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat === "all" ? "All" : cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => handleAddAll(filteredSuggestions || [])}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950/60 dark:hover:bg-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add All ({filteredSuggestions?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Close recommendations"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredSuggestions?.map((skill) => {
                const lower = skill.name.toLowerCase();
                const isAdded =
                  addedSkillNames.has(lower) ||
                  (data.skills || []).some(
                    (s) => s.name.toLowerCase() === lower,
                  );

                return (
                  <div
                    key={skill.id}
                    onClick={() => !isAdded && handleAddSingle(skill)}
                    className={`p-2.5 rounded-lg border transition-all text-left flex items-start justify-between gap-2 ${
                      isAdded
                        ? "border-emerald-300 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 opacity-80"
                        : "border-border hover:border-purple-300 dark:hover:border-purple-750 bg-background hover:bg-purple-50/40 dark:hover:bg-purple-950/20 cursor-pointer group"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">
                          {skill.name}
                        </span>

                        {skill.isAtsCrucial && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            ATS Priority
                          </span>
                        )}

                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                          {skill.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {skill.reason}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {isAdded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3 stroke-[3]" /> Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSingle(skill);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white px-2 py-0.5 rounded-md transition-colors border border-purple-200 dark:border-purple-800/40"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ATS Insights dropdown */}
            {result.atsInsights && result.atsInsights.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowInsights(!showInsights)}
                  className="flex items-center justify-between w-full text-[11px] font-medium text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    💡 How these skills boost your ATS match score
                  </span>
                  {showInsights ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showInsights && (
                  <div className="mt-1.5 p-2.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/60 text-[11px] text-muted-foreground space-y-1 leading-relaxed">
                    {result.atsInsights.map((insight, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ChromeAISetupModal
        open={showSetup}
        onOpenChange={setShowSetup}
        onSuccess={handleGenerate}
      />
    </>
  );
}
