"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, ChevronDown, LogOut, Settings, User, Compass, Users, Briefcase,
  Radio, Menu, X, LayoutDashboard, FileCheck, CreditCard, GitMerge
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";

const ROLE_COLORS = {
  startup: "#1D6FF2",
  investor: "#F4A91F",
  b2b: "#10B981"
};

const getRoleBadge = (role: UserRole | undefined) => {
  if (!role) return null;
  const colors = {
    startup: "bg-[#1D6FF2]/20 text-[#1D6FF2] border-[#1D6FF2]/30",
    investor: "bg-[#F4A91F]/20 text-[#F4A91F] border-[#F4A91F]/30",
    b2b: "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
  };
  const labels = { startup: "Startup", investor: "Investor", b2b: "B2B Connect" };
  return <span className={`text-[10px] border rounded-full px-2 py-0.5 font-bold tracking-wide uppercase ${colors[role]}`}>{labels[role]}</span>;
}

const getNavLinks = (role: UserRole) => {
  return [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    // { href: "/matches", label: role === "b2b" ? "Discover Partners" : "Discover", icon: <Compass size={16} /> },
    { href: "/connections", label: "Connections", icon: <Users size={16} /> },
    { href: "/deal-room", label: role === "investor" ? "Portfolio" : "Deal Room", icon: <Briefcase size={16} /> },
    ...(role !== "b2b" ? [{ href: "#live", label: "Live Pitch", icon: <Radio size={16} /> }] : []),
  ];
};

