"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DealRoomPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="animate-fadeIn">
      <DashboardHeader 
        title="Deal Room" 
        description="Securely manage your active deals, negotiations, and document vault."
        showBack={true}
      />

      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-muted/40 border border-border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Briefcase size={40} className="text-muted-foreground/30" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-card border-2 border-border flex items-center justify-center shadow-xl">
              <Lock size={16} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase leading-none opacity-80">Deal Room Locked</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed opacity-60">
            Access to our specialized Deal Room requires an active Premium membership and completed KYC verification for maximum security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/kyc")} 
            className="w-full h-12 font-black text-[10px] uppercase tracking-widest rounded-2xl border-border hover:bg-muted transition-all"
          >
            Complete KYC
          </Button>
          <Button 
            onClick={() => router.push("/pricing")} 
            className="w-full h-12 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Go Premium →
          </Button>
        </div>
      </div>
    </div>
  );
}
