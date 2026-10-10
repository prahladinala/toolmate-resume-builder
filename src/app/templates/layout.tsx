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
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://resume.toolmate.co.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ATS Resume Templates",
            item: "https://resume.toolmate.co.in/templates",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "18+ Free ATS-Compliant Resume Templates",
        description:
          "A curated collection of developer, designer, corporate, and academic resume templates engineered to pass applicant tracking systems.",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Terminal Mono (Developer)",
            description:
              "High-density monospace layout for software engineers, featuring terminal aesthetics and clean skill tags.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Clean Code (Developer)",
            description:
              "Clean modern developer format emphasizing system architecture, projects, and tech stack.",
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
            name: "Executive Serif (Corporate)",
            description:
              "Authoritative, polished format designed for leadership, directors, and management roles.",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Consulting & Banking",
            description:
              "Ultra-clean high-finance format with rigorous margins and quantifiable metric emphasis.",
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Standard Professional (General)",
            description:
              "Versatile, universal ATS-optimized format suitable for operations, marketing, and cross-functional roles.",
          },
        ],
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
