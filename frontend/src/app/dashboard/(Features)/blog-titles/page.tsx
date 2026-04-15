"use client";

import { useState } from "react";
import { useGenerateTitles } from "@/hooks/useTitleMutation";
import {
  Type,
  Zap,
  Loader2,
  Copy,
  Check,
  Hash,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function BlogTitlePage() {
  const [category, setCategory] = useState("Technology");
  const [keywords, setKeywords] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { mutate, data, isPending, isSuccess } = useGenerateTitles();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ category, keywords });
  };

  const copyTitle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full pb-20 bg-[#1A232E] min-h-screen text-slate-200">
      <main className="max-w-[1000px] mx-auto pt-16 px-6 space-y-16">
        {/* --- HEADER SECTION --- */}
        <header className="space-y-5 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#88BDF2]/10 border border-[#88BDF2]/20 shadow-2xl shadow-[#88BDF2]/5 mb-4 group">
            <Type className="w-10 h-10 text-[#88BDF2] group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
              Title <span className="text-[#88BDF2]">Crafter</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide max-w-md mx-auto">
              Synthesize high-CTR, SEO-optimized headlines using neural
              linguistic patterns.
            </p>
          </div>
        </header>

        {/* --- INPUT CONFIGURATION CARD --- */}
        <section className="animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-[#1F2937]/40 border border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#88BDF2]/5 blur-[100px] rounded-full group-hover:bg-[#88BDF2]/10 transition-colors" />

            <form
              onSubmit={handleGenerate}
              className="space-y-10 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Niche Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                    <Layers size={14} className="text-[#88BDF2]" /> Core Niche
                  </label>
                  <div className="relative group">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-5 rounded-2xl bg-[#1A232E]/60 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all appearance-none cursor-pointer font-bold text-sm"
                    >
                      {[
                        "Technology",
                        "Health",
                        "Finance",
                        "Lifestyle",
                        "Business",
                        "Education",
                      ].map((cat) => (
                        <option key={cat} value={cat} className="bg-[#1F2937]">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Keywords Input */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                    <Hash size={14} className="text-[#88BDF2]" /> SEO Seed
                    Keywords
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="AI, SaaS, Future..."
                    className="w-full p-5 rounded-2xl bg-[#1A232E]/60 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all placeholder:text-slate-700 font-bold text-sm"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black py-6 rounded-2xl transition-all shadow-xl shadow-[#88BDF2]/10 flex items-center justify-center gap-4 disabled:opacity-50 group/btn overflow-hidden relative"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="uppercase tracking-[0.2em] text-xs">
                      Analyzing Semantic Trends...
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current group-hover/btn:scale-125 transition-transform" />
                    <span className="uppercase tracking-[0.2em] text-xs">
                      Execute Title Generation
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* --- RESULTS SECTION --- */}
        <section className="space-y-6">
          {isSuccess &&
            data?.data?.titles.map((title: string, index: number) => (
              <div
                key={index}
                onClick={() => copyTitle(title, index)}
                className="group cursor-pointer bg-[#1F2937]/20 border border-white/5 p-8 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.03] hover:border-[#88BDF2]/30 transition-all animate-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-8">
                  <span className="text-[#88BDF2]/40 font-black text-2xl italic tracking-tighter">
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#BDDDFC] transition-colors leading-tight">
                    {title}
                  </h3>
                </div>

                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-[#1A232E] border border-white/5 flex items-center justify-center group-hover:bg-[#88BDF2] group-hover:text-[#1A232E] transition-all duration-500 shadow-xl">
                  {copiedIndex === index ? (
                    <Check className="w-6 h-6 animate-in zoom-in" />
                  ) : (
                    <Copy className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            ))}

          {/* Skeleton Loaders */}
          {isPending &&
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-full bg-white/[0.02] rounded-[2rem] animate-pulse border border-white/5"
              />
            ))}

          {/* Empty State */}
          {!isSuccess && !isPending && (
            <div className="text-center pt-10 py-20 flex flex-col items-center opacity-20 group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#88BDF2]/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <Sparkles className="w-16 h-16 text-slate-400 relative" />
              </div>
              <p className="font-black tracking-[0.6em] text-[10px] text-slate-500 uppercase">
                Awaiting Semantic Signal
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
