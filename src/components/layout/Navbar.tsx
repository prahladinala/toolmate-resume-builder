import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            R
          </div>
          <span className="text-xl font-bold tracking-tight">Resume Builder</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/builder">
            <Button className="font-semibold rounded-full px-6">Build Resume</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
