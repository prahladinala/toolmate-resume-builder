import type { ResumeData } from "@/types/resume";

export interface QualityFinding {
  id: string;
  category: "completeness" | "impact" | "ats" | "formatting" | "clarity";
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  recommendation: string;
  targetSection:
    "personal" | "summary" | "experience" | "education" | "skills" | "projects";
}

export interface QualityReport {
  score: number; // 0 to 100
  criticalCount: number;
  warningCount: number;
  suggestionCount: number;
  findings: QualityFinding[];
}

/**
 * Analyzes resume data using rigorous deterministic rules and heuristic pattern matching.
 */
export function analyzeResumeQuality(data: ResumeData): QualityReport {
  const findings: QualityFinding[] = [];
  let score = 100;

  // 1. Personal Info Completeness
  if (!data.personalInfo.firstName || !data.personalInfo.lastName) {
    findings.push({
      id: "personal-name-missing",
      category: "completeness",
      severity: "critical",
      title: "Full Name Missing",
      description:
        "Recruiters and ATS parsers require your candidate name at the top of the resume.",
      recommendation:
        "Provide your first and last name in the Personal Information section.",
      targetSection: "personal",
    });
    score -= 20;
  }

  if (!data.personalInfo.email) {
    findings.push({
      id: "personal-email-missing",
      category: "completeness",
      severity: "critical",
      title: "Contact Email Missing",
      description:
        "Hiring managers cannot contact you for interview invitations without an email.",
      recommendation: "Add a professional email address.",
      targetSection: "personal",
    });
    score -= 15;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
    findings.push({
      id: "personal-email-invalid",
      category: "formatting",
      severity: "warning",
      title: "Potentially Invalid Email Format",
      description:
        "The email address does not follow standard email formatting.",
      recommendation: "Check for typos or extra spaces in your email.",
      targetSection: "personal",
    });
    score -= 5;
  }

  if (!data.personalInfo.title) {
    findings.push({
      id: "personal-title-missing",
      category: "ats",
      severity: "warning",
      title: "Target Job Title Missing",
      description:
        "Adding your target professional role (e.g. 'Senior Full-Stack Engineer') immediately aligns your profile with ATS job titles.",
      recommendation: "Add a clear professional title under your name.",
      targetSection: "personal",
    });
    score -= 8;
  }

  // 2. Summary Section
  if (!data.summary || data.summary.trim().length === 0) {
    findings.push({
      id: "summary-missing",
      category: "completeness",
      severity: "warning",
      title: "Professional Summary Missing",
      description:
        "A 2-3 sentence executive summary provides hiring managers with an immediate hook for your core strengths.",
      recommendation:
        "Draft a concise 2-3 sentence summary highlighting your primary technical stack and career milestones.",
      targetSection: "summary",
    });
    score -= 10;
  } else if (data.summary.trim().length < 80) {
    findings.push({
      id: "summary-too-short",
      category: "clarity",
      severity: "suggestion",
      title: "Summary is Very Brief",
      description:
        "Your summary is under 80 characters, which may not convey your core strengths.",
      recommendation:
        "Expand your summary with your primary domain focus and quantifiable achievements.",
      targetSection: "summary",
    });
    score -= 4;
  }

  // 3. Experience Section
  if (!data.experience || data.experience.length === 0) {
    findings.push({
      id: "experience-empty",
      category: "completeness",
      severity: "critical",
      title: "No Experience Entries Found",
      description:
        "Work experience is the primary section evaluated by tech recruiters.",
      recommendation:
        "Add at least one relevant work, internship, or project role.",
      targetSection: "experience",
    });
    score -= 25;
  } else {
    // Check experience bullets for length, passive phrases, and metrics
    let totalBullets = 0;
    let bulletsWithNumbers = 0;
    const usedVerbs = new Set<string>();
    let duplicateVerbCount = 0;

    data.experience.forEach((exp, idx) => {
      const lines = exp.description
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      totalBullets += lines.length;

      lines.forEach((line) => {
        // Metric detection
        if (
          /\b\d+%|\b\d+x|\b\$\d+|\b\d+\+?\s*(users|requests|ms|teams|engineers|clients|hours)\b/i.test(
            line,
          )
        ) {
          bulletsWithNumbers++;
        }

        // Overly long bullet check
        if (line.length > 250) {
          findings.push({
            id: `experience-long-bullet-${idx}`,
            category: "clarity",
            severity: "suggestion",
            title: `Lengthy Bullet Point in ${exp.company || "Experience"}`,
            description:
              "Bullet points over 250 characters are difficult for recruiters to scan in 6 seconds.",
            recommendation:
              "Split into two punchy, action-oriented bullet points.",
            targetSection: "experience",
          });
          score -= 3;
        }

        // Action verb repetition check
        const firstWord = line
          .replace(/^[-*•\d.]+\s*/, "")
          .split(/\s+/)[0]
          ?.toLowerCase();
        if (firstWord && firstWord.length > 3) {
          if (usedVerbs.has(firstWord)) {
            duplicateVerbCount++;
          } else {
            usedVerbs.add(firstWord);
          }
        }
      });
    });

    if (totalBullets > 0 && bulletsWithNumbers === 0) {
      findings.push({
        id: "experience-no-metrics",
        category: "impact",
        severity: "warning",
        title: "Few or No Quantifiable Metrics",
        description:
          "None of your experience bullet points include quantifiable figures (e.g. % improvements, latency gains, user counts).",
        recommendation:
          "Use the Achievement Discovery assistant to identify verified metrics and substantiate your achievements.",
        targetSection: "experience",
      });
      score -= 10;
    }

    if (duplicateVerbCount >= 3) {
      findings.push({
        id: "experience-repeated-verbs",
        category: "clarity",
        severity: "suggestion",
        title: "Repeated Action Verbs Detected",
        description:
          "Multiple bullet points start with the exact same action verbs.",
        recommendation:
          "Diversify your opening verbs using terms like 'Architected', 'Spearheaded', 'Optimized', and 'Overhauled'.",
        targetSection: "experience",
      });
      score -= 3;
    }
  }

  // 4. Skills Section
  if (!data.skills || data.skills.length === 0) {
    findings.push({
      id: "skills-missing",
      category: "completeness",
      severity: "critical",
      title: "No Skills Listed",
      description:
        "Applicant tracking systems heavily rely on skill keyword matching to rank candidates.",
      recommendation:
        "Add your core programming languages, frameworks, databases, and development tools.",
      targetSection: "skills",
    });
    score -= 20;
  } else if (data.skills.length < 5) {
    findings.push({
      id: "skills-few",
      category: "ats",
      severity: "warning",
      title: "Fewer Than 5 Skills Listed",
      description:
        "A comprehensive skills section typically features 8-15 technologies categorized by domain.",
      recommendation:
        "Add complementary tools such as testing frameworks, cloud infrastructure, or databases.",
      targetSection: "skills",
    });
    score -= 5;
  }

  // 5. Education Section
  if (!data.education || data.education.length === 0) {
    findings.push({
      id: "education-missing",
      category: "completeness",
      severity: "warning",
      title: "No Education Entries Found",
      description:
        "Most screening filters look for formal degrees, bootcamps, or certifications.",
      recommendation:
        "Add your university degree, bootcamp, or major certification.",
      targetSection: "education",
    });
    score -= 10;
  }

  const normalizedScore = Math.max(15, Math.min(100, score));

  return {
    score: normalizedScore,
    criticalCount: findings.filter((f) => f.severity === "critical").length,
    warningCount: findings.filter((f) => f.severity === "warning").length,
    suggestionCount: findings.filter((f) => f.severity === "suggestion").length,
    findings,
  };
}
