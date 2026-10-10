import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interview Prep & Questions Generator | ToolMate",
  description:
    "Prepare for your next tech interview with curated technical and behavioral questions tailored to your skills. Includes structured STAR-method answers, architectural explanations, and runnable code examples.",
  keywords: [
    "ai interview prep",
    "interview questions generator",
    "technical interview practice",
    "software engineer interview questions",
    "react interview questions and answers",
    "system design interview prep",
    "star method interview questions",
    "coding interview prep free",
    "node.js interview questions",
    "devops interview prep",
  ],
  alternates: {
    canonical: "/interview-prep",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume.toolmate.co.in/interview-prep",
    siteName: "ToolMate Resume Builder",
    title: "AI Interview Prep & Questions Generator | ToolMate",
    description:
      "Skill-based interview preparation with STAR-method answers and code explanations. 100% free with instant generator.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interview Prep & Questions Generator | ToolMate",
    description:
      "Prepare for technical interviews with curated questions, STAR answers, and code explanations tailored to your skills.",
    creator: "@prahladinala",
  },
};

export default function InterviewPrepLayout({
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
            name: "AI Interview Prep",
            item: "https://resume.toolmate.co.in/interview-prep",
          },
        ],
      },
      {
        "@type": "Quiz",
        name: "Software Engineering & Technical Interview Preparation",
        description:
          "Comprehensive technical and behavioral interview questions with structured STAR-method model answers and executable code explanations.",
        educationalUse: "Interview Practice & Career Development",
        provider: {
          "@type": "Organization",
          name: "ToolMate",
          url: "https://resume.toolmate.co.in",
        },
        hasPart: [
          {
            "@type": "Question",
            name: "How does React Fiber architecture work under the hood and how does it enable concurrent rendering?",
            text: "How does React Fiber architecture work under the hood and how does it enable concurrent rendering?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "React Fiber replaces the synchronous recursive stack reconciler with a cooperative, interruptible singly-linked list of fiber nodes. It splits rendering work into non-blocking chunks using time-slicing via requestIdleCallback/MessageChannel scheduler.",
            },
          },
          {
            "@type": "Question",
            name: "Explain the difference between optimistic concurrency and pessimistic locking in PostgreSQL.",
            text: "Explain the difference between optimistic concurrency and pessimistic locking in PostgreSQL.",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Optimistic concurrency allows concurrent updates assuming conflicts are rare, checking version tokens (xmin or version column) at commit time. Pessimistic locking acquires row-level locks (SELECT ... FOR UPDATE) immediately to serialize operations.",
            },
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
