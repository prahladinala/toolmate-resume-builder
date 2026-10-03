"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/useResumeStore";
import type { ResumeTemplate, ResumeData } from "@/types/resume";
import { TemplateEngine } from "@/components/builder/TemplateEngine";

const dummyData: ResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Software Engineer",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  },
  summary:
    "Senior Software Engineer with 8+ years of experience architecting scalable backend systems and responsive web applications. Proven leadership in guiding cross-functional teams, reducing technical debt, and improving deployment pipelines. Passionate about clean code, developer experience, and delivering measurable business impact.",
  experience: [
    {
      id: "1",
      company: "Tech Innovations Inc.",
      role: "Lead Frontend Engineer",
      startDate: "Jan 2021",
      endDate: "Present",
      current: true,
      description:
        "- Architected and successfully migrated a monolithic React application to Next.js App Router, resulting in a **45% increase** in Lighthouse performance scores and faster SEO indexing.\n- Mentored a team of 6 junior and mid-level developers, establishing weekly coding dojos and strict PR review guidelines.\n- Spearheaded the adoption of Tailwind CSS and a custom design system, reducing design-to-code time by 30%.",
    },
    {
      id: "2",
      company: "Global Software Corp",
      role: "Full Stack Developer",
      startDate: "Mar 2017",
      endDate: "Dec 2020",
      current: false,
      description:
        "- Developed microservices using Node.js and Express, handling over **2M API requests daily** with 99.9% uptime.\n- Implemented Redis caching layers that decreased average database query times by 60%.\n- Collaborated directly with product managers to scope, design, and deliver 4 major feature releases ahead of schedule.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "State University",
      degree: "M.S. Computer Science",
      startDate: "2015",
      endDate: "2017",
      current: false,
      score: "3.9 GPA",
    },
    {
      id: "2",
      institution: "State University",
      degree: "B.S. Software Engineering",
      startDate: "2011",
      endDate: "2015",
      current: false,
      score: "3.8 GPA",
    },
  ],
  projects: [
    {
      id: "1",
      name: "OpenSource UI Library",
      description:
        "A highly accessible React component library focusing on keyboard navigation and ARIA patterns, used by over 500 production apps.",
      technologies: ["React", "TypeScript", "Tailwind", "Radix UI"],
    },
    {
      id: "2",
      name: "Serverless Analytics Dashboard",
      description:
        "Real-time analytics processing pipeline built on AWS Lambda and DynamoDB, processing millions of events.",
      technologies: ["AWS", "Node.js", "Next.js"],
    },
  ],
  skills: [
    { id: "1", name: "JavaScript / TypeScript", category: "languages" },
    { id: "2", name: "Python, Go", category: "languages" },
    { id: "3", name: "React / Next.js", category: "frameworks" },
    { id: "4", name: "Node.js / Express", category: "frameworks" },
    { id: "5", name: "PostgreSQL, Redis", category: "tools" },
    { id: "6", name: "AWS, Docker, CI/CD", category: "tools" },
  ],
  customSections: [],
};

interface TemplateGalleryProps {
  categories: { id: string; label: string }[];
  templates: {
    id: string;
    name: string;
    category: string;
    ats: number;
    color: string;
  }[];
}

export function TemplateGallery({
  categories,
  templates,
}: TemplateGalleryProps) {
  const router = useRouter();
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (templateId: string) => {
    setTemplate(templateId as ResumeTemplate);
    router.push("/builder");
  };

  return (
    <Tabs defaultValue="developers" className="w-full relative z-10">
      <div className="flex justify-center mb-12">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#111113] border border-[#27272a] rounded-full p-1 h-12">
          {categories.map((c) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className="rounded-full text-xs font-medium data-[state=active]:bg-[#27272a] data-[state=active]:text-[#fafafa] text-[#a1a1aa]"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {categories.map((category) => (
        <TabsContent
          key={category.id}
          value={category.id}
          className="mt-0 outline-none"
        >
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {templates
              .filter((t) => t.category === category.id)
              .map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-[90vw] h-[75vh] md:h-auto md:w-auto shrink-0 snap-center group relative rounded-[24px] border border-[#27272a] bg-[#111113] overflow-hidden hover:border-[#3f3f46] transition-all duration-300 flex flex-col cursor-pointer"
                  onMouseEnter={() => setHoveredId(template.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    if (window.innerWidth < 768) handleSelect(template.id);
                  }}
                >
                  <div className="flex-1 md:aspect-[210/297] md:h-auto w-full bg-white flex items-center justify-center relative border-b border-[#27272a] @container">
                    {/* Real Template Preview Scaled Down */}
                    <div className="absolute inset-0 overflow-hidden bg-white pointer-events-none select-none flex items-center justify-center">
                      <div
                        className="w-[794px] h-[1123px] bg-white origin-center"
                        style={{
                          transform:
                            "scale(calc(min(100cqw / 794, 100cqh / 1123)))",
                        }}
                      >
                        <TemplateEngine
                          data={dummyData}
                          templateId={template.id}
                        />
                      </div>
                    </div>

                    {/* Hover Overlay (Desktop Only) */}
                    <div className="hidden md:flex">
                      {hoveredId === template.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center p-6"
                        >
                          <Button
                            size="lg"
                            className="w-full rounded-full bg-[#fafafa] text-[#09090b] hover:bg-[#e4e4e7] h-12 font-semibold cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(template.id);
                            }}
                          >
                            Select Template
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex justify-between items-center bg-[#111113] flex-1">
                    <div>
                      <h2 className="font-semibold text-sm md:text-base text-[#fafafa]">
                        {template.name}
                      </h2>
                      <p className="text-[10px] md:text-xs text-[#a1a1aa] capitalize mt-0.5 md:mt-1">
                        {template.category}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
                        ATS: {template.ats}%
                      </span>
                      <Button
                        size="sm"
                        className="md:hidden h-8 rounded-full bg-emerald-500 text-white font-semibold w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(template.id);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
