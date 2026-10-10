"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { TemplateEngine } from "./TemplateEngine";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState, useRef } from "react";
import { AtsAnalyzer } from "./AtsAnalyzer";
import { Wand2, Loader2, Scissors, ZoomIn, ZoomOut } from "lucide-react";

interface PreviewProps {
  mode?: "resume" | "cover-letter";
  onModeChange?: (mode: "resume" | "cover-letter") => void;
  showPageBreaks?: boolean;
  onTogglePageBreaks?: () => void;
  onNavigateStep?: (stepIndex: number) => void;
}

export function Preview({
  mode: propMode,
  onModeChange,
  showPageBreaks: propShowPageBreaks,
  onTogglePageBreaks,
  onNavigateStep,
}: PreviewProps = {}) {
  const { data, activeTemplate, themeConfig, updateThemeConfig } =
    useResumeStore();
  const [mounted, setMounted] = useState(false);
  const [mobileScale, setMobileScale] = useState(0.45);
  const [internalMode, setInternalMode] = useState<"resume" | "cover-letter">(
    "resume",
  );
  const mode = propMode ?? internalMode;
  const setMode = (m: "resume" | "cover-letter") => {
    setInternalMode(m);
    onModeChange?.(m);
  };

  const [isShrinking, setIsShrinking] = useState(false);
  const [internalShowPageBreaks, setInternalShowPageBreaks] = useState(true);
  const showPageBreaks = propShowPageBreaks ?? internalShowPageBreaks;
  const togglePageBreaks = () => {
    if (onTogglePageBreaks) {
      onTogglePageBreaks();
    } else {
      setInternalShowPageBreaks(!internalShowPageBreaks);
    }
  };

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

  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [desktopScale, setDesktopScale] = useState(1);
  const [resumeHeight, setResumeHeight] = useState(1123);

  useEffect(() => {
    setMounted(true);

    const calcScale = () => {
      if (typeof window !== "undefined") {
        const screenWidth = window.innerWidth;
        // On mobile, scale 794px width to fit within screen with padding (16px each side = 32px)
        const scale = Math.min((screenWidth - 24) / 794, 0.95);
        setMobileScale(Math.max(scale, 0.35));
      }
    };

    calcScale();
    window.addEventListener("resize", calcScale);

    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          const width = entry.contentRect.width;
          // Available width is container width minus padding (py-8 px-2 = 8px each side = 16px)
          const availableWidth = width - 16;
          // Resume is fixed to 794px width.
          setDesktopScale(Math.min(availableWidth / 794, 1));
        } else if (entry.target === resumeRef.current) {
          setResumeHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(containerRef.current);
    if (resumeRef.current) observer.observe(resumeRef.current);

    return () => {
      window.removeEventListener("resize", calcScale);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return <div className="w-full h-full bg-muted/30" />;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-muted/30 overflow-y-auto overflow-x-hidden flex justify-center @container print:!bg-transparent print:p-0 print:overflow-visible print:block print:h-auto relative"
    >
      {/* Desktop Mode Toggle (Hidden on mobile to avoid overlapping with mobile app bar) */}
      <div className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 z-30 print:hidden bg-white dark:bg-zinc-900 rounded-full shadow-lg p-1 border border-zinc-200 dark:border-zinc-800 items-center">
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
          {isShrinking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span className="text-xs">Fit 1-Page</span>
        </button>
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
        <button
          onClick={togglePageBreaks}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
            showPageBreaks
              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
              : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          title="Toggle A4 Page Break Guide Lines"
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Page Breaks</span>
        </button>
      </div>

      <AtsAnalyzer onNavigateStep={onNavigateStep} />

      {/* Mobile Interactive Zoom View */}
      <div className="md:hidden w-full h-[calc(100vh-56px)] overflow-hidden print:hidden relative flex flex-col items-center">
        <TransformWrapper
          initialScale={mobileScale}
          minScale={0.25}
          maxScale={2.5}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false, mode: "toggle", step: 0.5 }}
        >
          {({ zoomIn, zoomOut, setTransform }) => (
            <>
              {/* Floating Mobile Zoom & Quick Tools Bar */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                <button
                  onClick={() => zoomOut(0.15)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTransform(0, 0, mobileScale, 200)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full"
                  title="Fit Page to Screen Width"
                >
                  Fit
                </button>
                <button
                  onClick={() => setTransform(0, 0, 1, 200)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full"
                  title="100% Size"
                >
                  100%
                </button>
                <button
                  onClick={() => zoomIn(0.15)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3.5 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
                <button
                  onClick={smartShrink}
                  disabled={isShrinking || mode !== "resume"}
                  className="px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full flex items-center gap-1"
                  title="Auto-Fit Spacing to 1 Page"
                >
                  {isShrinking ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  1-Page
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                }}
                contentStyle={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "52px",
                  paddingBottom: "110px",
                }}
              >
                <div
                  id="resume-preview-mobile"
                  className="w-[794px] min-h-[1123px] bg-white shadow-2xl origin-top relative"
                >
                  <TemplateEngine
                    data={data}
                    templateId={activeTemplate || "dev-1"}
                    themeConfig={themeConfig}
                    mode={mode}
                  />

                  {/* Smart Page Break Visualizer Guidelines (A4 Height: 1123px) */}
                  {showPageBreaks && resumeHeight > 1123 && (
                    <>
                      <div
                        className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500/80 pointer-events-none z-40 flex items-center justify-end pr-4"
                        style={{ top: "1123px" }}
                      >
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow -mt-2.5">
                          End of Page 1 / Cutoff
                        </span>
                      </div>
                      {resumeHeight > 2246 && (
                        <div
                          className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500/80 pointer-events-none z-40 flex items-center justify-end pr-4"
                          style={{ top: "2246px" }}
                        >
                          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow -mt-2.5">
                            End of Page 2 / Cutoff
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Desktop CSS Scaled View */}
      <div className="hidden md:flex py-8 px-2 justify-center w-full print:hidden">
        <div
          className="relative"
          style={{
            width: "min(100% - 16px, 794px)",
            height: `${resumeHeight * desktopScale}px`,
          }}
        >
          <div
            id="resume-preview-desktop"
            ref={resumeRef}
            className="absolute top-0 left-0 w-[794px] min-h-[1123px] bg-white shadow-xl origin-top-left"
            style={{
              transform: `scale(${desktopScale})`,
            }}
          >
            <TemplateEngine
              data={data}
              templateId={activeTemplate || "dev-1"}
              themeConfig={themeConfig}
              mode={mode}
            />

            {/* Smart Page Break Visualizer Guidelines (A4 Height: 1123px) */}
            {showPageBreaks && resumeHeight > 1123 && (
              <>
                <div
                  className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500/80 pointer-events-none z-40 flex items-center justify-end pr-4"
                  style={{ top: "1123px" }}
                >
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow -mt-2.5">
                    End of Page 1 / Cutoff
                  </span>
                </div>
                {resumeHeight > 2246 && (
                  <div
                    className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500/80 pointer-events-none z-40 flex items-center justify-end pr-4"
                    style={{ top: "2246px" }}
                  >
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow -mt-2.5">
                      End of Page 2 / Cutoff
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
