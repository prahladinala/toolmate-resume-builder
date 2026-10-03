"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { TemplateEngine } from "./TemplateEngine";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";

export function Preview() {
  const { data, activeTemplate, themeConfig } = useResumeStore();
  const [mounted, setMounted] = useState(false);
  const [mobileScale, setMobileScale] = useState(1); // 100% by default as user requested!

  useEffect(() => {
    setMounted(true);
    // User requested: "We need to show in 100% and user can pinch to zoom same like a mobile app expeirnce"
    // Native mobile app experience for PDF is usually Fit to Width OR 100%.
    // Since they specifically said "show in 100%", let's set initialScale to 1.
    setMobileScale(1);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-muted/30" />;

  return (
    <div className="w-full h-full bg-muted/30 overflow-y-auto flex justify-center @container print:bg-transparent print:p-0 print:overflow-visible print:block">
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
        />
      </div>
    </div>
  );
}
