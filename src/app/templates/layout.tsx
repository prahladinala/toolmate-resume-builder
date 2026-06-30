import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Templates',
  description: 'Browse our collection of 16 premium, ATS-optimized resume templates. Choose designs tailored for developers, designers, corporate, and general roles.',
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
