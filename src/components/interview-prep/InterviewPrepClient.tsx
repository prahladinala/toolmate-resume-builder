"use client";

import { useState, useTransition } from "react";
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
  Loader2,
  Filter,
} from "lucide-react";
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

export function InterviewPrepClient() {
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
    <>
      {/* SKILLS INPUT & CONFIGURATION CARD */}
      <section className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-600" />
              Configure Skills & Role
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Add the technologies you want to prepare for or import your resume
              stack.
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
              {(["Junior", "Mid-Level", "Senior", "Staff / Lead"] as const).map(
                (lvl) => (
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
                ),
              )}
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
              placeholder="e.g. Kubernetes, Redis, GraphQL, Clean Architecture..."
              className="text-xs rounded-xl border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b]"
            />
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              className="rounded-xl text-xs px-4 shrink-0 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </form>

          {/* Quick Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SKILL_SUGGESTIONS.map((skill) => {
                const isSelected = skills.some(
                  (s) => s.toLowerCase() === skill.toLowerCase(),
                );
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      isSelected
                        ? handleRemoveSkill(skill)
                        : handleAddSkill(skill)
                    }
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-purple-100 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                        : "bg-zinc-100/80 dark:bg-[#18181b] border-transparent text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleGenerate}
            disabled={isPending || skills.length === 0}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md transition-all gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Targeted Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Questions for {skills.length} Skills</span>
              </>
            )}
          </Button>
        </div>
      </section>

      {/* QUESTIONS LIST & STUDY ACCORDION */}
      <section className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111113] p-4 rounded-2xl border border-zinc-200 dark:border-[#27272a] shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400 text-xs font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {(
              [
                { id: "all", label: "All" },
                { id: "technical", label: "Deep-Dive" },
                { id: "system-design", label: "System Design" },
                { id: "behavioral", label: "Behavioral" },
                { id: "debugging", label: "Architecture" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  categoryFilter === cat.id
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-[#18181b] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Study Mode */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 w-44 sm:w-56"
              />
            </div>

            {/* Test Yourself Toggle */}
            <button
              onClick={() => {
                const nextMode = !testYourselfMode;
                setTestYourselfMode(nextMode);
                if (nextMode) {
                  setRevealedAnswers({});
                }
              }}
              title="Test Yourself hides answers until revealed"
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                testYourselfMode
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                  : "bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-[#27272a] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {testYourselfMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flashcard Mode ON</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flashcard Mode</span>
                </>
              )}
            </button>

            {/* Copy All */}
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllQnA}
              className="rounded-xl text-xs gap-1 border-zinc-200 dark:border-[#27272a]"
              title="Copy questions & answers as Markdown"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export MD</span>
            </Button>
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;

            return (
              <article
                key={q.id}
                className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                        Q{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-[#18181b] text-zinc-600 dark:text-zinc-400">
                        {q.topic}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          q.difficulty === "Senior" ||
                          q.difficulty === "Staff / Lead"
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                        {q.category}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${q.question}\n\n${q.fullAnswer}`,
                          q.id,
                        );
                      }}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#18181b] hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                      title="Copy question & answer"
                    >
                      {copiedId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <div className="p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-4 text-xs sm:text-sm">
                    {/* Context / Why they ask */}
                    <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-purple-900 dark:text-purple-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        Why Interviewers Ask This:
                      </span>
                      <p className="text-xs leading-relaxed text-purple-800 dark:text-purple-300/90">
                        {q.context}
                      </p>
                    </div>

                    {/* Answer Reveal Gate in Test Yourself Mode */}
                    {testYourselfMode && !revealedAnswers[q.id] ? (
                      <div className="p-6 rounded-xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10 text-center space-y-2">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                          Flashcard Mode Active: Think through your answer
                          first!
                        </p>
                        <Button
                          size="sm"
                          onClick={() => toggleAnswerReveal(q.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Reveal Model Answer</span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Model Answer */}
                        <div className="space-y-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-zinc-500">
                            Verified Model Answer:
                          </span>
                          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200/80 dark:border-zinc-800 font-normal leading-relaxed whitespace-pre-line text-zinc-800 dark:text-zinc-200">
                            {q.fullAnswer}
                          </div>
                        </div>

                        {/* Code Snippet (if available) */}
                        {q.codeSnippet && (
                          <div className="space-y-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-purple-500" />
                              Executable Reference ({q.codeSnippet.language}):
                            </span>
                            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#09090b]">
                              <div className="px-4 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 flex justify-between items-center">
                                <span>{q.codeSnippet.language}</span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      q.codeSnippet!.code,
                                      `${q.id}-code`,
                                    )
                                  }
                                  className="hover:text-white transition-colors"
                                >
                                  {copiedId === `${q.id}-code`
                                    ? "Copied!"
                                    : "Copy Code"}
                                </button>
                              </div>
                              <pre className="p-4 text-xs font-mono text-zinc-100 overflow-x-auto leading-relaxed">
                                <code>{q.codeSnippet.code}</code>
                              </pre>
                              <div className="p-3 bg-zinc-900/60 border-t border-zinc-800 text-xs text-zinc-400">
                                <span className="font-semibold text-zinc-300">
                                  Explanation:{" "}
                                </span>
                                {q.codeSnippet.explanation}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Key Talking Points */}
                        {q.suggestedAnswerPoints &&
                          q.suggestedAnswerPoints.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="font-bold text-xs uppercase tracking-wider text-zinc-500">
                                Essential Talking Points:
                              </span>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.suggestedAnswerPoints.map((pt, i) => (
                                  <li
                                    key={i}
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
    </>
  );
}
