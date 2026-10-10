import { get, set as idbSet } from "idb-keyval";
import type { ResumeData, ThemeConfig, ResumeTemplate } from "@/types/resume";

export interface ResumeProfile {
  id: string;
  name: string;
  targetRole?: string;
  updatedAt: string;
  data: ResumeData;
  activeTemplate: ResumeTemplate;
  themeConfig: ThemeConfig;
}

const PROFILES_KEY = "toolmate_resume_profiles_list";
const ACTIVE_PROFILE_ID_KEY = "toolmate_active_profile_id";

/**
 * Loads all saved resume profiles from IndexedDB.
 */
export async function getSavedProfiles(): Promise<ResumeProfile[]> {
  try {
    const list = await get(PROFILES_KEY);
    if (Array.isArray(list)) {
      return list;
    }
    return [];
  } catch (err) {
    console.error("Failed to load profiles from IndexedDB", err);
    return [];
  }
}

/**
 * Saves all resume profiles to IndexedDB.
 */
export async function saveProfiles(profiles: ResumeProfile[]): Promise<void> {
  try {
    await idbSet(PROFILES_KEY, profiles);
  } catch (err) {
    console.error("Failed to save profiles to IndexedDB", err);
  }
}

/**
 * Gets currently active profile ID.
 */
export async function getActiveProfileId(): Promise<string | null> {
  try {
    const activeId = await get(ACTIVE_PROFILE_ID_KEY);
    return activeId || null;
  } catch {
    return null;
  }
}

/**
 * Sets currently active profile ID.
 */
export async function setActiveProfileId(id: string): Promise<void> {
  try {
    await idbSet(ACTIVE_PROFILE_ID_KEY, id);
  } catch (err) {
    console.error("Failed to set active profile id", err);
  }
}

/**
 * Creates a new profile or clones an existing profile.
 */
export async function createOrCloneProfile(
  name: string,
  baseData?: ResumeData,
  baseTemplate?: ResumeTemplate,
  baseThemeConfig?: ThemeConfig,
): Promise<ResumeProfile> {
  const profiles = await getSavedProfiles();
  const newProfile: ResumeProfile = {
    id: `prof-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    targetRole: baseData?.personalInfo?.title || "Default Role",
    updatedAt: new Date().toISOString(),
    data: baseData
      ? JSON.parse(JSON.stringify(baseData))
      : {
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
        },
    activeTemplate: baseTemplate || "dev-1",
    themeConfig: baseThemeConfig
      ? JSON.parse(JSON.stringify(baseThemeConfig))
      : {},
  };

  profiles.unshift(newProfile);
  await saveProfiles(profiles);
  await setActiveProfileId(newProfile.id);
  return newProfile;
}

/**
 * Deletes a profile from IndexedDB.
 */
export async function deleteProfile(id: string): Promise<ResumeProfile[]> {
  const profiles = await getSavedProfiles();
  const updated = profiles.filter((p) => p.id !== id);
  await saveProfiles(updated);
  return updated;
}
