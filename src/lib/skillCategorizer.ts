/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skill } from "@/types/resume";

const CATEGORY_MAP: Record<string, string[]> = {
  Languages: [
    "typescript",
    "javascript",
    "python",
    "java",
    "go",
    "golang",
    "c++",
    "c#",
    "c",
    "ruby",
    "rust",
    "php",
    "swift",
    "kotlin",
    "sql",
    "html",
    "css",
    "bash",
    "shell",
    "dart",
    "scala",
    "r",
    "perl",
    "matlab",
  ],
  "Frameworks & Libraries": [
    "react",
    "next.js",
    "nextjs",
    "vue",
    "vue.js",
    "angular",
    "svelte",
    "node.js",
    "nodejs",
    "express",
    "nestjs",
    "django",
    "flask",
    "fastapi",
    "spring",
    "spring boot",
    "asp.net",
    ".net",
    "laravel",
    "rails",
    "tailwind css",
    "tailwind",
    "bootstrap",
    "redux",
    "zustand",
    "graphql",
    "trpc",
    "pytorch",
    "tensorflow",
  ],
  "Cloud & DevOps": [
    "docker",
    "kubernetes",
    "k8s",
    "aws",
    "amazon web services",
    "gcp",
    "google cloud",
    "azure",
    "terraform",
    "ci/cd",
    "github actions",
    "jenkins",
    "gitlab ci",
    "ansible",
    "helm",
    "linux",
    "nginx",
    "prometheus",
    "grafana",
    "serverless",
    "cloudflare",
    "datadog",
  ],
  "Databases & Tools": [
    "postgresql",
    "postgres",
    "mongodb",
    "mysql",
    "redis",
    "elasticsearch",
    "sqlite",
    "cassandra",
    "dynamodb",
    "supabase",
    "prisma",
    "firebase",
    "kafka",
    "rabbitmq",
    "git",
    "github",
    "jira",
    "figma",
    "postman",
    "vite",
    "webpack",
    "jest",
    "cypress",
    "playwright",
  ],
};

export function classifySkillHeuristic(skillName: string): string {
  const lower = skillName.trim().toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some((kw) => lower === kw || lower.includes(kw))) {
      return category;
    }
  }

  return "Core Skills";
}

/**
 * Categorizes a list of skills using Gemini Nano or local taxonomy fallback.
 */
export async function categorizeSkillsList(skills: Skill[]): Promise<Skill[]> {
  if (!skills.length) return [];

  // Try Gemini Nano
  try {
    const ai =
      typeof window !== "undefined"
        ? (window as any).ai || (window as any).model
        : null;

    if (ai?.languageModel) {
      const session = await ai.languageModel.create({
        systemPrompt:
          "You are an ATS skills categorizer. Group skills into: Languages, Frameworks & Libraries, Cloud & DevOps, Databases & Tools. Output JSON map with skill names as keys and category names as values.",
      });

      const skillNames = skills.map((s) => s.name).join(", ");
      const prompt = `Categorize these skills into JSON key-values: ${skillNames}`;
      const response = await session.prompt(prompt);
      session.destroy?.();

      const cleaned = response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed: Record<string, string> = JSON.parse(cleaned);

      return skills.map((skill) => {
        const matchingKey = Object.keys(parsed).find(
          (k) => k.toLowerCase() === skill.name.toLowerCase(),
        );
        return {
          ...skill,
          category: matchingKey
            ? parsed[matchingKey]
            : classifySkillHeuristic(skill.name),
        };
      });
    }
  } catch (err) {
    console.warn(
      "Gemini skill categorizer unavailable, using rule-based taxonomy:",
      err,
    );
  }

  // Fallback Rule-based Taxonomy
  return skills.map((skill) => ({
    ...skill,
    category: classifySkillHeuristic(skill.name),
  }));
}
