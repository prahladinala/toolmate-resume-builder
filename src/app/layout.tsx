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
    template: "%s | Resume Builder 2026",
    default: "Resume Builder 2026 - Beautiful, ATS-Friendly Resumes",
  },
  description:
    "Build a beautiful, ATS-compatible resume in minutes. A premium, developer-focused resume builder with local privacy and real-time PDF generation.",
  keywords: [
    "resume builder",
    "ats friendly",
    "developer resume",
    "designer resume",
    "free resume maker",
    "pdf resume",
  ],
  authors: [{ name: "Prahlad Inala" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.toolmate.co.in",
    title: "Resume Builder 2026",
    description:
      "Create a beautiful, ATS-friendly resume locally in your browser.",
    siteName: "Resume Builder 2026",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Resume Builder 2026 Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Builder 2026",
    description:
      "Create a beautiful, ATS-friendly resume locally in your browser.",
    creator: "@prahladinala",
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
