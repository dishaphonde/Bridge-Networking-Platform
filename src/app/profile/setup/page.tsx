"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building2, MapPin, Globe, Activity, Camera } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function ProfileSetupPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto pb-24">
      <DashboardHeader 
        title="Profile Setup" 
        description="Complete your profile to increase your visibility to premium matches."
        showBack={true}
      />

      <div className="space-y-8 mt-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl bg-card border border-border shadow-sm group hover:border-primary/20 transition-all">
          <div className="relative group/avatar">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl transform rotate-3 group-hover/avatar:rotate-0 transition-transform duration-500">
              <span className="text-white font-black text-4xl">{user?.name?.[0] || "D"}</span>
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-card border-2 border-border flex items-center justify-center shadow-2xl text-primary hover:scale-110 active:scale-95 transition-all">
              <Camera size={18} />
            </button>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none opacity-80">{user?.name}</h3>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{user?.role} · {user?.email}</p>
            <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-2 cursor-pointer hover:underline underline-offset-4 decoration-2">Change Profile Photo</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                   <User size={16}/>
                </div>
                <h3 className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Personal Details</h3>
             </div>
             
             <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/10 transition-all group">
                <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", placeholder: user?.name || "Your legal name", id: "profile-name" },
                    { label: "Designation", placeholder: "e.g. Founder & CEO", id: "profile-designation" },
                  ].map(f => (
                    <div key={f.id} className="space-y-1.5">
                      <Label htmlFor={f.id} className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">{f.label}</Label>
                      <Input id={f.id} placeholder={f.placeholder} defaultValue={f.placeholder === user?.name ? user?.name : ""}
                        className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-tight rounded-2xl shadow-sm"/>
                    </div>
                  ))}
                  <div className="sm:col-span-2 space-y-1.5 pt-2">
                    <Label htmlFor="profile-bio" className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">Professional Bio</Label>
                    <textarea id="profile-bio" placeholder="Describe your background and what value you bring to the network..."
                      className="w-full bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary rounded-2xl p-4 text-sm font-medium h-32 resize-none focus:outline-none shadow-sm transition-all"/>
                  </div>
                </CardContent>
             </Card>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                   <Building2 size={16}/>
                </div>
                <h3 className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Venture Information</h3>
             </div>

             <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/10 transition-all group">
                <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Company Name", placeholder: "e.g. Acme Tech Solutions", id: "company-name" },
                    { label: "Industry Sector", placeholder: "Fintech, SaaS, AI, etc.", id: "company-industry" },
                    { label: "Growth Stage", placeholder: "Seed, Series A, Series B", id: "company-stage" },
                    { label: "Incorporation Year", placeholder: "2024", id: "company-year" },
                  ].map(f => (
                    <div key={f.id} className="space-y-1.5">
                      <Label htmlFor={f.id} className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">{f.label}</Label>
                      <Input id={f.id} placeholder={f.placeholder} className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-tight rounded-2xl shadow-sm uppercase"/>
                    </div>
                  ))}
                </CardContent>
             </Card>
          </div>

          {/* Location & Links */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                   <Globe size={16}/>
                </div>
                <h3 className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Global Reach</h3>
             </div>

             <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/10 transition-all group">
                <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Primary City", placeholder: "Mumbai", id: "location-city", icon: <MapPin size={14}/> },
                    { label: "LinkedIn URL", placeholder: "linkedin.com/in/...", id: "social-linkedin", icon: <Activity size={14}/> },
                    { label: "Company Website", placeholder: "https://...", id: "social-website", icon: <Globe size={14}/> },
                  ].map(f => (
                    <div key={f.id} className="space-y-1.5">
                      <Label htmlFor={f.id} className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">{f.label}</Label>
                      <Input id={f.id} placeholder={f.placeholder} className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-tight rounded-2xl shadow-sm"/>
                    </div>
                  ))}
                </CardContent>
             </Card>
          </div>

          <div className="flex items-center gap-4 justify-end pt-8">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="h-12 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground rounded-2xl transition-all">
              Discard
            </Button>
            <Button className="h-12 px-12 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Save Profile Details →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