const getSidebarLinks = (role: UserRole) => {
  const common = [
    { href: "/profile/setup", label: "My Profile", icon: <User size={15} /> },
    { href: "/kyc", label: "KYC Status", icon: <FileCheck size={15} /> },
  ];

  const bottom = [
    { href: "/connections", label: "Connections", icon: <Users size={15} /> },
    { href: "/pricing", label: "Pricing", icon: <CreditCard size={15} /> },
    { href: "/settings/subscription", label: "Subscription", icon: <CreditCard size={15} /> },
  ];

  if (role === "startup") {
    return [
      ...common,
      { href: "/matches", label: "AI Matches", icon: <GitMerge size={15} /> },
      { href: "#live", label: "Live Pitches", icon: <Radio size={15} /> },
      { href: "/deal-room", label: "Deal Room", icon: <Briefcase size={15} /> },
      ...bottom
    ];
  } else if (role === "investor") {
    return [
      ...common,
      // { href: "/discover", label: "Discover Startups", icon: <Compass size={15} /> },
      { href: "/matches", label: "AI Matches", icon: <GitMerge size={15} /> },
      { href: "#live", label: "Live Pitches", icon: <Radio size={15} /> },
      { href: "/deal-room", label: "My Portfolio", icon: <Briefcase size={15} /> },
      ...bottom
    ];
  } else {
    return [
      ...common,
      // { href: "/discover", label: "Discover Partners", icon: <Compass size={15} /> },
      { href: "/matches", label: "AI Matches", icon: <GitMerge size={15} /> },
      { href: "/deal-room", label: "Deal Room", icon: <Briefcase size={15} /> },
      ...bottom
    ];
  }
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, switchRole } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devSwitcherOpen, setDevSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  const roleColor = ROLE_COLORS[user.role as UserRole] || ROLE_COLORS.startup;
  const navLinks = getNavLinks(user.role as UserRole);
  const sidebarLinks = getSidebarLinks(user.role as UserRole);
  const completeness = user.profileCompletion || 72;

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "DU";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative transition-colors duration-300">
      {/* Mobile Floating Menu Button (Visible only on < lg) */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer (Visible when open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] bg-background/80 backdrop-blur-md animate-fadeIn">
          <div className="flex flex-col h-full p-6 pt-20 overflow-y-auto">
            {/* Logo in Mobile Menu */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: roleColor }}>
                <span className="text-white font-black text-xl">B</span>
              </div>
              <span className="text-foreground font-black text-2xl tracking-tighter uppercase">Bridge</span>
            </div>

            <nav className="space-y-2 mb-12">
              {sidebarLinks.map((l) => (
                <Link key={l.label} href={l.href} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-bold transition-all text-muted-foreground hover:text-foreground hover:bg-muted">
                  {l.icon}{l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <ThemeToggle showLabel />
              <button onClick={logout} className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-red-400 text-lg font-bold hover:bg-red-500/10 transition-all">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 flex-col w-64 border-r border-border bg-sidebar p-5 overflow-y-auto transition-colors duration-300 z-40">
           {/* Sidebar Header: Logo & Branding */}
           <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: roleColor }}>
                <span className="text-white font-black text-xl">B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-black text-xl tracking-tighter uppercase leading-none">Bridge</span>
                <div className="mt-1">{getRoleBadge(user.role as UserRole)}</div>
              </div>
           </div>

          {/* Profile progress (Moved slightly down) */}
          <div className="mb-8 p-5 rounded-2xl bg-card border border-border shadow-sm group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform" style={{ backgroundColor: roleColor }}>
                <span className="text-white text-sm font-black">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-[13px] font-black tracking-tight truncate">{user?.name}</p>
                <p className="text-muted-foreground text-[10px] font-medium truncate italic">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em]">Profile Strength</span>
              <span className="text-xs font-black" style={{ color: roleColor }}>{completeness}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
               <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${completeness}%`, backgroundColor: roleColor }} />
            </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {sidebarLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link key={l.label} href={l.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-black transition-all group
                  ${isActive ? "shadow-md" : "text-foreground hover:bg-muted"}`}
                  style={isActive ? { backgroundColor: `${roleColor}15`, color: roleColor } : {}}
                >
                  <span className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "" : "group-hover:opacity-100"}`}>{l.icon}</span>
                  <span className="tracking-tight">{l.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer: Theme, Notifications, Settings */}
          <div className="pt-6 border-t border-border mt-6 space-y-4">
             <div className="flex items-center justify-between gap-2 px-2">
                <ThemeToggle />
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border bg-card shadow-sm">
                   <Bell size={18} />
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card animate-pulse" />
                </button>
                <Link href="/settings" className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border bg-card shadow-sm">
                   <Settings size={18} />
                </Link>
             </div>

             <div className="p-4 rounded-2xl bg-muted/40 border border-border shadow-inner group">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-foreground text-[10px] font-black uppercase tracking-widest">Trial</p>
                  <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black px-1.5 py-0.5">{user?.trialDaysLeft || 0}d left</Badge>
                </div>
                <Button onClick={logout} variant="ghost" className="w-full h-10 font-bold text-xs uppercase tracking-widest text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                   <LogOut size={14} className="mr-2" /> Sign Out
                </Button>
             </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64 bg-background transition-colors duration-300 min-h-screen">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Role Switcher */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
          {devSwitcherOpen && (
            <div className="bg-card border border-border p-2 rounded-2xl shadow-2xl flex flex-col gap-1 w-56 animate-fadeIn">
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-2 opacity-50">Switch View Role</p>
              {[
                { role: 'startup', label: 'Startup (Founder)', color: ROLE_COLORS.startup },
                { role: 'investor', label: 'Investor', color: ROLE_COLORS.investor },
                { role: 'b2b', label: 'B2B Connect', color: ROLE_COLORS.b2b }
              ].map(r => (
                <button key={r.role} onClick={() => { switchRole(r.role as UserRole); setDevSwitcherOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${user.role === r.role ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: r.color }}></span> {r.label}
                </button>
              ))}
            </div>
          )}
          <Button onClick={() => setDevSwitcherOpen(!devSwitcherOpen)} className="bg-card hover:bg-muted text-foreground font-black rounded-full shadow-2xl border-2 border-border flex items-center gap-2 h-11 px-5 transition-all">
            <GitMerge size={16} className="text-primary" /> Dev: Switch Role
          </Button>
        </div>
      )}
    </div>
  );
}
