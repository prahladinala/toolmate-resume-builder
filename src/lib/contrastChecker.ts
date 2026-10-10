/**
 * Calculates WCAG 2.1 relative luminance and contrast ratio between two HEX colors.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export interface ContrastResult {
  ratio: number;
  ratioText: string;
  isAaPassed: boolean;
  isAaaPassed: boolean;
  rating: "AAA" | "AA" | "Fail";
  ratingColor: string;
  message: string;
}

export function checkContrast(
  foregroundHex: string,
  backgroundHex: string = "#FFFFFF",
): ContrastResult {
  const fg = hexToRgb(foregroundHex) || { r: 15, g: 23, b: 42 }; // fallback slate
  const bg = hexToRgb(backgroundHex) || { r: 255, g: 255, b: 255 }; // fallback white

  const lum1 = getLuminance(fg.r, fg.g, fg.b);
  const lum2 = getLuminance(bg.r, bg.g, bg.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const rawRatio = (brightest + 0.05) / (darkest + 0.05);
  const ratio = Math.round(rawRatio * 10) / 10;
  const ratioText = `${ratio.toFixed(1)}:1`;

  const isAaPassed = ratio >= 4.5;
  const isAaaPassed = ratio >= 7.0;

  if (isAaaPassed) {
    return {
      ratio,
      ratioText,
      isAaPassed: true,
      isAaaPassed: true,
      rating: "AAA",
      ratingColor:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      message: "Excellent contrast. Highly legible on all screens & paper.",
    };
  }

  if (isAaPassed) {
    return {
      ratio,
      ratioText,
      isAaPassed: true,
      isAaaPassed: false,
      rating: "AA",
      ratingColor:
        "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
      message: "Good contrast. Meets standard WCAG requirements.",
    };
  }

  return {
    ratio,
    ratioText,
    isAaPassed: false,
    isAaaPassed: false,
    rating: "Fail",
    ratingColor:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    message: "Low contrast (< 4.5:1). May be hard to read when printed.",
  };
}
