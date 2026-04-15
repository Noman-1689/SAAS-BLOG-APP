// app/articles/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useGetArticle } from "@/hooks/useArticleMutation";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  FileText,
  Share2,
  Download,
  Clock,
  Zap,
  Hash,
} from "lucide-react";
import Link from "next/link";

export default function ArticleDetailPage() {
  const { id } = useParams();

  // Use React Query hook
  const { data, isLoading, isError } = useGetArticle(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="animate-spin text-[#88BDF2] w-16 h-16" />
          <div className="absolute inset-0 blur-xl bg-[#88BDF2]/20 animate-pulse" />
        </div>
        <p className="mt-8 text-[#6A89A7] font-bold uppercase tracking-[0.5em] text-[10px]">
          Retrieving Artifact...
        </p>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <FileText className="text-red-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
          404: Access Denied
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          The requested article fragment does not exist.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 text-[#88BDF2] font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
        >
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  const article = data.data;
  const readTime = Math.ceil((article.wordCount || 0) / 200);

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200">
      {/* --- Global Navigation --- */}
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
            <Download size={14} /> Download
          </button>
          <button className="flex items-center gap-2 bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] px-5 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#88BDF2]/20">
            <Share2 size={14} /> Share
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* --- Left Sidebar: Metadata Panel --- */}
        <aside className="lg:col-span-4 xl:col-span-3 p-6 md:p-10 border-r border-white/5 space-y-10 bg-[#1A232E]">
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-[#88BDF2]">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                AI Synthesis
              </span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight tracking-tighter italic uppercase">
              {article.topic}
            </h1>
          </header>

          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 space-y-5">
              <h4 className="text-white font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                <Hash size={14} className="text-[#88BDF2]" /> Document Info
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-[#6A89A7]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Word Count
                    </p>
                    <p className="text-xl font-black text-slate-100">
                      {article.wordCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-[#6A89A7]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Est. Read Time
                    </p>
                    <p className="text-xl font-black text-slate-100">
                      {readTime}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-[#6A89A7]">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Created On
                    </p>
                    <p className="text-xl font-black text-slate-100">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#88BDF2]/5 rounded-2xl border border-[#88BDF2]/10">
              <p className="text-[10px] font-black text-[#88BDF2] uppercase tracking-[0.2em] mb-2">
                Editor's Note
              </p>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                This content was synthesized using high-density neural models.
                Verify technical specifics before publishing.
              </p>
            </div>
          </div>
        </aside>

        {/* --- Right Panel: Reader Experience --- */}
        <article className="lg:col-span-8 xl:col-span-9 p-6 md:p-16 lg:p-24 bg-[#1F2937]/30">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb / Context */}
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-[1px] bg-[#6A89A7]/30"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6A89A7]">
                Full Content Artifact
              </span>
            </div>

            {/* Markdown Body */}
            <div
              className="prose prose-invert prose-slate max-w-none 
              prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-white
              prose-h1:text-5xl prose-h2:text-3xl prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4
              prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
              prose-strong:text-[#88BDF2] prose-strong:font-bold
              prose-code:text-[#88BDF2] prose-code:bg-[#88BDF2]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-blockquote:border-l-[#88BDF2] prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:rounded-r-xl
            "
            >
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            <footer className="mt-20 pt-12 border-t border-white/5 text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
                End of Document
              </p>
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}
