"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "startup" | "investor" | "b2b";
export type SubscriptionStatus = "trial" | "premium" | "cancelled";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  kycStatus: "pending" | "verified" | "rejected";
  subscription: SubscriptionStatus;
  trialDaysLeft?: number;
  trialStartDate?: string;
  trialEndDate?: string;
  profileCompletion: number;
  // Premium fields
  billingCycle?: "monthly" | "annual";
  amount?: number;
  nextBillingDate?: string;
  paymentMethod?: string;
  subscribedSince?: string;
  accessUntil?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  upgradeToPremium: (billingCycle: "monthly" | "annual") => void;
  cancelSubscription: () => void;
  reactivate: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MOCK_USERS: Record<UserRole, UserProfile> = {
  startup: {
    name: "Rohan Mehta",
    email: "rohan@startup.com",
    role: "startup",
    kycStatus: "pending",
    subscription: "trial",
    trialDaysLeft: 4,
    trialStartDate: "2026-03-30",
    trialEndDate: "2026-04-06",
    profileCompletion: 72
  },
  investor: {
    name: "Arjun Tiwari",
    email: "arjun@investor.com",
    role: "investor",
    kycStatus: "verified",
    subscription: "premium",
    billingCycle: "monthly",
    amount: 17700,
    nextBillingDate: "2026-05-06",
    paymentMethod: "Visa •••• 4242",
    subscribedSince: "2026-03-06",
    profileCompletion: 95
  },
  b2b: {
    name: "Sneha Patel",
    email: "sneha@b2b.com",
    role: "b2b",
    kycStatus: "pending",
    subscription: "trial",
    trialDaysLeft: 6,
    trialStartDate: "2026-03-31",
    trialEndDate: "2026-04-07",
    profileCompletion: 58
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("bridge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const persist = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem("bridge_user", JSON.stringify(u));
  };

  const login = (email: string, role: UserRole = "startup") => {
    const mockUser = MOCK_USERS[role];
    persist({ ...mockUser, email });
    router.push("/dashboard");
  };

  const switchRole = (role: UserRole) => {
    persist(MOCK_USERS[role]);
  };

  const upgradeToPremium = (billingCycle: "monthly" | "annual") => {
    if (!user) return;
    const monthly = billingCycle === "monthly";
    persist({
      ...user,
      subscription: "premium",
      billingCycle,
      amount: monthly ? 17700 : 14160, // incl GST
      nextBillingDate: "2026-05-06",
      paymentMethod: "Visa •••• 4242",
      subscribedSince: "2026-04-06",
      trialDaysLeft: undefined
    });
  };

  const cancelSubscription = () => {
    if (!user) return;
    persist({ ...user, subscription: "cancelled", accessUntil: "2026-05-06" });
  };

  const reactivate = () => {
    if (!user) return;
    persist({ ...user, subscription: "premium", accessUntil: undefined });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bridge_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole, upgradeToPremium, cancelSubscription, reactivate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
