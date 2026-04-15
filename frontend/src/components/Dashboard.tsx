"use client";

import {
  Sparkles,
  Home,
  PenTool,
  Type,
  ImageIcon,
  Layers3,
  Puzzle,
  FileText,
  Users,
  ScanText,
  LogOut,
  Fingerprint,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SidebarIcon = ({ Icon, active }: { Icon: any; active?: boolean }) => (
  <Icon
    className={`w-5 h-5 ${active ? "text-[#1A232E]" : "text-slate-500 group-hover:text-[#88BDF2]"} transition-colors`}
  />
);

export default function DashboardLayout() {
  const [activeItem, setActiveItem] = useState("Remove Background");

  return (
    <div className="h-screen bg-[#0F172A] text-white flex overflow-hidden font-sans">
      {/* --- SIDEBAR: TACTICAL TERMINAL --- */}
      <aside className="w-[280px] border-r border-white/5 flex flex-col bg-[#1A232E] relative z-20">
        {/* Logo Section */}
        <div className="h-[80px] flex items-center gap-3 px-8 mb-6">
          <div className="p-2 bg-[#88BDF2] rounded-lg shadow-[0_0_15px_rgba(136,189,242,0.4)]">
            <Sparkles className="w-5 h-5 text-[#1A232E]" />
          </div>
          <span className="font-black tracking-tighter text-xl italic uppercase">
            CANVAS<span className="text-[#88BDF2]">.OS</span>
          </span>
        </div>

        {/* User Status Card */}
        <div className="px-4 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#88BDF2] to-[#BDDDFC] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#1A232E] flex items-center justify-center">
                  <Fingerprint
                    className="w-6 h-6 text-[#88BDF2]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1A232E] rounded-full" />
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-white">
                GreatStack
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap className="w-3 h-3 text-[#88BDF2] fill-[#88BDF2]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  Pro Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Navigation --- */}
        <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { Icon: Home, label: "Dashboard" },
            { Icon: PenTool, label: "Write Article" },
            { Icon: Type, label: "Blog Titles" },
            { Icon: ImageIcon, label: "Generate Images" },
            { Icon: Layers3, label: "Remove Background" },
            { Icon: Puzzle, label: "Remove Object" },
            { Icon: FileText, label: "Review Resume" },
            { Icon: Users, label: "Community" },
          ].map((item) => {
            const isActive = activeItem === item.label;
            const hrefPath =
              item.label === "Dashboard"
                ? "/"
                : `/dashboard/${item.label.toLowerCase().replace(/\s+/g, "-")}`;

            return (
              <Link
                key={item.label}
                href={hrefPath}
                onClick={() => setActiveItem(item.label)}
                className={`group flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#88BDF2] text-[#1A232E] shadow-[0_10px_20px_rgba(136,189,242,0.15)]"
                      : "text-slate-500 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <SidebarIcon Icon={item.Icon} active={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* --- Logout Section --- */}
        <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
          <button className="w-full flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                Terminate Session
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT: THE WORKSPACE --- */}
      <main className="flex-grow bg-[#0F172A] relative flex flex-col p-8 xl:p-12 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#88BDF2]/5 rounded-full blur-[120px] pointer-events-none" />

        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#88BDF2] rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-[#88BDF2] uppercase tracking-[0.4em]">
                Active Module: AI-03
              </span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Visual <span className="text-[#88BDF2]">Extraction</span>
            </h1>
          </div>
          <div className="text-right hidden xl:block">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
              Compute Latency
            </p>
            <p className="text-sm font-mono text-green-500">24ms // STABLE</p>
          </div>
        </header>

        {/* --- Card Workspace Grid --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow">
          {/* Card 1: Input Terminal */}
          <div className="p-8 xl:p-10 rounded-[2.5rem] bg-[#1A232E] border border-white/5 flex flex-col justify-between group hover:border-[#88BDF2]/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[#88BDF2]">
                  <Layers3 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  Input_Source
                </span>
              </div>

              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-6">
                Alpha <span className="text-[#88BDF2]">Channeling</span>
              </h2>

              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 ml-1">
                Upload Target
              </label>
              <div className="group/drop h-24 w-full bg-black/20 border border-dashed border-white/10 rounded-2xl flex items-center px-8 text-xs text-slate-500 mb-4 font-bold cursor-pointer hover:bg-black/40 hover:border-[#88BDF2]/50 transition-all">
                <ScanText className="w-5 h-5 mr-4 text-slate-700 group-hover/drop:text-[#88BDF2]" />
                SELECT SYSTEM FILE{" "}
                <span className="text-slate-800 ml-2 font-black italic">
                  // NULL
                </span>
              </div>
              <p className="text-slate-700 text-[10px] font-bold italic leading-relaxed">
                * SYSTEM SUPPORTS: [RAW, JPG, PNG] @ 4096PX MAX
              </p>
            </div>

            <button className="relative z-10 w-full py-6 bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1A232E] font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(136,189,242,0.1)] uppercase text-[11px] tracking-widest active:scale-95">
              <Sparkles className="w-4 h-4" /> Initialize Removal
            </button>
          </div>

          {/* Card 2: Output Monitor */}
          <div className="p-8 xl:p-10 rounded-[2.5rem] bg-[#1A232E] border border-white/5 flex flex-col group hover:border-[#88BDF2]/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 group-hover:text-[#88BDF2] transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                Monitor_Output
              </span>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center px-10 border border-white/5 rounded-3xl relative overflow-hidden bg-black/20 group-hover:bg-black/30 transition-all">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#88BDF2 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />

              <Layers3 className="w-12 h-12 text-slate-800 mb-6 group-hover:scale-110 transition-transform group-hover:text-[#88BDF2]/20" />
              <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] max-w-[200px] leading-loose">
                Waiting for <span className="text-slate-400">Data Stream</span>{" "}
                to initialize...
              </p>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <footer className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
          <p className="text-slate-700 text-[9px] font-black tracking-[0.5em] uppercase">
            OS Kernel v2.0.6 // G-Node 42
          </p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                AI Engine Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#88BDF2]" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                Encrypted Storage active
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
