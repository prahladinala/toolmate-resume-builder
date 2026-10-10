import { z } from "zod";

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().default(""),
  role: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  description: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  url: z.string().optional(),
  github: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().default(""),
  institution: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  score: z.string().default(""),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  category: z.string().optional(),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().default("Custom Section"),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().default(""),
        description: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .default([]),
});

export const personalInfoSchema = z.object({
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  title: z.string().default(""),
  photoBase64: z.string().optional(),
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema.default({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
  }),
  summary: z.string().default(""),
  coverLetter: z.string().optional(),
  targetJobDescription: z.string().optional(),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

export type ValidatedResumeData = z.infer<typeof resumeDataSchema>;

/**
 * Validates and sanitizes raw untrusted input against the ResumeData schema.
 * Automatically supplies safe defaults for missing or nullish fields.
 */
export function validateAndSanitizeResumeData(data: unknown): {
  success: boolean;
  data?: ValidatedResumeData;
  error?: string;
} {
  const result = resumeDataSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMsg = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  return { success: false, error: errorMsg };
}
