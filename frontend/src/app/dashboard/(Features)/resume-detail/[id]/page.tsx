"use client";

import { useParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useGetResume } from "@/hooks/useResumeMutation";

export default function RedesignedResumeDetail() {
  const { id } = useParams();
  const { data: resume, isLoading, isError } = useGetResume(id as string);

  // Parse the feedback if it's stored as a JSON string in the DB
  const analysis = resume?.feedback ? JSON.parse(resume.feedback) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#C084FC] w-12 h-12" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">
          Parsing Neural JSON...
        </p>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">
          Archive Fault
        </h2>
        <Link
          href="/dashboard"
          className="text-[#C084FC] font-black uppercase text-xs tracking-widest"
        >
          Return
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200">
      <nav className="border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50 bg-[#1A232E]/80 backdrop-blur-md">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft
            size={20}
            className="text-[#6A89A7] hover:text-[#C084FC]"
          />
        </Link>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
          Resume Analysis System
        </span>
      </nav>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* --- LEFT SIDEBAR: SCORE & BREAKDOWN --- */}
        <aside className="lg:col-span-4 xl:col-span-3 p-6 md:p-10 border-r border-white/5 space-y-10">
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-[#C084FC]">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Canvas.OS Core
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Match
              <br />
              Engine
            </h1>
          </header>

          {/* Main Score Display */}
          <div className="bg-[#1F2937] border border-[#C084FC]/30 p-8 rounded-[2.5rem] relative overflow-hidden">
            <Trophy className="absolute -right-4 -bottom-4 text-[#C084FC] opacity-5 w-32 h-32" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Aggregate Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-black text-white tracking-tighter">
                {analysis?.score || resume.score}
              </span>
              <span className="text-2xl font-black text-[#C084FC]">%</span>
            </div>
          </div>

          {/* Breakdown Progress Bars */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-xs tracking-widest flex items-center gap-2 uppercase">
              <BarChart3 size={14} className="text-[#C084FC]" /> Neural
              Breakdown
            </h4>
            <div className="space-y-4">
              {analysis?.breakdown &&
                Object.entries(analysis.breakdown).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">{key}</span>
                        <span className="text-slate-300">{value}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C084FC] transition-all duration-1000"
                          style={{ width: `${(value / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
            </div>
          </div>
        </aside>

        {/* --- RIGHT PANEL: STRENGTHS, WEAKNESSES, SUGGESTIONS --- */}
        <article className="lg:col-span-8 xl:col-span-9 p-6 md:p-16 lg:p-24 bg-[#1F2937]/30">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Strengths Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <TrendingUp size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.3em]">
                  Identified Strengths
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis?.strengths.map((str: string, i: number) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 items-start"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-slate-300 font-medium leading-relaxed">
                      {str}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Weaknesses Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-amber-400">
                <ShieldAlert size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.3em]">
                  Critical Gaps
                </h2>
              </div>
              <div className="space-y-3">
                {analysis?.weaknesses.map((weak: string, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-center"
                  >
                    <span className="text-[10px] font-black text-amber-500/50">
                      0{i + 1}
                    </span>
                    <p className="text-sm text-slate-400 italic">{weak}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Suggestions (AI Action Items) */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                <Target size={120} className="text-[#C084FC]" />
              </div>
              <h2 className="text-[#C084FC] text-[10px] font-black uppercase tracking-[0.5em] mb-8">
                Synthesis Suggestions
              </h2>
              <ul className="space-y-6 relative z-10">
                {analysis?.suggestions.map((sug: string, i: number) => (
                  <li key={i} className="flex gap-6 items-start group">
                    <span className="w-8 h-8 rounded-lg bg-[#C084FC]/10 flex items-center justify-center text-[#C084FC] text-xs font-black shrink-0 group-hover:bg-[#C084FC] group-hover:text-[#1A232E] transition-all">
                      {i + 1}
                    </span>
                    <p className="text-lg text-slate-200 font-bold leading-tight pt-1">
                      {sug}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Source Text Snippet */}
            <section className="pt-10 border-t border-white/5">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">
                Source Resume Document
              </h3>
              <div className="bg-black/20 p-8 rounded-2xl border border-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                <p className="text-[11px] font-mono text-slate-500 leading-relaxed whitespace-pre-wrap">
                  {resume.content}
                </p>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
