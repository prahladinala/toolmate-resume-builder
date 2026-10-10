import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://resume.toolmate.co.in"),
  alternates: {
    canonical: "/",
  },
  title: {
    template: "%s | ToolMate Resume Builder",
    default:
      "Free ATS Resume Builder | 100% Private, No Login, PDF & Word Export",
  },
  description:
    "Build an ATS-optimized resume in minutes with 100% local privacy. 18+ developer & executive templates, direct vector PDF download, editable Word (.docx) export, and AI interview prep with zero login.",
  keywords: [
    "free ats resume builder",
    "ats friendly resume maker",
    "resume builder without sign up",
    "privacy first resume builder",
    "free resume builder no paywall",
    "developer resume builder",
    "software engineer resume template",
    "latex resume template",
    "word resume template docx",
    "export resume to word docx",
    "vector pdf resume download",
    "ai interview prep questions",
    "technical interview questions generator",
    "star method interview answers",
    "ats resume checker free",
  ],
  authors: [{ name: "Prahlad Inala", url: "https://prahladinala.in" }],
  creator: "Prahlad Inala",
  publisher: "ToolMate",
  category: "Business & Career Software",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.toolmate.co.in",
    siteName: "ToolMate Resume Builder",
    title:
      "Free ATS Resume Builder | 100% Private, No Login, PDF & Word Export",
    description:
      "Create high-scoring, ATS-compliant resumes with 18+ templates, vector PDF & editable Word export, and AI interview prep. Completely free & local.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Free ATS Resume Builder | 100% Private, No Login, PDF & Word Export",
    description:
      "Create high-scoring, ATS-compliant resumes with 18+ templates, vector PDF & editable Word export. 100% free and local.",
    creator: "@prahladinala",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
