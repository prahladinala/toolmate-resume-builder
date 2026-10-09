"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coverLetterSchema } from "@/lib/validations";
import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { PowerVerbs } from "../PowerVerbs";
import { AIHelper } from "../AIHelper";

export function CoverLetterForm() {
  const { data, updateCoverLetter } = useResumeStore();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: { coverLetter: data.coverLetter || "" },
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateCoverLetter(value.coverLetter || "");
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [watch, updateCoverLetter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Cover Letter Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Write a cover letter that matches your resume&apos;s design. Use
          markdown!
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="coverLetter">Letter Content</Label>
          <div className="flex items-center gap-2">
            <AIHelper
              currentText={watch("coverLetter") || ""}
              onUpdate={(improvedText) => setValue("coverLetter", improvedText)}
              targetId="cover-letter-ai-options"
              sectionType="cover_letter"
            />
            <PowerVerbs
              onSelect={(verb) => {
                const currentDesc = watch("coverLetter") || "";
                setValue(
                  "coverLetter",
                  currentDesc +
                    (currentDesc && !currentDesc.endsWith(" ") ? " " : "") +
                    verb,
                );
              }}
            />
          </div>
        </div>
        <Textarea
          id="coverLetter"
          placeholder={`Dear Hiring Manager,\n\nI am writing to express my interest in...`}
          className="min-h-[400px]"
          {...register("coverLetter")}
        />
        <div id="cover-letter-ai-options" />
      </div>
    </div>
  );
}
