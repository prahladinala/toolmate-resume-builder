"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from '@/components/builder/forms/PersonalInfoForm';
import { SummaryForm } from '@/components/builder/forms/SummaryForm';
import { ExperienceForm } from '@/components/builder/forms/ExperienceForm';
import { EducationForm } from '@/components/builder/forms/EducationForm';
import { Preview } from '@/components/builder/Preview';
import { ChevronLeft, ChevronRight, Download, CheckCircle2, User, Briefcase, GraduationCap, Code, FileText } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: Code },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'preview', label: 'Preview', icon: FileText },
];

export default function BuilderPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(s => s + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(s => s - 1);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      {/* Top Navbar specifically for Builder */}
      <header className="flex h-14 items-center justify-between border-b px-4 bg-background z-10 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/templates">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-semibold text-sm">Resume Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-muted-foreground mr-4 hidden sm:flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" /> Auto-saved
          </div>
          <Button onClick={handleDownload} size="sm" className="rounded-full">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden print:overflow-visible">
        {/* Left Sidebar - Form/Mobile Preview */}
        <div className={`w-full md:w-[450px] lg:w-[500px] flex flex-col border-r bg-background shrink-0 transition-all print:hidden ${activeStep === 4 ? 'hidden md:flex' : ''}`}>
          {/* Step Tracker */}
          <div className="p-4 border-b bg-muted/10 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeStep === idx 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeStep === 0 && <PersonalInfoForm />}
                {activeStep === 1 && <SummaryForm />}
                {activeStep === 2 && <ExperienceForm />}
                {activeStep === 3 && <EducationForm />}
                {activeStep === 4 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-10">
                    <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Resume Complete!</h2>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Your resume is ready. On desktop, the preview is on the right. On mobile, you can tap download to save your PDF.
                      </p>
                    </div>
                    <Button size="lg" onClick={handleDownload} className="w-full max-w-sm rounded-full">
                      <Download className="mr-2 h-5 w-5" /> Download PDF Now
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Nav */}
          <div className="p-4 border-t flex justify-between bg-background">
            <Button variant="outline" onClick={handlePrev} disabled={activeStep === 0}>
              Previous
            </Button>
            {activeStep === STEPS.length - 1 ? (
              <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                Download PDF
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar - Preview (Visible on desktop always, visible on mobile ONLY on step 4) */}
        <div className={`${activeStep === 4 ? 'block' : 'hidden'} md:block flex-1 bg-muted/20 relative print:block print:w-full print:h-full print:bg-transparent print:absolute print:inset-0 print:m-0 print:p-0`}>
          <Preview />
        </div>
      </main>
    </div>
  );
}
