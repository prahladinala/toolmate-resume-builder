import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, HardDrive, Cpu, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Privacy Policy | ToolMate Resume Builder",
  description:
    "ToolMate Resume Builder is built on a 100% local-first, zero-knowledge architecture. Read our commitment to keeping your resume data entirely on your device.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | ToolMate Resume Builder",
    description:
      "100% on-device privacy. Zero cloud databases, zero login required, zero resume tracking.",
    url: "https://resume.toolmate.co.in/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-[#fafafa] selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full z-50 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold tracking-tight">
            ResumeBuilder<span className="text-purple-600">.</span>
          </div>
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Local-First & Zero-Knowledge Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Effective Date: October 11, 2026 • Last Updated: October 11, 2026
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 space-y-2">
            <Lock className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-sm">No Accounts Required</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We never ask for your email address, phone number, password, or
              sign-up credentials.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 space-y-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm">On-Device Storage</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your resume data is stored entirely in your web browser&apos;s
              IndexedDB and LocalStorage.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 space-y-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm">Zero Remote Tracking</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We do not track keystrokes, sell telemetry data, or store your
              career details on any server.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="prose dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              1. Information We Do Not Collect
            </h2>
            <p>
              Unlike conventional resume-building SaaS tools, ToolMate Resume
              Builder operates under a strict
              <strong> zero-knowledge principle</strong>. We do not maintain any
              cloud database, user account table, or document repository. When
              you enter personal contact details, work history, educational
              achievements, or technical skill sets, that data never leaves your
              device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              2. Where Your Data Is Stored
            </h2>
            <p>
              All autosaved drafts, active template configurations, styling
              choices, and cover letter drafts are persisted exclusively within
              your client browser using{" "}
              <strong>IndexedDB (via idb-keyval)</strong> and
              <strong> localStorage</strong>. This data remains on your machine
              and is accessible solely by your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              3. Data Retention and Erasure (Your Right to Delete)
            </h2>
            <p>
              Because your information is stored strictly on your local browser:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>
                <strong>Instant Wipe:</strong> Clicking &quot;Reset Resume&quot;
                or clearing your browser cookies and site data immediately
                purges all saved resume records.
              </li>
              <li>
                <strong>Zero Server Retention:</strong> Because no server-side
                copies exist, no residual or orphaned data persists in backups
                or server logs after you clear your device storage.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              4. Document Generation (PDF and Word .docx)
            </h2>
            <p>
              Document compilation is performed 100% client-side via JavaScript
              libraries running in your browser (<code>jspdf</code>,{" "}
              <code>html2canvas</code>, and <code>docx</code>). Your generated
              files are compiled in browser memory and downloaded directly to
              your local file system without passing through any intermediary
              rendering proxy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              5. AI and ATS Features
            </h2>
            <p>
              Our artificial intelligence integrations prioritize on-device
              Chrome Built-in AI (Gemini Nano via <code>window.ai</code>). When
              on-device AI is utilized, prompt execution is handled entirely by
              your local Chromium runtime. In all other instances, keyword
              matching, ATS score calculations, and interview questions operate
              via deterministic client-side heuristics and curated offline
              datasets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              6. Contact & Data Controller
            </h2>
            <p>
              For inquiries regarding this Privacy Policy or architectural
              security verifications, please reach out via our contact portal at{" "}
              <a
                href="https://prahladinala.in/#contact"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:underline"
              >
                prahladinala.in/#contact
              </a>
              .
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
