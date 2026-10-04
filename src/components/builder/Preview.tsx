"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { TemplateEngine } from "./TemplateEngine";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { AtsAnalyzer } from "./AtsAnalyzer";

export function Preview() {
  const { data, activeTemplate, themeConfig } = useResumeStore();
  const [mounted, setMounted] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);
  const [mode, setMode] = useState<"resume" | "cover-letter">("resume");

  useEffect(() => {
    setMounted(true);
    setMobileScale(1);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-muted/30" />;

  return (
    <div className="w-full h-full bg-muted/30 overflow-y-auto flex justify-center @container print:!bg-transparent print:p-0 print:overflow-visible print:block relative">
      
      {/* Mode Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 print:hidden bg-white dark:bg-zinc-900 rounded-full shadow-lg p-1 border border-zinc-200 dark:border-zinc-800 flex items-center">
        <button
          onClick={() => setMode("resume")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === "resume" ? "bg-indigo-600 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
        >
          Resume
        </button>
        <button
          onClick={() => setMode("cover-letter")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === "cover-letter" ? "bg-indigo-600 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
        >
          Cover Letter
        </button>
      </div>

      <AtsAnalyzer />
      {/* Mobile Interactive Zoom View */}
      <div className="md:hidden w-full h-[calc(100vh-64px)] overflow-hidden print:hidden">
        <TransformWrapper
          initialScale={mobileScale}
          minScale={0.2}
          maxScale={3}
          limitToBounds={false}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <div
              id="resume-preview-mobile"
              className="w-[794px] min-h-[1123px] bg-white shadow-xl origin-top-left"
            >
              <TemplateEngine
                data={data}
                templateId={activeTemplate || "dev-1"}
                themeConfig={themeConfig}
                mode={mode}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Desktop CSS Scaled View */}
      <div className="hidden md:flex p-8 justify-center w-full print:hidden">
        <div
          className="relative"
          style={{
            width: "min(100cqw - 64px, 794px)",
            height: "calc(min(100cqw - 64px, 794px) * 1.414357)",
          }}
        >
          <div
            id="resume-preview-desktop"
            className="absolute top-0 left-0 w-[794px] min-h-[1123px] bg-white shadow-xl overflow-hidden origin-top-left"
            style={{
              transform: "scale(calc(min(100cqw - 64px, 794px) / 794))",
            }}
          >
            <TemplateEngine
              data={data}
              templateId={activeTemplate || "dev-1"}
              themeConfig={themeConfig}
              mode={mode}
            />
          </div>
        </div>
      </div>

      {/* Print-only unscaled version */}
      <div className="hidden print:block w-[210mm] min-h-[297mm] bg-white m-0 p-0">
        <TemplateEngine
          data={data}
          templateId={activeTemplate || "dev-1"}
          themeConfig={themeConfig}
          mode={mode}
        />
      </div>
    </div>
  );
}
