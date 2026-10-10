"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TemplateEngine } from "./TemplateEngine";
import { useResumeStore } from "@/store/useResumeStore";

interface PrintPortalProps {
  mode?: "resume" | "cover-letter";
}

/**
 * Dedicated, unscaled A4 portal rendered directly into document.body.
 * - Screen mode: Positioned behind the app (top: 0, left: 0, z-index: -9999) with full 794px width.
 *   This gives html2canvas a stable, 100% unscaled DOM element with zero negative-coordinate bugs.
 * - Print mode: Switched to position: static (in-flow) with 210mm A4 width via CSS,
 *   enabling native multi-page pagination and vector printing in Chrome, Firefox, Safari & Edge.
 */
export function PrintPortal({ mode = "resume" }: PrintPortalProps) {
  const [mounted, setMounted] = useState(false);
  const { data, activeTemplate, themeConfig } = useResumeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div id="print-resume-root" className="print-resume-portal">
      <TemplateEngine
        data={data}
        templateId={activeTemplate || "dev-1"}
        themeConfig={themeConfig}
        mode={mode}
      />
    </div>,
    document.body,
  );
}
