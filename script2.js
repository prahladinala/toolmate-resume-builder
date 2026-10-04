const fs = require('fs');
let f = fs.readFileSync('src/components/builder/TemplateEngine.tsx', 'utf8');

const sidebarSkillsStr = `{data.skills && data.skills.length > 0 && (
              <div className="mb-12 print:break-inside-avoid">
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
            )}`;

const sidebarEduStr = `{education.length > 0 && (
              <div className="print:break-inside-avoid">
                <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">
                  Education
                </h3>
                {sortedEducation.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                    <p className="text-xs opacity-80">{edu.institution}</p>
                    <p className="text-xs opacity-80">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}`;

f = f.replace(sidebarSkillsStr + '\n            ' + sidebarEduStr,
`{sideColOrder.map(s => {
              if (s === "skills") return (${sidebarSkillsStr});
              if (s === "education") return (${sidebarEduStr});
              return null;
            })}`);

const rightSidebarSkillsStr = `{data.skills && data.skills.length > 0 && (
              <div className="mb-12 print:break-inside-avoid">
                <h3 className="text-xl font-bold mb-4 border-b border-slate-300 pb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span
                      key={s.id}
                      className="bg-white text-slate-700 px-2 py-1 border border-slate-200 rounded text-xs"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}`;

const rightSidebarEduStr = `{education.length > 0 && (
              <div className="print:break-inside-avoid">
                <h3 className="text-xl font-bold mb-4 border-b border-slate-300 pb-2">
                  Education
                </h3>
                {sortedEducation.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                    <p className="text-xs opacity-80">{edu.institution}</p>
                    <p className="text-xs opacity-80">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}`;

f = f.replace(rightSidebarSkillsStr + '\n            ' + rightSidebarEduStr,
`{sideColOrder.map(s => {
              if (s === "skills") return (${rightSidebarSkillsStr});
              if (s === "education") return (${rightSidebarEduStr});
              return null;
            })}`);

// Replace main cols in left/right sidebars
const leftMainColOld = `{summary && (
            <section className={\`\${sectionSpacing} print:break-inside-avoid\`}>
              {renderSectionHeader("Profile")}
              <div className="leading-relaxed text-sm markdown-container prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{summary}</ReactMarkdown></div>
            </section>
          )}
          {renderExperience()}
          {renderProjects()}`;
const mainColNew = `{mainColOrder.map(getSection)}`;
f = f.replace(leftMainColOld, mainColNew);

const rightMainColOld = `{summary && (
            <section className={\`\${sectionSpacing} print:break-inside-avoid\`}>
              {renderSectionHeader("Summary")}
              <div className="leading-relaxed text-sm markdown-container prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{summary}</ReactMarkdown></div>
            </section>
          )}
          {renderExperience()}
          {renderProjects()}`;
f = f.replace(rightMainColOld, mainColNew);

fs.writeFileSync('src/components/builder/TemplateEngine.tsx', f);
