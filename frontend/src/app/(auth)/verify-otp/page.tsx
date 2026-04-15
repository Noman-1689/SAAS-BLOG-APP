"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

function VerifyOTPContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verified successfully!");
        router.push("/login");
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#1A232E] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#88BDF2]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-[#88BDF2]/10 flex items-center justify-center mx-auto mb-6 border border-[#88BDF2]/20">
            <ShieldAlert className="w-7 h-7 text-[#88BDF2]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase mb-2">
            Final <span className="text-[#88BDF2]">Auth</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
            Transmission sent to: <br />
            <span className="text-white underline decoration-[#88BDF2]/40 underline-offset-4 lowercase">
              {email || "unknown_node"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!searchParams.get("email") && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">
                Target Email
              </label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-[1.2rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 text-sm font-bold"
                placeholder="NAME@VAULT.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2 text-center">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              Verification Sequence
            </label>
            <input
              type="text"
              required
              maxLength={6}
              className="w-full px-4 py-6 rounded-[1.5rem] bg-[#1F2937]/40 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 text-center text-4xl font-black tracking-[0.4em] placeholder:text-slate-800"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-[#88BDF2] hover:bg-[#A5CFFF] text-[#1A232E] font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-[#88BDF2]/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="uppercase text-[11px] tracking-[0.2em]">
                  Validating...
                </span>
              </>
            ) : (
              <>
                <span className="uppercase text-[11px] tracking-[0.2em]">
                  Authorize Access
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => alert("Resend functionality triggered")}
            className="text-slate-500 hover:text-[#88BDF2] transition-colors text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 mx-auto group"
          >
            <div className="w-1 h-1 bg-slate-700 group-hover:bg-[#88BDF2] rounded-full transition-colors" />
            Request New Link
            <div className="w-1 h-1 bg-slate-700 group-hover:bg-[#88BDF2] rounded-full transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-[#1A232E] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-[#88BDF2] animate-spin" />
          <span className="text-[#88BDF2] text-[10px] font-black tracking-[0.5em] animate-pulse">
            BOOTING SECURE CHANNEL...
          </span>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
