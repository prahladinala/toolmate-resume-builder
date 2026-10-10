import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InterviewPrepClient } from "@/components/interview-prep/InterviewPrepClient";

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-[#fafafa] selection:bg-purple-500/30">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full z-50 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold tracking-tight">
            ResumeBuilder<span className="text-purple-600">.</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Interview Prep
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/builder"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors hidden sm:block"
          >
            Resume Builder
          </Link>
          <Link
            href="/templates"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors hidden sm:block"
          >
            Templates
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Header */}
      <header className="px-6 pt-12 pb-8 max-w-5xl mx-auto w-full text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive On-Device & Curated Interview Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Master Your Next Tech Interview
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Enter your tech stack or target role to generate targeted technical
          deep-dives, system design architectures, and behavioral STAR outlines
          with complete verified answers and code walkthroughs.
        </p>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-24 space-y-8">
        <InterviewPrepClient />

        {/* CTA TO RESUME BUILDER */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-zinc-900 dark:text-white">
              Ready to showcase these skills on your resume?
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Align your project metrics, pass ATS screenings, and download a
              recruiter-ready PDF.
            </p>
          </div>
          <Link
            href="/builder"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-md shrink-0 transition-transform hover:scale-105"
          >
            <span>Open Resume Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      </main>
    </div>
  );
}
