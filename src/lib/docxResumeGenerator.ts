import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { ResumeData, ThemeConfig } from "@/types/resume";

const TEMPLATE_CONFIGS: Record<
  string,
  {
    layout:
      | "left-sidebar"
      | "right-sidebar"
      | "single-column"
      | "split-header"
      | "executive";
    headerAlign: "left" | "center" | "right";
    fontFamily: "sans" | "serif" | "mono";
    accentColor: string;
    sectionStyle: "minimal" | "boxed" | "underline" | "badge" | "timeline";
  }
> = {
  // Developers
  "dev-1": {
    layout: "left-sidebar",
    headerAlign: "left",
    fontFamily: "mono",
    accentColor: "zinc-900",
    sectionStyle: "minimal",
  },
  "dev-2": {
    layout: "split-header",
    headerAlign: "left",
    fontFamily: "sans",
    accentColor: "blue-600",
    sectionStyle: "badge",
  },
  "dev-3": {
    layout: "right-sidebar",
    headerAlign: "right",
    fontFamily: "mono",
    accentColor: "emerald-600",
    sectionStyle: "boxed",
  },
  "dev-4": {
    layout: "single-column",
    headerAlign: "left",
    fontFamily: "mono",
    accentColor: "indigo-500",
    sectionStyle: "underline",
  },

  // Designers
  "des-1": {
    layout: "single-column",
    headerAlign: "center",
    fontFamily: "sans",
    accentColor: "pink-500",
    sectionStyle: "boxed",
  },
  "des-2": {
    layout: "left-sidebar",
    headerAlign: "left",
    fontFamily: "sans",
    accentColor: "purple-600",
    sectionStyle: "badge",
  },
  "des-3": {
    layout: "right-sidebar",
    headerAlign: "left",
    fontFamily: "sans",
    accentColor: "orange-500",
    sectionStyle: "underline",
  },
  "des-4": {
    layout: "split-header",
    headerAlign: "center",
    fontFamily: "serif",
    accentColor: "rose-500",
    sectionStyle: "minimal",
  },

  // Corporate & Executive
  "corp-1": {
    layout: "single-column",
    headerAlign: "left",
    fontFamily: "serif",
    accentColor: "slate-800",
    sectionStyle: "underline",
  },
  "corp-2": {
    layout: "left-sidebar",
    headerAlign: "left",
    fontFamily: "serif",
    accentColor: "gray-900",
    sectionStyle: "minimal",
  },
  "corp-3": {
    layout: "right-sidebar",
    headerAlign: "left",
    fontFamily: "serif",
    accentColor: "stone-700",
    sectionStyle: "boxed",
  },
  "corp-4": {
    layout: "executive",
    headerAlign: "center",
    fontFamily: "serif",
    accentColor: "neutral-800",
    sectionStyle: "badge",
  },

  // General & Minimalist
  "gen-1": {
    layout: "single-column",
    headerAlign: "center",
    fontFamily: "sans",
    accentColor: "teal-600",
    sectionStyle: "minimal",
  },
  "gen-2": {
    layout: "split-header",
    headerAlign: "left",
    fontFamily: "sans",
    accentColor: "sky-600",
    sectionStyle: "underline",
  },
  "gen-3": {
    layout: "left-sidebar",
    headerAlign: "center",
    fontFamily: "sans",
    accentColor: "amber-600",
    sectionStyle: "badge",
  },
  "gen-4": {
    layout: "right-sidebar",
    headerAlign: "right",
    fontFamily: "sans",
    accentColor: "red-500",
    sectionStyle: "boxed",
  },

  // LaTeX & Consulting
  "latex-1": {
    layout: "single-column",
    headerAlign: "center",
    fontFamily: "serif",
    accentColor: "slate-800",
    sectionStyle: "underline",
  },
  "consult-1": {
    layout: "single-column",
    headerAlign: "left",
    fontFamily: "sans",
    accentColor: "zinc-900",
    sectionStyle: "minimal",
  },
};

