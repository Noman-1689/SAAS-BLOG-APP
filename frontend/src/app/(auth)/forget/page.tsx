"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Fingerprint,
} from "lucide-react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#1A232E] flex items-center justify-center lg:grid lg:grid-cols-2 overflow-hidden">
      {/* --- LEFT SIDE: TACTICAL BRANDING --- */}
      <div className="hidden lg:flex flex-col justify-between p-20 relative h-full border-r border-white/5 bg-[#1A232E]">
        {/* Ambient Background decor */}
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#88BDF2] rounded-full animate-pulse shadow-[0_0_8px_#88BDF2]" />
              <span className="text-[#88BDF2] text-[10px] font-black uppercase tracking-[0.4em]">
                Security Override
              </span>
            </div>
            <h2 className="text-6xl font-black text-white leading-[1] tracking-tighter italic uppercase mb-8">
              Restore <br />
              <span className="text-[#88BDF2]">Vault Access</span>
            </h2>
            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase leading-relaxed border-l-2 border-[#88BDF2]/20 pl-6">
              Establish new administrative credentials to regain control of your
              operating environment.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-700 text-[10px] font-black tracking-[0.5em] uppercase">
          <Fingerprint className="w-5 h-5 opacity-20" strokeWidth={1.5} />
          <span>System Protocol v3.0.26</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: OVERRIDE FORM --- */}
      <div className="w-full flex justify-center p-8 md:p-20 bg-[#1A232E] items-center relative">
        {/* Mobile background decor */}
        <div className="absolute top-0 left-0 w-full h-full lg:hidden opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#88BDF2] rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-sm relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-2">
              New <span className="text-[#88BDF2]">Cipher</span>
            </h1>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
              Update sequence for master authorization
            </p>
          </div>

          {!token ? (
            <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-red-400 flex items-center gap-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-tight">
                Critical Error: Missing or expired security token
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* INPUT: NEW PASSWORD */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">
                  New Private Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full pl-6 pr-4 py-5 rounded-[1.5rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 tracking-[0.3em] placeholder:text-slate-800"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* INPUT: CONFIRM PASSWORD */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">
                  Verify Sequence
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full pl-6 pr-4 py-5 rounded-[1.5rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 tracking-[0.3em] placeholder:text-slate-800"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-[#88BDF2]/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

                <div className="relative flex items-center gap-3 uppercase text-[11px] tracking-[0.2em]">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Re-Encrypting...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute Rotation</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* STATUS FEEDBACK */}
              {status.message && (
                <div
                  className={`flex items-center gap-3 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 ${
                    status.type === "success"
                      ? "bg-emerald-500/5 text-emerald-400 border border-emerald-500/10"
                      : "bg-red-500/5 text-red-400 border border-red-500/10"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {status.message}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-[#1A232E] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-[#88BDF2] animate-spin" />
          <span className="text-[#88BDF2] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
            Establishing Secure Link
          </span>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
