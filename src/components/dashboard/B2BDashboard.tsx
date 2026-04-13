"use client";

import { UserProfile } from "@/context/AuthContext";
import { 
  CheckCircle2, ChevronRight, MapPin, Search, Edit3, Briefcase, 
  Users, Zap, TrendingUp, Clock, Globe 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Modular Widgets (Memoized)
import AIMatchCard from "./widgets/AIMatchCard";
import ActivityFeed from "./widgets/ActivityFeed";

const aiMatchesData = [
  { name: "TechParts Co.", role: "B2B | Manufacturing", revenue: "₹5Cr–₹20Cr", exports: true, location: "Pune", score: 88, tags: ["Sector Match", "Same Region", "Mutual Connections"] },
  { name: "GlobalExim", role: "B2B | Export/Import", revenue: "₹10Cr+", exports: true, location: "Ahmedabad", score: 79, tags: ["Shared Intent", "Predicted Connection"] },
  { name: "SwiftLogix", role: "B2B | Logistics", revenue: "₹1Cr–₹5Cr", exports: false, location: "Mumbai", score: 72, tags: ["Sector Match", "Highly Active"] },
];

const activeDeals = [
  { name: "TechParts Co.", stage: "Negotiation", type: "Supply Agreement", time: "Active 1 hour ago", color: "bg-emerald-500" },
  { name: "GlobalExim", stage: "Connection", type: "Export Deal", time: "Active 2 days ago", color: "bg-blue-500" }
];

const discoverPartners = [
  { name: "TechParts Co.", category: "Manufacturing", rev: "₹5Cr–₹20Cr", loc: "Pune", exp: true },
  { name: "GlobalExim", category: "Export/Import", rev: "₹10Cr+", loc: "Ahmedabad", exp: true },
  { name: "SwiftLogix", category: "Logistics", rev: "₹1Cr–₹5Cr", loc: "Mumbai", exp: false },
  { name: "FreshFarm", category: "Agri-tech", rev: "₹50L–₹1Cr", loc: "Nashik", exp: true },
  { name: "BuildRight", category: "Construction", rev: "₹2Cr–₹10Cr", loc: "Hyderabad", exp: false },
  { name: "MediSupply", category: "Healthcare", rev: "₹1Cr–₹5Cr", loc: "Chennai", exp: false },
];

const activityFeedData = [
  { text: "TechParts Co. accepted your connection request", time: "1h ago" },
  { text: "New Match: 88% — TechParts Co. (Manufacturing, Pune)", time: "3h ago" },
  { text: "Your GSTIN verification is under review", time: "5h ago" },
  { text: "Deal Room with TechParts Co. is active — 2 new messages", time: "Yesterday" },
  { text: "3 new verified businesses match your profile", time: "2 days ago" },
];

export default function B2BDashboard({ user }: { user: UserProfile }) {
  return (
    <div className="p-4 lg:p-6 space-y-8 animate-fadeIn pb-24 transition-colors duration-300">
      {/* Header */}
      <DashboardHeader 
        title={`Good morning, ${user.name.split(" ")[0]} 👋`}
        description="Verified business partners curated for your growth."
        showBack={false}
      >
        <div className="flex items-center gap-2 bg-emerald-500 text-white shadow-xl shadow-emerald-500/10 rounded-xl px-5 py-2.5">
          <Globe size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">B2B Connect</span>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Widget 2: AI Match Cards */}
            <div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-foreground text-xl font-black flex items-center gap-2 tracking-tight">🤖 Smart B2B Matches</h2>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1">Recommended industrial synergies</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {aiMatchesData.map((m, i) => (
                    <AIMatchCard 
                      key={i} 
                      {...m} 
                      metadata={m.revenue} 
                      sector={[m.role.split('|')[1].trim()]} 
                    />
                 ))}
               </div>
            </div>

            {/* Widget 3: Discovery Feed */}
            <div>
               <div className="flex justify-between items-center mb-6 pt-4">
                 <h2 className="text-foreground text-lg font-black flex items-center gap-2 uppercase tracking-tight opacity-70"><Search size={22} className="text-emerald-500"/> Partner Discovery</h2>
                 <Button variant="outline" className="h-9 text-[10px] font-black uppercase border-border text-muted-foreground hover:bg-muted"><TrendingUp size={12} className="mr-1.5"/> Filters</Button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {discoverPartners.map((s, i) => (
                     <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:border-emerald-500/40 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black rounded-2xl flex items-center justify-center text-xl border border-emerald-500/10 group-hover:scale-105 transition-all shadow-inner">{s.name[0]}</div>
                           {s.exp && <Badge className="text-blue-600 dark:text-blue-400 font-black tracking-widest text-[8px] bg-blue-500/10 px-2 py-0.5 rounded-full border-none shadow-sm uppercase">Export Ready</Badge>}
                        </div>
                        <h4 className="text-foreground font-black text-sm truncate tracking-tight mb-0.5">{s.name}</h4>
                        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest mb-4 opacity-70">{s.category}</p>
                        <p className="text-foreground text-[11px] font-black mb-6 tracking-tight uppercase opacity-50">{s.rev}</p>
                        <Button className="w-full h-10 text-[9px] font-black uppercase tracking-widest bg-muted text-foreground hover:bg-emerald-500 hover:text-white transition-all border-none">Initiate Deal</Button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            <ActivityFeed activities={activityFeedData} title="Synergy Logs" />

            {/* Active Deals Card */}
            <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
               <h3 className="text-foreground font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Briefcase size={14} className="text-primary"/> Ongoing Negotiations
               </h3>
               <div className="space-y-6">
                  {activeDeals.map((deal, i) => (
                    <div key={i} className="flex flex-col gap-1 cursor-pointer group">
                        <div className="flex justify-between items-center">
                           <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{deal.name}</p>
                           <p className={`text-[10px] ${deal.type.includes('Export') ? 'text-blue-500' : 'text-emerald-500'} font-black`}>{deal.type.split(' ')[0]}</p>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                           <div className={`h-full ${deal.color} transition-all group-hover:scale-x-105`} style={{ width: deal.stage === "Negotiation" ? "75%" : "40%" }} />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-60 mt-1">{deal.stage} · {deal.time}</p>
                    </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full mt-6 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-500/5 transition-all">Review Pipeline</Button>
            </Card>

            {/* GSTIN / KYC Optimization CTA */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 text-center hover:bg-emerald-500/10 transition-all cursor-pointer group border-dashed">
               <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-2 opacity-80">Industrial Trust Shield</h4>
               <p className="text-muted-foreground text-[10px] font-bold mb-4 opacity-70 leading-relaxed px-4">Verified business profiles receive 3x more premium supply deal offers.</p>
               <Button className="w-full h-10 bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all border-none">Finalize Verification</Button>
            </div>
         </div>
      </div>
    </div>
  );
}
