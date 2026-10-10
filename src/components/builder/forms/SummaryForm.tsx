"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { summarySchema } from "@/lib/validations";
import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { PowerVerbs } from "../PowerVerbs";
import { AIHelper } from "../AIHelper";
import { AISuggestions } from "../AISuggestions";
import { GuidedSummaryModal } from "../GuidedSummaryModal";

export function SummaryForm() {
  const summary = useResumeStore((state) => state.data.summary);
  const updateSummary = useResumeStore((state) => state.updateSummary);
  const [showGuidedSummary, setShowGuidedSummary] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary },
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateSummary(value.summary || "");
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [watch, updateSummary]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Professional Summary
        </h2>
        <p className="text-sm text-muted-foreground">
          A brief overview of your professional background.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="summary">Summary</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGuidedSummary(true)}
              className="h-8 gap-1.5 text-xs text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              title="Guided 3-question assistant to draft an executive summary"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Guided Creator
            </Button>
            <AIHelper
              currentText={watch("summary") || ""}
              onUpdate={(improvedText) => setValue("summary", improvedText)}
              targetId="summary-ai-options"
              sectionType="summary"
            />
            <PowerVerbs
              onSelect={(verb) => {
                const currentDesc = watch("summary") || "";
                setValue(
                  "summary",
                  currentDesc +
                    (currentDesc && !currentDesc.endsWith(" ") ? " " : "") +
                    verb,
                );
              }}
            />
          </div>
        </div>
        <Textarea
          id="summary"
          placeholder="Experienced software engineer with a passion for building scalable web applications..."
          className="min-h-[200px]"
          {...register("summary")}
        />
        <div id="summary-ai-options" />
        <GuidedSummaryModal
          isOpen={showGuidedSummary}
          onClose={() => setShowGuidedSummary(false)}
          defaultRole={useResumeStore.getState().data.personalInfo.title}
          onApply={(generatedSummary) => {
            setValue("summary", generatedSummary, { shouldValidate: true });
            updateSummary(generatedSummary);
          }}
        />
        <AISuggestions
          currentText={watch("summary") || ""}
          onSelect={(suggestion) => {
            const currentDesc = watch("summary") || "";
            setValue(
              "summary",
              currentDesc +
                (currentDesc && !currentDesc.endsWith(" ") ? " " : "") +
                suggestion,
            );
          }}
          contextPrompt="professional summary"
        />
        {errors.summary && (
          <p className="text-xs text-destructive">
            {errors.summary.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
