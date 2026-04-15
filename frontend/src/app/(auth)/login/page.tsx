"use client";

import { useState } from "react";
import { useLoginMutation } from "@/hooks/useAuthMutation";
import { loginWithGoogle } from "@/services/authService";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Loader2,
  X,
  Fingerprint,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Forgot Password States ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isResetPending, setIsResetPending] = useState(false);

  const { mutate, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Reset link sent to your email!");
        setShowForgotModal(false);
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsResetPending(false);
    }
  };

  return (
    <div className="h-screen bg-[#1A232E] flex items-center justify-center lg:grid lg:grid-cols-2 overflow-hidden">
      {/* --- Left Side: Tactical Dashboard Hero --- */}
      <div className="hidden lg:flex flex-col justify-between p-20 relative h-full border-r border-white/5 bg-[#1A232E]">
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
          <div className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 rounded-xl bg-[#88BDF2] flex items-center justify-center shadow-[0_0_20px_rgba(136,189,242,0.3)]">
              <Sparkles className="w-6 h-6 text-[#1A232E]" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter italic uppercase">
              CANVAS<span className="text-[#88BDF2]">.OS</span>
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-6xl font-black text-white leading-[1] tracking-tighter italic uppercase mb-8">
              Resume <br />
              <span className="text-[#88BDF2]">Neural</span> <br />
              Workflows.
            </h2>

            <div className="space-y-6">
              {[
                "Encrypted Workspace Access",
                "AI Rendering Protocol Active",
                "Cloud-Vault Synchronization",
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
          <Zap className="w-4 h-4 text-[#88BDF2] animate-pulse" />
          <span>Industrial Grade // 2026</span>
        </div>
      </div>

      {/* --- Right Side: Access Terminal --- */}
      <div className="w-full flex justify-center p-8 md:p-20 bg-[#1A232E] items-center relative">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-2">
              Identity <span className="text-[#88BDF2]">Verify</span>
            </h1>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
              Establish secure session link
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-white/5 text-white border border-white/10 font-black text-[10px] tracking-widest uppercase p-5 rounded-[1.5rem] transition-all duration-300 mb-8 group"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all"
              alt="Google"
            />
            Continue with Google
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">
                Authorization Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-[#88BDF2] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 placeholder:text-slate-800"
                  placeholder="USER@VAULT.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                  Security Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[9px] font-black text-[#88BDF2]/60 hover:text-[#88BDF2] uppercase tracking-widest transition-colors"
                >
                  Key Lost?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-[#88BDF2] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 tracking-[0.3em] placeholder:text-slate-800"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-[#88BDF2]/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="uppercase text-[11px] tracking-[0.2em]">
                    Authenticating...
                  </span>
                </>
              ) : (
                <>
                  <span className="uppercase text-[11px] tracking-[0.2em]">
                    Initialize Session
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-12">
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
              External Node?{" "}
            </span>
            <a
              href="/signup"
              className="text-[#88BDF2] hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-[#88BDF2]/30"
            >
              Register Unit
            </a>
          </p>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL (Redesigned) --- */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A232E]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#1F2937] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#88BDF2]/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-10">
              <div className="h-12 w-12 rounded-2xl bg-[#88BDF2]/10 flex items-center justify-center mx-auto mb-6">
                <Fingerprint className="w-6 h-6 text-[#88BDF2]" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                Reset <span className="text-[#88BDF2]">Sequence</span>
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3 leading-relaxed">
                Enter recovery email to bypass current encryption key
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                <input
                  type="email"
                  required
                  placeholder="IDENTITY@RECOVERY.COM"
                  className="w-full pl-14 pr-4 py-4 rounded-[1.2rem] bg-[#1A232E] border border-white/5 text-white outline-none focus:border-[#88BDF2]/40 transition-all text-xs font-bold tracking-widest"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isResetPending}
                className="w-full bg-[#88BDF2] text-[#1A232E] font-black py-5 rounded-[1.2rem] hover:bg-[#A5CFFF] transition-all text-[10px] tracking-[0.2em] uppercase disabled:opacity-50"
              >
                {isResetPending ? "Relaying..." : "Relay Reset Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
