"use client";

import { useState, useEffect } from "react";
import { useGenerateImage } from "@/hooks/useImageMutation";
import { toast } from "sonner";
import {
  ImageIcon,
  Download,
  Sparkles,
  Loader2,
  Maximize2,
  Terminal,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function GenerateImagePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, data, isPending, isSuccess, isError, error, reset } =
    useGenerateImage();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Rendering Complete", {
        description: "Your visual has been processed by the neural engine.",
      });
    }

    if (isError) {
      const message =
        (error as any)?.response?.data?.message || "Generation failed";
      toast.error("Engine Fault", {
        description: message,
      });
    }
  }, [isSuccess, isError, error]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (description.length < 10) {
      return toast.warning("Detailed prompt required", {
        description: "Please provide a more descriptive prompt for the AI.",
      });
    }

    mutate({ title, description });
  };

  const downloadImage = () => {
    if (data?.imagePreview) {
      toast.info("Downloading artifact...");
      const link = document.createElement("a");
      link.href = data.imagePreview;
      link.download = `${title.replace(/\s+/g, "-") || "visual-artifact"}.jpg`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200 p-6 md:p-10 lg:p-16">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10">
        {/* --- Control Sidebar (Left) --- */}
        <div className="w-full lg:w-[400px] space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-[#88BDF2]">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                AI Synthesis
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
              Visual
              <br />
              Engine
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Define parameters to generate high-fidelity image artifacts using
              semantic prompts.
            </p>
          </header>

          <form
            onSubmit={handleGenerate}
            className="space-y-6 bg-[#1F2937]/50 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm shadow-2xl"
          >
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                Project Title
              </label>
              <input
                required
                className="w-full p-4 rounded-xl bg-[#1A232E]/80 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all placeholder:text-slate-600 text-sm font-medium"
                placeholder="Ex: Cyberpunk Cityscape"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                Visual Description
              </label>
              <textarea
                required
                className="w-full p-4 rounded-xl bg-[#1A232E]/80 border border-white/10 text-white focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]/50 outline-none transition-all h-40 resize-none placeholder:text-slate-600 text-sm font-medium leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                placeholder="Describe the composition, lighting, style, and subject matter in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-[#88BDF2]/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Render Visual</span>
                </>
              )}
            </button>
          </form>

          {isSuccess && (
            <button
              onClick={() => {
                reset();
                setTitle("");
                setDescription("");
                toast.info("Session reset");
              }}
              className="w-full py-4 bg-white/[0.02] border border-white/5 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3 h-3" /> Initialize New Session
            </button>
          )}
        </div>

        {/* --- Main Canvas (Right) --- */}
        <div className="flex-1 min-h-[600px] bg-[#1F2937]/30 border border-white/5 rounded-[2rem] lg:rounded-[3rem] relative overflow-hidden flex items-center justify-center shadow-inner">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#6A89A7 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Idle State */}
          {!data && !isPending && (
            <div className="text-center space-y-5 opacity-40 mix-blend-plus-lighter">
              <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Maximize2 className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-black tracking-[0.4em] text-[10px] text-slate-300 uppercase">
                Awaiting Parameters
              </p>
            </div>
          )}

          {/* Loading State */}
          {isPending && (
            <div className="text-center space-y-8 z-10">
              <div className="relative h-24 w-24 mx-auto">
                <div className="absolute inset-0 border-2 border-[#88BDF2]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-[#88BDF2] rounded-full border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-[#88BDF2] w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-[#88BDF2] font-black animate-pulse uppercase tracking-[0.3em] text-xs">
                  Synthesizing Artifact...
                </p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Applying High-Density Render
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="relative group w-full h-full p-8 md:p-12 flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative max-h-full max-w-full rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 group-hover:border-[#88BDF2]/40 transition-colors duration-500">
                <img
                  src={data.imagePreview}
                  alt={title}
                  className="object-contain max-h-[70vh] w-auto"
                />

                {/* Hover Overlay Download Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button
                    onClick={downloadImage}
                    className="bg-white/10 backdrop-blur-xl text-white px-6 py-4 rounded-2xl border border-white/20 hover:bg-[#88BDF2] hover:text-[#1A232E] hover:border-[#88BDF2] transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl scale-95 group-hover:scale-100 duration-300"
                  >
                    <Download className="w-4 h-4" /> Export HD Asset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top Right System Label */}
          <div className="absolute top-6 right-8 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-[#1F2937] px-3 py-1.5 rounded-full border border-white/5">
            <Terminal className="w-3 h-3 text-[#88BDF2]" /> SDXL-Base // Model
            2026
          </div>
        </div>
      </div>
    </div>
  );
}
