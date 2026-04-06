"use client";

import Link from "next/link";
import { LayoutDashboard, Users, FileCheck, Settings, Shield, TrendingUp, Activity, Bell, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: <Users size={18} className="text-primary"/> },
  { label: "KYC Pending", value: "43", change: "+5", icon: <FileCheck size={18} className="text-amber-500"/> },
  { label: "Active Deals", value: "89", change: "+8%", icon: <TrendingUp size={18} className="text-green-500"/> },
  { label: "New Today", value: "27", change: "Today", icon: <Activity size={18} className="text-purple-500"/> },
];

const recentKyc = [
  { name: "Rahul Sharma", role: "Startup", status: "Pending", date: "Today, 10:32 AM" },
  { name: "Neha Kapoor", role: "Investor", status: "Approved", date: "Today, 09:15 AM" },
  { name: "Vikram Nair", role: "B2B Connect", status: "Under Review", date: "Yesterday" },
  { name: "Priya Singh", role: "Startup", status: "Rejected", date: "Yesterday" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Approved: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "Under Review": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-black text-xl tracking-tight leading-none">BRIDGE</span>
              <span className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mt-1 flex items-center gap-1 opacity-70">
                <Shield size={10} className="text-primary"/>ADMIN PANEL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
              <Input placeholder="Global search..." className="w-64 pl-10 h-9 bg-muted/50 border-border rounded-xl focus:border-primary text-xs font-medium" />
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <ThemeToggle />
              
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/50">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
              </button>

              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-muted border border-border hover:bg-muted/80 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                <LayoutDashboard size={14}/>USER VIEW
              </Link>

              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-sm">
                <span className="text-red-500 text-xs font-black tracking-tighter">AD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/30 min-h-[calc(100vh-64px)] p-4 space-y-8">
          <div>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest pl-4 mb-4 opacity-50">Operation Console</p>
            <nav className="space-y-1">
              {[
                { icon: <LayoutDashboard size={16}/>, label: "Overview", active: true },
                { icon: <Users size={16}/>, label: "User Directory" },
                { icon: <FileCheck size={16}/>, label: "KYC Submissions" },
                { icon: <TrendingUp size={16}/>, label: "Deal Pipeline" },
                { icon: <Activity size={16}/>, label: "System Metrics" },
                { icon: <Settings size={16}/>, label: "Global Settings" },
              ].map((item) => (
                <button key={item.label}
                  className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${item.active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {item.icon}{item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="px-4 py-4 rounded-2xl bg-primary/5 border border-primary/10 shadow-inner">
            <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1.5">Admin Server Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground text-[11px] font-bold">Latency: 24ms</span>
            </div>
          </div>
        </aside>

        {/* Admin Main */}
        <main className="flex-1 p-8 space-y-8 animate-fadeIn">
          <div>
            <h1 className="text-foreground text-3xl font-black tracking-tight leading-none mb-2">Platform Administration</h1>
            <p className="text-muted-foreground text-sm font-medium">Real-time oversight of users, KYC, and deals across BRIDGE.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <Card key={s.label} className="bg-card border-border shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">{s.icon}</div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[10px] font-black uppercase tracking-wider">{s.change}</Badge>
                  </div>
                  <p className="text-foreground text-3xl font-black tracking-tight">{s.value}</p>
                  <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em] mt-1 opacity-70">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent KYC Submissions */}
          <Card className="bg-card border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-border bg-muted/20">
              <CardTitle className="text-foreground text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <FileCheck size={18} className="text-primary"/>Queue: Pending KYC Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentKyc.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                        <span className="text-white text-base font-black italic">{item.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-black tracking-tight">{item.name}</p>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{item.role} <span className="mx-1.5 opacity-30">|</span> Submitted {item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <Badge className={`border text-[9px] font-black uppercase tracking-widest px-2.5 py-1 shadow-sm ${statusColors[item.status]}`}>{item.status}</Badge>
                      <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline px-4 py-1.5 rounded-lg hover:bg-primary/5 transition-all">Review Info →</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
