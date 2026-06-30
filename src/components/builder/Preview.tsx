"use client";

import { useResumeStore } from '@/store/useResumeStore';
import { TemplateEngine } from './TemplateEngine';

export function Preview() {
  const { data, activeTemplate } = useResumeStore();

  return (
    <div className="w-full h-full bg-muted/30 p-2 md:p-8 overflow-y-auto flex justify-center @container print:bg-transparent print:p-0 print:overflow-visible print:block">
      <div 
        id="resume-preview" 
        className="w-[794px] min-h-[1123px] bg-white shadow-xl rounded-sm overflow-hidden print:shadow-none print:w-[210mm] print:h-[297mm] print:m-0 print:p-0 origin-top"
        style={{ transform: 'scale(min(1, calc(100cqw / 820)))' }}
      >
        <TemplateEngine data={data} templateId={activeTemplate || 'dev-1'} />
      </div>
    </div>
  );
}
