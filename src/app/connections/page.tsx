"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function ConnectionsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => { 
    if (!isAuthenticated) router.replace("/login"); 
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) return null;

  return (
    <div className="animate-fadeIn">
      <DashboardHeader 
        title="Connections" 
        description="Your global network of verified partners, investors, and founders."
        showBack={true}
      />
      
      <div className="flex flex-col items-center justify-center py-24 gap-8 text-center max-w-sm mx-auto">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-card border border-border flex items-center justify-center shadow-xl group hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <Users size={40} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-500 transform group-hover:scale-110" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-primary/20 animate-bounce">
            0
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none opacity-80">Building Your Network</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed opacity-60">
            Accept connection requests from discovery matches to build your trusted network. Verified status increases your acceptance rate by 3x.
          </p>
        </div>
        
        <Button 
          onClick={() => router.push("/matches")}
          className="w-full h-12 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Search size={14} className="mr-2" /> Find Matches →
        </Button>

        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
          Powered by Bridge AI Engine
        </p>
      </div>
    </div>
  );
}
