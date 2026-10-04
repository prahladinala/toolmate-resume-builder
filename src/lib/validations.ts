import { z } from "zod";

const urlSchema = z
  .string()
  .trim()
  .transform((val) => {
    if (!val) return "";
    if (!/^https?:\/\//i.test(val)) return `https://${val}`;
    return val;
  })
  .pipe(z.string().url("Must be a valid URL").or(z.literal("")))
  .optional();

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  website: urlSchema,
  github: urlSchema,
  linkedin: urlSchema,
  title: z.string().min(2, "Professional title is required"),
  photoBase64: z.string().optional(),
});

export const summarySchema = z.object({
  summary: z
    .string()
    .min(10, "Please write a brief professional summary (min 10 characters)"),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z
    .string()
    .min(10, "Please describe your responsibilities and achievements"),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()).min(1, "Add at least one technology"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  score: z.string().min(1, "Score/GPA is required (e.g., 3.8 GPA, 85%)"),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill is required"),
  category: z.string().min(1, "Category is required"),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Section title is required"),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Item name is required"),
      description: z.string().optional(),
      date: z.string().optional(),
    }),
  ),
});

export const fullResumeSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string(),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  customSections: z.array(customSectionSchema),
});
