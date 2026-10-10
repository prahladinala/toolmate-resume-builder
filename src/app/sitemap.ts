import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://resume.toolmate.co.in";
  // Stable lastModified timestamp corresponding to the latest release
  const lastReleaseDate = new Date("2026-10-11T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified: lastReleaseDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: lastReleaseDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interview-prep`,
      lastModified: lastReleaseDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];
}
