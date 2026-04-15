"use client";

import { useState } from "react";
import { useGenerateArticle } from "@/hooks/useArticleMutation";
import ReactMarkdown from "react-markdown";
import {
  PenTool,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Layout,
  FileText,
  Zap,
  Terminal,
} from "lucide-react";

export default function WriteArticlePage() {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState(600);
  const [copied, setCopied] = useState(false);

  const { mutate, data, isPending, isSuccess } = useGenerateArticle();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ topic, wordCount });
  };

  const copyToClipboard = () => {
    if (data?.data?.content) {
      navigator.clipboard.writeText(data.data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200">
      {/* Main container now uses a narrower max-width (1000px) 
          to prevent the stacked elements from looking too wide 
      */}
      <main className="w-full max-w-[1000px] mx-auto p-6 md:p-10 lg:p-16 space-y-16">
        {/* --- TOP SECTION: Input / Configuration --- */}
        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#88BDF2]">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Neural Synthesis Engine
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
              Article Engine
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[500px] mx-auto">
              Configure your parameters below to synthesize high-density
              narrative structures.
            </p>
          </header>

          <form
            onSubmit={handleGenerate}
            className="bg-[#1F2937]/50 border border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-md shadow-2xl space-y-10"
          >
            {/* Topic Input */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                Primary Narrative Focus
              </label>
              <textarea
                required
                className="w-full p-6 rounded-2xl bg-[#1A232E]/80 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all h-32 resize-none placeholder:text-slate-600 text-lg font-medium leading-relaxed"
                placeholder="Ex: The strategic importance of AI ethics in 2026..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Slider and Button Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Output Volume
                  </label>
                  <span className="text-[#88BDF2] font-black text-sm tracking-tighter italic">
                    {wordCount} WORDS
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="100"
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#88BDF2] hover:accent-[#BDDDFC] transition-all"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black text-xs uppercase tracking-[0.3em] py-5 rounded-2xl transition-all shadow-xl shadow-[#88BDF2]/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Generate Artifact</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* --- BOTTOM SECTION: Output Terminal --- */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="bg-[#1F2937]/20 border border-white/5 rounded-[3rem] min-h-[500px] flex flex-col overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="border-b border-white/5 p-6 md:px-10 flex justify-between items-center bg-[#1A232E]/40 backdrop-blur-xl">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-white/5 border border-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/5 border border-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/5 border border-white/10" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                  <Terminal size={14} className="text-[#88BDF2]" />{" "}
                  Kernel.Output_Stream
                </span>
              </div>

              {isSuccess && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-[#88BDF2] hover:text-[#1A232E] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Markdown
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-14 lg:p-20 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {!data && !isPending && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-8 py-20 opacity-30">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#88BDF2]/10 blur-3xl rounded-full" />
                    <FileText size={80} className="relative text-slate-700" />
                  </div>
                  <p className="font-black tracking-[0.6em] text-[10px] text-slate-500 uppercase">
                    Terminal Idle // Awaiting Kernel Execution
                  </p>
                </div>
              )}

              {isPending && (
                <div className="space-y-12 animate-pulse max-w-2xl mx-auto py-10">
                  <div className="h-12 w-3/4 bg-white/5 rounded-2xl" />
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-white/[0.03] rounded-full" />
                    <div className="h-4 w-full bg-white/[0.03] rounded-full" />
                    <div className="h-4 w-2/3 bg-white/[0.03] rounded-full" />
                  </div>
                </div>
              )}

              {isSuccess && (
                <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
                  <article
                    className="prose prose-invert prose-slate max-w-none 
                    prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-white
                    prose-h1:text-5xl prose-h1:mb-12 prose-h1:italic
                    prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4 prose-h2:mt-16
                    prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                    prose-strong:text-[#88BDF2] prose-strong:font-bold
                    prose-blockquote:border-l-[#88BDF2] prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-2xl
                  "
                  >
                    <ReactMarkdown>{data.data.content}</ReactMarkdown>
                  </article>

                  <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center">
                    <div className="h-1 w-12 bg-[#88BDF2]/40 rounded-full mb-6" />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.8em]">
                      End of Transmission
                    </p>
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
