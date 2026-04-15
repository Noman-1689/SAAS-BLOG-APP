"use client";

import { useState } from "react";
import { useSignupMutation } from "@/hooks/useAuthMutation";
import { loginWithGoogle } from "@/services/authService";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Loader2,
  Fingerprint,
} from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { mutate, isPending } = useSignupMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password, firstName, lastName });
  };

  return (
    // Added h-screen and overflow-hidden to lock the viewport
    <div className="h-screen w-full bg-[#1A232E] flex items-center justify-center lg:grid lg:grid-cols-2 overflow-hidden">
      {/* --- LEFT SIDE: TACTICAL BRANDING (Fixed/No Scroll) --- */}
      <div className="hidden lg:flex flex-col justify-between p-16 xl:p-20 relative h-full border-r border-white/5 bg-[#1A232E]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#88BDF2]/5 rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 xl:mb-16">
            <div className="h-10 w-10 rounded-xl bg-[#88BDF2] flex items-center justify-center shadow-[0_0_20px_rgba(136,189,242,0.3)]">
              <Sparkles className="w-6 h-6 text-[#1A232E]" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter italic uppercase">
              CANVAS<span className="text-[#88BDF2]">.OS</span>
            </span>
          </div>

          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#88BDF2] rounded-full animate-pulse shadow-[0_0_8px_#88BDF2]" />
              <span className="text-[#88BDF2] text-[10px] font-black uppercase tracking-[0.4em]">
                Node Registration
              </span>
            </div>
            <h2 className="text-5xl xl:text-6xl font-black text-white leading-[1] tracking-tighter italic uppercase mb-8">
              Forge the <br />
              <span className="text-[#88BDF2]">Next Gen</span>
            </h2>

            <div className="space-y-4 xl:space-y-6">
              {[
                "Ultra-low latency rendering",
                "Encrypted cloud storage",
                "Multi-model AI integration",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-[#88BDF2]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-700 text-[10px] font-black tracking-[0.5em] uppercase">
          <Fingerprint className="w-5 h-5 opacity-20" strokeWidth={1.5} />
          <span>Genesis Protocol // 2026</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: TERMINAL (Centering with No Scroll) --- */}
      <div className="w-full h-full flex flex-col justify-center p-8 md:p-12 xl:p-20 bg-[#1A232E] relative overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-1">
              Create <span className="text-[#88BDF2]">Unit</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Join the professional network of AI creators
            </p>
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-white/5 text-white border border-white/10 font-black text-[10px] tracking-widest uppercase p-4 xl:p-5 rounded-[1.2rem] xl:rounded-[1.5rem] transition-all duration-300 mb-6 group"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all"
              alt="Google"
            />
            Sign up with Google
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.4em]">
              <span className="bg-[#1A232E] px-4 text-slate-700">
                Direct Entry
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-5">
            {/* NAME FIELDS ROW - Compressed for fit */}
            <div className="grid grid-cols-2 gap-3 xl:gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">
                  First Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700 group-focus-within:text-[#88BDF2] transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 xl:py-4 rounded-[1rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all text-xs font-bold"
                    placeholder="JOHN"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">
                  Last Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700 group-focus-within:text-[#88BDF2] transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 xl:py-4 rounded-[1rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all text-xs font-bold"
                    placeholder="DOE"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">
                Authorization Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700 group-focus-within:text-[#88BDF2] transition-colors" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 xl:py-4 rounded-[1rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all text-xs font-bold"
                  placeholder="NAME@COMPANY.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700 group-focus-within:text-[#88BDF2] transition-colors" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 xl:py-4 rounded-[1rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all tracking-[0.2em] text-xs font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black py-5 xl:py-6 rounded-[1.2rem] xl:rounded-[1.5rem] transition-all shadow-2xl shadow-[#88BDF2]/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="uppercase text-[10px] tracking-[0.2em]">
                    Syncing...
                  </span>
                </>
              ) : (
                <>
                  <span className="uppercase text-[10px] tracking-[0.2em]">
                    Initialize Account
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8">
            <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">
              Existing Unit?{" "}
            </span>
            <a
              href="/login"
              className="text-[#88BDF2] hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest underline underline-offset-8 decoration-[#88BDF2]/30"
            >
              Enter Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
