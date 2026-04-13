"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, XCircle, Zap, Building2, Rocket, Handshake, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UpgradeModal from "@/components/UpgradeModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ROLE_COLORS: Record<string, string> = {
  startup: "#1D6FF2",
  investor: "#F4A91F",
  b2b: "#10B981",
};

const ROLE_VALUES: Record<string, string> = {
  startup: "One investor connection can fund your next 3 years.",
  investor: "One deal closed covers 5+ years of subscription.",
  b2b: "One partnership returns 10x your yearly investment.",
};

const trustStats = [
  { icon: <Building2 size={16} />, label: "2,400+ Verified Businesses" },
  { icon: <Zap size={16} />, label: "800+ Active Investors" },
  { icon: <Rocket size={16} />, label: "1,200+ Startups Funded" },
  { icon: <Handshake size={16} />, label: "₹240Cr+ Deals Closed" },
];

const trialFeatures = [
  { text: "Create & verify your profile", included: true },
  { text: "Submit KYC documents", included: true },
  { text: "View AI match previews (blurred)", included: true },
  { text: "Browse live pitch schedule", included: true },
  { text: "View platform features", included: true },
  { text: "Send connection requests", included: false },
  { text: "View full match profiles", included: false },
  { text: "Join live pitches", included: false },
  { text: "Access Deal Room", included: false },
];

const premiumFeatures = [
  "Everything in Discovery Trial",
  "Full AI matchmaking (unlimited)",
  "Send & receive connection requests",
  "View complete match profiles",
  "Real-time 1:1 messaging",
  "Join live pitch sessions",
  "Host live pitches (Startup only)",
  "Full Deal Room access",
  "Secure document shared vault",
];

const comparisonRows = [
  { feature: "AI Match Previews", trial: "Blurred", premium: "Full Access" },
  { feature: "Connection Requests", trial: "❌", premium: "✅" },
  { feature: "Live Pitch Sessions", trial: "❌", premium: "✅" },
  { feature: "Deal Room Access", trial: "❌", premium: "✅" },
  { feature: "Price", trial: "₹0", premium: "₹15,000/mo" },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const accent = ROLE_COLORS[user?.role ?? "startup"];
  const isTrial = user?.subscription === "trial";
  const isPremium = user?.subscription === "premium";

  return (
    <div className="pb-24 animate-fadeIn">
      <DashboardHeader 
        title="Premium Membership" 
        description="Unlock the full power of verified networking on BRIDGE."
        showBack={true}
      >
        <div className="flex items-center bg-card border border-border p-1 rounded-2xl shadow-sm ">
          <button onClick={() => setAnnual(false)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all tracking-tight uppercase ${!annual ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}>
            Monthly
          </button>
          <button onClick={() => setAnnual(true)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 tracking-tight uppercase ${annual ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}>
            Annually
            <span className="bg-green-500/20 text-green-500 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-green-500/20">-20%</span>
          </button>
        </div>
      </DashboardHeader>

      <div className="max-w-5xl mx-auto mt-6">
        {/* Trust stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {trustStats.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-4 shadow-sm hover:border-primary/20 transition-all">
              <span className="text-primary">{s.icon}</span>
              <span className="text-[11px] font-black text-foreground uppercase tracking-tight opacity-70">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* DISCOVERY TRIAL */}
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col shadow-sm">
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Discovery Trial</p>
            <div className="mb-2">
              <span className="text-foreground text-5xl font-black tracking-tighter">₹0</span>
              <span className="text-muted-foreground text-sm font-black ml-2 uppercase tracking-wide opacity-50">Free</span>
            </div>
            <p className="text-muted-foreground text-xs mb-8 font-medium">7 days · No card required · Explore BRIDGE features</p>

            <div className="space-y-4 flex-1 mb-10">
              {trialFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {f.included ? <CheckCircle2 size={16} className="text-primary shrink-0" /> : <XCircle size={16} className="text-muted-foreground/30 shrink-0" />}
                  <span className={`font-medium tracking-tight ${f.included ? "text-foreground" : "text-muted-foreground/40 line-through"}`}>{f.text}</span>
                </div>
              ))}
            </div>

            <Button disabled className="w-full h-12 bg-muted text-muted-foreground font-black tracking-widest text-[10px] uppercase rounded-2xl opacity-60">
              {isTrial ? "Current Plan" : "Already Registered"}
            </Button>
          </div>

          {/* PREMIUM */}
          <div className="relative bg-card rounded-3xl p-8 flex flex-col overflow-hidden border-2 border-primary shadow-2xl shadow-primary/5">
            <Badge className="absolute top-6 right-6 text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-primary text-white border-none shadow-lg">
              Recommended
            </Badge>

            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Premium Membership</p>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-foreground text-5xl font-black tracking-tighter">₹{annual ? "12,000" : "15,000"}</span>
              <span className="text-muted-foreground text-sm font-black uppercase tracking-wide opacity-50">/ month</span>
            </div>
            
            {annual && (
              <div className="mb-4">
                 <span className="bg-green-500/10 text-green-600 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/10">Save ₹36,000 per year</span>
              </div>
            )}
            
            <p className="text-muted-foreground text-xs mb-8 font-black uppercase tracking-widest opacity-70 underline decoration-primary/40 underline-offset-4">{ROLE_VALUES[user?.role ?? "startup"]}</p>

            <div className="space-y-4 flex-1 mb-10">
              {premiumFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span className="text-foreground font-bold tracking-tight">{f}</span>
                </div>
              ))}
            </div>

            <Button onClick={() => setUpgradeOpen(true)}
              className="w-full h-14 bg-primary text-white font-black tracking-widest text-[11px] uppercase rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {isPremium ? "Current Plan ✓" : "Upgrade to Premium →"}
            </Button>
            <p className="text-muted-foreground text-[10px] text-center mt-4 font-bold flex items-center justify-center gap-2 opacity-50 uppercase tracking-widest">
              <Lock size={12} /> Secure Razorpay Gateway
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-foreground text-xl font-black text-center mb-8 uppercase tracking-widest opacity-60">Full Comparison</h2>
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-muted/30 p-5 text-[10px] font-black uppercase tracking-widest opacity-60 border-b border-border">
              <span>Feature</span>
              <span className="text-center">Trial</span>
              <span className="text-center text-primary">Premium</span>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 p-5 text-sm border-t border-border ${i % 2 === 0 ? "" : "bg-muted/5 shadow-inner"}`}>
                <span className="text-foreground font-black tracking-tight">{row.feature}</span>
                <span className="text-center text-muted-foreground font-medium text-xs">{row.trial}</span>
                <span className="text-center text-foreground font-black text-xs">{row.premium}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
