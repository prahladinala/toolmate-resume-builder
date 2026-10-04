/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Fragment } from "react";
import type { ResumeData, ThemeConfig } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Briefcase, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";

type LayoutType =
  "left-sidebar" | "right-sidebar" | "single-column" | "split-header" | "executive";
type AlignType = "left" | "center" | "right";
type FontType = "sans" | "serif" | "mono";

interface EngineConfig {
  layout: LayoutType;
  headerAlign: AlignType;
  imageAlign: AlignType | "hidden";
  fontFamily: FontType;
  accentColor: string;
  bgColor: string;
  textColor: string;
  sectionStyle: "minimal" | "boxed" | "underline" | "badge";
  showContactIcons: boolean;
}

const fontClasses = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

function parseMarkdown(text: string) {
  if (!text) return null;
  // Handle basic markdown: **bold**, *italic*, - bullet points
  const lines = text.split("\n");
  return (
    <div className="space-y-1 mt-2">
      {lines.map((line, i) => {
        let parsed = line;
        // Bold
        parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Italic
        parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");

        if (parsed.trim().startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="opacity-50 mt-0.5">•</span>
              <span
                dangerouslySetInnerHTML={{ __html: parsed.replace(/^- /, "") }}
              />
            </div>
          );
        }

        return (
          <p
            key={i}
            className="text-sm leading-relaxed min-h-[1.25rem]"
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        );
      })}
    </div>
  );
}

function getIcon(name: string, colorClass: string) {
  const props = { className: `w-4 h-4 ${colorClass}` };
  switch (name) {
    case "email":
      return <Mail {...props} />;
    case "phone":
      return <Phone {...props} />;
    case "location":
      return <MapPin {...props} />;
    case "website":
      return <Globe {...props} />;
    case "linkedin":
      return <Briefcase {...props} />;
    case "github":
      return <Terminal {...props} />;
    default:
      return null;
  }
}

