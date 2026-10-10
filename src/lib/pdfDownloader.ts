import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ResumeData } from "@/types/resume";

/**
 * Generates and downloads a high-resolution, pixel-perfect A4 PDF directly in the browser
 * without relying on the browser's system print dialog.
 */
export async function downloadDirectPdf(data: ResumeData): Promise<void> {
  // Prioritize unscaled print portal element
  let targetElement: HTMLElement | null =
    document.getElementById("print-resume-root");

  if (!targetElement || targetElement.offsetHeight === 0) {
    targetElement =
      document.querySelector("#resume-preview-desktop #template-root") ||
      document.querySelector("#resume-preview-mobile #template-root") ||
      document.getElementById("template-root") ||
      (document.querySelector('[id*="template-root"]') as HTMLElement | null);
  }

  if (!targetElement) {
    throw new Error("Resume preview element was not found in the DOM.");
  }

  // Ensure dimensions are positive and measured
  const elementWidth = 794;
  const elementHeight = Math.max(
    targetElement.scrollHeight,
    targetElement.offsetHeight,
    1123,
  );

  // Capture canvas at 2x resolution with strict viewport offsets
  const canvas = await html2canvas(targetElement, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    width: elementWidth,
    height: elementHeight,
    windowWidth: elementWidth,
    windowHeight: elementHeight,
    onclone: (clonedDoc) => {
      const clonedRoot = clonedDoc.getElementById("print-resume-root");
      if (clonedRoot) {
        clonedRoot.style.position = "static";
        clonedRoot.style.top = "0";
        clonedRoot.style.left = "0";
        clonedRoot.style.zIndex = "1";
        clonedRoot.style.visibility = "visible";
        clonedRoot.style.opacity = "1";
      }
    },
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
  const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
  const totalImgHeight = (canvas.height * pdfWidth) / canvas.width;

  // Single page if within 5% tolerance of A4 height (297 mm)
  if (totalImgHeight <= pdfPageHeight * 1.05) {
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      pdfWidth,
      Math.min(totalImgHeight, pdfPageHeight),
    );
  } else {
    // Multi-page slicing
    let heightLeft = totalImgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, totalImgHeight);
    heightLeft -= pdfPageHeight;

    while (heightLeft > 5) {
      position -= pdfPageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, totalImgHeight);
      heightLeft -= pdfPageHeight;
    }
  }

  const fullName =
    `${data.personalInfo.firstName || "Resume"}_${data.personalInfo.lastName || ""}`.trim();
  const filename = `${fullName || "Resume"}_ATS.pdf`.replace(/\s+/g, "_");

  try {
    pdf.save(filename);
  } catch (err) {
    console.warn("pdf.save fallback triggered:", err);
    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  }
}
