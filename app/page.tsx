'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle, BarChart3, Lock, Zap, Cpu, Search, FileCheck, Gavel } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-[#f0f2f5]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-brand-black/90 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-brand-primary w-8 h-8" />
            <span className="text-2xl font-heading tracking-tight text-white">PolicyPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide text-slate-400">
            <Link href="#solutions" className="hover:text-brand-primary transition-colors">Solutions</Link>
            <Link href="#capabilities" className="hover:text-brand-primary transition-colors">Capabilities</Link>
            <Link href="/docs" className="hover:text-brand-primary transition-colors">Documentation</Link>
          </div>
          <Link href="/auth/login" className="btn btn-outline py-2 px-6">
            Authorized Login
          </Link>
        </div>
      </nav>

      <main className="flex-grow pt-40">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-heading mb-8 leading-[1.05] text-white">
              Legally Defensible <br />
              <span className="italic text-brand-primary">Audit Intelligence</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Establishing a new standard in regulatory verification. Our agentic reasoning engine provides deterministic compliance mapping with forensic integrity.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/auth/login" className="btn btn-primary px-10 py-4 text-base gap-3 group">
                Initialize Audit Session <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/docs" className="btn btn-secondary px-10 py-4 text-base">
                Technical Whitepaper
              </Link>
            </div>
          </motion.div>

          {/* Institutional Trust Banner */}
          <div className="mt-32 pt-12 border-t border-white/5 opacity-40 grayscale flex flex-wrap justify-center gap-12 md:gap-24 items-center">
            <div className="flex items-center gap-2 font-heading text-2xl"><Shield className="w-5 h-5" /> TRUSTED_INSTITUTION</div>
            <div className="flex items-center gap-2 font-heading text-2xl"><FileCheck className="w-5 h-5" /> COMPLIANCE_NODE</div>
            <div className="flex items-center gap-2 font-heading text-2xl"><Lock className="w-5 h-5" /> AUDIT_READY</div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="capabilities" className="py-32 bg-brand-muted/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-heading mb-6 text-white italic text-brand-primary">Core Audit Protocol</h2>
              <p className="text-slate-500 text-lg">
                Precision engineering for the Digital Personal Data Protection Act landscape.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="text-brand-primary" />,
                  title: "Agentic Reasoning",
                  desc: "A coordinated multi-agent environment for requirement planning, semantic retrieval, and cross-verification."
                },
                {
                  icon: <Search className="text-brand-primary" />,
                  title: "Semantic Analysis",
                  desc: "Advanced layout-aware extraction retains clause hierarchy and geometric coordinate metadata for verification."
                },
                {
                  icon: <Lock className="text-brand-primary" />,
                  title: "Immutable Integrity",
                  desc: "Every audit finding is cryptographically anchored with SHA-256 fingerprints to ensure forensic defensibility."
                }
              ].map((f, i) => (
                <div key={i} className="glass p-10 rounded-2xl hover:bg-brand-muted/40 transition-all border-white/5 group">
                  <div className="w-14 h-14 rounded-xl bg-brand-black border border-brand-primary/20 flex items-center justify-center mb-8 group-hover:border-brand-primary/50 transition-colors shadow-inner">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-heading mb-4 text-white uppercase tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="text-brand-primary w-8 h-8" />
                <span className="text-2xl font-heading tracking-tight text-white">PolicyPulse</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                Autonomous regulatory intelligence engineered for high-stakes compliance environments.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              {[
                { title: "System", links: ["Terminal", "Audits", "Registry"] },
                { title: "Legal", links: ["Privacy", "Terms", "CCPA"] },
                { title: "Resources", links: ["Docs", "API", "Status"] }
              ].map((group, i) => (
                <div key={i} className="flex flex-col gap-5">
                  <span className="text-[13px] font-bold text-white tracking-wider">{group.title}</span>
                  <div className="flex flex-col gap-3">
                    {group.links.map((link, j) => (
                      <Link key={j} href="#" className="text-sm text-slate-500 hover:text-brand-primary transition-colors">{link}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-600 font-medium tracking-wide">
            <span>© 2026 PolicyPulse AI. Official Auditing Infrastructure.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

