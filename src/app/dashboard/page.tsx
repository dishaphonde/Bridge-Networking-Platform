"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StartupDashboard from "@/components/dashboard/StartupDashboard";
import InvestorDashboard from "@/components/dashboard/InvestorDashboard";
import B2BDashboard from "@/components/dashboard/B2BDashboard";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  switch (user.role) {
    case "startup":
      return <StartupDashboard user={user} />;
    case "investor":
      return <InvestorDashboard user={user} />;
    case "b2b":
      return <B2BDashboard user={user} />;
    default:
      return <StartupDashboard user={user} />; // Fallback
  }
}
