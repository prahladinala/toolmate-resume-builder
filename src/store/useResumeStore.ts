import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { temporal } from "zundo";
import { get, set as idbSet, del } from "idb-keyval";
import type { ResumeStore, ResumeTemplate, ResumeData } from "@/types/resume";

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get(name);
      if (value) return value;
      // Fallback to localStorage for backward compatibility (migration)
      const localValue = localStorage.getItem(name);
      if (localValue) {
        await idbSet(name, localValue);
        // We don't remove it from localStorage just to be safe, or we could.
        return localValue;
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await idbSet(name, value);
    } catch (err) {
      console.warn("Failed to save to IndexedDB", err);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch (err) {
      console.warn("Failed to delete from IndexedDB", err);
    }
  },
};

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
  coverLetter: `**Date:** October 4, 2026\n\n**To Hiring Manager,**\n\nI am writing to express my strong interest in the open position at your company. With a solid foundation in engineering and a passion for building scalable, user-centric solutions, I am confident in my ability to make an immediate impact on your team.\n\nThroughout my career, I have consistently delivered high-quality results by collaborating cross-functionally, optimizing processes, and adapting quickly to new technologies. I thrive in dynamic environments and am eager to bring my unique blend of technical expertise and problem-solving skills to help achieve your organization's goals.\n\nI would welcome the opportunity to discuss how my background, skills, and enthusiasm align with the needs of your team. Please find my resume attached for your review.\n\nThank you for your time and consideration.\n\nSincerely,\n\n**[Your Name]**`,
  experience: [],
  projects: [],
  education: [],
  skills: [],
  customSections: [],
};

export const useResumeStore = create<ResumeStore>()(
  temporal(
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

        updateCoverLetter: (coverLetter) =>
          set((state) => ({
            data: { ...state.data, coverLetter },
          })),

        updateTargetJobDescription: (targetJobDescription) =>
          set((state) => ({
            data: { ...state.data, targetJobDescription },
          })),

        addExperience: (exp) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: [...state.data.experience, exp],
            },
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

        reorderEducation: (startIndex, endIndex) =>
          set((state) => {
            const result = Array.from(state.data.education);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { data: { ...state.data, education: result } };
          }),

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

        reorderSkills: (startIndex, endIndex) =>
          set((state) => {
            const result = Array.from(state.data.skills);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { data: { ...state.data, skills: result } };
          }),

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
        name: "resume-builder-storage", // key in indexedDB
        storage: createJSONStorage(() => idbStorage),
      },
    ),
  ),
);
