"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  HelpCircle,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  EyeOff,
  Plus,
  X,
  FileText,
  BookOpen,
  ArrowRight,
  Loader2,
  Filter,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/useResumeStore";
import {
  generateInterviewQuestionsForSkills,
  CURATED_SKILL_QUESTIONS,
  type InterviewQuestion,
} from "@/lib/interviewPrep";
import { toast } from "sonner";

const QUICK_SKILL_SUGGESTIONS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Python",
  "System Design",
  "Docker",
  "GraphQL",
  "Redis",
  "AWS",
  "Tailwind CSS",
];

const ROLES = [
  "Full-Stack Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "DevOps & Cloud Engineer",
  "Engineering Lead / Architect",
  "Data Scientist / ML Engineer",
];

export default function InterviewPrepPage() {
  const resumeData = useResumeStore((state) => state.data);

  // Configuration state
  const [skills, setSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "Next.js",
    "System Design",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [role, setRole] = useState("Full-Stack Software Engineer");
  const [difficulty, setDifficulty] = useState<
    "Junior" | "Mid-Level" | "Senior" | "Staff / Lead"
  >("Senior");

  // Output questions state
  const initialQuestions = [
    ...CURATED_SKILL_QUESTIONS.react,
    ...CURATED_SKILL_QUESTIONS.typescript,
    ...CURATED_SKILL_QUESTIONS.system_design,
    ...CURATED_SKILL_QUESTIONS.behavioral,
  ];
  const [questions, setQuestions] =
    useState<InterviewQuestion[]>(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>(
    initialQuestions[0]?.id || null,
  );
  const [isPending, startTransition] = useTransition();

  // Study Mode & Filters
  const [testYourselfMode, setTestYourselfMode] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<string, boolean>
  >({});
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleImportFromResume = () => {
    if (!resumeData) return;
    const resumeSkills = resumeData.skills.map((s) => s.name);
    if (resumeSkills.length === 0) {
      toast.error(
        "No skills found in active resume. Add skills in the builder first!",
      );
      return;
    }

    const merged = Array.from(new Set([...skills, ...resumeSkills]));
    setSkills(merged);
    if (resumeData.personalInfo.title) {
      setRole(resumeData.personalInfo.title);
    }
    toast.success(
      `Imported ${resumeSkills.length} skills & target role from your resume!`,
    );
  };

  const handleGenerate = () => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill or technology.");
      return;
    }

    startTransition(async () => {
      try {
        const results = await generateInterviewQuestionsForSkills(
          skills,
          role,
          difficulty,
        );
        setQuestions(results);
        if (results.length > 0) {
          setExpandedId(results[0].id);
        }
        setRevealedAnswers({});
        toast.success(
          `Generated ${results.length} targeted questions with answers & code!`,
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to generate questions. Showing curated fallback.");
      }
    });
  };

  const toggleAnswerReveal = (id: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllQnA = () => {
    const formatted = filteredQuestions
      .map((q, idx) => {
        let content = `### Question ${idx + 1}: ${q.question} (${q.topic} - ${q.difficulty})\n\n`;
        content += `**Context:** ${q.context}\n\n`;
        content += `**Model Answer:**\n${q.fullAnswer}\n\n`;
        if (q.codeSnippet) {
          content += `\`\`\`${q.codeSnippet.language}\n${q.codeSnippet.code}\n\`\`\`\n`;
          content += `*Explanation:* ${q.codeSnippet.explanation}\n\n`;
        }
        return content;
      })
      .join("\n---\n\n");

    navigator.clipboard.writeText(formatted);
    toast.success("Copied all questions and answers as Markdown!");
  };

  // Filtered list
  const filteredQuestions = questions.filter((q) => {
    const matchesCategory =
      categoryFilter === "all" || q.category === categoryFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.fullAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {/* SKILLS INPUT & CONFIGURATION CARD */}
        <section className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-600" />
                Configure Skills & Role
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Add the technologies you want to prepare for or import your
                resume stack.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportFromResume}
              className="text-xs font-semibold gap-1.5 border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Import from Resume</span>
            </Button>
          </div>

          {/* Role & Seniority Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Seniority / Difficulty
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a]">
                {(
                  ["Junior", "Mid-Level", "Senior", "Staff / Lead"] as const
                ).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-colors text-center ${
                      difficulty === lvl
                        ? "bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                    }`}
                  >
                    {lvl.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Active Skills to Test ({skills.length})
            </label>

            {/* Chips Box */}
            <div className="flex flex-wrap gap-2 p-3 min-h-[52px] rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b]">
              {skills.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-2xs group"
                >
                  <span>{s}</span>
                  <button
                    onClick={() => handleRemoveSkill(s)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {skills.length === 0 && (
                <span className="text-xs text-zinc-400 self-center">
                  No skills entered. Type below or pick suggestions.
                </span>
              )}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSkill(skillInput);
              }}
              className="flex gap-2"
            >
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill or technology and press Enter (e.g. Next.js, Redis, PyTorch)..."
                className="text-xs bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-[#27272a] rounded-xl focus-visible:ring-purple-500"
              />
              <Button
                type="submit"
                variant="outline"
                className="shrink-0 text-xs font-semibold rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </form>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-400 font-medium">
                Quick Add:
              </span>
              {QUICK_SKILL_SUGGESTIONS.map((sug) => {
                const isSelected = skills.includes(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() =>
                      isSelected ? handleRemoveSkill(sug) : handleAddSkill(sug)
                    }
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 font-medium"
                        : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-purple-400"
                    }`}
                  >
                    {isSelected ? `✓ ${sug}` : `+ ${sug}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isPending || skills.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-600/20 text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Formulating Questions, Answers & Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Generate Interview Questions & Answers ({skills.length}{" "}
                    Skills)
                  </span>
                </>
              )}
            </Button>
          </div>
        </section>

        {/* QUESTIONS HEADER & CONTROLS */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Interview Questions & Solutions
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {filteredQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Test Yourself Mode Toggle */}
              <button
                onClick={() => setTestYourselfMode(!testYourselfMode)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  testYourselfMode
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
                title="Hides model answers by default so you can practice speaking first"
              >
                {testYourselfMode ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Test Yourself: ON</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Practice Mode</span>
                  </>
                )}
              </button>

              {/* Copy All Notes */}
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllQnA}
                className="text-xs font-semibold rounded-xl gap-1.5"
                title="Copy all visible questions and answers to clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Export Notes</span>
              </Button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-[#111113] p-3 rounded-2xl border border-zinc-200 dark:border-[#27272a]">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, topics, or technologies..."
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-zinc-400 ml-1 mr-1 shrink-0 hidden sm:block" />
              {[
                { id: "all", label: "All" },
                { id: "technical", label: "Technical & Coding" },
                { id: "system-design", label: "System Design" },
                { id: "behavioral", label: "Behavioral (STAR)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    categoryFilter === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedId === q.id;
              const isAnswerRevealed =
                !testYourselfMode || !!revealedAnswers[q.id];

              return (
                <article
                  key={q.id || idx}
                  className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] rounded-2xl overflow-hidden shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  {/* Question Header Accordion Trigger */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-[#18181b]/50 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            q.category === "technical"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : q.category === "system-design"
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {q.category === "system-design"
                            ? "System Design"
                            : q.category}
                        </span>

                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {q.topic}
                        </span>

                        <span className="text-[10px] text-zinc-400 font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                          {q.difficulty}
                        </span>

                        <span className="text-xs text-zinc-400 ml-auto font-mono">
                          #{idx + 1}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <div className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-5 animate-in fade-in duration-200">
                      {/* Context / Interviewer Intent */}
                      {q.context && (
                        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          💡 <strong>Interviewer Intent:</strong> {q.context}
                        </div>
                      )}

                      {/* Test Yourself Mode Curtain */}
                      {testYourselfMode && !isAnswerRevealed ? (
                        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 space-y-3">
                          <EyeOff className="w-8 h-8 text-amber-500 mx-auto" />
                          <h5 className="font-bold text-sm text-zinc-900 dark:text-white">
                            Practice Mode Active
                          </h5>
                          <p className="text-xs text-zinc-500 max-w-md mx-auto">
                            Practice articulating your answer out loud or
                            drafting your technical solution first before
                            comparing against the model answer.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => toggleAnswerReveal(q.id)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Reveal Model Answer & Code
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Comprehensive Model Answer */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4" />
                                Model Answer & In-Depth Explanation
                              </label>
                              <button
                                onClick={() =>
                                  copyToClipboard(q.fullAnswer, `ans-${q.id}`)
                                }
                                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                              >
                                {copiedId === `ans-${q.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Answer</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                              {q.fullAnswer}
                            </div>
                          </div>

                          {/* Code Walkthrough Block (if available) */}
                          {q.codeSnippet && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                                  <Code2 className="w-4 h-4" />
                                  Code Implementation & Example (
                                  {q.codeSnippet.language})
                                </label>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      q.codeSnippet!.code,
                                      `code-${q.id}`,
                                    )
                                  }
                                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                                >
                                  {copiedId === `code-${q.id}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>Copied Code</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Code</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d1117] text-zinc-100 shadow-md">
                                <div className="px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                                  <span>{q.codeSnippet.language}</span>
                                  <span className="text-[10px] text-zinc-500">
                                    production pattern
                                  </span>
                                </div>
                                <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed">
                                  <code>{q.codeSnippet.code}</code>
                                </pre>
                                {q.codeSnippet.explanation && (
                                  <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 text-xs text-zinc-400">
                                    💡 <strong>Solution Walkthrough:</strong>{" "}
                                    {q.codeSnippet.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Key Takeaways / STAR Highlight points */}
                          {q.suggestedAnswerPoints &&
                            q.suggestedAnswerPoints.length > 0 && (
                              <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                  Key Takeaways & Interview Points
                                </label>
                                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                                  {q.suggestedAnswerPoints.map((pt, pIndex) => (
                                    <li
                                      key={pIndex}
                                      className="flex items-start gap-2 leading-relaxed"
                                    >
                                      <span className="text-purple-500 font-bold">
                                        •
                                      </span>
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {testYourselfMode && (
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => toggleAnswerReveal(q.id)}
                                className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                Hide Answer
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-[#111113] rounded-2xl border border-zinc-200 dark:border-[#27272a] space-y-3">
                <HelpCircle className="w-10 h-10 text-zinc-400 mx-auto" />
                <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                  No questions match your filter
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try clearing the search query or switching the category filter
                  above.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter("all");
                    setSearchQuery("");
                  }}
                  className="rounded-xl text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>

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
