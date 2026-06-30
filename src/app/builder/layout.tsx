import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Editor',
  description: 'Edit your resume details and see a live preview. Completely local, secure, and blazing fast.',
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