const COLOR_MAP: Record<string, string> = {
  "blue-600": "2563EB",
  "indigo-500": "6366F1",
  "indigo-600": "4F46E5",
  "emerald-600": "059669",
  "teal-600": "0D9488",
  "sky-600": "0284C7",
  "pink-500": "EC4899",
  "rose-500": "F43F5E",
  "purple-600": "9333EA",
  "orange-500": "F97316",
  "amber-600": "D97706",
  "red-500": "EF4444",
  "zinc-900": "18181B",
  "slate-800": "1E293B",
  "gray-900": "111827",
  "neutral-800": "262626",
  "stone-700": "44403C",
};

function resolveHexColor(color?: string, fallback = "2563EB"): string {
  if (!color) return fallback;
  const clean = color.trim().replace(/^#/, "");
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) return clean.toUpperCase();
  if (COLOR_MAP[color]) return COLOR_MAP[color];
  if (COLOR_MAP[clean]) return COLOR_MAP[clean];
  return fallback;
}

function getFontName(fontFamily: "sans" | "serif" | "mono"): string {
  switch (fontFamily) {
    case "serif":
      return "Georgia";
    case "mono":
      return "Consolas";
    case "sans":
    default:
      return "Calibri";
  }
}

const NO_BORDER = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

/**
 * Generates an editable Microsoft Word (.docx) document reproducing the user's selected
 * template style (layout, colors, fonts, sidebar, badges, and headers).
 */
