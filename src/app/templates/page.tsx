"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/store/useResumeStore';
import { ResumeTemplate, ResumeData } from '@/types/resume';
import { TemplateEngine } from '@/components/builder/TemplateEngine';

const dummyData: ResumeData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe'
  },
  summary: 'Experienced Software Engineer with a passion for building scalable web applications and elegant user interfaces. Proven track record in leading teams and delivering high-impact products.',
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Senior Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      current: true,
      description: 'Led frontend architecture, reduced load times by 40%, and mentored junior engineers.'
    },
    {
      id: '2',
      company: 'Startup Inc',
      role: 'Full Stack Dev',
      startDate: 'Mar 2017',
      endDate: 'Dec 2019',
      current: false,
      description: 'Built core features using React and Node.js. Scaled user base from 0 to 100k.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'State University',
      degree: 'B.S. Computer Science',
      startDate: 'Aug 2013',
      endDate: 'May 2017',
      current: false,
      score: '3.8 GPA'
    }
  ],
  projects: [],
  skills: [],
  customSections: []
};

const categories = [
  { id: 'developers', label: 'Developers' },
  { id: 'designers', label: 'Designers' },
  { id: 'corporate', label: 'Corporate' }
];

const templates = [
  // Developers (Focus on Mono, clean split layouts)
  { id: 'dev-1', name: 'Minimal Mono', category: 'developers', ats: 98, color: 'bg-zinc-900' },
  { id: 'dev-2', name: 'Modern Split', category: 'developers', ats: 95, color: 'bg-blue-600' },
  { id: 'dev-3', name: 'Code Block', category: 'developers', ats: 99, color: 'bg-emerald-600' },
  { id: 'dev-4', name: 'Terminal Pro', category: 'developers', ats: 94, color: 'bg-indigo-500' },

  // Designers (Focus on bold headers, masonry/asymmetric, vibrant colors)
  { id: 'des-1', name: 'Bold Header', category: 'designers', ats: 85, color: 'bg-pink-500' },
  { id: 'des-2', name: 'Creative Sidebar', category: 'designers', ats: 88, color: 'bg-purple-600' },
  { id: 'des-3', name: 'Asymmetric Split', category: 'designers', ats: 82, color: 'bg-orange-500' },
  { id: 'des-4', name: 'Studio Minimal', category: 'designers', ats: 90, color: 'bg-rose-500' },

  // Corporate (Focus on Serif, traditional layouts, subtle colors)
  { id: 'corp-1', name: 'Executive Serif', category: 'corporate', ats: 99, color: 'bg-slate-800' },
  { id: 'corp-2', name: 'Classic Finance', category: 'corporate', ats: 100, color: 'bg-gray-900' },
  { id: 'corp-3', name: 'Management Right', category: 'corporate', ats: 97, color: 'bg-stone-700' },
  { id: 'corp-4', name: 'Director Clean', category: 'corporate', ats: 98, color: 'bg-neutral-800' },

  // Non-IT / General (Focus on clean Sans, versatile layouts)
  { id: 'gen-1', name: 'Standard Professional', category: 'non-it', ats: 96, color: 'bg-teal-600' },
  { id: 'gen-2', name: 'Modern General', category: 'non-it', ats: 95, color: 'bg-sky-600' },
  { id: 'gen-3', name: 'Entry Level', category: 'non-it', ats: 99, color: 'bg-amber-600' },
  { id: 'gen-4', name: 'Creative General', category: 'non-it', ats: 92, color: 'bg-red-500' },
];

export default function TemplatesPage() {
  const router = useRouter();
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (templateId: string) => {
    setTemplate(templateId as ResumeTemplate);
    router.push('/builder');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Choose Your Resume Template</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            All templates are expertly designed, ATS-friendly, and fully customizable.
          </p>
        </div>

        <Tabs defaultValue="developers" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              {categories.map(c => (
                <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.filter(t => t.category === category.id).map((template, i) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative rounded-2xl border bg-background overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    onMouseEnter={() => setHoveredId(template.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="aspect-[1/1.4] w-full bg-muted flex items-center justify-center p-8 relative">
                      {/* Real Template Preview Scaled Down */}
                      <div className="absolute inset-0 overflow-hidden bg-white pointer-events-none select-none @container">
                        <div 
                          className="w-[794px] h-[1123px] origin-top-left"
                          style={{ transform: 'scale(calc(100cqw / 794))' }}
                        >
                          <TemplateEngine data={dummyData} templateId={template.id} />
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      {hoveredId === template.id && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
                        >
                          <Button size="lg" className="w-full rounded-full" onClick={() => handleSelect(template.id)}>
                            Use Template
                          </Button>
                        </motion.div>
                      )}
                    </div>
                    <div className="p-5 flex justify-between items-center border-t">
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          ATS: {template.ats}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
