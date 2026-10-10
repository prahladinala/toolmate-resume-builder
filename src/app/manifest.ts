import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToolMate Resume Builder - Free ATS Resume Maker",
    short_name: "ToolMate Resume",
    description:
      "Build ATS-optimized resumes with 18+ templates, vector PDF & Word (.docx) export, and AI interview prep with 100% local privacy.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["productivity", "business", "career"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
