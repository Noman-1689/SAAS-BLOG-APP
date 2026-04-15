"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  Type,
  LayoutGrid,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Zap,
  Layers,
  FileSearch,
  CheckCircle2,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

type Category = "all" | "articles" | "titles" | "resumes";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["userLibrary"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/library`,
        {
          withCredentials: true,
        },
      );
      return res.data.library;
    },
  });

  if (!mounted) return <div className="min-h-screen bg-[#1A232E]" />;

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#88BDF2]/20 border-t-[#88BDF2] rounded-full animate-spin" />
            <Zap className="absolute inset-0 m-auto text-[#88BDF2] w-4 h-4 animate-pulse" />
          </div>
          <p className="text-[#6A89A7] font-black tracking-[0.4em] text-[10px] uppercase">
            Accessing Neural Vault...
          </p>
        </div>
      );

    const showArticles = activeTab === "all" || activeTab === "articles";
    const showTitles = activeTab === "all" || activeTab === "titles";
    const showResumes = activeTab === "all" || activeTab === "resumes";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --- Articles --- */}
        {showArticles &&
          data?.articles?.map((art: any) => (
            <Link
              key={art.id}
              href={`/dashboard/article-detail/${art.id}`}
              className="group block h-full"
            >
              <div className="h-full p-8 rounded-[2rem] bg-[#1F2937]/50 border border-white/5 group-hover:border-[#88BDF2]/40 group-hover:bg-[#1F2937]/80 transition-all duration-500 flex flex-col backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-[#88BDF2]/10 text-[#88BDF2] group-hover:bg-[#88BDF2] group-hover:text-[#1A232E] transition-all">
                    <FileText size={20} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <span className="text-[10px] font-black text-[#88BDF2] uppercase tracking-widest">
                      Read
                    </span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white leading-tight mb-3 line-clamp-2">
                  {art.topic}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-8 leading-relaxed">
                  {art.content.replace(/[#*=_]/g, "").substring(0, 140)}...
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Clock size={12} /> {art.wordCount} Words
                  </div>
                  <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}

        {/* --- Blog Title Sets --- */}
        {showTitles &&
          data?.titles?.map((t: any) => (
            <Link
              key={t.id}
              href={`/dashboard/title-detail/${t.id}`}
              className="group block h-full"
            >
              <div className="h-full p-8 rounded-[2rem] bg-[#1F2937]/50 border border-white/5 group-hover:border-[#BDDDFC]/40 group-hover:bg-[#1F2937]/80 transition-all duration-500 flex flex-col backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-[#BDDDFC]/10 text-[#BDDDFC] group-hover:bg-[#BDDDFC] group-hover:text-[#1A232E] transition-all">
                    <Type size={20} />
                  </div>
                  <Layers size={18} className="text-slate-700" />
                </div>
                <div className="space-y-4 mb-8">
                  {t.titles.slice(0, 2).map((title: string, i: number) => (
                    <p
                      key={i}
                      className="text-sm font-bold text-slate-300 border-l border-white/10 pl-4 line-clamp-2"
                    >
                      {title}
                    </p>
                  ))}
                </div>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#BDDDFC] uppercase tracking-widest px-2 py-1 bg-[#BDDDFC]/5 rounded">
                    {t.description.split("|")[0] || "Title Logic"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {/* --- Resume Audits --- */}
        {showResumes &&
          data?.resumes?.map((res: any) => {
            const analysis = res.parsed || {};
            return (
              <Link
                key={res.id}
                href={`/dashboard/resume-detail/${res.id}`}
                className="group block h-full"
              >
                <div className="h-full p-8 rounded-[2rem] bg-[#1F2937]/50 border border-white/5 group-hover:border-[#C084FC]/40 group-hover:bg-[#1F2937]/80 transition-all duration-500 flex flex-col backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-[#C084FC]/10 text-[#C084FC] group-hover:bg-[#C084FC] group-hover:text-[#1A232E] transition-all">
                      <FileSearch size={20} />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase">
                      <CheckCircle2 size={10} /> ATS Sync
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">
                    {res.field || "Career Scan"}
                  </h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-black text-white px-2 py-1 rounded bg-[#C084FC]/20">
                      SCORE: {res.score}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-8 italic">
                    &quot;
                    {analysis.summary || "Full competency mapping complete."}
                    &quot;
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black text-[#C084FC] uppercase tracking-widest">
                      Analysis Core
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">
                      {new Date(res.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-12 lg:p-16 max-w-[1600px] mx-auto bg-[#1A232E] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            <LayoutGrid size={14} className="text-[#88BDF2]" />
            <span>Archive</span>
            <ChevronRight size={12} />
            <span className="text-[#88BDF2]">Neural Library</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
            Canvas<span className="text-[#88BDF2]">.</span>OS
          </h1>
        </div>

        <div className="flex gap-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5">
          {["all", "articles", "titles", "resumes"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as Category)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === t
                  ? "bg-[#88BDF2] text-[#1A232E]"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>
      {renderContent()}
    </div>
  );
}
