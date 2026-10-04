export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  current: boolean;
  score: string;
};

export type Skill = {
  id: string;
  name: string;
  category?: string;
};

export type CustomSection = {
  id: string;
  title: string;
  items: {
    id: string;
    name: string;
    description?: string;
    date?: string;
  }[];
};

export type ResumeData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    github?: string;
    linkedin?: string;
    title: string;
    photoBase64?: string;
  };
  summary: string;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];
  customSections: CustomSection[];
};

export type ResumeTemplate = string;

export type ThemeConfig = {
  accentColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  headerColor?: string;
  backgroundColor?: string;
  sectionStyle?: "minimal" | "badge" | "boxed" | "underline";
  imageAlign?: "left" | "center" | "right" | "hidden";
  showContactIcons?: boolean;
  spacing?: "compact" | "normal" | "relaxed";
  sectionOrder?: string[];
  dateFormat?: "MM/YYYY" | "Month YYYY" | "YYYY";
  titleFont?: "sans" | "serif" | "mono";
  headingFont?: "sans" | "serif" | "mono";
  bodyFont?: "sans" | "serif" | "mono";
};

export type ResumeStore = {
  data: ResumeData;
  activeTemplate: ResumeTemplate;
  themeConfig: ThemeConfig;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  updateSummary: (summary: string) => void;

  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;

  // Projects
  addProject: (proj: Project) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;

  // Education
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;

  // Skills
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;

  // Custom Sections
  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  // Global
  setTemplate: (template: ResumeTemplate) => void;
  reset: () => void;
};
