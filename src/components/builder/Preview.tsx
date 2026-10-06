"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { TemplateEngine } from "./TemplateEngine";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { AtsAnalyzer } from "./AtsAnalyzer";
import { Wand2, Loader2 } from "lucide-react";

export function Preview() {
  const { data, activeTemplate, themeConfig, updateThemeConfig } = useResumeStore();
  const [mounted, setMounted] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);
  const [mode, setMode] = useState<"resume" | "cover-letter">("resume");
  const [isShrinking, setIsShrinking] = useState(false);

  const smartShrink = async () => {
    setIsShrinking(true);
    let currentZoom = 1;
    // Reset zoom first
    updateThemeConfig({ documentZoom: currentZoom });
    
    // Wait for react to re-render the reset zoom
    await new Promise((r) => setTimeout(r, 150));
    
    const el = document.getElementById("template-root");
    if (!el) {
      setIsShrinking(false);
      return;
    }

    // A4 ratio 210/297 -> for 794px width, height is exactly 1123px.
    let count = 0;
    while (el.scrollHeight > 1123 && currentZoom > 0.6 && count < 20) {
      currentZoom -= 0.02;
      updateThemeConfig({ documentZoom: currentZoom });
      // yield to browser layout
      await new Promise((r) => setTimeout(r, 50));
      count++;
    }
    setIsShrinking(false);
  };

  useEffect(() => {
    setMounted(true);
    setMobileScale(1);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-muted/30" />;

  return (
    <div className="w-full h-full bg-muted/30 overflow-y-auto flex justify-center @container print:!bg-transparent print:p-0 print:overflow-visible print:block print:h-auto relative">
      
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
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
        <button
          onClick={smartShrink}
          disabled={isShrinking || mode !== "resume"}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isShrinking ? "text-purple-400" : "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"} flex items-center gap-2`}
          title="Magic Fit to 1 Page"
        >
          {isShrinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
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
