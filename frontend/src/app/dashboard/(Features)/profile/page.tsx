"use client";

import { useEffect, useState, Suspense } from "react";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  Key,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Zap,
  CalendarDays,
  Activity,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
  subscriptionStatus?: string;
  stripeCurrentPeriodEnd?: string; // This is the base date from backend
  renewalDate?: string; // New field for our calculated 3-month date
}

function ProfileContent() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success");

  useEffect(() => {
    const syncUserProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (res.ok) {
          const freshData = await res.json();
          const userData = freshData.user;

          if (userData) {
            // --- DATE CALCULATION LOGIC ---
            if (userData.stripeCurrentPeriodEnd) {
              const startDate = new Date(userData.stripeCurrentPeriodEnd);
              // Add 3 months to the date
              startDate.setMonth(startDate.getMonth() + 3);
              userData.renewalDate = startDate.toISOString();
            }

            setUser(userData);
            Cookies.set("user_data", JSON.stringify(userData));

            if (isSuccess === "true") {
              toast.success("Protocol Upgraded", {
                description: `Identity verified for ${userData.plan} tier.`,
              });
              router.replace("/dashboard/profile");
            }
          }
        } else {
          const rawData = Cookies.get("user_data");
          if (rawData) setUser(JSON.parse(rawData));
        }
      } catch (error) {
        console.error("Profile sync error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    syncUserProfile();
  }, [isSuccess, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        Cookies.remove("user_data");
        toast.success("Session Terminated");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Helper: Formats the calculated renewal date
  const formatRenewalDate = (dateString?: string) => {
    if (!dateString) return "Processing...";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const initials =
    user?.firstName && user?.lastName
      ? (user.firstName[0] + user.lastName[0]).toUpperCase()
      : user?.email?.substring(0, 2).toUpperCase() || "??";

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#1A232E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 border-[#88BDF2]/20 border-t-[#88BDF2] rounded-full animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">
            Syncing Identity...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A232E] text-slate-200">
      <main className="max-w-[1000px] mx-auto pt-16 px-6 pb-20 space-y-10">
        <section className="flex flex-col md:flex-row items-center gap-8 bg-[#1F2937]/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white pointer-events-none z-0 group-hover:opacity-[0.07] transition-opacity duration-500">
            <User size={160} strokeWidth={1} />
          </div>

          <div className="w-28 h-28 rounded-[2.5rem] bg-[#88BDF2] flex items-center justify-center text-[#1A232E] text-4xl font-black shadow-2xl shadow-[#88BDF2]/20 relative z-10">
            {initials}
          </div>

          <div className="text-center md:text-left flex-1 relative z-10">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white italic uppercase leading-none mb-2">
              {user.firstName}{" "}
              <span className="text-[#88BDF2]">{user.lastName}</span>
            </h1>
            <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2.5 text-sm">
              <Mail className="w-4 h-4 text-[#88BDF2]" /> {user.email}
            </p>
          </div>

          <div className="relative z-10">
            <div
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-300 ${
                user.plan !== "FREE"
                  ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.1)]"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              {user.plan} Access Tier
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-[#1F2937]/20 border border-white/5 p-8 rounded-[2.5rem] space-y-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 px-1">
              <ShieldCheck className="w-4 h-4 text-[#88BDF2]" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Identity Enclave
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1A232E]/60 p-5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">
                  User Handle
                </p>
                <p className="font-bold text-white tracking-tight">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className="bg-[#1A232E]/60 p-5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">
                  Network Address
                </p>
                <p className="font-bold text-white tracking-tight">
                  {user.email}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#1F2937]/20 border border-white/5 p-8 rounded-[2.5rem] space-y-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 px-1">
              <Zap className="w-4 h-4 text-[#88BDF2]" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Plan Architecture
              </h3>
            </div>

            <div className="bg-gradient-to-br from-[#1A232E] to-[#1F2937] p-8 rounded-[2rem] border border-[#88BDF2]/10 relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
                    {user.plan}
                  </p>
                  <p className="text-[10px] text-[#88BDF2] font-black uppercase tracking-[0.2em]">
                    Active Tier
                  </p>
                </div>
                {user.plan !== "FREE" ? (
                  <ShieldCheck className="w-10 h-10 text-yellow-400 drop-shadow-2xl" />
                ) : (
                  <ShieldAlert className="w-10 h-10 text-slate-700" />
                )}
              </div>

              {user.plan !== "FREE" && (
                <div className="mt-6 space-y-4 relative z-10">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-[#88BDF2]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Status:{" "}
                      <span className="text-white uppercase">
                        {user.subscriptionStatus || "ACTIVE"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-yellow-400/80" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Renewal Cycle:{" "}
                      <span className="text-white">90 Days (Quarterly)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <CalendarDays className="w-3.5 h-3.5 text-[#88BDF2]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Next Renewal:{" "}
                      <span className="text-white">
                        {/* We use our calculated renewalDate here */}
                        {formatRenewalDate(user.renewalDate)}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {user.plan === "FREE" ? (
                <button
                  onClick={() => router.push("/dashboard/pricing")}
                  className="w-full mt-8 bg-[#88BDF2] text-[#1A232E] font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-[#A5CFFF] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#88BDF2]/10"
                >
                  Upgrade Protocol <ChevronRight size={14} />
                </button>
              ) : (
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.3em]">
                    Premium Protocol Engaged
                  </span>
                </div>
              )}
            </div>
          </section>

          <section className="md:col-span-2 bg-[#1F2937]/10 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center gap-3 px-1">
              <Key className="w-4 h-4 text-[#88BDF2]" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                System Operations
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => router.push("/dashboard/reset-password")}
                className="flex items-center justify-between p-6 bg-[#1A232E]/40 rounded-2xl border border-white/5 hover:border-[#88BDF2]/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#88BDF2]/10 rounded-xl text-[#88BDF2]">
                    <Key size={20} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-slate-300">
                    Update Credentials
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-between p-6 bg-red-500/5 rounded-2xl border border-red-500/10 hover:border-red-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <LogOut size={20} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-red-400">
                    Terminate Session
                  </span>
                </div>
                <ShieldAlert className="w-5 h-5 text-red-900 group-hover:text-red-500" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1A232E] flex items-center justify-center">
          <p className="text-[#88BDF2] text-[10px] font-black animate-pulse uppercase tracking-[0.5em]">
            Initializing Identity...
          </p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
