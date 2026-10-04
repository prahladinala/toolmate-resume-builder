const fs = require('fs');
let f = fs.readFileSync('src/components/builder/TemplateEngine.tsx', 'utf8');

const helper = `
  const getSection = (name) => {
    switch (name) {
      case 'summary': return summary ? (
        <section key='summary' className={\`\${sectionSpacing} print:break-inside-avoid\`}>
          {renderSectionHeader('Summary')}
          <div className='leading-relaxed text-sm markdown-container prose prose-sm max-w-none dark:prose-invert'><ReactMarkdown>{summary}</ReactMarkdown></div>
        </section>
      ) : null;
      case 'experience': return <React.Fragment key='experience'>{renderExperience()}</React.Fragment>;
      case 'projects': return <React.Fragment key='projects'>{renderProjects()}</React.Fragment>;
      case 'education': return <React.Fragment key='education'>{renderEducation()}</React.Fragment>;
      case 'skills': return <React.Fragment key='skills'>{renderSkills()}</React.Fragment>;
      default: return null;
    }
  };

  const mainColOrder = config.sectionOrder.filter(s => ['summary', 'experience', 'projects'].includes(s));
  const sideColOrder = config.sectionOrder.filter(s => ['skills', 'education'].includes(s));

  const renderExperience = () => {
`;
f = f.replace('  const renderExperience = () => {', helper);

// single-column
f = f.replace(/\{summary && \([\s\S]*?<\/section>\s*\)\}\s*\{renderSkills\(\)\}\s*\{renderExperience\(\)\}\s*\{renderProjects\(\)\}\s*\{renderEducation\(\)\}/g,
'{config.sectionOrder.map(getSection)}');

// split-header
f = f.replace(/\{summary && \([\s\S]*?<\/section>\s*\)\}\s*<div className="grid grid-cols-\[2fr_1fr\] gap-8\">\s*<div>\s*\{renderExperience\(\)\}\s*\{renderProjects\(\)\}\s*<\/div>\s*<div>\s*\{renderSkills\(\)\}\s*\{renderEducation\(\)\}\s*<\/div>\s*<\/div>/g,
`<div className="grid grid-cols-[2fr_1fr] gap-8">
            <div>
              {mainColOrder.map(getSection)}
            </div>
            <div>
              {sideColOrder.map(getSection)}
            </div>
          </div>`);

fs.writeFileSync('src/components/builder/TemplateEngine.tsx', f);
