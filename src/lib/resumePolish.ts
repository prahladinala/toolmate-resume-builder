import { ResumeData } from "@/types/resume";

const TECH_STANDARDIZATION_RULES: [RegExp, string][] = [
  [/\bjavascript\b/gi, "JavaScript"],
  [/\btypescript\b/gi, "TypeScript"],
  [/\bpostgres\b/gi, "PostgreSQL"],
  [/\bpostgresql\b/gi, "PostgreSQL"],
  [/\breact\.?js\b/gi, "React"],
  [/\breact\b/gi, "React"],
  [/\bnext\.?js\b/gi, "Next.js"],
  [/\bnode\.?js\b/gi, "Node.js"],
  [/\bvue\.?js\b/gi, "Vue.js"],
  [/\bangular\.?js\b/gi, "Angular"],
  [/\baws\b/gi, "AWS"],
  [/\bgcp\b/gi, "GCP"],
  [/\bdocker\b/gi, "Docker"],
  [/\bkubernetes\b/gi, "Kubernetes"],
  [/\bk8s\b/gi, "Kubernetes"],
  [/\bmongodb\b/gi, "MongoDB"],
  [/\bgraphql\b/gi, "GraphQL"],
  [/\bhtml5?\b/gi, "HTML5"],
  [/\bcss3?\b/gi, "CSS3"],
  [/\brest\s*apis?\b/gi, "RESTful APIs"],
  [/\brestful\s*apis?\b/gi, "RESTful APIs"],
  [/\bci\s*\/\s*cd\b/gi, "CI/CD"],
  [/\bcicd\b/gi, "CI/CD"],
  [/\bsql\b/gi, "SQL"],
  [/\bnosql\b/gi, "NoSQL"],
  [/\blinux\b/gi, "Linux"],
  [/\bgithub\b/gi, "GitHub"],
  [/\bgitlab\b/gi, "GitLab"],
  [/\bpython\b/gi, "Python"],
  [/\bredis\b/gi, "Redis"],
  [/\bkafka\b/gi, "Kafka"],
  [/\btailwind(?:\s*css)?\b/gi, "Tailwind CSS"],
  [/\bvite(?:\.js)?\b/gi, "Vite"],
  [/\bjest\b/gi, "Jest"],
  [/\bplaywright\b/gi, "Playwright"],
  [/\bmicroservices\b/gi, "microservices"],
];

/**
 * Standardizes technical names, fixes spacing, and cleans bullet point punctuation.
 */
export function polishTextString(text: string): {
  polished: string;
  changesCount: number;
} {
  if (!text) return { polished: text, changesCount: 0 };

  let current = text;
  let changesCount = 0;

  // Apply tech capitalization rules
  for (const [regex, standard] of TECH_STANDARDIZATION_RULES) {
    if (regex.test(current)) {
      const replaced = current.replace(regex, (matched) => {
        if (matched !== standard) {
          changesCount++;
          return standard;
        }
        return matched;
      });
      current = replaced;
    }
  }

  // Remove multiple consecutive spaces (excluding newlines)
  const spaceRegex = /[^\S\r\n]{2,}/g;
  if (spaceRegex.test(current)) {
    current = current.replace(spaceRegex, " ");
    changesCount++;
  }

  // Standardize bullet points format (ensure space after • or -)
  const bulletFormatRegex = /^([•\-])([^\s])/gm;
  if (bulletFormatRegex.test(current)) {
    current = current.replace(bulletFormatRegex, "$1 $2");
    changesCount++;
  }

  return { polished: current, changesCount };
}

/**
 * Scans the entire ResumeData and standardizes technical casing across Summary, Experience, Projects, and Skills.
 */
export function polishEntireResume(data: ResumeData): {
  polishedData: ResumeData;
  totalFixes: number;
} {
  let totalFixes = 0;

  // Polish Summary
  const { polished: polishedSummary, changesCount: summaryFixes } =
    polishTextString(data.summary);
  totalFixes += summaryFixes;

  // Polish Experience
  const polishedExperience = data.experience.map((exp) => {
    const { polished: descPolished, changesCount: descFixes } =
      polishTextString(exp.description);
    const { polished: rolePolished, changesCount: roleFixes } =
      polishTextString(exp.role);
    totalFixes += descFixes + roleFixes;
    return {
      ...exp,
      role: rolePolished,
      description: descPolished,
    };
  });

  // Polish Projects
  const polishedProjects = data.projects.map((proj) => {
    const { polished: descPolished, changesCount: descFixes } =
      polishTextString(proj.description);
    totalFixes += descFixes;
    const polishedTechs = proj.technologies.map((t) => {
      const { polished, changesCount } = polishTextString(t);
      totalFixes += changesCount;
      return polished;
    });
    return {
      ...proj,
      description: descPolished,
      technologies: polishedTechs,
    };
  });

  // Polish Skills
  const polishedSkills = data.skills.map((skill) => {
    const { polished, changesCount } = polishTextString(skill.name);
    totalFixes += changesCount;
    return {
      ...skill,
      name: polished,
    };
  });

  return {
    polishedData: {
      ...data,
      summary: polishedSummary,
      experience: polishedExperience,
      projects: polishedProjects,
      skills: polishedSkills,
    },
    totalFixes,
  };
}
