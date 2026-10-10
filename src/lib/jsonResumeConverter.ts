/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResumeData } from "@/types/resume";

/**
 * Official JSON Resume standard schema interface.
 * https://jsonresume.org/schema/
 */
export interface JsonResumeSchema {
  basics?: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: {
      network?: string;
      username?: string;
      url?: string;
    }[];
  };
  work?: {
    name?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  education?: {
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }[];
  skills?: {
    name?: string;
    level?: string;
    keywords?: string[];
  }[];
  projects?: {
    name?: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
    roles?: string[];
    entity?: string;
    type?: string;
  }[];
}

/**
 * Converts internal ResumeData to standard JSON Resume specification.
 */
export function exportToJsonResume(data: ResumeData): JsonResumeSchema {
  const fullName =
    `${data.personalInfo.firstName || ""} ${data.personalInfo.lastName || ""}`.trim();

  const profiles: { network: string; url: string }[] = [];
  if (data.personalInfo.linkedin) {
    profiles.push({ network: "LinkedIn", url: data.personalInfo.linkedin });
  }
  if (data.personalInfo.github) {
    profiles.push({ network: "GitHub", url: data.personalInfo.github });
  }

  return {
    basics: {
      name: fullName,
      label: data.personalInfo.title || "",
      image: data.personalInfo.photoBase64 || "",
      email: data.personalInfo.email || "",
      phone: data.personalInfo.phone || "",
      url: data.personalInfo.website || "",
      summary: data.summary || "",
      location: {
        city: data.personalInfo.location || "",
      },
      profiles,
    },
    work: (data.experience || []).map((exp) => ({
      name: exp.company,
      position: exp.role,
      startDate: exp.startDate,
      endDate: exp.current ? "Present" : exp.endDate,
      summary: exp.description,
      highlights: (exp.description || "")
        .split("\n")
        .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter((l) => l.length > 5),
    })),
    education: (data.education || []).map((edu) => ({
      institution: edu.institution,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.current ? "Present" : edu.endDate,
      score: edu.score,
    })),
    skills: (data.skills || []).map((skill) => ({
      name: skill.name,
      keywords: [skill.name],
    })),
    projects: (data.projects || []).map((proj) => ({
      name: proj.name,
      description: proj.description,
      keywords: proj.technologies || [],
      url: proj.url || proj.github || "",
    })),
  };
}

/**
 * Converts standard JSON Resume format into internal ResumeData format.
 */
export function importFromJsonResume(json: any): ResumeData {
  const nameParts = (json.basics?.name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  let linkedin = "";
  let github = "";

  if (Array.isArray(json.basics?.profiles)) {
    json.basics.profiles.forEach((p: any) => {
      const net = (p.network || "").toLowerCase();
      const url = p.url || "";
      if (net.includes("linkedin") || url.includes("linkedin.com")) {
        linkedin = url;
      } else if (net.includes("github") || url.includes("github.com")) {
        github = url;
      }
    });
  }

  const experience = Array.isArray(json.work)
    ? json.work.map((w: any, idx: number) => {
        let description = w.summary || "";
        if (Array.isArray(w.highlights) && w.highlights.length > 0) {
          const bulletText = w.highlights
            .map((h: string) => `- ${h}`)
            .join("\n");
          description = description
            ? `${description}\n${bulletText}`
            : bulletText;
        }

        const isCurrent =
          (w.endDate || "").toLowerCase() === "present" || !w.endDate;

        return {
          id: `exp-${Date.now()}-${idx}`,
          company: w.name || "Company",
          role: w.position || "Role",
          startDate: w.startDate || "",
          endDate: isCurrent ? "" : w.endDate || "",
          current: isCurrent,
          description: description || "",
        };
      })
    : [];

  const education = Array.isArray(json.education)
    ? json.education.map((edu: any, idx: number) => ({
        id: `edu-${Date.now()}-${idx}`,
        institution: edu.institution || "Institution",
        degree: edu.studyType || edu.area || "Degree",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        current: (edu.endDate || "").toLowerCase() === "present",
        score: edu.score || "",
      }))
    : [];

  const skills: { id: string; name: string }[] = [];
  if (Array.isArray(json.skills)) {
    json.skills.forEach((s: any, idx: number) => {
      if (s.name) {
        skills.push({ id: `skill-${Date.now()}-${idx}`, name: s.name });
      } else if (Array.isArray(s.keywords)) {
        s.keywords.forEach((kw: string, kIdx: number) => {
          skills.push({ id: `skill-${Date.now()}-${idx}-${kIdx}`, name: kw });
        });
      }
    });
  }

  const projects = Array.isArray(json.projects)
    ? json.projects.map((proj: any, idx: number) => ({
        id: `proj-${Date.now()}-${idx}`,
        name: proj.name || "Project",
        description:
          proj.description ||
          (Array.isArray(proj.highlights) ? proj.highlights.join(" ") : ""),
        technologies: Array.isArray(proj.keywords) ? proj.keywords : [],
        url: proj.url || "",
        github: (proj.url || "").includes("github.com") ? proj.url : "",
      }))
    : [];

  return {
    personalInfo: {
      firstName,
      lastName,
      email: json.basics?.email || "",
      phone: json.basics?.phone || "",
      location:
        json.basics?.location?.city || json.basics?.location?.address || "",
      title: json.basics?.label || "",
      website: json.basics?.url || "",
      photoBase64: json.basics?.image || "",
      linkedin,
      github,
    },
    summary: json.basics?.summary || "",
    coverLetter: "",
    experience,
    education,
    skills,
    projects,
    customSections: [],
  };
}