export function TemplateEngine({
  data,
  templateId,
  themeConfig,
}: {
  data: ResumeData;
  templateId: string;
  themeConfig?: ThemeConfig;
}) {
  // Explicit configurations to guarantee zero repetition and high contrast between choices
  const configs: Record<string, EngineConfig> = {
    // Developers: Mono fonts, robust structure, clean logic
    "dev-1": {
      layout: "left-sidebar",
      headerAlign: "left",
      imageAlign: "center",
      fontFamily: "mono",
      accentColor: "zinc-900",
      bgColor: "#FFFFFF",
      textColor: "text-slate-800",
      sectionStyle: "minimal",
      showContactIcons: true,
    },
    "dev-2": {
      layout: "split-header",
      headerAlign: "left",
      imageAlign: "hidden",
      fontFamily: "sans",
      accentColor: "blue-600",
      bgColor: "#FAFAFA",
      textColor: "text-slate-800",
      sectionStyle: "badge",
      showContactIcons: true,
    },
    "dev-3": {
      layout: "right-sidebar",
      headerAlign: "right",
      imageAlign: "right",
      fontFamily: "mono",
      accentColor: "emerald-600",
      bgColor: "#FFFFFF",
      textColor: "text-zinc-900",
      sectionStyle: "boxed",
      showContactIcons: true,
    },
    "dev-4": {
      layout: "single-column",
      headerAlign: "left",
      imageAlign: "hidden",
      fontFamily: "mono",
      accentColor: "indigo-500",
      bgColor: "#FFFFFF",
      textColor: "text-slate-800",
      sectionStyle: "timeline",
      showContactIcons: false,
    },

    // Designers: Vibrant, asymmetric, centered, heavily styled
    "des-1": {
      layout: "single-column",
      headerAlign: "center",
      imageAlign: "center",
      fontFamily: "sans",
      accentColor: "pink-500",
      bgColor: "#FFF0F5",
      textColor: "text-slate-900",
      sectionStyle: "boxed",
      showContactIcons: true,
    },
    "des-2": {
      layout: "left-sidebar",
      headerAlign: "left",
      imageAlign: "left",
      fontFamily: "sans",
      accentColor: "purple-600",
      bgColor: "#FFFFFF",
      textColor: "text-slate-800",
      sectionStyle: "badge",
      showContactIcons: true,
    },
    "des-3": {
      layout: "right-sidebar",
      headerAlign: "left",
      imageAlign: "center",
      fontFamily: "sans",
      accentColor: "orange-500",
      bgColor: "#FFFAF0",
      textColor: "text-slate-900",
      sectionStyle: "underline",
      showContactIcons: true,
    },
    "des-4": {
      layout: "split-header",
      headerAlign: "center",
      imageAlign: "center",
      fontFamily: "serif",
      accentColor: "rose-500",
      bgColor: "#FFFFFF",
      textColor: "text-slate-800",
      sectionStyle: "minimal",
      showContactIcons: true,
    },

    // Corporate: Classic Serif, conservative colors, formal alignments
    "corp-1": {
      layout: "single-column",
      headerAlign: "left",
      imageAlign: "left",
      fontFamily: "serif",
      accentColor: "slate-800",
      bgColor: "#FFFFFF",
      textColor: "text-gray-900",
      sectionStyle: "underline",
      showContactIcons: true,
    },
    "corp-2": {
      layout: "left-sidebar",
      headerAlign: "left",
      imageAlign: "center",
      fontFamily: "serif",
      accentColor: "gray-900",
      bgColor: "#F9FAFB",
      textColor: "text-slate-800",
      sectionStyle: "minimal",
      showContactIcons: true,
    },
    "corp-3": {
      layout: "right-sidebar",
      headerAlign: "left",
      imageAlign: "left",
      fontFamily: "serif",
      accentColor: "stone-700",
      bgColor: "#FFFFFF",
      textColor: "text-stone-900",
      sectionStyle: "boxed",
      showContactIcons: true,
    },
    "corp-4": {
      layout: "executive",
      headerAlign: "center",
      imageAlign: "left",
      fontFamily: "serif",
      accentColor: "neutral-800",
      bgColor: "#FFFFFF",
      textColor: "text-neutral-900",
      sectionStyle: "badge",
      showContactIcons: true,
    },

    // General: Clean Sans, versatile, neutral layouts
    "gen-1": {
      layout: "single-column",
      headerAlign: "center",
      imageAlign: "center",
      fontFamily: "sans",
      accentColor: "teal-600",
      bgColor: "#FFFFFF",
      textColor: "text-slate-800",
      sectionStyle: "minimal",
      showContactIcons: true,
    },
    "gen-2": {
      layout: "split-header",
      headerAlign: "left",
      imageAlign: "right",
      fontFamily: "sans",
      accentColor: "sky-600",
      bgColor: "#F0F9FF",
      textColor: "text-slate-800",
      sectionStyle: "underline",
      showContactIcons: true,
    },
    "gen-3": {
      layout: "left-sidebar",
      headerAlign: "center",
      imageAlign: "center",
      fontFamily: "sans",
      accentColor: "amber-600",
      bgColor: "#FFFFFF",
      textColor: "text-stone-800",
      sectionStyle: "badge",
      showContactIcons: true,
    },
    "gen-4": {
      layout: "right-sidebar",
      headerAlign: "right",
      imageAlign: "left",
      fontFamily: "sans",
      accentColor: "red-500",
      bgColor: "#FFF5F5",
      textColor: "text-slate-900",
      sectionStyle: "boxed",
      showContactIcons: true,
    },
  };

  // Fallback to dev-1 if somehow an invalid ID is passed
  const baseConfig = configs[templateId] || configs["dev-1"];

  const config = {
    ...baseConfig,
    accentColor: themeConfig?.accentColor || baseConfig.accentColor,
    fontFamily: themeConfig?.fontFamily || baseConfig.fontFamily,
    titleFont: themeConfig?.titleFont || themeConfig?.fontFamily || baseConfig.fontFamily,
    headingFont: themeConfig?.headingFont || themeConfig?.fontFamily || baseConfig.fontFamily,
    bodyFont: themeConfig?.bodyFont || themeConfig?.fontFamily || baseConfig.fontFamily,
    bgColor: themeConfig?.backgroundColor || baseConfig.bgColor,
    textColor: themeConfig?.headerColor || baseConfig.textColor,
    sectionStyle: themeConfig?.sectionStyle || baseConfig.sectionStyle,
    imageAlign: themeConfig?.imageAlign || baseConfig.imageAlign,
    showContactIcons:
      themeConfig?.showContactIcons !== undefined
        ? themeConfig.showContactIcons
        : baseConfig.showContactIcons,
    spacing: themeConfig?.spacing || "normal",
    sectionOrder: themeConfig?.sectionOrder || [
      "summary",
      "experience",
      "projects",
      "education",
      "skills",
    ],
    dateFormat: themeConfig?.dateFormat || "Month YYYY",
    hidePhoto: themeConfig?.hidePhoto || false,
    hidePhone: themeConfig?.hidePhone || false,
    hideEmail: themeConfig?.hideEmail || false,
    hideLocation: themeConfig?.hideLocation || false,
    hideLinks: themeConfig?.hideLinks || false,
    hideDates: themeConfig?.hideDates || false,
    pageMargin: themeConfig?.pageMargin !== undefined ? themeConfig.pageMargin : 32, // Default 32px padding/margin
  };

  const colorClasses = {
    "blue-600": {
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-600",
    },
    "indigo-500": {
      bg: "bg-indigo-500",
      text: "text-indigo-500",
      border: "border-indigo-500",
    },
    "cyan-600": {
      bg: "bg-cyan-600",
      text: "text-cyan-600",
      border: "border-cyan-600",
    },
    "zinc-900": {
      bg: "bg-zinc-900",
      text: "text-zinc-900",
      border: "border-zinc-900",
    },
    "emerald-600": {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-600",
    },
    "pink-500": {
      bg: "bg-pink-500",
      text: "text-pink-500",
      border: "border-pink-500",
    },
    "purple-600": {
      bg: "bg-purple-600",
      text: "text-purple-600",
      border: "border-purple-600",
    },
    "orange-500": {
      bg: "bg-orange-500",
      text: "text-orange-500",
      border: "border-orange-500",
    },
    "rose-500": {
      bg: "bg-rose-500",
      text: "text-rose-500",
      border: "border-rose-500",
    },
    "fuchsia-500": {
      bg: "bg-fuchsia-500",
      text: "text-fuchsia-500",
      border: "border-fuchsia-500",
    },
    "slate-800": {
      bg: "bg-slate-800",
      text: "text-slate-800",
      border: "border-slate-800",
    },
    "gray-900": {
      bg: "bg-gray-900",
      text: "text-gray-900",
      border: "border-gray-900",
    },
    "stone-700": {
      bg: "bg-stone-700",
      text: "text-stone-700",
      border: "border-stone-700",
    },
    "neutral-800": {
      bg: "bg-neutral-800",
      text: "text-neutral-800",
      border: "border-neutral-800",
    },
    "zinc-800": {
      bg: "bg-zinc-800",
      text: "text-zinc-800",
      border: "border-zinc-800",
    },
    "teal-600": {
      bg: "bg-teal-600",
      text: "text-teal-600",
      border: "border-teal-600",
    },
    "sky-600": {
      bg: "bg-sky-600",
      text: "text-sky-600",
      border: "border-sky-600",
    },
    "amber-600": {
      bg: "bg-amber-600",
      text: "text-amber-600",
      border: "border-amber-600",
    },
    "red-500": {
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500",
    },
    "emerald-500": {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500",
    },
  };

  const accentClasses =
    colorClasses[config.accentColor as keyof typeof colorClasses] ||
    colorClasses["zinc-900"];

  const { personalInfo, summary, experience, education } = data;

  const parseDateForSort = (dateStr: string) => {
    if (!dateStr || dateStr.toLowerCase() === "present") return Infinity;
    const parsed = Date.parse(dateStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  const sortedExperience = [...(experience || [])].sort(
    (a, b) => parseDateForSort(b.startDate) - parseDateForSort(a.startDate),
  );
  
  const sortedEducation = [...(education || [])].sort(
    (a, b) => parseDateForSort(b.startDate) - parseDateForSort(a.startDate),
  );

  const sectionSpacing =
    config.spacing === "compact"
      ? "mb-4"
      : config.spacing === "relaxed"
        ? "mb-10"
        : "mb-8";
  const itemSpacing =
    config.spacing === "compact"
      ? "space-y-3"
      : config.spacing === "relaxed"
        ? "space-y-8"
        : "space-y-6";

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.toLowerCase() === "present") return dateStr;
    if (config.dateFormat === "YYYY") {
      const match = dateStr.match(/\b(19|20)\d{2}\b/);
      return match ? match[0] : dateStr;
    }
    if (config.dateFormat === "MM/YYYY") {
      // Basic heuristic for Month YYYY to MM/YYYY (e.g., "Jan 2023" -> "01/2023")
      const months: Record<string, string> = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12",
      };
      const parts = dateStr.split(/[\s,/-]+/);
      if (parts.length >= 2) {
        const m = parts[0].toLowerCase().slice(0, 3);
        const y = parts.find((p) => p.match(/^(19|20)\d{2}$/));
        if (months[m] && y) return `${months[m]}/${y}`;
      }
    }
    return dateStr; // Fallback to 'Month YYYY' exactly as typed
  };

  // -- Component Renderers based on Config --

  const renderImage = () => {
    if (!personalInfo.photoBase64 || config.imageAlign === "hidden" || config.hidePhoto)
      return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={personalInfo.photoBase64}
        alt="Profile"
        className={`w-32 h-32 object-cover ${config.layout === "split-header" ? "rounded-xl shadow-lg" : "rounded-full border-4"} border-white shadow-md`}
      />
    );
  };

  const formatUrl = (url: string) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
  };

  const renderContactInfo = (iconColorClass?: string) => {
    const iconClass = iconColorClass || accentClasses.text;
    return (
      <div
        className={`flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm ${config.headerAlign === "center" ? "justify-center" : ""}`}
      >
        {personalInfo.email && !config.hideEmail && (
          <div className="flex items-center gap-1.5">
            {config.showContactIcons && getIcon("email", iconClass)}
            {personalInfo.email}
          </div>
        )}
        {personalInfo.phone && !config.hidePhone && (
          <div className="flex items-center gap-1.5">
            {config.showContactIcons && getIcon("phone", iconClass)}
            {personalInfo.phone}
          </div>
        )}
        {personalInfo.location && !config.hideLocation && (
          <div className="flex items-center gap-1.5">
            {config.showContactIcons && getIcon("location", iconClass)}
            {personalInfo.location}
          </div>
        )}
        {personalInfo.linkedin && !config.hideLinks && (
          <div className="flex items-center gap-1.5">
            {config.showContactIcons && getIcon("linkedin", iconClass)}
            {formatUrl(personalInfo.linkedin)}
          </div>
        )}
        {personalInfo.github && !config.hideLinks && (
          <div className="flex items-center gap-1.5">
            {config.showContactIcons && getIcon("github", iconClass)}
            {formatUrl(personalInfo.github)}
          </div>
        )}
        {personalInfo.website && !config.hideLinks && (
          <div className="flex items-center gap-1.5">
            {config.showContactIcons && getIcon("website", iconClass)}
            {formatUrl(personalInfo.website)}
          </div>
        )}
      </div>
    );
  };

  const renderSectionHeader = (title: string, customClasses?: string) => {
    switch (config.sectionStyle) {
      case "badge":
        return (
          <h3
            className={`text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-3 ${fontClasses[config.headingFont]} ${customClasses || ""}`}
          >
            <span
              className={`${accentClasses.bg} text-white px-3 py-1 rounded-full text-xs font-sans`}
            >
              ◆
            </span>
            {title}
          </h3>
        );
      case "boxed":
        return (
          <h3
            className={`text-xl font-bold uppercase mb-4 ${accentClasses.bg} text-white p-2 rounded ${fontClasses[config.headingFont]} ${customClasses || ""}`}
          >
            {title}
          </h3>
        );
      case "underline":
        return (
          <h3
            className={`text-xl font-bold uppercase mb-4 border-b-2 ${accentClasses.border} pb-1 ${fontClasses[config.headingFont]} ${customClasses || ""}`}
          >
            {title}
          </h3>
        );
      case "minimal":
      default:
        return (
          <h3
            className={`text-xl font-bold tracking-widest uppercase mb-4 ${accentClasses.text} ${fontClasses[config.headingFont]} ${customClasses || ""}`}
          >
            {title}
          </h3>
        );
    }
  };


  const getSection = (name: string) => {
    if (name.startsWith('custom-')) {
      const sectionId = name.replace('custom-', '');
      const section = data.customSections?.find(s => s.id === sectionId);
      if (!section || !section.items || section.items.length === 0) return null;
      return (
        <section key={name} className={`${sectionSpacing} print:break-inside-avoid`}>
          {renderSectionHeader(section.title)}
          <div className={itemSpacing}>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`print:break-inside-avoid ${config.sectionStyle === "boxed" ? "bg-slate-50 dark:bg-[#111113] p-4 rounded-xl" : ""}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  {item.date && (
                    <span className="text-sm font-semibold opacity-70">
                      {item.date}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm leading-relaxed mb-2 whitespace-pre-wrap">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    switch (name) {
      case 'summary': return summary ? (
        <section key='summary' className={`${sectionSpacing} print:break-inside-avoid`}>
          {renderSectionHeader('Summary')}
          <div className='leading-relaxed text-sm markdown-container prose prose-sm max-w-none dark:prose-invert'><ReactMarkdown>{summary}</ReactMarkdown></div>
        </section>
      ) : null;
      case 'experience': return <Fragment key='experience'>{renderExperience()}</Fragment>;
      case 'projects': return <Fragment key='projects'>{renderProjects()}</Fragment>;
      case 'education': return <Fragment key='education'>{renderEducation()}</Fragment>;
      case 'skills': return <Fragment key='skills'>{renderSkills()}</Fragment>;
      default: return null;
    }
  };

  const fullSectionOrder = [...config.sectionOrder];
  if (data.customSections) {
    data.customSections.forEach(cs => {
      if (!fullSectionOrder.includes(`custom-${cs.id}`)) {
        fullSectionOrder.push(`custom-${cs.id}`);
      }
    });
  }

  const mainColOrder = fullSectionOrder.filter(s => !['skills', 'education'].includes(s));
  const sideColOrder = fullSectionOrder.filter(s => ['skills', 'education'].includes(s));

  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null;
    
    if (config.sectionStyle === "timeline") {
      return (
        <section className={sectionSpacing}>
          {renderSectionHeader("Experience")}
          <div className="relative border-l-2 ml-3 mt-4 border-slate-200 dark:border-[#27272a] space-y-8">
            {sortedExperience.map((exp) => (
              <div key={exp.id} className="relative pl-6 print:break-inside-avoid">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ${accentClasses.bg} ring-4 ring-white dark:ring-[#09090b]`} />
                <div className="flex flex-col mb-2">
                  <h4 className="font-bold text-lg">
                    {exp.role}{" "}
                    <span className={`${accentClasses.text}`}>
                      @ {exp.company}
                    </span>
                  </h4>
                  {!config.hideDates && (
                    <span className="text-sm font-semibold opacity-70">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  )}
                </div>
                {parseMarkdown(exp.description)}
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className={sectionSpacing}>
        {renderSectionHeader("Experience")}
        <div className={itemSpacing}>
          {sortedExperience.map((exp) => (
            <div
              key={exp.id}
              className={`print:break-inside-avoid ${config.sectionStyle === "boxed" ? "bg-slate-50 dark:bg-[#111113] p-4 rounded-xl" : ""}`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-lg">
                  {exp.role}{" "}
                  <span className={`${accentClasses.text}`}>
                    @ {exp.company}
                  </span>
                </h4>
                {!config.hideDates && (
                  <span className="text-sm font-semibold opacity-70">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                )}
              </div>
              {parseMarkdown(exp.description)}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null;

    if (config.sectionStyle === "timeline") {
      return (
        <section className={sectionSpacing}>
          {renderSectionHeader("Education")}
          <div className="relative border-l-2 ml-3 mt-4 border-slate-200 dark:border-[#27272a] space-y-6">
            {sortedEducation.map((edu) => (
              <div key={edu.id} className="relative pl-6 print:break-inside-avoid">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ${accentClasses.bg} ring-4 ring-white dark:ring-[#09090b]`} />
                <div className="flex flex-col mb-1">
                  <h4 className="font-bold text-lg">{edu.degree}</h4>
                  <div className="flex justify-between text-sm mt-0.5">
                    <span className={`${accentClasses.text} font-medium`}>
                      {edu.institution}
                    </span>
                    {!config.hideDates && (
                      <span className="opacity-70 font-semibold">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className={sectionSpacing}>
        {renderSectionHeader("Education")}
        <div className={itemSpacing}>
          {sortedEducation.map((edu) => (
            <div
              key={edu.id}
              className={`print:break-inside-avoid ${config.sectionStyle === "boxed" ? "bg-slate-50 dark:bg-[#111113] p-4 rounded-xl" : ""}`}
            >
              <h4 className="font-bold">{edu.degree}</h4>
              <div className="flex justify-between text-sm mt-1">
                <span className={`${accentClasses.text} font-medium`}>
                  {edu.institution}
                </span>
                {!config.hideDates && (
                  <span className="opacity-70">
                    {formatDate(edu.startDate)} -{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!data.skills || data.skills.length === 0) return null;
    return (
      <section className={`${sectionSpacing} print:break-inside-avoid`}>
        {renderSectionHeader("Skills")}
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill.id}
              className={
                config.sectionStyle === "badge"
                  ? `${accentClasses.bg} text-white px-3 py-1 rounded-full text-sm font-medium`
                  : config.sectionStyle === "boxed"
                    ? "bg-slate-100 text-slate-800 px-3 py-1 rounded text-sm font-medium border border-slate-200"
                    : "bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
              }
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <section className={sectionSpacing}>
        {renderSectionHeader("Projects")}
        <div className={itemSpacing}>
          {data.projects.map((proj) => (
            <div
              key={proj.id}
              className={`print:break-inside-avoid ${config.sectionStyle === "boxed" ? "bg-slate-50 p-4 rounded-xl" : ""}`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-lg">{proj.name}</h4>
                <div className="flex gap-3 text-sm font-semibold opacity-70">
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Globe className="w-3 h-3" /> Live
                    </a>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Terminal className="w-3 h-3" /> Code
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-2">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium opacity-70 px-1.5 py-0.5 border border-slate-200 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Compute Layouts
  let layoutContainer = null;

  if (config.layout === "single-column") {
    layoutContainer = (
      <div 
        className="pb-24 max-w-4xl mx-auto"
        style={{ padding: `${config.pageMargin}px` }}
      >
        <header
          className={`mb-10 flex flex-col ${config.headerAlign === "center" ? "items-center text-center" : config.headerAlign === "right" ? "items-end text-right" : "items-start text-left"}`}
        >
          {config.imageAlign === "center" && (
            <div className="mb-6">{renderImage()}</div>
          )}
          <div
            className={`flex w-full ${config.imageAlign === "right" ? "flex-row-reverse justify-between" : config.imageAlign === "left" ? "flex-row justify-between" : "flex-col"}`}
          >
            {(config.imageAlign === "left" || config.imageAlign === "right") &&
              renderImage()}
            <div
              className={
                config.imageAlign === "left"
                  ? "ml-6 flex-1"
                  : config.imageAlign === "right"
                    ? "mr-6 flex-1"
                    : "w-full"
              }
            >
              <h1 className={`text-5xl font-black mb-2 ${fontClasses[config.titleFont]}`}>
                {personalInfo.firstName}{" "}
                <span className={`${accentClasses.text}`}>
                  {personalInfo.lastName}
                </span>
              </h1>
              <h2 className="text-2xl font-medium opacity-80">
                {personalInfo.title}
              </h2>
              {renderContactInfo()}
            </div>
          </div>
        </header>
        {fullSectionOrder.map(getSection)}
      </div>
    );
  } else if (config.layout === "split-header") {
    layoutContainer = (
      <div>
        <header
          className={`${accentClasses.bg} text-white flex gap-8 items-center ${config.imageAlign === "right" ? "flex-row-reverse text-right" : config.imageAlign === "center" ? "flex-col text-center" : "flex-row text-left"}`}
          style={{ padding: `${config.pageMargin}px` }}
        >
          {renderImage()}
          <div className="flex-1">
            <h1 className={`text-4xl font-bold mb-2 ${fontClasses[config.titleFont]}`}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl opacity-90 mb-4">{personalInfo.title}</h2>
            <div
              className={`opacity-90 flex ${config.imageAlign === "center" ? "justify-center" : config.imageAlign === "right" ? "justify-end" : "justify-start"}`}
            >
              {renderContactInfo("text-white")}
            </div>
          </div>
        </header>
        <div className="pb-24" style={{ padding: `${config.pageMargin}px` }}>
          <div className="grid grid-cols-[2fr_1fr] gap-8">
            <div>
              {mainColOrder.map(getSection)}
            </div>
            <div>
              {sideColOrder.map(getSection)}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (config.layout === "left-sidebar") {
    layoutContainer = (
      <div className="flex min-h-[297mm] h-auto">
        <aside className={`w-[35%] ${accentClasses.bg} text-white pb-24`} style={{ padding: `${config.pageMargin}px` }}>
          <div
            className={`flex flex-col mb-8 ${config.imageAlign === "left" ? "items-start text-left" : config.imageAlign === "right" ? "items-end text-right" : "items-center text-center"}`}
          >
            <div className="mb-6">{renderImage()}</div>
            <h1 className={`text-3xl font-bold mb-1 ${fontClasses[config.titleFont]}`}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-lg opacity-90">{personalInfo.title}</h2>
          </div>
          <div
            className={`opacity-90 flex ${config.imageAlign === "left" ? "justify-start" : config.imageAlign === "right" ? "justify-end" : "justify-center"}`}
          >
            {renderContactInfo("text-white")}
          </div>
          <div className="mt-12 text-white">
            {sideColOrder.map(s => {
              if (s === 'skills' && data.skills && data.skills.length > 0) return (
                <div key="skills" className="mb-12 print:break-inside-avoid">
                  <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s) => (
                      <span
                        key={s.id}
                        className="bg-white/20 px-2 py-1 rounded text-xs"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
              if (s === 'education' && education.length > 0) return (
                <div key="education" className="print:break-inside-avoid">
                  <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">
                    Education
                  </h3>
                  {sortedEducation.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <h4 className="font-bold text-sm">{edu.degree}</h4>
                      <p className="text-xs opacity-80">{edu.institution}</p>
                      {!config.hideDates && (
                        <p className="text-xs opacity-80">
                          {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
              return null;
            })}
          </div>
        </aside>
        <main className="w-[65%] pb-24" style={{ padding: `${config.pageMargin}px` }}>
          {mainColOrder.map(getSection)}
        </main>
      </div>
    );
  } else {
    // Right sidebar
    layoutContainer = (
      <div className="flex min-h-[297mm] h-auto">
        <main className="w-[65%] pb-24" style={{ padding: `${config.pageMargin}px` }}>
          <header className="mb-10">
            <h1 className={`text-5xl font-black mb-2 ${accentClasses.text} ${fontClasses[config.titleFont]}`}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-2xl font-medium opacity-80">
              {personalInfo.title}
            </h2>
          </header>
          {mainColOrder.map(getSection)}
        </main>
        <aside className="w-[35%] bg-slate-100 pb-24 border-l border-slate-200" style={{ padding: `${config.pageMargin}px` }}>
          <div
            className={`mb-8 flex flex-col ${config.imageAlign === "left" ? "items-start text-left" : config.imageAlign === "center" ? "items-center text-center" : "items-end text-right"}`}
          >
            <div className="mb-4">{renderImage()}</div>
            <div
              className={`flex ${config.imageAlign === "left" ? "justify-start" : config.imageAlign === "center" ? "justify-center" : "justify-end"}`}
            >
              {renderContactInfo()}
            </div>
          </div>
          {sideColOrder.map(getSection)}
        </aside>
      </div>
    );
  }



  return (
    <div
      className={`w-full min-h-[297mm] h-auto relative ${fontClasses[config.bodyFont]} ${config.textColor}`}
      style={{ backgroundColor: config.bgColor }}
    >
      {layoutContainer}

      <div className="absolute bottom-4 print:fixed print:bottom-4 left-0 right-0 text-center text-[10px] opacity-40 font-sans tracking-widest uppercase pointer-events-none z-50">
        Generated by <span className="font-bold">ToolMate</span> Resume Builder
        - resume.toolmate.co.in
      </div>
    </div>
  );
}
