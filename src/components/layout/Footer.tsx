import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              R
            </div>
            <span className="font-semibold">Resume Builder 2026</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
            Build a professional resume in minutes. Fast, beautiful, and
            completely private.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-foreground">Product</span>
            <Link href="/templates" className="hover:text-foreground">
              Templates
            </Link>
            <Link href="/builder" className="hover:text-foreground">
              Builder
            </Link>
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-foreground">Legal</span>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-foreground">Developer</span>
            <a
              href="https://resume.toolmate.co.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Toolmate
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Resume Builder. All rights reserved.
      </div>
    </footer>
  );
}
