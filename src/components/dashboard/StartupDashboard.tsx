"use client";

import { useState } from "react";
import { UserProfile } from "@/context/AuthContext";
import { 
  AlertTriangle, ArrowRight, CheckCircle2, Clock, 
  Users, Video, Bell, MapPin, Activity, Zap, 
  TrendingUp, X, Briefcase 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import UpgradeModal from "@/components/UpgradeModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Modular Widgets (Memoized)
import FundraisingProgress from "./widgets/FundraisingProgress";
import AIMatchCard from "./widgets/AIMatchCard";
import ActivityFeed from "./widgets/ActivityFeed";
import PitchTimeline from "./widgets/PitchTimeline";

const aiMatchesData = [
  { name: "Arjun T.", role: "Investor", sector: ["Fintech", "SaaS"], location: "Bangalore, India", score: 91, tags: ["Sector Match", "Funding Aligned", "Highly Active"] },
  { name: "Neha K.", role: "Investor", sector: ["HealthTech"], location: "Delhi, India", score: 83, tags: ["Shared Intent", "Same Region", "Complete Profile"] },
  { name: "Ravi M.", role: "Investor", sector: ["SaaS"], location: "Mumbai, India", score: 74, tags: ["Sector Match", "Predicted Connection"] },
];

const upcomingPitchesData = [
  { name: "MedSync AI", sector: "HealthTech", title: "Future of Healthcare", date: "Tomorrow 11:00 AM IST", status: "upcoming" as const },
  { name: "LogiRoute", sector: "Logistics", title: "AI Supply Chain", date: "Wednesday 4:30 PM IST", status: "upcoming" as const }
];

const pastPitchesData = [
  { name: "UrbanNest", sector: "PropTech", duration: "18 min", date: "March 30, 2026", title: "PropTech Seed Round", status: "past" as const }
];

const activeDeals = [
  { name: "Arjun T.", stage: "Negotiation", time: "Last active 2 hours ago", color: "bg-purple-500" },
  { name: "Neha K.", stage: "Due Diligence", time: "Last active Yesterday", color: "bg-blue-500" }
];

const activityFeedData = [
  { icon: <Activity size={14} className="text-primary"/>, text: "Your pitch deck was viewed by 3 investors today", time: "2 hours ago" },
  { icon: <CheckCircle2 size={14} className="text-green-500"/>, text: "New AI Match: 91% — Arjun T. (Fintech Investor, Bangalore)", time: "Yesterday" },
  { icon: <TrendingUp size={14} className="text-primary"/>, text: "Deal Room with Neha K. moved to Due Diligence", time: "2 days ago" },
  { icon: <Zap size={14} className="text-accent"/>, text: "Your KYC documents were received", time: "3 days ago" },
];

export const ROLE_COLORS = {
  startup: "#1D6FF2",
  investor: "#F4A91F",
  b2b: "#10B981"
};

export default function StartupDashboard({ user }: { user: UserProfile }) {
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setPitchModalOpen(false);
    toast.success("Pitch scheduled! Investors will be notified.");
  };

  const isTrial = user.subscription === "trial";
  const isCancelled = user.subscription === "cancelled";
  const isPremium = user.subscription === "premium";

  const progressSteps = [
    { label: "Profile", status: "done" as const },
    { label: "KYC", status: "done" as const },
    { label: "Discovery", status: "active" as const },
    { label: "Match", status: "pending" as const },
    { label: "Deal Room", status: "pending" as const },
    { label: "Closed", status: "pending" as const },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fadeIn pb-24 transition-colors duration-300">
      {/* Subscription Banners */}
      {isTrial && !bannerDismissed && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
          <p className="text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2 font-medium">
            <Clock size={14}/> Your Discovery Trial ends in <strong>{user.trialDaysLeft} days</strong>. Upgrade to keep matches.
          </p>
          <div className="flex gap-2 shrink-0">
            <Button onClick={() => setUpgradeModalOpen(true)} className="bg-amber-500 text-white dark:text-background hover:bg-amber-400 h-7 text-xs font-bold px-3 shadow-md border-none">Upgrade Now</Button>
            <button onClick={() => setBannerDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={14}/></button>
          </div>
        </div>
      )}
      {isCancelled && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">Your subscription is cancelled. Access until <strong>{user.accessUntil || "May 6"}</strong>.</p>
          <Button onClick={() => setUpgradeModalOpen(true)} className="bg-red-500 text-white h-7 text-xs font-bold px-3 shrink-0 shadow-md border-none">Reactivate</Button>
        </div>
      )}

      <DashboardHeader 
        title={`Good morning, ${user.name.split(" ")[0]} 👋`}
        description="Here's your fundraising progress overview."
        showBack={false}
      >
        {isPremium && (
          <Badge className="bg-primary text-white font-black px-4 py-2 shadow-xl shadow-primary/20 border-none uppercase tracking-widest text-[10px]">
             Premium Member
          </Badge>
        )}
      </DashboardHeader>

      <FundraisingProgress steps={progressSteps} currentStep={3} totalSteps={6} statusLabel="Step 3 — Discovery Active" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <div>
               <div className="flex justify-between items-center mb-4">
                 <div>
                    <h2 className="text-foreground text-xl font-black flex items-center gap-2 tracking-tight">🤖 Premium AI Matches</h2>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-50">Recommended for your thesis</p>
                 </div>
                 <Link href="/connections" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline decoration-2">View All →</Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {aiMatchesData.map((m, i) => (
                    <AIMatchCard key={i} {...m} isTrial={isTrial} onUpgrade={() => setUpgradeModalOpen(true)} />
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <PitchTimeline pitches={upcomingPitchesData} title="Upcoming Sessions" />
               <PitchTimeline pitches={pastPitchesData} title="Past Recordings" />
            </div>
         </div>

         <div className="space-y-6">
            <ActivityFeed activities={activityFeedData} title="Recent Activity" />
            
            {/* Active Deals Card (Brief) */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
               <h3 className="text-foreground font-black text-[10px] uppercase tracking-widest opacity-70 mb-6 flex items-center gap-2">
                 <Briefcase size={14} className="text-primary"/> Active Pipelines
               </h3>
               <div className="space-y-4">
                  {activeDeals.map((deal, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${deal.color} animate-pulse`}/>
                          <div>
                            <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{deal.name}</p>
                            <p className="text-[9px] text-muted-foreground font-bold">{deal.stage}</p>
                          </div>
                       </div>
                       <ArrowRight size={14} className="text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
                    </div>
                  ))}
               </div>
            </div>

            {/* Profile Completion CTA */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center hover:bg-primary/10 transition-all cursor-pointer group">
               <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Refine Profile</h4>
               <p className="text-muted-foreground text-[10px] font-bold mb-4 opacity-70">Complete your profile to increase match accuracy by 40%.</p>
               <Button variant="outline" className="w-full h-10 bg-transparent border-primary/20 text-primary font-black text-[9px] uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">Update Now</Button>
            </div>
         </div>
      </div>

      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
      
      {/* Pitch Scheduler Modal */}
      <Dialog open={pitchModalOpen} onOpenChange={setPitchModalOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-md rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-black tracking-tight uppercase">Schedule Live Pitch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSchedule} className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">Pitch Title</Label>
                <Input placeholder="e.g. Seed Round — Disrupting Agri-tech" className="bg-muted/40 border-border h-12 rounded-2xl font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">Date</Label>
                  <Input type="date" className="bg-muted/40 border-border h-12 rounded-2xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">Time</Label>
                  <Input type="time" className="bg-muted/40 border-border h-12 rounded-2xl font-bold" />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4 flex flex-col gap-3">
              <Button type="submit" className="w-full h-12 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Publish Session</Button>
              <Button type="button" variant="ghost" onClick={() => setPitchModalOpen(false)} className="w-full h-10 text-muted-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl">Discard</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
