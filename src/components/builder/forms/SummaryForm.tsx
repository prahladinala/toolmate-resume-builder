"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { summarySchema } from "@/lib/validations";
import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { PowerVerbs } from "../PowerVerbs";
import { AIHelper } from "../AIHelper";
import { AISuggestions } from "../AISuggestions";

export function SummaryForm() {
  const summary = useResumeStore((state) => state.data.summary);
  const updateSummary = useResumeStore((state) => state.updateSummary);

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
