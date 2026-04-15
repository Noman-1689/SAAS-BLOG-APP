"use client";

import { useState } from "react";
import { useReviewResume } from "@/hooks/useResumeMutation";
import {
  ShieldCheck,
  Sparkles,
  Loader2,
  FileText,
  Zap,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";

// --- ADDED INTERFACE FOR TYPE SAFETY ---
interface ResumeBreakdown {
  [key: string]: number | string | undefined;
}

export default function ResumeReviewPage() {
  const [resumeText, setResumeText] = useState("");
  const [field, setField] = useState("");

  const { mutate, data, isPending, isSuccess } = useReviewResume();

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ resumeText, field });
  };

  const parsedData = data?.data?.parsed;

  // Cast breakdown to our interface to avoid 'unknown' errors
  const breakdown = (parsedData?.breakdown as ResumeBreakdown) ?? {};

  const strengths = Array.isArray(parsedData?.strengths)
    ? (parsedData.strengths as string[])
    : [];
  const weaknesses = Array.isArray(parsedData?.weaknesses)
    ? (parsedData.weaknesses as string[])
    : [];
  const suggestions = Array.isArray(parsedData?.suggestions)
    ? (parsedData.suggestions as string[])
    : [];

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200">
      <main className="w-full max-w-[1000px] mx-auto p-6 md:p-10 lg:p-16 space-y-16">
        {/* --- HEADER --- */}
        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#88BDF2]">
              <ShieldCheck size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                ATS Optimization Protocol
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
              Resume Analyzer
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[500px] mx-auto">
              Simulate an ATS deep-scan by providing your resume and target
              role.
            </p>
          </header>

          <form
            onSubmit={handleReview}
            className="bg-[#1F2937]/50 border border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-md shadow-2xl space-y-8"
          >
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                <Target size={12} className="text-[#88BDF2]" /> Target Job Role
              </label>
              <input
                required
                type="text"
                className="w-full p-5 rounded-2xl bg-[#1A232E]/80 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all placeholder:text-slate-700"
                placeholder="Ex: Senior React Developer..."
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                Raw Resume Content
              </label>
              <textarea
                required
                className="w-full p-6 rounded-2xl bg-[#1A232E]/80 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all h-64 resize-none placeholder:text-slate-700 text-sm font-mono"
                placeholder="Paste experience, skills, and education here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full group bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black text-xs uppercase tracking-[0.3em] py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Execute Scan</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* --- RESULTS --- */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
          <div className="bg-[#1F2937]/20 border border-white/5 rounded-[3rem] min-h-[500px] flex flex-col overflow-hidden shadow-2xl">
            <div className="border-b border-white/5 p-6 md:px-10 flex justify-between items-center bg-[#1A232E]/40 backdrop-blur-xl">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <Terminal size={14} className="text-[#88BDF2]" />
                System.Output // {field || "General_Scan"}
              </span>
            </div>

            <div className="p-8 md:p-14 overflow-y-auto flex-grow">
              {!data && !isPending && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-8 py-20 opacity-30">
                  <FileText size={80} />
                  <p className="font-black tracking-[0.6em] text-[10px] uppercase">
                    Awaiting Transmission
                  </p>
                </div>
              )}

              {isSuccess && parsedData && (
                <div className="space-y-12 animate-in fade-in duration-700">
                  {/* Score & Category Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/5"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={
                              364.4 - (364.4 * (parsedData.score || 0)) / 100
                            }
                            className="text-[#88BDF2] transition-all duration-1000"
                          />
                        </svg>
                        <span className="absolute text-4xl font-black italic text-white">
                          {parsedData.score}
                        </span>
                      </div>
                      <span className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                        Overall Match
                      </span>
                    </div>

                    <div className="lg:col-span-2 space-y-4 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                      {Object.entries(breakdown).length > 0 ? (
                        Object.entries(breakdown).map(([key, val]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                              <span>{key}</span>
                              {/* FIXED: Convert unknown val to string */}
                              <span className="text-[#88BDF2]">
                                {String(val)}
                              </span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#88BDF2]/50 transition-all duration-1000"
                                style={{
                                  /* FIXED: Convert unknown val to number for calculation */
                                  width: `${(Number(val) / (key === "relevance" ? 30 : key === "skills" ? 25 : key === "experience" ? 20 : 15)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-400 py-4">
                          Breakdown data is unavailable.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Strengths / Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-green-500/5 border border-green-500/10 p-8 rounded-[2rem] space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Strengths
                      </h3>
                      <ul className="space-y-2">
                        {strengths.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-slate-300 flex gap-2"
                          >
                            <span className="text-green-500/40">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2rem] space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
                        <AlertCircle size={14} /> Weaknesses
                      </h3>
                      <ul className="space-y-2">
                        {weaknesses.map((w, i) => (
                          <li
                            key={i}
                            className="text-sm text-slate-300 flex gap-2"
                          >
                            <span className="text-red-500/40">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-[#88BDF2]/5 border border-[#88BDF2]/10 p-8 rounded-[2rem] space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#88BDF2] flex items-center gap-2">
                      <Lightbulb size={14} /> Optimization Path
                    </h3>
                    <div className="grid gap-3">
                      {suggestions.map((suggest, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 bg-[#1A232E]/60 p-4 rounded-xl border border-white/5"
                        >
                          <Zap size={14} className="text-[#88BDF2] shrink-0" />
                          <p className="text-sm text-slate-400">{suggest}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
