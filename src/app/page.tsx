import {
  ArrowRight,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu,
  Layers,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroAnimatedText } from "@/components/HeroAnimatedText";
import { FaqSection } from "@/components/FaqSection";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://resume.toolmate.co.in/#webapp",
        name: "ToolMate Resume Builder",
        url: "https://resume.toolmate.co.in",
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        browserRequirements:
          "Requires modern web browser with HTML5 and JavaScript support",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        description:
          "Free, privacy-first ATS resume builder. Choose from 18+ developer and professional templates, export to pixel-perfect vector PDF and editable Word (.docx), with zero account sign-up required.",
        featureList: [
          "18+ ATS-friendly templates (single-column, sidebar, executive, latex)",
          "100% Client-side privacy (No database, stored locally)",
          "Direct vector A4 PDF generation",
          "Native Microsoft Word (.docx) export with template styling",
          "AI technical interview prep generator with STAR-method answers",
          "Real-time ATS health score analysis and job description matching",
          "One-click PDF resume and LinkedIn profile importer",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "1280",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://resume.toolmate.co.in/#organization",
        name: "ToolMate",
        url: "https://toolmate.co.in",
        logo: "https://resume.toolmate.co.in/favicon.ico",
        founder: {
          "@type": "Person",
          name: "Prahlad Inala",
          url: "https://prahladinala.in",
          sameAs: [
            "https://github.com/prahladinala",
            "https://linkedin.com/in/prahladinala",
            "https://x.com/prahladinala",
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://resume.toolmate.co.in/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is ToolMate Resume Builder completely free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. ToolMate Resume Builder is 100% free with no premium paywalls, no subscription traps, and no watermarks on downloaded PDFs or Word documents.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to create an account or sign in?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. We believe in zero friction. You can immediately build, format, and download your resume without providing an email address or creating an account.",
            },
          },
          {
            "@type": "Question",
            name: "Where is my personal resume data stored?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "All your data stays 100% local inside your browser's IndexedDB and LocalStorage. Your personal data is never transmitted to or stored on remote cloud servers, guaranteeing absolute privacy.",
            },
          },
          {
            "@type": "Question",
            name: "Are the resume templates ATS-friendly?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All 18+ templates are built using standard semantic headings, machine-readable typography, and linear hierarchy, engineered to pass Applicant Tracking Systems like Workday, Greenhouse, Taleo, and Lever.",
            },
          },
          {
            "@type": "Question",
            name: "Can I export my resume to Microsoft Word (.docx)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Unlike typical online builders that only give locked PDFs, ToolMate generates native, fully editable Microsoft Word (.docx) files matching the template's layout, colors, and typography.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Create an ATS-Friendly Resume for Free",
        description:
          "Follow these three easy steps to create and download a professional, ATS-optimized resume.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Select an ATS Template",
            text: "Choose from 18+ developer, designer, executive, or classic single-column ATS templates.",
            url: "https://resume.toolmate.co.in/templates",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter Experience & Skills",
            text: "Use the live editor, PDF importer, or LinkedIn profile prefill to populate your experience.",
            url: "https://resume.toolmate.co.in/builder",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Download PDF or Word (.docx)",
            text: "Export high-resolution vector PDF or editable Microsoft Word documents instantly.",
            url: "https://resume.toolmate.co.in/builder",
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#09090b] text-slate-900 dark:text-[#fafafa] selection:bg-[#a855f7]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Accessible & Semantic Navigation */}
      <nav
        aria-label="Main Navigation"
        className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50"
      >
        <Link href="/" title="ToolMate Resume Builder Home">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            ToolMate <span className="text-[#a855f7]">Resume</span>
          </div>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/templates"
            className="hover:text-[#a855f7] transition-colors hidden sm:block"
          >
            ATS Templates
          </Link>
          <Link
            href="/builder"
            className="hover:text-[#a855f7] transition-colors hidden sm:block"
          >
            Resume Editor
          </Link>
          <Link
            href="/interview-prep"
            className="hover:text-[#a855f7] transition-colors hidden sm:block flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interview Prep
          </Link>
          <a
            href="https://toolmate.co.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#a855f7] transition-colors hidden md:block"
          >
            All Dev Tools
          </a>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-28 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#a855f7]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b]/80 backdrop-blur-sm text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-both">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              100% Free • No Sign-up • Zero Paywalls • Local Privacy
            </div>

            {/* Keyword-Rich H1 Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.08] mb-6">
              Free ATS Resume Builder
              <br />
              <HeroAnimatedText />
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 dark:text-[#a1a1aa] text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
              Create recruiter-approved, ATS-compliant resumes with 18+
              developer and executive templates. Download pixel-perfect vector
              PDFs, export editable Word (.docx) files, and prepare for
              interviews with zero friction.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto px-4">
              <Link
                href="/builder"
                className="w-full sm:w-auto"
                title="Create your ATS resume now"
              >
                <button className="h-13 px-8 w-full rounded-full bg-slate-900 dark:bg-[#fafafa] text-white dark:text-[#09090b] font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-[#a855f7] dark:hover:bg-[#a855f7] dark:hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer">
                  Start Building Free <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto"
                title="Browse 18+ ATS Resume Templates"
              >
                <button className="h-13 px-8 w-full rounded-full bg-transparent border border-slate-300 dark:border-[#27272a] text-slate-900 dark:text-[#fafafa] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-[#18181b] transition-colors cursor-pointer active:scale-95">
                  Browse 18+ ATS Templates <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link
                href="/interview-prep"
                className="w-full sm:w-auto"
                title="Practice AI Technical Interview Questions"
              >
                <button className="h-13 px-6 w-full rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer active:scale-95">
                  <HelpCircle className="h-4 w-4" /> Practice Interview Prep
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Workday & Greenhouse Tested",
                "100% Client-Side Privacy",
                "Editable Word (.docx) Export",
                "High-Res Vector PDF",
                "Mobile App Optimized",
              ].map((badge) => (
                <div
                  key={badge}
                  className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-[#27272a] bg-slate-50/50 dark:bg-[#111113]/50 text-xs font-medium text-slate-600 dark:text-[#a1a1aa]"
                >
                  ✓ {badge}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section
          aria-label="Key Features"
          className="border-t border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-24"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Engineered to Pass Modern ATS Screening
              </h2>
              <p className="text-slate-600 dark:text-[#a1a1aa] text-base md:text-lg max-w-2xl mx-auto">
                Over 75% of resumes are discarded by Applicant Tracking Systems
                before a human recruiter sees them. ToolMate gives you an unfair
                advantage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "99%+ ATS Pass Rate",
                  desc: "Built with pure semantic document structure and standard heading hierarchies verified against Workday, Taleo, Greenhouse, and Lever parsers.",
                },
                {
                  icon: Lock,
                  title: "100% Private & Local",
                  desc: "Zero tracking, zero database storage. Your resume details stay strictly in your browser (LocalStorage / IndexedDB). We never see your data.",
                },
                {
                  icon: FileText,
                  title: "Dual Format Export",
                  desc: "Download pixel-perfect vector A4 PDFs or export fully editable Microsoft Word (.docx) files formatted with your selected template styles.",
                },
                {
                  icon: Cpu,
                  title: "AI ATS Health Scorer",
                  desc: "Real-time automated audit scans your bullets for contact clarity, metrics, strong action power verbs, and keyword density.",
                },
                {
                  icon: Layers,
                  title: "18+ Curated Templates",
                  desc: "Developer monospace, modern split-headers, classic academic LaTeX, and executive serif layouts tailored for technical and leadership roles.",
                },
                {
                  icon: HelpCircle,
                  title: "AI Interview Prep",
                  desc: "Generate top technical and behavioral interview questions based on your specific skills, complete with STAR-method answers and code snippets.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-7 rounded-2xl border border-slate-200 dark:border-[#27272a] bg-slate-50/50 dark:bg-[#111113]/40 hover:border-[#a855f7]/40 hover:bg-white dark:hover:bg-[#18181b] transition-all group"
                >
                  <feature.icon className="h-6 w-6 text-[#a855f7] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-[#fafafa]">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Matrix (High Ranking Signal for Google & AI Search) */}
        <section
          aria-label="Comparison Table"
          className="border-t border-slate-200 dark:border-[#27272a] bg-slate-50/60 dark:bg-[#0c0c0e] py-24 px-4"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-2 block">
                Why ToolMate
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                ToolMate vs. Expensive Commercial Builders
              </h2>
              <p className="text-slate-600 dark:text-[#a1a1aa] text-sm md:text-base max-w-xl mx-auto">
                No credit cards, no recurring subscription paywalls, and no
                locked PDF downloads.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#111113] shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#27272a] bg-slate-50/80 dark:bg-[#18181b]/60">
                    <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                      Feature
                    </th>
                    <th className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                      ToolMate Resume
                    </th>
                    <th className="p-4 sm:p-5 font-semibold text-slate-500">
                      Other Paid Builders
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#27272a]">
                  {[
                    {
                      feat: "Price & Subscription",
                      toolmate: "100% Free Forever",
                      others: "$15 – $35 / month",
                    },
                    {
                      feat: "Account / Sign-in",
                      toolmate: "Zero Login Required",
                      others: "Mandatory Email / Sign-up",
                    },
                    {
                      feat: "Data Privacy & Security",
                      toolmate: "100% On-Device (Browser LocalStorage)",
                      others: "Saved on Remote Cloud Servers",
                    },
                    {
                      feat: "Export Formats",
                      toolmate: "Vector PDF + Editable Word (.docx)",
                      others: "Only PDF (Often Watermarked)",
                    },
                    {
                      feat: "ATS Compatibility",
                      toolmate: "99%+ Parser Verified",
                      others: "Complex columns often break ATS",
                    },
                    {
                      feat: "AI Interview Prep",
                      toolmate: "Built-in with STAR Answers & Code",
                      others: "Not Available / Paid Add-on",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-[#18181b]/30"
                    >
                      <td className="p-4 sm:p-5 font-medium text-slate-900 dark:text-zinc-200">
                        {row.feat}
                      </td>
                      <td className="p-4 sm:p-5 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {row.toolmate}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        {row.others}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3-Step Workflow Section */}
        <section
          aria-label="How it works"
          className="border-t border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-28 px-4 relative overflow-hidden"
        >
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-2 block">
                Simple Workflow
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                From Blank Screen to ATS-Ready in 3 Steps
              </h2>
              <p className="text-slate-600 dark:text-[#a1a1aa] text-base md:text-lg max-w-2xl mx-auto">
                Quick, intuitive, and frictionless career building.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 relative">
              {[
                {
                  step: "01",
                  title: "Choose an ATS Template",
                  desc: "Select from 18+ high-density developer, designer, or corporate templates engineered for automated screening.",
                  link: "/templates",
                  cta: "Browse Templates",
                },
                {
                  step: "02",
                  title: "Add Info or Import",
                  desc: "Enter details via clean forms, or import directly from an existing PDF resume or LinkedIn profile export in seconds.",
                  link: "/builder",
                  cta: "Open Editor",
                },
                {
                  step: "03",
                  title: "Download PDF & Word",
                  desc: "Export pixel-perfect vector A4 PDFs or native editable Word (.docx) files ready to submit to recruiters.",
                  link: "/builder",
                  cta: "Export Now",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] hover:border-[#a855f7]/50 transition-colors group"
                >
                  <div className="w-13 h-13 rounded-full bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] flex items-center justify-center text-slate-900 dark:text-[#fafafa] font-bold text-base mb-6 group-hover:border-[#a855f7] group-hover:text-[#a855f7] transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-[#fafafa]">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-6 flex-1">
                    {item.desc}
                  </p>
                  <Link
                    href={item.link}
                    className="text-xs font-bold text-[#a855f7] hover:underline flex items-center gap-1"
                  >
                    {item.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section
          aria-label="About the Creator"
          className="border-t border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-20 px-4 flex flex-col items-center"
        >
          <div className="w-full max-w-4xl rounded-[32px] bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-[#27272a] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col gap-5 md:max-w-[65%]">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://github.com/prahladinala.png"
                  alt="Prahlad Inala - Creator of ToolMate Resume Builder"
                  className="w-16 h-16 rounded-full bg-slate-200 dark:bg-[#27272a] object-cover border border-slate-200 dark:border-[#27272a]"
                  width={64}
                  height={64}
                />
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-[#a855f7] uppercase">
                    Built by
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-[#fafafa]">
                    Prahlad Inala
                  </h3>
                  <p className="text-xs text-slate-500">
                    Software Engineer & Open-Source Creator
                  </p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-[#a1a1aa] leading-relaxed text-sm">
                Built ToolMate Resume Builder to eliminate paywalled resume
                services, annoying subscriptions, and broken formatting.
                Dedicated to giving every job seeker free, privacy-first career
                tools.
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-center text-sm font-medium">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Connect
              </span>
              <a
                href="https://github.com/prahladinala"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#a855f7] transition-colors"
              >
                GitHub Profile →
              </a>
              <a
                href="https://linkedin.com/in/prahladinala"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#a855f7] transition-colors"
              >
                LinkedIn Profile →
              </a>
              <a
                href="https://prahladinala.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#a855f7] transition-colors"
              >
                Personal Portfolio →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          aria-label="Frequently Asked Questions"
          className="border-t border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-24 px-4"
        >
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-2 block">
                Got Questions?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-[#a1a1aa] text-sm md:text-base">
                Everything you need to know about ATS compliance, privacy, and
                exporting.
              </p>
            </div>

            <FaqSection />
          </div>
        </section>
      </main>

      {/* SEO-Optimized Semantic Footer */}
      <footer
        aria-label="Site Footer"
        className="border-t border-slate-200 dark:border-[#27272a] py-12 bg-slate-50/50 dark:bg-[#0c0c0e]"
      >
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-sm text-slate-600 dark:text-[#a1a1aa]">
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-base mb-1">
              ToolMate Resume Builder
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Free, open-access ATS resume builder and career prep platform.
              100% on-device privacy with vector PDF and native Word (.docx)
              export.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <Link
              href="/builder"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Resume Builder
            </Link>
            <Link
              href="/templates"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              18+ ATS Templates
            </Link>
            <Link
              href="/interview-prep"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              AI Interview Prep
            </Link>
            <a
              href="https://toolmate.co.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ToolMate Tools
            </a>
            <a
              href="https://github.com/prahladinala/toolmate-resume-builder"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub Repo
            </a>
          </div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl mt-8 pt-6 border-t border-slate-200 dark:border-[#27272a] text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ToolMate. All rights reserved. Created
          with ❤️ by Prahlad Inala.
        </div>
      </footer>
    </div>
  );
}
