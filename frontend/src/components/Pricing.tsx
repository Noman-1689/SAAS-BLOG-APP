"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Zap,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Globe,
  Sparkles,
  Lock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            priceId: priceId,
            userId: "user_uuid_here", // Should be pulled from your Auth State
          }),
        },
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-[#1A232E] text-white flex flex-col items-center justify-center p-6 lg:overflow-hidden relative">
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#88BDF2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#88BDF2]/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* --- NAVIGATION OVERLAY --- */}
      <Link
        href="/dashboard"
        className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[#88BDF2] transition-colors z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* --- CONTENT BOX --- */}
      <div className="relative z-10 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#88BDF2]/20 bg-[#88BDF2]/5 text-[#88BDF2] text-[10px] font-black tracking-[0.4em] uppercase mb-6">
            <Cpu className="w-3 h-3" />
            Node Scaling Protocol
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">
            Upgrade <span className="text-[#88BDF2]">Clearance</span>
          </h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            Select an access tier to expand your neural processing capacity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* HOBBY TIER (Inactive / Current) */}
          <div className="p-10 rounded-[2.5rem] bg-[#1F2937]/30 border border-white/5 flex flex-col justify-between opacity-60">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/5 rounded-2xl text-slate-500">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Standard_Access
                </span>
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase mb-2">
                Hobby
              </h3>
              <div className="text-4xl font-black mb-6 italic">$0</div>
              <ul className="space-y-4 mb-10">
                {["5 Articles/mo", "10 Blog Titles", "Basic AI Images"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500"
                    >
                      <ShieldCheck className="w-4 h-4" /> {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="py-4 text-center border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600">
              Current Node Level
            </div>
          </div>

          {/* PRO TIER (Call to Action) */}
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1A232E] to-[#1F2937] border-2 border-[#88BDF2] flex flex-col justify-between relative shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            <div className="absolute top-6 right-8">
              <span className="bg-[#88BDF2] text-[#1A232E] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Recommended
              </span>
            </div>

            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-[#88BDF2]/10 rounded-2xl text-[#88BDF2] border border-[#88BDF2]/20">
                  <Zap className="w-6 h-6 fill-[#88BDF2]" />
                </div>
                <span className="text-[10px] font-black text-[#88BDF2] uppercase tracking-widest">
                  Quantum_Tier
                </span>
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase mb-2">
                Pro Plan
              </h3>
              <div className="text-4xl font-black mb-6 italic text-[#88BDF2]">
                $19
                <span className="text-lg text-slate-500 not-italic ml-1 italic">
                  /mo
                </span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited Neural Forge",
                  "Unlimited Visual Synth",
                  "4K Image Export",
                  "Priority Compute Queue",
                  "Full API Integration",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white"
                  >
                    <Sparkles className="w-4 h-4 text-[#88BDF2]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe("price_H123456789")}
              className="group w-full py-5 bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1A232E] font-black rounded-2xl flex items-center justify-center gap-3 transition-all uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#88BDF2]/10 active:scale-95"
            >
              Initialize Upgrade{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* --- FOOTER STATUS --- */}
        <div className="mt-12 flex justify-center items-center gap-8 border-t border-white/5 pt-8">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-slate-700" />
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
              Secure Stripe Gateway
            </span>
          </div>
          <div className="w-1 h-1 bg-slate-800 rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
              Billing Service Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
