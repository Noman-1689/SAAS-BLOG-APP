"use client";

import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  FileText,
  Share2,
  Download,
  Clock,
  Check,
  Zap,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetTitleSet } from "@/hooks/useTitleMutation";

export default function RedesignedArticleDetail() {
  const { id } = useParams();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { data, isLoading, isError } = useGetTitleSet(id as string);
  const article = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#88BDF2] w-12 h-12" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">
          Decrypting Neural Assets...
        </p>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <FileText className="text-red-500 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">
          Fragment Missing
        </h2>
        <Link
          href="/dashboard"
          className="bg-[#88BDF2] text-[#1F2937] px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#A5CFFF] transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const rawText = article.description || "";
  const contentParts = rawText.split("Keywords: ");
  const cleanContent =
    contentParts.length > 1
      ? contentParts[1].split("** ").slice(1).join("** ") || contentParts[1]
      : rawText;

  const wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  const copyHeadline = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200">
      <nav className="border-b border-white/5 p-4 flex justify-between items-center bg-[#1A232E]/80 backdrop-blur-md sticky top-0 z-50">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft
            size={20}
            className="text-[#6A89A7] hover:text-[#88BDF2]"
          />
        </Link>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 transition-all font-bold text-[10px] uppercase tracking-widest">
            <Download size={14} /> Export PDF
          </button>
          <button className="flex items-center gap-2 bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] px-5 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#88BDF2]/20">
            <Share2 size={14} /> Share
          </button>
        </div>
      </nav>

      {/* Main Grid: Scroll is now handled by the window, not individual columns */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* --- LEFT SIDEBAR: STATIC (NO INTERNAL SCROLL) --- */}
        <aside className="lg:col-span-4 xl:col-span-3 p-6 md:p-10 border-r border-white/5 space-y-10">
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-[#88BDF2]">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                AI Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-black text-white leading-none tracking-tighter italic">
              OPTIMIZED
              <br />
              TITLES
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              High-engagement headline variations generated based on semantic
              relevance and CTR patterns.
            </p>
          </header>

          <div className="space-y-4">
            {article.titles?.map((t: string, i: number) => (
              <div
                key={i}
                onClick={() => copyHeadline(t, i)}
                className="group relative bg-[#1F2937] border border-white/5 p-5 rounded-2xl cursor-pointer hover:bg-[#2A3749] hover:border-[#88BDF2]/30 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded-md">
                    Variant 0{i + 1}
                  </span>
                  {copiedIndex === i ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Tag
                      size={14}
                      className="text-[#6A89A7] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
                <p className="text-sm font-bold text-slate-100 leading-snug group-hover:text-white">
                  {t}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 space-y-5">
            <h4 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
              <span className="w-1 h-3 bg-[#88BDF2] rounded-full" /> Synthesis
              Metrics
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[#6A89A7]" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Words
                  </p>
                  <p className="text-2xl font-black text-slate-100">
                    {wordCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#6A89A7]" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Read
                  </p>
                  <p className="text-2xl font-black text-slate-100">
                    {readTime}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* --- RIGHT PANEL --- */}
        <article className="lg:col-span-8 xl:col-span-9 p-6 md:p-16 lg:p-24 bg-[#1F2937]/30">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-12 text-[#6A89A7]">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">
                <Calendar size={12} />{" "}
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">
                <FileText size={12} /> Content Artifact
              </div>
            </div>

            <div
              className="prose prose-invert prose-slate max-w-none 
              prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-white
              prose-h1:text-5xl prose-h2:text-3xl prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4
              prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
              prose-strong:text-[#88BDF2] prose-strong:font-bold
              prose-code:text-[#88BDF2] prose-code:bg-[#88BDF2]/5 prose-code:px-1.5 prose-code:rounded
            "
            >
              <ReactMarkdown>{cleanContent}</ReactMarkdown>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
