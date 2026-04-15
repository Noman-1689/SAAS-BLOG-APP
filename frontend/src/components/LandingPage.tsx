"use client";

import {
  Sparkles,
  Zap,
  PenTool,
  Image as ImageIcon,
  Type,
  ArrowRight,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#88BDF2] selection:text-[#1A232E] font-sans">
      {/* --- NAVIGATION: BLUR TERMINAL --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#1A232E]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#88BDF2] rounded-lg shadow-[0_0_15px_rgba(136,189,242,0.3)]">
              <Sparkles className="w-5 h-5 text-[#1A232E]" />
            </div>
            <span className="font-black tracking-tighter text-xl italic uppercase">
              CANVAS<span className="text-[#88BDF2]">.OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a
              href="#features"
              className="hover:text-[#88BDF2] transition-colors"
            >
              Solutions
            </a>
            <a
              href="#workflow"
              className="hover:text-[#88BDF2] transition-colors"
            >
              Protocol
            </a>
            <a
              href="#pricing"
              className="hover:text-[#88BDF2] transition-colors"
            >
              Credits
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#88BDF2] text-[#1A232E] px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#BDDDFC] transition-all shadow-[0_10px_20px_rgba(136,189,242,0.15)]"
            >
              Initialize
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO: THE CORE ENGINE --- */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-[#1A232E]">
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-[#88BDF2]/10 to-transparent blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-[#88BDF2] text-[10px] font-black tracking-[0.4em] uppercase mb-10 animate-fade-in">
            <Cpu className="w-3 h-3 fill-current" />
            Next-Gen Neural Architecture
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 italic uppercase">
            Create at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#88BDF2] via-white to-[#88BDF2] bg-[length:200%_auto] animate-gradient">
              Warp Speed.
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-bold leading-relaxed uppercase tracking-tight">
            High-ranking articles, viral titles, and stunning AI visuals
            generated from a single prompt. <br />
            <span className="text-white/40 font-black italic">
              Welcome to the professional grade.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-[#88BDF2] text-[#1A232E] font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-[#88BDF2]/20 uppercase text-xs tracking-widest"
            >
              Start Generating <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-10 py-5 border border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all uppercase text-xs tracking-widest"
            >
              <Terminal className="w-5 h-5 text-[#88BDF2]" /> API Reference
            </Link>
          </div>
        </div>
      </section>

      {/* --- DATA STRIP: LIVE STATUS --- */}
      <section className="py-12 border-y border-white/5 bg-black/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40">
            {["LUMINA.SYS", "VERTEX.CORE", "AETHER.NET", "PRISM.AI"].map(
              (brand) => (
                <div key={brand} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#88BDF2] rounded-full" />
                  <span className="font-black text-sm italic tracking-tighter">
                    {brand}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURES: MODULE OVERVIEW --- */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
              Core <span className="text-[#88BDF2]">Modules</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Optimized for scale. Built for professionals.
            </p>
          </div>
          <div className="flex items-center gap-3 text-green-500 font-mono text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SYSTEM_STATUS: OPTIMAL
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <PenTool />,
              title: "Article Forge",
              desc: "SEO-optimized long-form content generated with neural precision.",
              tag: "TX-1",
            },
            {
              icon: <Type />,
              title: "Headline Gen",
              desc: "High-clickrate headlines tailored to viral engagement patterns.",
              tag: "TX-2",
            },
            {
              icon: <ImageIcon />,
              title: "Visual Synth",
              desc: "Custom high-fidelity imagery generated from text descriptors.",
              tag: "IMG-1",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-10 rounded-[2.5rem] bg-[#1A232E] border border-white/5 hover:border-[#88BDF2]/40 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-6 right-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
                {feature.tag}
              </div>
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#88BDF2] mb-8 transition-transform group-hover:scale-110 group-hover:bg-[#88BDF2]/10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase italic italic text-white">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-tight">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING: ACCESS LEVELS --- */}
      <section id="pricing" className="py-32 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 rounded-[3rem] border border-white/5 bg-[#1A232E] hover:border-white/10 transition-all">
              <h3 className="text-xs font-black mb-4 uppercase tracking-[0.4em] text-slate-500">
                Tier: Hobby
              </h3>
              <div className="text-5xl font-black mb-8 italic">
                $0
                <span className="text-lg text-slate-700 not-italic uppercase tracking-widest ml-2">
                  /Credits
                </span>
              </div>
              <ul className="space-y-5 mb-12">
                {[
                  "5 Neural Articles",
                  "10 Optimized Titles",
                  "Standard Generation",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#88BDF2]" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-5 rounded-2xl border border-white/10 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                Initialize Free
              </Link>
            </div>

            <div className="p-12 rounded-[3rem] border-2 border-[#88BDF2] bg-[#1A232E] relative overflow-hidden shadow-[0_0_50px_rgba(136,189,242,0.1)]">
              <div className="absolute top-6 right-8 bg-[#88BDF2] text-[#1A232E] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Priority
              </div>
              <h3 className="text-xs font-black mb-4 uppercase tracking-[0.4em] text-[#88BDF2]">
                Tier: Professional
              </h3>
              <div className="text-5xl font-black mb-8 italic text-white">
                $29
                <span className="text-lg text-slate-600 not-italic uppercase tracking-widest ml-2">
                  /Month
                </span>
              </div>
              <ul className="space-y-5 mb-12">
                {[
                  "Unlimited Forge Access",
                  "Ultra-HD Visual Synth",
                  "Full API Integration",
                  "Global Edge CDN",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white"
                  >
                    <Zap className="w-4 h-4 text-[#88BDF2] fill-[#88BDF2]" />{" "}
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-5 rounded-2xl bg-[#88BDF2] text-[#1A232E] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#BDDDFC] transition-all shadow-xl shadow-[#88BDF2]/20"
              >
                Upgrade Protocol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER: TERMINAL EXIT --- */}
      <footer className="py-24 text-center border-t border-white/5 bg-[#1A232E]">
        <div className="flex justify-center gap-10 mb-12 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">
          <Link
            href="/privacy"
            className="hover:text-[#88BDF2] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-[#88BDF2] transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/twitter"
            className="hover:text-[#88BDF2] transition-colors"
          >
            Endpoint
          </Link>
        </div>
        <p className="text-slate-800 text-[10px] font-black tracking-[0.6em] uppercase">
          Build the future with Canvas.OS // 2026 // Auth: G-04
        </p>
      </footer>
    </div>
  );
}
