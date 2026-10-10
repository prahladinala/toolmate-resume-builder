import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Terms of Service | ToolMate Resume Builder",
  description:
    "Review the terms and conditions governing the use of ToolMate Resume Builder, free resume templates, and export tools.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | ToolMate Resume Builder",
    description:
      "Terms of service, permissible use, and ATS compatibility guidelines for ToolMate Resume Builder.",
    url: "https://resume.toolmate.co.in/terms",
    type: "website",
  },
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Usage Terms & Disclaimers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Effective Date: October 11, 2026 • Last Updated: October 11, 2026
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm">
              100% Free & Open Career Software
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ToolMate Resume Builder is provided free of charge for job seekers
              worldwide. There are no surprise paywalls, no subscription
              auto-renewals, and no watermarks placed on your exported
              documents.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="prose dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using ToolMate Resume Builder (hosted at
              resume.toolmate.co.in), you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service. If
              you do not agree with any portion of these terms, you should
              discontinue using the application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              2. Intellectual Property and User Ownership
            </h2>
            <p>
              <strong>Your Content Belongs to You:</strong> You retain complete,
              unencumbered ownership of all resume text, employment histories,
              educational records, project portfolios, and personal information
              you enter into the application. ToolMate claims no rights,
              licenses, or ownership over your professional content.
            </p>
            <p>
              <strong>Template & Code License:</strong> The underlying web
              application code, layout styling, and template designs are the
              intellectual property of ToolMate and Prahlad Inala. You are
              granted a personal, non-exclusive license to use the templates to
              generate resumes and cover letters for personal and professional
              job applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              3. Permissible Use
            </h2>
            <p>
              You agree to use ToolMate Resume Builder solely for lawful
              purposes. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>
                Attempt to reverse-engineer, exploit, or disrupt the client-side
                application scripts.
              </li>
              <li>
                Use automated scripts to overload or abuse static distribution
                endpoints.
              </li>
              <li>
                Inject malicious payloads, exploits, or harmful code into
                imported files or text inputs.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              4. ATS Compatibility Disclaimer
            </h2>
            <p>
              Our templates and ATS health score algorithms are modeled on
              industry-standard applicant tracking systems (including Workday,
              Greenhouse, Lever, and Taleo). However, hiring organizations
              utilize diverse, proprietary, and continually updated parser
              configurations. ToolMate does not warrant or guarantee that any
              resume generated using the platform will achieve specific
              interview callback rates or pass automated screening at any
              specific employer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              5. AI Suggestions Disclaimer
            </h2>
            <p>
              AI-powered bullet point quantification, interview prep outlines,
              and STAR-method responses are generated to assist and inspire your
              drafting process. Artificial intelligence outputs may occasionally
              contain factual inaccuracies or unintended phrasing. You are
              solely responsible for reviewing and verifying the accuracy of all
              text prior to submitting your resume to prospective employers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              6. Limitation of Liability
            </h2>
            <p>
              ToolMate Resume Builder is provided on an &quot;AS IS&quot; and
              &quot;AS AVAILABLE&quot; basis without warranties of any kind. In
              no event shall ToolMate, its contributors, or maintainers be
              liable for any indirect, incidental, or consequential damages
              resulting from the use or inability to use the service.
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
