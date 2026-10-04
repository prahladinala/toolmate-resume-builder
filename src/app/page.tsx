"use client";

import { useState } from "react";
import { ArrowRight, Shield, FileText, Zap, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroAnimatedText } from "@/components/HeroAnimatedText";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ResumeBuilder",
    operatingSystem: "Any",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Build a beautiful, ATS-compatible resume in minutes. A premium, developer-focused resume builder with local privacy and real-time PDF generation.",
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-900 dark:text-[#fafafa] selection:bg-[#a855f7]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            className="hover:text-muted-foreground transition-colors hidden sm:block"
          >
            Templates
          </Link>
          <Link
            href="/builder"
            className="hover:text-muted-foreground transition-colors hidden sm:block"
          >
            Builder
          </Link>
          <Link
            href="/contact"
            target="_blank"
            className="hover:text-muted-foreground transition-colors hidden sm:block"
          >
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Ultra Modern Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 overflow-hidden">
          {/* Subtle Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#a855f7]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b]/80 backdrop-blur-sm text-xs font-medium mb-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-both">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              All your career tools in one place
            </div>

            {/* Massive Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-[85px] font-bold tracking-tight leading-[1.1] mb-8">
              Hi, I&apos;m ResumeBuilder
              <br />
              <HeroAnimatedText />
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
              Format, convert, generate, and inspect — with a minimal UI,
              mobile-first design, and lightning-fast performance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto px-4">
              <Link href="/builder" className="w-full sm:w-auto cursor-pointer">
                <button className="h-12 px-8 w-full rounded-full bg-slate-900 dark:bg-[#fafafa] text-white dark:text-[#09090b] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#e4e4e7] transition-colors cursor-pointer">
                  Start Building <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto cursor-pointer"
              >
                <button className="h-12 px-8 w-full rounded-full bg-transparent border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] text-slate-900 dark:text-zinc-900 dark:text-[#fafafa] font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:bg-[#27272a] transition-colors cursor-pointer">
                  Try Resume Templates <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* ToolMate Interlink */}
            <a
              href="https://toolmate.co.in"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-50 dark:bg-zinc-50 dark:bg-[#111113] border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] hover:border-[#a855f7]/50 hover:bg-slate-200 dark:bg-[#27272a]/30 transition-all mb-20"
            >
              <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
              <span className="text-sm font-medium text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:text-zinc-900 dark:text-[#fafafa] transition-colors">
                Discover more developer tools at{" "}
                <strong className="text-white">ToolMate.co.in</strong>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:text-zinc-900 dark:text-[#fafafa] transition-colors group-hover:translate-x-1" />
            </a>

            {/* Bottom Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {["Mobile-first", "Accessible", "Local-first", "SEO-ready"].map(
                (badge) => (
                  <div
                    key={badge}
                    className="px-5 py-2 rounded-full border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] text-xs font-medium text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa]"
                  >
                    {badge}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Minimal Features Strip (matching aesthetic) */}
        <section className="border-t border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b]">
          <div className="container mx-auto px-4 py-24 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "ATS Optimized",
                  desc: "Pass ATS scanners easily with pure semantic HTML extraction.",
                },
                {
                  icon: Zap,
                  title: "Live Preview",
                  desc: "See changes instantly as you type. No loading screens.",
                },
                {
                  icon: FileText,
                  title: "PDF Export",
                  desc: "Download high-quality PDFs locally in your browser.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b]/50 hover:bg-slate-200 dark:bg-[#27272a]/20 transition-colors"
                >
                  <feature.icon className="h-6 w-6 text-[#a855f7] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="border-t border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-32 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Built for speed.
              </h2>
              <p className="text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] text-lg max-w-2xl mx-auto">
                Go from a blank screen to a perfectly formatted, ATS-ready PDF
                in three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-slate-200 dark:bg-[#27272a]" />

              {[
                {
                  step: "01",
                  title: "Select a Template",
                  desc: "Choose from our curated collection of professional, developer-focused designs.",
                },
                {
                  step: "02",
                  title: "Input Your Data",
                  desc: "Fill in your experience through a seamless, distraction-free interface.",
                },
                {
                  step: "03",
                  title: "Export to PDF",
                  desc: "Download your pixel-perfect resume instantly. No watermarks, no paywalls.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-[#09090b] border-2 border-slate-200 dark:border-zinc-200 dark:border-[#27272a] flex items-center justify-center text-slate-900 dark:text-zinc-900 dark:text-[#fafafa] font-bold text-lg mb-8 group-hover:border-[#a855f7] transition-colors relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-zinc-900 dark:text-[#fafafa]">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] leading-relaxed text-sm md:text-base">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Developer Section */}
        <section className="border-t border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-24 px-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b]/80 backdrop-blur-sm text-xs font-medium mb-12">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Meet the Developer
          </div>

          <div className="w-full max-w-4xl rounded-[32px] bg-slate-50 dark:bg-zinc-50 dark:bg-[#111113] border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row justify-between gap-12">
            {/* Subtle glow inside card */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6 md:max-w-[60%]">
              <div className="flex flex-col gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://github.com/prahladinala.png"
                  alt="Prahlad Inala"
                  className="w-16 h-16 rounded-full bg-slate-200 dark:bg-[#27272a] object-cover"
                />
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-1">
                    Creator
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-zinc-900 dark:text-[#fafafa]">
                    Prahlad Inala
                  </h3>
                </div>
              </div>

              <p className="text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] leading-relaxed mt-2 text-sm md:text-base">
                Full-stack developer building ResumeBuilder and helpful browser
                tools.
              </p>

              <div className="flex flex-wrap gap-4 md:gap-6 mt-auto pt-6 text-xs font-medium text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa]">
                <span>Next.js</span>
                <span>TypeScript</span>
                <span>Tailwind CSS</span>
                <span>Zustand</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-6 md:w-48 shrink-0 md:pt-4">
              <div className="text-[10px] font-bold tracking-widest text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] uppercase">
                Connect
              </div>
              <div className="flex flex-col gap-5 text-sm font-medium text-slate-900 dark:text-zinc-900 dark:text-[#fafafa]">
                <a
                  href="https://github.com/prahladinala"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors w-fit"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/prahladinala"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors w-fit"
                >
                  LinkedIn
                </a>
                <a
                  href="https://x.com/prahladinala"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors w-fit"
                >
                  X
                </a>
                <a
                  href="https://prahladinala.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors w-fit"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] py-32 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Is this completely free?",
                  a: "Yes. There are no premium tiers, hidden fees, or watermarks. It is 100% free forever.",
                },
                {
                  q: "Do I need to create an account?",
                  a: "No. We believe in zero friction. You don't need an account to build or download your resume.",
                },
                {
                  q: "Where is my data stored?",
                  a: "Everything is stored locally in your browser's LocalStorage. Your personal data never touches our servers, ensuring complete privacy.",
                },
                {
                  q: "Are the templates ATS-friendly?",
                  a: "Absolutely. Our templates are constructed using semantic HTML to ensure applicant tracking systems can easily parse your text.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="group border border-slate-200 dark:border-zinc-200 dark:border-[#27272a] bg-slate-50 dark:bg-zinc-50 dark:bg-[#111113]/50 rounded-2xl overflow-hidden hover:bg-slate-50 dark:bg-zinc-50 dark:bg-[#111113] transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-900 dark:text-[#fafafa]">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${activeFaq === i ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden px-6">
                      <p className="text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa] leading-relaxed text-sm md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-200 dark:border-[#27272a] py-8">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-zinc-500 dark:text-[#a1a1aa]">
          <div>© {new Date().getFullYear()} ResumeBuilder.</div>
          <div className="flex gap-6">
            <Link
              href="/builder"
              className="hover:text-white transition-colors"
            >
              Builder
            </Link>
            <Link
              href="/templates"
              className="hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/contact"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
