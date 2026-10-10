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
import { ResumeData } from "@/types/resume";

/**
 * Generates an ATS-compliant, professionally formatted Microsoft Word (.docx) document
 * from the user's structured resume data.
 */
export async function generateDocxResume(data: ResumeData): Promise<Blob> {
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

  const children: (Paragraph | Table)[] = [];

  // 1. Header: Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60, before: 0 },
      children: [
        new TextRun({
          text: fullName,
          bold: true,
          size: 40, // 20pt
          color: "1A202C",
        }),
      ],
    }),
  );

  // Job Title (if present)
  if (personalInfo.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: personalInfo.title,
            italics: true,
            size: 24, // 12pt
            color: "4A5568",
          }),
        ],
      }),
    );
  }

  // Contact Info Line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin}` : "",
    personalInfo.github ? `GitHub: ${personalInfo.github}` : "",
    personalInfo.website ? `Portfolio: ${personalInfo.website}` : "",
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: 19, // ~9.5pt
            color: "718096",
          }),
        ],
      }),
    );
  }

  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: "2D3748",
          space: 2,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 23, // 11.5pt
          color: "1A202C",
        }),
      ],
    });
  };

  // 2. Professional Summary
  if (summary && summary.trim().length > 0) {
    children.push(createSectionHeader("Professional Summary"));
    children.push(
      new Paragraph({
        spacing: { after: 140, line: 276 },
        children: [
          new TextRun({
            text: summary.trim(),
            size: 21, // 10.5pt
            color: "2D3748",
          }),
        ],
      }),
    );
  }

  // Helper for two-column header (Role/Title on left, Dates/Location on right)
  const createEntryHeaderTable = (
    leftText: string,
    leftSub: string,
    rightDate: string,
    rightLoc: string,
  ) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  spacing: { before: 80, after: 20 },
                  children: [
                    new TextRun({
                      text: leftText,
                      bold: true,
                      size: 21,
                      color: "1A202C",
                    }),
                    ...(leftSub
                      ? [
                          new TextRun({
                            text: ` — ${leftSub}`,
                            italics: true,
                            size: 21,
                            color: "4A5568",
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
                  spacing: { before: 80, after: 20 },
                  children: [
                    new TextRun({
                      text: rightDate,
                      bold: true,
                      size: 20,
                      color: "4A5568",
                    }),
                    ...(rightLoc
                      ? [
                          new TextRun({
                            text: ` | ${rightLoc}`,
                            size: 19,
                            color: "718096",
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
    });
  };

  // 3. Work Experience
  if (experience && experience.length > 0) {
    children.push(createSectionHeader("Work Experience"));

    for (const exp of experience) {
      const dates =
        `${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}`.trim();
      children.push(
        createEntryHeaderTable(exp.role || "", exp.company || "", dates, ""),
      );

      // Bullet points
      const bullets = (exp.description || "")
        .split("\n")
        .filter((b) => b.trim().length > 0);

      for (const bullet of bullets) {
        const cleanBullet = bullet.replace(/^[•\-\*]\s*/, "").trim();
        if (!cleanBullet) continue;

        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30, line: 260 },
            children: [
              new TextRun({
                text: cleanBullet,
                size: 20, // 10pt
                color: "2D3748",
              }),
            ],
          }),
        );
      }
    }
  }

  // 4. Skills
  if (skills && skills.length > 0) {
    children.push(createSectionHeader("Technical Skills"));

    // Group skills by category if available
    const categorized: Record<string, string[]> = {};
    const uncategorized: string[] = [];

    for (const skill of skills) {
      if (skill.category && skill.category.trim().length > 0) {
        if (!categorized[skill.category]) categorized[skill.category] = [];
        categorized[skill.category].push(skill.name);
      } else {
        uncategorized.push(skill.name);
      }
    }

    const categories = Object.keys(categorized);
    if (categories.length > 0) {
      for (const cat of categories) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: `${cat}: `,
                bold: true,
                size: 21,
                color: "1A202C",
              }),
              new TextRun({
                text: categorized[cat].join(", "),
                size: 20,
                color: "2D3748",
              }),
            ],
          }),
        );
      }
      if (uncategorized.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: "Other Skills: ",
                bold: true,
                size: 21,
                color: "1A202C",
              }),
              new TextRun({
                text: uncategorized.join(", "),
                size: 20,
                color: "2D3748",
              }),
            ],
          }),
        );
      }
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: skills.map((s) => s.name).join("  •  "),
              size: 20,
              color: "2D3748",
            }),
          ],
        }),
      );
    }
  }

  // 5. Projects
  if (projects && projects.length > 0) {
    children.push(createSectionHeader("Key Projects"));

    for (const proj of projects) {
      const tech =
        proj.technologies && proj.technologies.length > 0
          ? ` [${proj.technologies.join(", ")}]`
          : "";
      const links = [proj.url, proj.github].filter(Boolean).join(" | ");

      children.push(createEntryHeaderTable(proj.name || "", links, tech, ""));

      const bullets = (proj.description || "")
        .split("\n")
        .filter((b) => b.trim().length > 0);

      for (const bullet of bullets) {
        const cleanBullet = bullet.replace(/^[•\-\*]\s*/, "").trim();
        if (!cleanBullet) continue;

        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30, line: 260 },
            children: [
              new TextRun({
                text: cleanBullet,
                size: 20,
                color: "2D3748",
              }),
            ],
          }),
        );
      }
    }
  }

  // 6. Education
  if (education && education.length > 0) {
    children.push(createSectionHeader("Education"));

    for (const edu of education) {
      const dates =
        `${edu.startDate || ""} - ${edu.current ? "Present" : edu.endDate || ""}`.trim();

      children.push(
        createEntryHeaderTable(
          edu.institution || "",
          edu.degree || "",
          dates,
          "",
        ),
      );

      if (edu.score) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 40 },
            children: [
              new TextRun({
                text: `Grade / Score: `,
                bold: true,
                size: 19,
                color: "4A5568",
              }),
              new TextRun({ text: edu.score, size: 19, color: "2D3748" }),
            ],
          }),
        );
      }
    }
  }

  // 7. Custom Sections
  if (customSections && customSections.length > 0) {
    for (const sec of customSections) {
      if (!sec.title) continue;
      children.push(createSectionHeader(sec.title));

      for (const item of sec.items) {
        children.push(
          createEntryHeaderTable(item.name || "", "", item.date || "", ""),
        );

        if (item.description) {
          const bullets = item.description
            .split("\n")
            .filter((b) => b.trim().length > 0);
          for (const bullet of bullets) {
            const cleanBullet = bullet.replace(/^[•\-\*]\s*/, "").trim();
            if (!cleanBullet) continue;

            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 30, after: 30, line: 260 },
                children: [
                  new TextRun({
                    text: cleanBullet,
                    size: 20,
                    color: "2D3748",
                  }),
                ],
              }),
            );
          }
        }
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Convenience helper to download the resume as a .docx file in browser.
 */
export async function downloadDocxResume(data: ResumeData) {
  const blob = await generateDocxResume(data);
  const fullName =
    `${data.personalInfo.firstName || "Resume"}_${data.personalInfo.lastName || ""}`.trim();
  const filename = `${fullName || "Resume"}_ATS.docx`.replace(/\s+/g, "_");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
