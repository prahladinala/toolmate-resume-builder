import { Metadata } from "next";

export const metadata: Metadata = {
  title: "18+ Free ATS Resume Templates for Developers & Professionals",
  description:
    "Explore 18+ free, ATS-compliant resume templates built for software engineers, designers, executives, and academics. Export seamlessly to vector PDF and native Word (.docx).",
  keywords: [
    "ats resume templates",
    "software engineer resume template",
    "developer resume templates free",
    "tech resume template",
    "latex resume template online",
    "executive resume format",
    "free word resume templates",
    "minimalist resume templates",
    "modern cv templates 2026",
  ],
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.toolmate.co.in/templates",
    siteName: "ToolMate Resume Builder",
    title: "18+ Free ATS Resume Templates for Developers & Professionals",
    description:
      "Handcrafted ATS-friendly resume templates with single-column, sidebar, and executive layouts. Export to vector PDF and editable Word.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ToolMate Resume Templates Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "18+ Free ATS Resume Templates for Developers & Professionals",
    description:
      "ATS-tested developer and professional templates. 100% free with instant editing and vector PDF export.",
    creator: "@prahladinala",
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ATS-Compliant Resume Templates",
    description:
      "A curated collection of developer, designer, corporate, and academic resume templates engineered to pass applicant tracking systems.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Developer Monospace (Sidebar)",
        description:
          "High-density technical layout with left sidebar, monospace typography, and clean skill tags.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Full-Stack Split Header",
        description:
          "Modern balanced layout with badge section headers and quick-scan contact matrix.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Academic LaTeX Classic",
        description:
          "Prestigious serif layout adhering to academic curriculum vitae conventions with subtle rules.",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Executive Corporate",
        description:
          "Authoritative, polished format designed for leadership, directors, and management roles.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
