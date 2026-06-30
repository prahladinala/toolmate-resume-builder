"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { summarySchema } from '@/lib/validations';
import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

export function SummaryForm() {
  const { data, updateSummary } = useResumeStore();
  
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary: data.summary },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateSummary(value.summary || '');
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSummary]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">A brief overview of your professional background.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea 
          id="summary" 
          placeholder="Experienced software engineer with a passion for building scalable web applications..." 
          className="min-h-[200px]"
          {...register('summary')} 
        />
        {errors.summary && <p className="text-xs text-destructive">{errors.summary.message as string}</p>}
      </div>
    </div>
  );
}
