"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, CheckCircle, FileText, Zap, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container relative mx-auto px-4 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Build a Professional Resume in Minutes
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Create ATS-friendly resumes using modern templates designed for developers, designers, and professionals. No signup required.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/builder">
                <Button size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
                  Start Building <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
                  Explore Templates
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Choose Us?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to create a standout resume, built with modern web technologies.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "ATS Friendly", desc: "Pass ATS scanners easily with optimized semantic HTML and pure text extraction." },
                { icon: FileText, title: "40+ Templates", desc: "Industry-specific designs for developers, designers, and corporate roles." },
                { icon: Zap, title: "Live Preview", desc: "See changes instantly as you type. No loading screens or spinners." },
                { icon: CheckCircle, title: "Save Progress", desc: "Your resume auto-saves locally in your browser. No account needed." },
                { icon: Smartphone, title: "Mobile Responsive", desc: "Works perfectly everywhere. Build your resume on the go." },
                { icon: ArrowRight, title: "PDF Export", desc: "Download high-quality, pixel-perfect PDFs with one click." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Choose Template", desc: "Select from our premium collection." },
                { step: "02", title: "Fill Details", desc: "Enter your experience and skills." },
                { step: "03", title: "Preview Resume", desc: "See your design update live." },
                { step: "04", title: "Download PDF", desc: "Export and apply to jobs." }
              ].map((step, i) => (
                <div key={i} className="text-center relative">
                  <div className="h-16 w-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                  {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-border" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is it completely free?", a: "Yes, our builder is 100% free with no hidden paywalls." },
                { q: "Do I need to sign up?", a: "No account is required. Everything is stored locally in your browser." },
                { q: "Are the templates ATS friendly?", a: "Absolutely. We designed our templates to be easily parsed by Applicant Tracking Systems." },
                { q: "Is my data secure?", a: "Your data never leaves your device. We use LocalStorage to save your progress." }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
