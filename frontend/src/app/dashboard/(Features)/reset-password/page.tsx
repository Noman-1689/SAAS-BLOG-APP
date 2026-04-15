"use client";

import { useState } from "react";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsPending(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    /* FIXED HEIGHT LOGIC:
       - h-screen: Locks height to exactly the window height.
       - overflow-hidden: Prevents any scrolling.
       - items-center justify-center: Perfectly centers the vault in the viewport.
    */
    <div className="h-screen bg-[#1A232E] flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="max-w-2xl w-full mx-auto">
        {/* --- PROTOCOL HEADER --- */}
        <div className="mb-8 flex items-end justify-between px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#88BDF2] rounded-full animate-pulse shadow-[0_0_10px_#88BDF2]" />
              <span className="text-[#88BDF2] text-[10px] font-black uppercase tracking-[0.4em]">
                Vault Access
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Credential <span className="text-[#88BDF2]">Rotation</span>
            </h1>
          </div>
          <Fingerprint
            className="text-white/5 w-14 h-14 hidden sm:block"
            strokeWidth={1}
          />
        </div>

        {/* --- MAIN FORM MODULE --- */}
        <div className="bg-[#1F2937]/40 border border-white/5 backdrop-blur-xl rounded-[3rem] p-1 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#88BDF2]/5 rounded-full blur-[100px] pointer-events-none" />

          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-10 space-y-6 relative z-10"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Existing Authorization
                </label>
                <Lock className="w-3 h-3 text-slate-700" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-6 pr-4 py-4 rounded-[1.2rem] bg-[#1A232E]/80 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 tracking-[0.3em]"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative bg-[#1F2937] px-3 py-1 rounded-full border border-white/5">
                <ArrowRight className="w-3 h-3 text-slate-700 rotate-90" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  New Private Key
                </label>
                <input
                  type="password"
                  required
                  className="w-full pl-6 pr-4 py-4 rounded-[1.2rem] bg-[#1A232E]/80 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 tracking-[0.3em]"
                  placeholder="NEW_SECURE"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Confirm Sequence
                </label>
                <input
                  type="password"
                  required
                  className="w-full pl-6 pr-4 py-4 rounded-[1.2rem] bg-[#1A232E]/80 border border-white/5 text-white focus:border-[#88BDF2]/40 outline-none transition-all duration-500 tracking-[0.3em]"
                  placeholder="CONFIRM_KEY"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {status && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500 ${
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
                {status.msg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-[1.2rem] bg-[#88BDF2] py-5 transition-all active:scale-[0.97] disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center gap-3 text-[#1A232E] font-black uppercase tracking-[0.25em] text-[10px]">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>
                  {isPending ? "Synchronizing..." : "Commit New Protocol"}
                </span>
              </div>
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em] opacity-40">
            SECURE SESSION ACTIVE • AES-256
          </p>
        </div>
      </div>
    </div>
  );
}
