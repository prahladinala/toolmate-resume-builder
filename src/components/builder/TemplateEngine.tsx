import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Briefcase, Terminal } from 'lucide-react';

type LayoutType = 'left-sidebar' | 'right-sidebar' | 'single-column' | 'split-header';
type AlignType = 'left' | 'center' | 'right';
type FontType = 'sans' | 'serif' | 'mono';

interface EngineConfig {
  layout: LayoutType;
  headerAlign: AlignType;
  imageAlign: AlignType | 'hidden';
  fontFamily: FontType;
  accentColor: string;
  bgColor: string;
  textColor: string;
  sectionStyle: 'minimal' | 'boxed' | 'underline' | 'badge';
}

function getIcon(name: string, color: string) {
  const props = { className: `w-4 h-4 text-${color}` };
  switch (name) {
    case 'email': return <Mail {...props} />;
    case 'phone': return <Phone {...props} />;
    case 'location': return <MapPin {...props} />;
    case 'website': return <Globe {...props} />;
    case 'linkedin': return <Briefcase {...props} />;
    case 'github': return <Terminal {...props} />;
    default: return null;
  }
}

export function TemplateEngine({ data, templateId }: { data: ResumeData, templateId: string }) {
  // Explicit configurations to guarantee zero repetition and high contrast between choices
  const configs: Record<string, EngineConfig> = {
    // Developers: Mono fonts, robust structure, clean logic
    'dev-1': { layout: 'left-sidebar', headerAlign: 'left', imageAlign: 'center', fontFamily: 'mono', accentColor: 'zinc-900', bgColor: '#FFFFFF', textColor: 'text-slate-800', sectionStyle: 'minimal' },
    'dev-2': { layout: 'split-header', headerAlign: 'left', imageAlign: 'hidden', fontFamily: 'sans', accentColor: 'blue-600', bgColor: '#FAFAFA', textColor: 'text-slate-800', sectionStyle: 'badge' },
    'dev-3': { layout: 'right-sidebar', headerAlign: 'right', imageAlign: 'right', fontFamily: 'mono', accentColor: 'emerald-600', bgColor: '#FFFFFF', textColor: 'text-zinc-900', sectionStyle: 'boxed' },
    'dev-4': { layout: 'single-column', headerAlign: 'left', imageAlign: 'left', fontFamily: 'mono', accentColor: 'indigo-500', bgColor: '#FFFFFF', textColor: 'text-slate-800', sectionStyle: 'underline' },

    // Designers: Vibrant, asymmetric, centered, heavily styled
    'des-1': { layout: 'single-column', headerAlign: 'center', imageAlign: 'center', fontFamily: 'sans', accentColor: 'pink-500', bgColor: '#FFF0F5', textColor: 'text-slate-900', sectionStyle: 'boxed' },
    'des-2': { layout: 'left-sidebar', headerAlign: 'left', imageAlign: 'hidden', fontFamily: 'sans', accentColor: 'purple-600', bgColor: '#FFFFFF', textColor: 'text-slate-800', sectionStyle: 'badge' },
    'des-3': { layout: 'right-sidebar', headerAlign: 'left', imageAlign: 'center', fontFamily: 'sans', accentColor: 'orange-500', bgColor: '#FFFAF0', textColor: 'text-slate-900', sectionStyle: 'underline' },
    'des-4': { layout: 'split-header', headerAlign: 'center', imageAlign: 'center', fontFamily: 'serif', accentColor: 'rose-500', bgColor: '#FFFFFF', textColor: 'text-slate-800', sectionStyle: 'minimal' },

    // Corporate: Classic Serif, conservative colors, formal alignments
    'corp-1': { layout: 'single-column', headerAlign: 'left', imageAlign: 'left', fontFamily: 'serif', accentColor: 'slate-800', bgColor: '#FFFFFF', textColor: 'text-gray-900', sectionStyle: 'underline' },
    'corp-2': { layout: 'left-sidebar', headerAlign: 'left', imageAlign: 'center', fontFamily: 'serif', accentColor: 'gray-900', bgColor: '#F9FAFB', textColor: 'text-slate-800', sectionStyle: 'minimal' },
    'corp-3': { layout: 'right-sidebar', headerAlign: 'left', imageAlign: 'hidden', fontFamily: 'serif', accentColor: 'stone-700', bgColor: '#FFFFFF', textColor: 'text-stone-900', sectionStyle: 'boxed' },
    'corp-4': { layout: 'split-header', headerAlign: 'center', imageAlign: 'left', fontFamily: 'serif', accentColor: 'neutral-800', bgColor: '#FFFFFF', textColor: 'text-neutral-900', sectionStyle: 'badge' },

    // General: Clean Sans, versatile, neutral layouts
    'gen-1': { layout: 'single-column', headerAlign: 'center', imageAlign: 'center', fontFamily: 'sans', accentColor: 'teal-600', bgColor: '#FFFFFF', textColor: 'text-slate-800', sectionStyle: 'minimal' },
    'gen-2': { layout: 'split-header', headerAlign: 'left', imageAlign: 'right', fontFamily: 'sans', accentColor: 'sky-600', bgColor: '#F0F9FF', textColor: 'text-slate-800', sectionStyle: 'underline' },
    'gen-3': { layout: 'left-sidebar', headerAlign: 'center', imageAlign: 'center', fontFamily: 'sans', accentColor: 'amber-600', bgColor: '#FFFFFF', textColor: 'text-stone-800', sectionStyle: 'badge' },
    'gen-4': { layout: 'right-sidebar', headerAlign: 'right', imageAlign: 'left', fontFamily: 'sans', accentColor: 'red-500', bgColor: '#FFF5F5', textColor: 'text-slate-900', sectionStyle: 'boxed' },
  };

  // Fallback to dev-1 if somehow an invalid ID is passed
  const config = configs[templateId] || configs['dev-1'];

  const colorClasses = {
    'blue-600': { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
    'indigo-500': { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500' },
    'cyan-600': { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-600' },
    'zinc-900': { bg: 'bg-zinc-900', text: 'text-zinc-900', border: 'border-zinc-900' },
    'emerald-600': { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600' },
    'pink-500': { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500' },
    'purple-600': { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600' },
    'orange-500': { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' },
    'rose-500': { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
    'fuchsia-500': { bg: 'bg-fuchsia-500', text: 'text-fuchsia-500', border: 'border-fuchsia-500' },
    'slate-800': { bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800' },
    'gray-900': { bg: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-900' },
    'stone-700': { bg: 'bg-stone-700', text: 'text-stone-700', border: 'border-stone-700' },
    'neutral-800': { bg: 'bg-neutral-800', text: 'text-neutral-800', border: 'border-neutral-800' },
    'zinc-800': { bg: 'bg-zinc-800', text: 'text-zinc-800', border: 'border-zinc-800' },
    'teal-600': { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-600' },
    'sky-600': { bg: 'bg-sky-600', text: 'text-sky-600', border: 'border-sky-600' },
    'amber-600': { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600' },
    'red-500': { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' },
    'emerald-500': { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' }
  };

  const accentClasses = colorClasses[config.accentColor as keyof typeof colorClasses] || colorClasses['zinc-900'];

  const { personalInfo, summary, experience, education } = data;

  // -- Component Renderers based on Config --

  const renderImage = () => {
    if (!personalInfo.photoBase64 || config.imageAlign === 'hidden') return null;
    return (
      <img 
        src={personalInfo.photoBase64} 
        alt="Profile" 
        className={`w-32 h-32 object-cover ${config.layout === 'split-header' ? 'rounded-xl shadow-lg' : 'rounded-full border-4'} border-white shadow-md`}
      />
    );
  };

  const renderContactInfo = () => (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm ${config.headerAlign === 'center' ? 'justify-center' : ''}`}>
      {personalInfo.email && <div className="flex items-center gap-1.5">{getIcon('email', config.accentColor)}{personalInfo.email}</div>}
      {personalInfo.phone && <div className="flex items-center gap-1.5">{getIcon('phone', config.accentColor)}{personalInfo.phone}</div>}
      {personalInfo.location && <div className="flex items-center gap-1.5">{getIcon('location', config.accentColor)}{personalInfo.location}</div>}
      {personalInfo.linkedin && <div className="flex items-center gap-1.5">{getIcon('linkedin', config.accentColor)}{personalInfo.linkedin.replace('https://', '')}</div>}
      {personalInfo.github && <div className="flex items-center gap-1.5">{getIcon('github', config.accentColor)}{personalInfo.github.replace('https://', '')}</div>}
      {personalInfo.website && <div className="flex items-center gap-1.5">{getIcon('website', config.accentColor)}{personalInfo.website.replace('https://', '')}</div>}
    </div>
  );

  const renderSectionHeader = (title: string) => {
    switch (config.sectionStyle) {
      case 'badge':
        return <h3 className={`text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-3`}><span className={`${accentClasses.bg} text-white px-3 py-1 rounded-full text-xs`}>◆</span>{title}</h3>;
      case 'boxed':
        return <h3 className={`text-xl font-bold uppercase mb-4 ${accentClasses.bg} text-white p-2 rounded`}>{title}</h3>;
      case 'underline':
        return <h3 className={`text-xl font-bold uppercase mb-4 border-b-2 ${accentClasses.border} pb-1`}>{title}</h3>;
      case 'minimal':
      default:
        return <h3 className={`text-xl font-bold tracking-widest uppercase mb-4 ${accentClasses.text}`}>{title}</h3>;
    }
  };

  const renderExperience = () => (
    <section className="mb-8">
      {renderSectionHeader('Experience')}
      <div className="space-y-6">
        {experience.map(exp => (
          <div key={exp.id} className={config.sectionStyle === 'boxed' ? 'bg-slate-50 p-4 rounded-xl' : ''}>
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-lg">{exp.role} <span className={`${accentClasses.text}`}>@ {exp.company}</span></h4>
              <span className="text-sm font-semibold opacity-70">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            {exp.description && <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section className="mb-8">
      {renderSectionHeader('Education')}
      <div className="space-y-4">
        {education.map(edu => (
          <div key={edu.id} className={config.sectionStyle === 'boxed' ? 'bg-slate-50 p-4 rounded-xl' : ''}>
            <h4 className="font-bold">{edu.degree}</h4>
            <div className="flex justify-between text-sm mt-1">
              <span className={`${accentClasses.text} font-medium`}>{edu.institution}</span>
              <span className="opacity-70">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // Compute Layouts
  let layoutContainer = null;

  if (config.layout === 'single-column') {
    layoutContainer = (
      <div className="p-10 max-w-4xl mx-auto">
        <header className={`mb-10 flex flex-col ${config.headerAlign === 'center' ? 'items-center text-center' : config.headerAlign === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
          {config.imageAlign === 'center' && <div className="mb-6">{renderImage()}</div>}
          <div className={`flex w-full ${config.imageAlign === 'right' ? 'flex-row-reverse justify-between' : config.imageAlign === 'left' ? 'flex-row justify-between' : 'flex-col'}`}>
            {(config.imageAlign === 'left' || config.imageAlign === 'right') && renderImage()}
            <div className={config.imageAlign === 'left' ? 'ml-6 flex-1' : config.imageAlign === 'right' ? 'mr-6 flex-1' : 'w-full'}>
              <h1 className="text-5xl font-black mb-2">{personalInfo.firstName} <span className={`${accentClasses.text}`}>{personalInfo.lastName}</span></h1>
              <h2 className="text-2xl font-medium opacity-80">{personalInfo.title}</h2>
              {renderContactInfo()}
            </div>
          </div>
        </header>
        {summary && <section className="mb-8">{renderSectionHeader('Summary')}<p className="leading-relaxed text-sm">{summary}</p></section>}
        {renderExperience()}
        {renderEducation()}
      </div>
    );
  } else if (config.layout === 'split-header') {
    layoutContainer = (
      <div>
        <header className={`${accentClasses.bg} text-white p-10 flex flex-col md:flex-row gap-8 items-center`}>
          {renderImage()}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.firstName} {personalInfo.lastName}</h1>
            <h2 className="text-xl opacity-90 mb-4">{personalInfo.title}</h2>
            <div className="opacity-90">{renderContactInfo()}</div>
          </div>
        </header>
        <div className="p-10">
          {summary && <section className="mb-8">{renderSectionHeader('Summary')}<p className="leading-relaxed text-sm">{summary}</p></section>}
          <div className="grid grid-cols-[2fr_1fr] gap-8">
            <div>{renderExperience()}</div>
            <div>{renderEducation()}</div>
          </div>
        </div>
      </div>
    );
  } else if (config.layout === 'left-sidebar') {
    layoutContainer = (
      <div className="flex h-full min-h-[297mm]">
        <aside className={`w-[35%] ${accentClasses.bg} text-white p-8`}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6">{renderImage()}</div>
            <h1 className="text-3xl font-bold mb-1">{personalInfo.firstName} {personalInfo.lastName}</h1>
            <h2 className="text-lg opacity-90">{personalInfo.title}</h2>
          </div>
          <div className="space-y-4 opacity-90">
            {renderContactInfo()}
          </div>
          {education.length > 0 && (
            <div className="mt-12">
               <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Education</h3>
               {education.map(edu => (
                  <div key={edu.id} className="mb-4">
                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                    <p className="text-xs opacity-80">{edu.institution}</p>
                    <p className="text-xs opacity-80">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                  </div>
               ))}
            </div>
          )}
        </aside>
        <main className="w-[65%] p-8">
          {summary && <section className="mb-8">{renderSectionHeader('Profile')}<p className="leading-relaxed text-sm">{summary}</p></section>}
          {renderExperience()}
        </main>
      </div>
    );
  } else {
    // Right sidebar
    layoutContainer = (
      <div className="flex h-full min-h-[297mm]">
        <main className="w-[65%] p-8">
          <header className="mb-10">
            <h1 className={`text-5xl font-black mb-2 ${accentClasses.text}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
            <h2 className="text-2xl font-medium opacity-80">{personalInfo.title}</h2>
          </header>
          {summary && <section className="mb-8">{renderSectionHeader('Summary')}<p className="leading-relaxed text-sm">{summary}</p></section>}
          {renderExperience()}
        </main>
        <aside className="w-[35%] bg-slate-100 p-8 border-l border-slate-200">
          <div className="mb-8 text-right">
            <div className="flex justify-end mb-4">{renderImage()}</div>
            {renderContactInfo()}
          </div>
          {renderEducation()}
        </aside>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full font-${config.fontFamily} ${config.textColor}`}
      style={{ backgroundColor: config.bgColor }}
    >
      {layoutContainer}
    </div>
  );
}
