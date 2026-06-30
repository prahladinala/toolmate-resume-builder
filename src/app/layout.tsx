import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Resume Builder 2026',
    default: 'Resume Builder 2026 - Beautiful, ATS-Friendly Resumes',
  },
  description: 'Create a stunning, ATS-compatible resume in under 10 minutes. A premium, developer-focused resume builder with entirely local privacy and real-time PDF generation.',
  keywords: ['resume builder', 'ats friendly', 'developer resume', 'designer resume', 'free resume maker', 'pdf resume'],
  authors: [{ name: 'Resume Builder 2026' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumebuilder2026.example.com',
    title: 'Resume Builder 2026',
    description: 'Create a beautiful, ATS-friendly resume locally in your browser.',
    siteName: 'Resume Builder 2026'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
