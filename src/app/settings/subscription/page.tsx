"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { CreditCard, Download, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import UpgradeModal from "@/components/UpgradeModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ROLE_COLORS: Record<string, string> = {
  startup: "#1D6FF2",
  investor: "#F4A91F",
  b2b: "#10B981",
};

const billingHistory = [
  { date: "Apr 6, 2026", plan: "Premium Monthly", amount: "₹15,000", gst: "₹2,700", total: "₹17,700", status: "Paid" },
  { date: "Mar 6, 2026", plan: "Premium Monthly", amount: "₹15,000", gst: "₹2,700", total: "₹17,700", status: "Paid" },
  { date: "Feb 6, 2026", plan: "Premium Monthly", amount: "₹15,000", gst: "₹2,700", total: "₹17,700", status: "Paid" },
];

export default function SubscriptionPage() {
  const { user, cancelSubscription, reactivate } = useAuth();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const accent = ROLE_COLORS[user?.role ?? "startup"];
  const isTrial = user?.subscription === "trial";
  const isPrem = user?.subscription === "premium";
  const isCancelled = user?.subscription === "cancelled";
  const trialProgress = user?.trialDaysLeft ? ((7 - user.trialDaysLeft) / 7) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-24">
      <DashboardHeader 
        title="Subscription" 
        description="Manage your BRIDGE plan, billing cycle, and invoice history."
        showBack={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Current Plan</p>
                  <CardTitle className="text-foreground text-2xl font-black tracking-tight uppercase">
                    {isPrem ? "BRIDGE Premium" : isCancelled ? "Premium (Ending)" : "Discovery Trial"}
                  </CardTitle>
                </div>
                <Badge className={`text-[9px] uppercase font-black px-3 py-1.5 rounded-full border-none shadow-lg ${
                  isPrem ? "bg-green-500 text-white shadow-green-500/20"
                  : isCancelled ? "bg-red-500 text-white shadow-red-500/20"
                  : "bg-amber-500 text-[#0F1B2D] shadow-amber-500/20"
                }`}>
                  {isPrem ? "Active ✅" : isCancelled ? "Ending Soon" : "Trial ✅"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {isTrial && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">Trial Progress</span>
                        <p className="text-foreground text-lg font-black tracking-tight">{user?.trialDaysLeft} days remaining</p>
                      </div>
                      <span className="text-primary text-sm font-black uppercase tracking-tighter opacity-80">{Math.round(trialProgress)}% used</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div className="h-full rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${trialProgress}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                  <Button onClick={() => setUpgradeOpen(true)}
                    className="w-full h-14 font-black tracking-widest text-[11px] uppercase rounded-2xl text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    style={{ backgroundColor: accent }}>
                    Upgrade to Premium Now →
                  </Button>
                </div>
              )}

              {(isPrem || isCancelled) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { l: "Next Payment", v: user?.nextBillingDate || "May 6, 2026" },
                    { l: "Amount", v: `₹${(user?.amount || 17700).toLocaleString("en-IN")}` },
                    { l: "Payment Method", v: "Visa •••• 4242" },
                    { l: "Billing Cycle", v: user?.billingCycle === "annual" ? "Annual" : "Monthly" },
                  ].map(row => (
                    <div key={row.l} className="space-y-1">
                      <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-50">{row.l}</span>
                      <p className="text-foreground text-sm font-black tracking-tight uppercase">{row.v}</p>
                    </div>
                  ))}
                </div>
              )}

              {isPrem && (
                <div className="pt-6 border-t border-border/50">
                  <button onClick={() => setCancelOpen(true)} 
                    className="text-red-500 hover:text-red-600 text-[10px] font-black uppercase tracking-widest transition-all hover:underline underline-offset-4 decoration-2">
                    Cancel Subscription
                  </button>
                </div>
              )}

              {isCancelled && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-amber-500"/>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-xs font-medium leading-relaxed opacity-80">
                      Your premium features remain active until <span className="text-foreground font-black uppercase">{user?.accessUntil || "May 6, 2026"}</span>.
                    </p>
                    <Button onClick={() => { reactivate(); toast.success("Subscription reactivated!"); }}
                      className="h-10 px-6 font-black tracking-widest text-[9px] uppercase rounded-xl text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      style={{ backgroundColor: accent }}>
                      Reactivate Premium ✓
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History */}
          {(isPrem || isCancelled) && (
            <Card className="bg-card border-border shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="p-6 border-b border-border/50">
                <CardTitle className="text-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">Payment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/30 text-muted-foreground font-black uppercase tracking-widest text-[9px]">
                      {["Date", "Amount", "Status", "Invoice"].map(h => (
                        <th key={h} className="px-6 py-4 text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {billingHistory.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4 text-foreground font-black whitespace-nowrap opacity-80">{row.date}</td>
                        <td className="px-6 py-4 text-foreground font-black whitespace-nowrap opacity-80">{row.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-500 text-[10px] font-black uppercase bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/10 shadow-sm">Paid</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => toast.success("Invoice downloading...")}
                            className="text-primary hover:text-primary/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                            <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Links / Perks */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/10 shadow-xl rounded-3xl p-6 border-dashed">
            <Zap size={24} className="text-primary mb-4" />
            <h3 className="text-foreground font-black text-lg uppercase tracking-tighter mb-2">Premium Perks</h3>
            <div className="space-y-4 pt-2">
              {[
                "Unlimited AI Matchmaking",
                "Advanced Deal Room Access",
                "Secure Document Vault",
                "Direct 1:1 Messaging"
              ].map(perk => (
                <div key={perk} className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary shrink-0" /> {perk}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 h-12 bg-transparent border-primary/20 hover:bg-primary/5 text-primary font-black text-[10px] tracking-widest uppercase rounded-2xl">
              Compare All Plans
            </Button>
          </Card>

          <Card className="bg-card border-border shadow-md rounded-3xl p-6">
             <CreditCard size={20} className="text-muted-foreground mb-4 opacity-50" />
             <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-4">Payment Methods</h4>
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
                <div className="w-10 h-6 bg-card border border-border rounded flex items-center justify-center px-1">
                   <span className="text-[8px] font-black italic text-muted-foreground">VISA</span>
                </div>
                <div className="flex-1">
                   <p className="text-foreground text-[10px] font-black uppercase tracking-widest">VISA **** 4242</p>
                   <p className="text-muted-foreground text-[8px] font-bold">Expires 12/28</p>
                </div>
                <button className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline">Edit</button>
             </div>
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-md rounded-3xl overflow-hidden shadow-2xl p-0" aria-describedby={undefined}>
           <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-foreground text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                Cancel?
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-medium leading-relaxed opacity-80">
                You will lose access to premium matchmaking and the Deal Room once your subscription period ends on <strong className="text-foreground font-black uppercase">{user?.nextBillingDate || "May 6, 2026"}</strong>.
              </p>
              
              <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-4 shadow-inner">
                <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest opacity-60">Impact of cancellation:</p>
                {[
                  "Connection requests & 1:1 messaging",
                  "Advanced Deal Room pipeline",
                  "Unblurred Match Profiles",
                  "Live Networking Sessions"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-xs font-bold text-muted-foreground/80">
                    <span className="text-red-500 text-sm">✕</span> {item}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-3 sm:flex-col mt-4">
              <Button onClick={() => setCancelOpen(false)}
                className="w-full h-14 font-black tracking-widest text-[11px] uppercase rounded-2xl text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                style={{ backgroundColor: accent }}>
                Keep My Premium Membership
              </Button>
              <Button onClick={() => {
                cancelSubscription();
                setCancelOpen(false);
                toast("Subscription will end on May 6", { icon: "⚠️" });
              }}
                variant="ghost" className="w-full h-12 text-red-500 hover:text-red-600 hover:bg-red-500/5 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all">
                confirm cancellation
              </Button>
            </DialogFooter>
           </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
