"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Lock, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const matchTeasers = [
  { name: "Rahul Sharma", title: "Angel Investor", match: "94%", location: "Mumbai", industry: "Fintech" },
  { name: "Neha Kapoor", title: "VC Partner", match: "88%", location: "Bengaluru", industry: "SaaS" },
  { name: "Vikram Nair", title: "Family Office", match: "81%", location: "Delhi NCR", industry: "Real Estate" },
  { name: "Priya Singh", title: "Startup Founder", match: "77%", location: "Hyderabad", industry: "Healthtech" },
  { name: "Arjun Mehta", title: "Growth Equity", match: "73%", location: "Pune", industry: "Edtech" },
  { name: "Kavya Reddy", title: "Corporate VC", match: "69%", location: "Chennai", industry: "Deeptech" },
];

export default function MatchesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="animate-fadeIn">
      <DashboardHeader 
        title="AI Matches" 
        description="Discover and connect with highly compatible, verified partners on BRIDGE."
        showBack={true}
      >
        <Button variant="outline" className="h-10 rounded-xl border-border hover:bg-muted font-black text-[10px] tracking-widest uppercase shadow-sm">
          <Search size={14} className="mr-2 opacity-60" /> Filter Results
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {matchTeasers.map((m, i) => (
          <div key={i} className="group relative rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
            <div className="p-6 filter blur-md select-none pointer-events-none opacity-40 grayscale translate-y-2 group-hover:blur-sm transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg transform rotate-3">
                  <span className="text-white font-black text-xl">{m.name[0]}</span>
                </div>
                <div>
                  <p className="text-foreground font-black text-lg tracking-tight leading-none mb-1">{m.name}</p>
                  <p className="text-muted-foreground text-xs font-black uppercase tracking-widest opacity-60">{m.title}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-border pb-2">
                  <span className="text-muted-foreground font-black uppercase tracking-widest opacity-60">Location</span>
                  <span className="text-foreground font-black uppercase tracking-tight">{m.location}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-border pb-2">
                  <span className="text-muted-foreground font-black uppercase tracking-widest opacity-60">Industry</span>
                  <span className="text-foreground font-black uppercase tracking-tight">{m.industry}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-black uppercase tracking-widest opacity-60">Compatibility</span>
                  <span className="text-green-500 font-black text-sm tracking-tighter">{m.match}</span>
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-4 z-10">
              <div className="w-16 h-16 rounded-3xl bg-card border-2 border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/20 transform hover:scale-110 active:scale-95 transition-all">
                <Lock size={24} className="text-primary animate-pulse" />
              </div>
              <div className="text-center px-6">
                <p className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Profile Hidden</p>
                <p className="text-muted-foreground text-[10px] font-bold leading-normal uppercase tracking-widest opacity-80">Requires Premium & KYC Verification</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-border bg-muted/20 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-card border border-border rounded-2xl shadow-xl shadow-amber-500/10 mb-6">
            <Zap size={32} className="text-amber-500" />
          </div>
          <h3 className="text-foreground font-black text-2xl uppercase tracking-tighter mb-2">Ready to pitch?</h3>
          <p className="text-muted-foreground text-sm font-medium mb-8 max-w-sm mx-auto opacity-70">
            Unblurred profiles, direct messaging, and priority KYC status are just one click away.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/kyc" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 px-8 font-black text-[10px] uppercase tracking-widest rounded-2xl border-border hover:bg-muted transition-all">
                Complete KYC
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button className="w-full h-12 px-8 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                See Pricing →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