export async function generateDocxResume(
  data: ResumeData,
  templateId = "dev-1",
  themeConfig?: ThemeConfig,
): Promise<Blob> {
  const baseConfig = TEMPLATE_CONFIGS[templateId] || TEMPLATE_CONFIGS["dev-1"];

  const layout = baseConfig.layout;
  const headerAlign =
    baseConfig.headerAlign === "center"
      ? AlignmentType.CENTER
      : baseConfig.headerAlign === "right"
        ? AlignmentType.RIGHT
        : AlignmentType.LEFT;

  const resolvedFontFamily = themeConfig?.fontFamily || baseConfig.fontFamily;
  const fontName = getFontName(resolvedFontFamily);

  const rawAccent = themeConfig?.accentColor || baseConfig.accentColor;
  const accentHex = resolveHexColor(rawAccent, "2563EB");
  const sectionStyle = themeConfig?.sectionStyle || baseConfig.sectionStyle;

  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    customSections,
  } = data;

  const fullName =
    `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() ||
    "Resume";

  // --- Section Header Helper ---
  const createSectionHeader = (
    title: string,
    isSidebar = false,
  ): (Paragraph | Table)[] => {
    const uppercaseTitle = title.toUpperCase();

    if (sectionStyle === "badge" && !isSidebar) {
      // Sleek shaded banner badge
      return [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: NO_BORDER,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: accentHex },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 0 },
                      children: [
                        new TextRun({
                          text: uppercaseTitle,
                          bold: true,
                          size: 21,
                          color: "FFFFFF",
                          font: fontName,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }),
      ];
    }

    if (sectionStyle === "boxed" || isSidebar) {
      // Left accent bar
      return [
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: isSidebar ? 160 : 200, after: 80 },
          border: {
            left: {
              color: accentHex,
              size: 20,
              style: BorderStyle.SINGLE,
              space: 6,
            },
          },
          children: [
            new TextRun({
              text: uppercaseTitle,
              bold: true,
              size: isSidebar ? 20 : 22,
              color: accentHex,
              font: fontName,
            }),
          ],
        }),
      ];
    }

    if (sectionStyle === "underline") {
      // Thick accent underline
      return [
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          border: {
            bottom: {
              color: accentHex,
              size: 10,
              style: BorderStyle.SINGLE,
              space: 3,
            },
          },
          children: [
            new TextRun({
              text: uppercaseTitle,
              bold: true,
              size: 22,
              color: accentHex,
              font: fontName,
            }),
          ],
        }),
      ];
    }

    // Default Minimal
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 60 },
        children: [
          new TextRun({
            text: uppercaseTitle,
            bold: true,
            size: 21,
            color: accentHex,
            font: fontName,
          }),
        ],
      }),
    ];
  };

  // --- Entry Header Helper (Role / Company / Dates) ---
  const createEntryHeader = (
    leftText: string,
    leftSub: string,
    rightDate: string,
    rightLoc: string,
    isSidebar = false,
  ): (Paragraph | Table)[] => {
    if (isSidebar) {
      return [
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: leftText,
              bold: true,
              size: 19,
              color: "0F172A",
              font: fontName,
            }),
            ...(leftSub
              ? [
                  new TextRun({
                    text: ` — ${leftSub}`,
                    italics: true,
                    size: 18,
                    color: accentHex,
                    font: fontName,
                  }),
                ]
              : []),
          ],
        }),
        ...(rightDate
          ? [
              new Paragraph({
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: rightDate,
                    bold: true,
                    size: 17,
                    color: "64748B",
                    font: fontName,
                  }),
                ],
              }),
            ]
          : []),
      ];
    }

    // Full width or main column: clean 2-column table
    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDER,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    spacing: { before: 60, after: 20 },
                    children: [
                      new TextRun({
                        text: leftText,
                        bold: true,
                        size: 21,
                        color: "0F172A",
                        font: fontName,
                      }),
                      ...(leftSub
                        ? [
                            new TextRun({
                              text: ` — ${leftSub}`,
                              italics: true,
                              size: 20,
                              color: accentHex,
                              font: fontName,
                            }),
                          ]
                        : []),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 60, after: 20 },
                    children: [
                      new TextRun({
                        text: rightDate,
                        bold: true,
                        size: 19,
                        color: "475569",
                        font: fontName,
                      }),
                      ...(rightLoc
                        ? [
                            new TextRun({
                              text: ` | ${rightLoc}`,
                              size: 18,
                              color: "64748B",
                              font: fontName,
                            }),
                          ]
                        : []),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];
  };

  // --- Bullet Paragraph Helper ---
  const createBullet = (text: string, isSidebar = false): Paragraph => {
    const clean = text.replace(/^[•\-\*]\s*/, "").trim();
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 20, after: 20, line: 250 },
      children: [
        new TextRun({
          text: clean,
          size: isSidebar ? 18 : 20,
          color: "334155",
          font: fontName,
        }),
      ],
    });
  };

  // --- Build Section Content Blocks ---
  const buildSummaryBlock = (
    isSidebar = false,
  ): (Paragraph | Table)[] | null => {
    if (!summary || !summary.trim()) return null;
    return [
      ...createSectionHeader("Professional Summary", isSidebar),
      new Paragraph({
        spacing: { after: 120, line: 260 },
        children: [
          new TextRun({
            text: summary.trim(),
            size: isSidebar ? 19 : 20,
            color: "334155",
            font: fontName,
          }),
        ],
      }),
    ];
  };

  const buildExperienceBlock = (
    isSidebar = false,
  ): (Paragraph | Table)[] | null => {
    if (!experience || experience.length === 0) return null;
    const items: (Paragraph | Table)[] = [
      ...createSectionHeader("Work Experience", isSidebar),
    ];
    for (const exp of experience) {
      const dates =
        `${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}`.trim();
      items.push(
        ...createEntryHeader(
          exp.role || "",
          exp.company || "",
          dates,
          "",
          isSidebar,
        ),
      );

      const bullets = (exp.description || "")
        .split("\n")
        .filter((b) => b.trim().length > 0);
      for (const b of bullets) {
        items.push(createBullet(b, isSidebar));
      }
    }
    return items;
  };

  const buildProjectsBlock = (
    isSidebar = false,
  ): (Paragraph | Table)[] | null => {
    if (!projects || projects.length === 0) return null;
    const items: (Paragraph | Table)[] = [
      ...createSectionHeader("Key Projects", isSidebar),
    ];
    for (const proj of projects) {
      const tech =
        proj.technologies && proj.technologies.length > 0
          ? ` [${proj.technologies.join(", ")}]`
          : "";
      const links = [proj.url, proj.github].filter(Boolean).join(" | ");
      items.push(
        ...createEntryHeader(proj.name || "", links, tech, "", isSidebar),
      );

      const bullets = (proj.description || "")
        .split("\n")
        .filter((b) => b.trim().length > 0);
      for (const b of bullets) {
        items.push(createBullet(b, isSidebar));
      }
    }
    return items;
  };

  const buildEducationBlock = (
    isSidebar = false,
  ): (Paragraph | Table)[] | null => {
    if (!education || education.length === 0) return null;
    const items: (Paragraph | Table)[] = [
      ...createSectionHeader("Education", isSidebar),
    ];
    for (const edu of education) {
      const dates =
        `${edu.startDate || ""} - ${edu.current ? "Present" : edu.endDate || ""}`.trim();
      items.push(
        ...createEntryHeader(
          edu.institution || "",
          edu.degree || "",
          dates,
          "",
          isSidebar,
        ),
      );

      if (edu.score) {
        items.push(
          new Paragraph({
            spacing: { before: 10, after: 30 },
            children: [
              new TextRun({
                text: "Grade / Score: ",
                bold: true,
                size: isSidebar ? 18 : 19,
                color: "475569",
                font: fontName,
              }),
              new TextRun({
                text: edu.score,
                size: isSidebar ? 18 : 19,
                color: "334155",
                font: fontName,
              }),
            ],
          }),
        );
      }
    }
    return items;
  };

  const buildSkillsBlock = (
    isSidebar = false,
  ): (Paragraph | Table)[] | null => {
    if (!skills || skills.length === 0) return null;
    const items: (Paragraph | Table)[] = [
      ...createSectionHeader("Skills", isSidebar),
    ];

    const categorized: Record<string, string[]> = {};
    const uncategorized: string[] = [];

    for (const s of skills) {
      if (s.category && s.category.trim().length > 0) {
        if (!categorized[s.category]) categorized[s.category] = [];
        categorized[s.category].push(s.name);
      } else {
        uncategorized.push(s.name);
      }
    }

    const categories = Object.keys(categorized);
    if (categories.length > 0) {
      for (const cat of categories) {
        items.push(
          new Paragraph({
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: `${cat}: `,
                bold: true,
                size: isSidebar ? 19 : 20,
                color: accentHex,
                font: fontName,
              }),
              new TextRun({
                text: categorized[cat].join(", "),
                size: isSidebar ? 18 : 19,
                color: "334155",
                font: fontName,
              }),
            ],
          }),
        );
      }
      if (uncategorized.length > 0) {
        items.push(
          new Paragraph({
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: "Other: ",
                bold: true,
                size: isSidebar ? 19 : 20,
                color: accentHex,
                font: fontName,
              }),
              new TextRun({
                text: uncategorized.join(", "),
                size: isSidebar ? 18 : 19,
                color: "334155",
                font: fontName,
              }),
            ],
          }),
        );
      }
    } else {
      items.push(
        new Paragraph({
          spacing: { before: 30, after: 30 },
          children: [
            new TextRun({
              text: skills.map((s) => s.name).join("  •  "),
              size: isSidebar ? 18 : 19,
              color: "334155",
              font: fontName,
            }),
          ],
        }),
      );
    }
    return items;
  };

  const buildCustomSectionsBlock = (
    isSidebar = false,
  ): (Paragraph | Table)[] | null => {
    if (!customSections || customSections.length === 0) return null;
    const items: (Paragraph | Table)[] = [];
    for (const sec of customSections) {
      if (!sec.title) continue;
      items.push(...createSectionHeader(sec.title, isSidebar));
      for (const item of sec.items) {
        items.push(
          ...createEntryHeader(
            item.name || "",
            "",
            item.date || "",
            "",
            isSidebar,
          ),
        );
        if (item.description) {
          const bullets = item.description
            .split("\n")
            .filter((b) => b.trim().length > 0);
          for (const b of bullets) {
            items.push(createBullet(b, isSidebar));
          }
        }
      }
    }
    return items.length > 0 ? items : null;
  };

  // --- Contact Stack for Sidebar ---
  const buildSidebarContactInfo = (): (Paragraph | Table)[] => {
    const contacts: { label: string; value?: string }[] = [
      { label: "Email", value: personalInfo.email },
      { label: "Phone", value: personalInfo.phone },
      { label: "Location", value: personalInfo.location },
      { label: "LinkedIn", value: personalInfo.linkedin },
      { label: "GitHub", value: personalInfo.github },
      { label: "Website", value: personalInfo.website },
    ].filter((c) => Boolean(c.value));

    if (contacts.length === 0) return [];

    const items: (Paragraph | Table)[] = [
      ...createSectionHeader("Contact", true),
    ];
    for (const c of contacts) {
      items.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({
              text: `${c.label}: `,
              bold: true,
              size: 18,
              color: accentHex,
              font: fontName,
            }),
            new TextRun({
              text: c.value || "",
              size: 18,
              color: "334155",
              font: fontName,
            }),
          ],
        }),
      );
    }
    return items;
  };

  // --- Horizontal Contact Line for Single Column / Header ---
  const buildHorizontalContactParagraph = (
    align:
      | typeof AlignmentType.CENTER
      | typeof AlignmentType.LEFT
      | typeof AlignmentType.RIGHT = AlignmentType.CENTER,
  ): Paragraph | null => {
    const contactParts = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin}` : "",
      personalInfo.github ? `GitHub: ${personalInfo.github}` : "",
      personalInfo.website ? `Portfolio: ${personalInfo.website}` : "",
    ].filter(Boolean);

    if (contactParts.length === 0) return null;

    return new Paragraph({
      alignment: align,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: contactParts.join("   |   "),
          size: 19,
          color: "64748B",
          font: fontName,
        }),
      ],
    });
  };

  // -------------------------------------------------------------
  // ASSEMBLE DOCUMENT ACCORDING TO TEMPLATE LAYOUT
  // -------------------------------------------------------------
  const documentChildren: (Paragraph | Table)[] = [];

  if (layout === "left-sidebar" || layout === "right-sidebar") {
    // 2-COLUMN TABLE LAYOUT
    const sidebarItems: (Paragraph | Table)[] = [
      ...buildSidebarContactInfo(),
      ...(buildSkillsBlock(true) || []),
      ...(buildEducationBlock(true) || []),
      ...(buildCustomSectionsBlock(true) || []),
    ];

    const mainItems: (Paragraph | Table)[] = [
      // Name & Title
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({
            text: fullName,
            bold: true,
            size: 42, // 21pt
            color: accentHex,
            font: fontName,
          }),
        ],
      }),
      ...(personalInfo.title
        ? [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { after: 120 },
              children: [
                new TextRun({
                  text: personalInfo.title,
                  italics: true,
                  size: 24,
                  color: "475569",
                  font: fontName,
                }),
              ],
            }),
          ]
        : []),
      ...(buildSummaryBlock(false) || []),
      ...(buildExperienceBlock(false) || []),
      ...(buildProjectsBlock(false) || []),
    ];

    const sidebarCell = new TableCell({
      width: { size: 34, type: WidthType.PERCENTAGE },
      shading: { fill: "F8FAFC" }, // subtle light tint matching sidebar
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      borders: {
        ...NO_BORDER,
        ...(layout === "left-sidebar"
          ? { right: { style: BorderStyle.SINGLE, size: 6, color: "E2E8F0" } }
          : { left: { style: BorderStyle.SINGLE, size: 6, color: "E2E8F0" } }),
      },
      children: sidebarItems,
    });

    const mainCell = new TableCell({
      width: { size: 66, type: WidthType.PERCENTAGE },
      margins: { top: 120, bottom: 120, left: 180, right: 120 },
      borders: NO_BORDER,
      children: mainItems,
    });

    const twoColumnTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children:
            layout === "left-sidebar"
              ? [sidebarCell, mainCell]
              : [mainCell, sidebarCell],
        }),
      ],
    });

    documentChildren.push(twoColumnTable);
  } else if (layout === "split-header") {
    // SPLIT HEADER TABLE (Name & Title on Left, Contact Details on Right)
    const rightContacts = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.github,
      personalInfo.website,
    ].filter(Boolean);

    const splitHeaderTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        ...NO_BORDER,
        bottom: {
          style: BorderStyle.SINGLE,
          size: 12,
          color: accentHex,
        },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 40 },
                  children: [
                    new TextRun({
                      text: fullName,
                      bold: true,
                      size: 42,
                      color: accentHex,
                      font: fontName,
                    }),
                  ],
                }),
                ...(personalInfo.title
                  ? [
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: personalInfo.title,
                            italics: true,
                            size: 24,
                            color: "475569",
                            font: fontName,
                          }),
                        ],
                      }),
                    ]
                  : []),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: rightContacts.map(
                (c) =>
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 10, after: 10 },
                    children: [
                      new TextRun({
                        text: c || "",
                        size: 18,
                        color: "475569",
                        font: fontName,
                      }),
                    ],
                  }),
              ),
            }),
          ],
        }),
      ],
    });

    documentChildren.push(splitHeaderTable);
    documentChildren.push(
      new Paragraph({ spacing: { before: 80 }, children: [] }),
    );

    // Body Sections
    if (buildSummaryBlock())
      documentChildren.push(...(buildSummaryBlock() || []));
    if (buildExperienceBlock())
      documentChildren.push(...(buildExperienceBlock() || []));
    if (buildProjectsBlock())
      documentChildren.push(...(buildProjectsBlock() || []));
    if (buildEducationBlock())
      documentChildren.push(...(buildEducationBlock() || []));
    if (buildSkillsBlock())
      documentChildren.push(...(buildSkillsBlock() || []));
    if (buildCustomSectionsBlock())
      documentChildren.push(...(buildCustomSectionsBlock() || []));
  } else if (layout === "executive") {
    // EXECUTIVE FORMAL BANNER HEADER
    documentChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({
            text: fullName.toUpperCase(),
            bold: true,
            size: 40,
            color: accentHex,
            font: fontName,
          }),
        ],
      }),
    );

    if (personalInfo.title) {
      documentChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: personalInfo.title.toUpperCase(),
              bold: true,
              size: 22,
              color: "475569",
              font: fontName,
            }),
          ],
        }),
      );
    }

    const contactP = buildHorizontalContactParagraph(AlignmentType.CENTER);
    if (contactP) documentChildren.push(contactP);

    // Decorative Accent Border Line
    documentChildren.push(
      new Paragraph({
        spacing: { before: 0, after: 120 },
        border: {
          bottom: {
            color: accentHex,
            size: 16,
            style: BorderStyle.SINGLE,
            space: 4,
          },
        },
        children: [],
      }),
    );

    // Body Sections
    if (buildSummaryBlock())
      documentChildren.push(...(buildSummaryBlock() || []));
    if (buildExperienceBlock())
      documentChildren.push(...(buildExperienceBlock() || []));
    if (buildProjectsBlock())
      documentChildren.push(...(buildProjectsBlock() || []));
    if (buildEducationBlock())
      documentChildren.push(...(buildEducationBlock() || []));
    if (buildSkillsBlock())
      documentChildren.push(...(buildSkillsBlock() || []));
    if (buildCustomSectionsBlock())
      documentChildren.push(...(buildCustomSectionsBlock() || []));
  } else {
    // SINGLE-COLUMN (Classic, Minimal, LaTeX, Consulting)
    documentChildren.push(
      new Paragraph({
        alignment: headerAlign,
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({
            text: fullName,
            bold: true,
            size: 40,
            color: accentHex,
            font: fontName,
          }),
        ],
      }),
    );

    if (personalInfo.title) {
      documentChildren.push(
        new Paragraph({
          alignment: headerAlign,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: personalInfo.title,
              italics: true,
              size: 24,
              color: "475569",
              font: fontName,
            }),
          ],
        }),
      );
    }

    const contactP = buildHorizontalContactParagraph(headerAlign);
    if (contactP) documentChildren.push(contactP);

    // Body Sections
    if (buildSummaryBlock())
      documentChildren.push(...(buildSummaryBlock() || []));
    if (buildExperienceBlock())
      documentChildren.push(...(buildExperienceBlock() || []));
    if (buildProjectsBlock())
      documentChildren.push(...(buildProjectsBlock() || []));
    if (buildEducationBlock())
      documentChildren.push(...(buildEducationBlock() || []));
    if (buildSkillsBlock())
      documentChildren.push(...(buildSkillsBlock() || []));
    if (buildCustomSectionsBlock())
      documentChildren.push(...(buildCustomSectionsBlock() || []));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch (720 dxa)
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: documentChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Convenience helper to download the styled resume as an editable .docx file in the browser.
 */
export async function downloadDocxResume(
  data: ResumeData,
  templateId = "dev-1",
  themeConfig?: ThemeConfig,
) {
  const blob = await generateDocxResume(data, templateId, themeConfig);
  const fullName =
    `${data.personalInfo.firstName || "Resume"}_${data.personalInfo.lastName || ""}`.trim();
  const filename =
    `${fullName || "Resume"}_${templateId.toUpperCase()}_ATS.docx`.replace(
      /\s+/g,
      "_",
    );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
