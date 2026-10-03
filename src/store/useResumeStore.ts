import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeStore, ResumeTemplate, ResumeData } from "@/types/resume";

const initialData: ResumeData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
  },
  summary: "",
  experience: [],
  projects: [],
  education: [],
  skills: [],
  customSections: [],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: initialData,
      activeTemplate: "dev-1" as ResumeTemplate,
      themeConfig: {},

      updateThemeConfig: (config) =>
        set((state) => ({
          themeConfig: { ...state.themeConfig, ...config },
        })),

      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),

      updateSummary: (summary) =>
        set((state) => ({
          data: { ...state.data, summary },
        })),

      addExperience: (exp) =>
        set((state) => ({
          data: { ...state.data, experience: [...state.data.experience, exp] },
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) =>
              e.id === id ? { ...e, ...exp } : e,
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((e) => e.id !== id),
          },
        })),

      reorderExperience: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.data.experience);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { data: { ...state.data, experience: result } };
        }),

      addProject: (proj) =>
        set((state) => ({
          data: { ...state.data, projects: [...state.data.projects, proj] },
        })),

      updateProject: (id, proj) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((p) =>
              p.id === id ? { ...p, ...proj } : p,
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter((p) => p.id !== id),
          },
        })),

      reorderProjects: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.data.projects);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { data: { ...state.data, projects: result } };
        }),

      addEducation: (edu) =>
        set((state) => ({
          data: { ...state.data, education: [...state.data.education, edu] },
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e,
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          data: { ...state.data, skills: [...state.data.skills, skill] },
        })),

      removeSkill: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter((s) => s.id !== id),
          },
        })),

      addCustomSection: (section) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: [...state.data.customSections, section],
          },
        })),

      updateCustomSection: (id, section) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: state.data.customSections.map((s) =>
              s.id === id ? { ...s, ...section } : s,
            ),
          },
        })),

      removeCustomSection: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: state.data.customSections.filter(
              (s) => s.id !== id,
            ),
          },
        })),

      setTemplate: (template) => set({ activeTemplate: template }),

      reset: () => set({ data: initialData }),
    }),
    {
      name: "resume-builder-storage", // key in local storage
    },
  ),
);
