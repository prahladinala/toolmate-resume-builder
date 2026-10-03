"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ServerCrash, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#09090b] text-[#fafafa] selection:bg-[#a855f7]/30 dark">
      {/* Minimal Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
        <Link href="/">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            ResumeBuilder<span className="text-[#a855f7]">.</span>
          </div>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Subtle Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#111113] border border-[#27272a] flex items-center justify-center mb-8 shadow-2xl relative">
            <div className="absolute inset-0 rounded-2xl bg-orange-500/10 animate-pulse" />
            <ServerCrash className="w-8 h-8 text-orange-500 relative z-10" />
          </div>

          <div className="text-[10px] font-bold tracking-widest text-[#a1a1aa] uppercase mb-4">
            500 Server Error
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#fafafa]">
            Something went wrong
          </h1>

          <p className="text-[#a1a1aa] text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            An unexpected error occurred in the application. Don&apos;t worry,
            your local data is safely stored in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => reset()}
              className="h-12 px-8 w-full sm:w-auto rounded-full bg-[#fafafa] text-[#09090b] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#e4e4e7] transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
            <Link href="/" className="w-full sm:w-auto">
              <button className="h-12 px-8 w-full sm:w-auto rounded-full bg-transparent border border-[#27272a] text-[#fafafa] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#27272a] transition-colors">
                <ArrowLeft className="h-4 w-4" /> Go Home
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
