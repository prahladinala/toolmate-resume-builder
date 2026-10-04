"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
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
  ];

  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="group border border-slate-200 dark:border-[#27272a] bg-slate-50 dark:bg-[#111113]/50 rounded-2xl overflow-hidden hover:bg-slate-50 dark:hover:bg-[#111113] transition-colors"
        >
          <button
            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-[#fafafa]">
              {faq.q}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-slate-600 dark:text-[#a1a1aa] transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${activeFaq === i ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="overflow-hidden px-6">
              <p className="text-slate-600 dark:text-[#a1a1aa] leading-relaxed text-sm md:text-base">
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
