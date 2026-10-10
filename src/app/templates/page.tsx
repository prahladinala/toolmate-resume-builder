import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Sparkles } from "lucide-react";

const categories = [
  { id: "developers", label: "Developers" },
  { id: "designers", label: "Designers" },
  { id: "corporate", label: "Corporate" },
  { id: "non-it", label: "General / Non-IT" },
];

const templates = [
  // Developers (Focus on mono fonts, GitHub/StackOverflow vibe)
  {
    id: "dev-1",
    name: "Terminal Mono",
    category: "developers",
    ats: 100,
    color: "bg-zinc-900",
  },
  {
    id: "dev-2",
    name: "Clean Code",
    category: "developers",
    ats: 98,
    color: "bg-blue-600",
  },
  {
    id: "dev-3",
    name: "Matrix Green",
    category: "developers",
    ats: 95,
    color: "bg-emerald-600",
  },
  {
    id: "dev-4",
    name: "Tech Stack",
    category: "developers",
    ats: 99,
    color: "bg-indigo-500",
  },

  // Designers (Focus on vibrant colors, unique layouts, sans-serif)
  {
    id: "des-1",
    name: "Creative Pink",
    category: "designers",
    ats: 85,
    color: "bg-pink-500",
  },
  {
    id: "des-2",
    name: "Studio Purple",
    category: "designers",
    ats: 92,
    color: "bg-purple-600",
  },
  {
    id: "des-3",
    name: "Agency Orange",
    category: "designers",
    ats: 88,
    color: "bg-orange-500",
  },
  {
    id: "des-4",
    name: "Editorial Rose",
    category: "designers",
    ats: 90,
    color: "bg-rose-500",
  },

  // Corporate (Focus on classic Serif fonts, conservative layouts)
  {
    id: "corp-1",
    name: "Executive Serif",
    category: "corporate",
    ats: 99,
    color: "bg-slate-800",
  },
  {
    id: "corp-2",
    name: "Classic Finance",
    category: "corporate",
    ats: 100,
    color: "bg-gray-900",
  },
  {
    id: "corp-3",
    name: "Management Right",
    category: "corporate",
    ats: 97,
    color: "bg-stone-700",
  },
  {
    id: "corp-4",
    name: "Director Clean",
    category: "corporate",
    ats: 98,
    color: "bg-neutral-800",
  },

  // Non-IT / General (Focus on clean Sans, versatile layouts)
  {
    id: "gen-1",
    name: "Standard Professional",
    category: "non-it",
    ats: 96,
    color: "bg-teal-600",
  },
  {
    id: "gen-2",
    name: "Modern General",
    category: "non-it",
    ats: 95,
    color: "bg-sky-600",
  },
  {
    id: "gen-3",
    name: "Entry Level",
    category: "non-it",
    ats: 99,
    color: "bg-amber-600",
  },
  {
    id: "gen-4",
    name: "Creative General",
    category: "non-it",
    ats: 92,
    color: "bg-red-500",
  },
  {
    id: "latex-1",
    name: "Academic LaTeX",
    category: "developers",
    ats: 100,
    color: "bg-slate-800",
  },
  {
    id: "consult-1",
    name: "Consulting & Banking",
    category: "corporate",
    ats: 100,
    color: "bg-zinc-900",
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#fafafa] selection:bg-[#a855f7]/30">
      {/* Minimal Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
        <Link href="/">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            ResumeBuilder<span className="text-[#a855f7]">.</span>
          </div>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/templates"
            className="text-zinc-900 dark:text-[#fafafa] transition-colors hidden sm:block"
          >
            Templates
          </Link>
          <Link
            href="/builder"
            className="text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:text-[#fafafa] transition-colors hidden sm:block"
          >
            Builder
          </Link>
          <Link
            href="/interview-prep"
            className="text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:text-[#fafafa] transition-colors hidden sm:block"
          >
            Interview Prep
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl relative z-10">
        {/* Subtle Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#a855f7]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b]/80 backdrop-blur-sm text-xs font-semibold mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Free • Workday & Greenhouse Tested • Zero Paywalls</span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-750">
              |
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Your resume content is automatically preserved across all
              templates
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            18+ Free ATS Resume Templates
          </h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] text-base md:text-lg max-w-2xl mx-auto">
            Curated developer monospace, modern split-headers, academic LaTeX,
            and executive layouts. Pure semantic HTML guaranteed to pass
            automated screening.
          </p>
        </div>

        <TemplateGallery categories={categories} templates={templates} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200 dark:border-[#27272a] py-8 mt-auto z-10 bg-white dark:bg-[#09090b]">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-500 dark:text-[#a1a1aa]">
          <div>© {new Date().getFullYear()} ToolMate Resume.</div>
          <div className="flex gap-6">
            <Link
              href="/builder"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Resume Builder
            </Link>
            <Link
              href="/templates"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/interview-prep"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Interview Prep
            </Link>
            <Link
              href="/privacy"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <a
              href="https://toolmate.co.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ToolMate Tools
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
