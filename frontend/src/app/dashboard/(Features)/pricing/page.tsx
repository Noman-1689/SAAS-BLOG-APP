"use client";

import {
  Check,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const plans = [
  {
    id: "FREE", // Changed from BASE to match Prisma Enum
    name: "BASE",
    price: "0",
    description: "Standard operating capacity for individual creators.",
    features: ["5 Workspaces", "Standard Render Speed", "2GB Vault Storage"],
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "PRO",
    name: "PRO",
    price: "29",
    description: "Advanced protocols for professional architects.",
    features: [
      "Unlimited Workspaces",
      "High-Velocity Rendering",
      "50GB Vault Storage",
      "Custom Domain",
    ],
    highlight: true,
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "ENTERPRISE",
    name: "ENTERPRISE",
    price: "99",
    description: "Full-scale deployment for high-output teams.",
    features: [
      "Dedicated Nodes",
      "API Access",
      "White-label OS",
      "Unlimited Storage",
    ],
    icon: <Crown className="w-5 h-5" />,
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // ✅ FETCH ACTUAL USER DATA
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          withCredentials: true,
        },
      );
      return res.data.user;
    },
  });

  const userPlan = profileData?.plan || "FREE";

  const handleUpgrade = async (planId: string) => {
    if (planId === "FREE" || planId === userPlan) return;

    if (planId === "ENTERPRISE") {
      window.location.href = "mailto:sales@canvas-os.com";
      return;
    }

    setLoadingPlan(planId);
    toast.info(`Initializing ${planId} Protocol...`);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout`,
        { planName: planId },
        { withCredentials: true },
      );

      if (res.data.url) window.location.href = res.data.url;
    } catch (error) {
      toast.error("Bridge Connection Error");
      setLoadingPlan(null);
    }
  };

  if (profileLoading) {
    return (
      <div className="h-screen bg-[#1A232E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#88BDF2]" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1A232E] flex flex-col items-center justify-center overflow-hidden px-6 relative">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="text-center mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#88BDF2] rounded-full animate-pulse shadow-[0_0_8px_#88BDF2]" />
            <span className="text-[#88BDF2] text-[10px] font-black uppercase tracking-[0.4em]">
              Subscription Ledger
            </span>
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            System <span className="text-[#88BDF2]">Tiers</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isCurrent = plan.id === userPlan;
            const isBase = plan.id === "FREE";
            // User cannot downgrade to FREE manually through this UI
            const isDowngrade =
              (userPlan === "PRO" || userPlan === "ENTERPRISE") && isBase;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-8 rounded-[3rem] border transition-all duration-500 backdrop-blur-xl ${
                  isCurrent
                    ? "bg-[#1F2937]/80 border-emerald-500/30 shadow-2xl shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                    : plan.highlight
                      ? "bg-[#1F2937]/60 border-[#88BDF2]/40 shadow-2xl shadow-[#88BDF2]/5 scale-[1.02]"
                      : "bg-[#1F2937]/30 border-white/5 opacity-80"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-[#1A232E] text-[9px] font-black px-5 py-2 rounded-full tracking-[0.2em] uppercase shadow-lg shadow-emerald-500/20">
                    Active Protocol
                  </div>
                )}

                <div className="mb-8">
                  <div
                    className={`p-3 rounded-2xl inline-block mb-4 ${
                      isCurrent
                        ? "bg-emerald-500 text-[#1A232E]"
                        : plan.highlight
                          ? "bg-[#88BDF2] text-[#1A232E]"
                          : "bg-white/5 text-[#88BDF2]"
                    }`}
                  >
                    {isCurrent ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      plan.icon
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    {plan.name}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-tight leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    ${plan.price}
                  </span>
                  <span className="text-slate-600 font-black text-[10px] uppercase tracking-widest">
                    / Cycle
                  </span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tighter"
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${
                          isCurrent ? "text-emerald-500" : "text-[#88BDF2]"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loadingPlan === plan.id || isCurrent || isDowngrade}
                  className={`w-full py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 group uppercase ${
                    isCurrent
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 cursor-default"
                      : isDowngrade
                        ? "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed opacity-50"
                        : plan.highlight
                          ? "bg-[#88BDF2] text-[#1A232E] hover:bg-[#A5CFFF] shadow-xl shadow-[#88BDF2]/10"
                          : "bg-[#1A232E]/80 border border-white/5 text-white hover:bg-[#1A232E]"
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrent ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Protocol Active</span>
                    </>
                  ) : isDowngrade ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Core Protocol</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {plan.id === "ENTERPRISE"
                          ? "Contact Sales"
                          : `Initialize ${plan.name}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
