"use client";

import { useState } from "react";
import { UserProfile } from "@/context/AuthContext";
import { 
  CheckCircle2, Compass, Briefcase, Zap, TrendingUp, Search, Download, Clock 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Modular Widgets (Memoized)
import AIMatchCard from "./widgets/AIMatchCard";
import ActivityFeed from "./widgets/ActivityFeed";

const aiMatchesData = [
  { name: "NovaPay", role: "Startup", sector: ["Fintech"], fundingAsk: "Seeking ₹1.5Cr — Seed Round", metric: "₹12L MRR | 40% MoM", location: "Mumbai", score: 94, tags: ["Funding Aligned", "Sector Match", "Highly Active"] },
  { name: "MedSync AI", role: "Startup", sector: ["HealthTech"], fundingAsk: "Seeking ₹80L — Pre-Seed", metric: "MVP Deployed", location: "Bangalore", score: 87, tags: ["Shared Intent", "Complete Profile"] },
  { name: "LogiRoute", role: "Startup", sector: ["Logistics"], fundingAsk: "Seeking ₹2Cr — Seed", metric: "₹8L MRR", location: "Pune", score: 71, tags: ["Sector Match", "Same Region"] },
];

const discoveryFeed = [
  { name: "NovaPay", sector: "Fintech", ask: "₹1.5Cr Seed", score: 94 },
  { name: "MedSync AI", sector: "HealthTech", ask: "₹80L Pre-Seed", score: 87 },
  { name: "LogiRoute", sector: "Logistics", ask: "₹2Cr Seed", score: 71 },
  { name: "GreenGrid", sector: "CleanTech", ask: "₹3Cr Pre-A", score: 68 },
  { name: "UrbanNest", sector: "PropTech", ask: "₹1Cr Seed", score: 65 },
  { name: "EduLeap", sector: "EdTech", ask: "₹50L Pre-Seed", score: 59 },
];

const activeDeals = [
  { name: "NovaPay", stage: "Negotiation", amount: "₹1.5Cr", time: "Active 3 hours ago", color: "bg-primary" },
  { name: "MedSync AI", stage: "Due Diligence", amount: "₹80L", time: "Active Yesterday", color: "bg-purple-500" }
];

const activityFeedData = [
  { text: "NovaPay accepted your connection request", time: "2h ago" },
  { text: "New Match: 94% — NovaPay (Fintech, Mumbai)", time: "4h ago" },
  { text: "MedSync AI Pitch Recording is ready", time: "Yesterday" },
  { text: "Deal Room with LogiRoute established", time: "2 days ago" },
];

export default function InvestorDashboard({ user }: { user: UserProfile }) {
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const isPremium = user.subscription === "premium";

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fadeIn pb-24 transition-colors duration-300">
      <DashboardHeader 
        title={`Good morning, ${user.name.split(" ")[0]} 👋`}
        description="Discover verified, high-intent startups matching your thesis."
        showBack={false}
      >
        {isPremium && (
          <Badge className="bg-primary text-white font-black px-4 py-2 shadow-xl shadow-primary/20 border-none uppercase tracking-widest text-[10px]">
            Premium Investor
          </Badge>
        )}
      </DashboardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Widget 1: AI Match Cards */}
            <div>
               <div className="flex justify-between items-center mb-4">
                 <div>
                    <h2 className="text-foreground text-xl font-black flex items-center gap-2 tracking-tight">🤖 Premium AI Matches</h2>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-50">Top recommendations based on your thesis</p>
                 </div>
                 <Button variant="ghost" className="text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">Explore More →</Button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {aiMatchesData.map((m, i) => (
                    <AIMatchCard key={i} {...m} metadata={m.fundingAsk} />
                 ))}
               </div>
            </div>

            {/* Widget 2: Discovery Feed */}
            <div>
               <div className="flex justify-between items-center mb-4 pt-4">
                 <h2 className="text-foreground text-lg font-black flex items-center gap-2 uppercase tracking-tighter"><Compass size={22} className="text-primary"/> Live Pipeline</h2>
                 <Button variant="outline" className="h-8 text-[10px] font-black uppercase border-border text-muted-foreground hover:bg-muted"><Search size={12} className="mr-1.5"/> Filter</Button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {discoveryFeed.map((s, i) => (
                     <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-11 h-11 bg-muted text-foreground font-black rounded-xl flex items-center justify-center text-sm border border-border group-hover:bg-primary/5 transition-all shadow-inner">{s.name[0]}</div>
                           <Badge className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10 uppercase">{s.score}% Match</Badge>
                        </div>
                        <h4 className="text-foreground font-black text-sm truncate tracking-tight mb-0.5">{s.name}</h4>
                        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest mb-4 opacity-70">{s.sector}</p>
                        <p className="text-primary text-[11px] font-black mb-5 tracking-wide italic">{s.ask}</p>
                        <Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest bg-muted text-foreground hover:bg-primary hover:text-white shadow-sm transition-all border-none">View Pipeline</Button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            <ActivityFeed activities={activityFeedData} title="Recent Portfolio Events" />

            {/* Active Deals Card */}
            <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
               <h3 className="text-foreground font-black text-[10px] uppercase tracking-widest opacity-70 mb-6 flex items-center gap-2">
                 <Briefcase size={14} className="text-primary"/> Active Negotiations
               </h3>
               <div className="space-y-6">
                  {activeDeals.map((deal, i) => (
                    <div key={i} className="flex flex-col gap-1 cursor-pointer group">
                        <div className="flex justify-between items-center">
                           <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{deal.name}</p>
                           <p className="text-[10px] text-primary font-black">{deal.amount}</p>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                           <div className={`h-full ${deal.color} transition-all group-hover:scale-x-105`} style={{ width: deal.stage === "Negotiation" ? "75%" : "40%" }} />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-60 mt-1">{deal.stage} · {deal.time}</p>
                    </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full mt-6 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all">Review Pipeline</Button>
            </Card>

            {/* Thesis Optimization CTA */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center hover:bg-primary/10 transition-all cursor-pointer group">
               <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Thesis Refinement</h4>
               <p className="text-muted-foreground text-[10px] font-bold mb-4 opacity-70">Updating your investment thesis improves match accuracy by 25%.</p>
               <Button className="w-full h-10 bg-primary text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all border-none">Update Thesis</Button>
            </div>
         </div>
      </div>

      {/* Pitch Modal (Legacy Dialog) */}
      <Dialog open={pitchModalOpen} onOpenChange={setPitchModalOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-black tracking-tight uppercase">Startup Pitch Session</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center bg-muted/30 rounded-2xl border border-border">
             <Clock size={32} className="mx-auto text-primary mb-4 animate-pulse" />
             <p className="text-foreground font-black text-lg uppercase tracking-tight">Stream Initializing...</p>
             <p className="text-muted-foreground text-xs mt-1">Connecting to secure investor portal.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
