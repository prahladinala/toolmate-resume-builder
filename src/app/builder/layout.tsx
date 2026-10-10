import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Resume Builder & ATS Editor | 100% Free & Private",
  description:
    "Edit your resume in real time with instant ATS scoring, live A4 preview, direct vector PDF download, editable Word (.docx) export, and LinkedIn importer. No sign-up required.",
  keywords: [
    "live resume builder",
    "ats resume editor",
    "free resume maker online",
    "resume builder no login",
    "instant pdf resume builder",
    "export resume to docx",
    "linkedin to resume converter",
  ],
  alternates: {
    canonical: "/builder",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.toolmate.co.in/builder",
    siteName: "ToolMate Resume Builder",
    title: "Live Resume Builder & ATS Editor | 100% Free & Private",
    description:
      "Real-time resume editor with ATS optimization, live A4 rendering, and instant PDF/Word export. Zero login, 100% local privacy.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ToolMate Live Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Resume Builder & ATS Editor | ToolMate",
    description:
      "Edit and format your resume in real-time with instant ATS score feedback and client-side PDF export.",
    creator: "@prahladinala",
  },
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
