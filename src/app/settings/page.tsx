"use client";

import { Bell, Shield, User, Palette, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  const sections = [
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize how BRIDGE looks on your device.",
      icon: <Palette className="text-primary" size={20} />,
      content: <ThemeToggle showLabel />,
    },
    {
      id: "profile",
      title: "Profile Information",
      description: "Update your name, bio, and business details.",
      icon: <User className="text-primary" size={20} />,
      action: "Edit Profile",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage how you receive alerts and matches.",
      icon: <Bell className="text-primary" size={20} />,
      action: "Configure",
    },
    {
      id: "security",
      title: "Privacy & Security",
      description: "Two-factor authentication and session management.",
      icon: <Shield className="text-primary" size={20} />,
      action: "Manage",
    },
  ];

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-24">
      <DashboardHeader 
        title="Settings" 
        description="Manage your account preferences, security, and interface appearance."
        showBack={true}
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  {section.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-black text-foreground tracking-tight uppercase leading-none mb-1.5 opacity-80">{section.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium opacity-60 leading-relaxed max-w-sm">{section.description}</p>
                </div>
              </div>
              
              {section.action && (
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all group/btn">
                  {section.action}
                  <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              )}
            </div>

            {section.content && (
              <div className="mt-8 pt-8 border-t border-border/50">
                {section.content}
              </div>
            )}
          </div>
        ))}

        {/* Account Deletion (Danger Zone) */}
        <div className="mt-12 p-8 rounded-3xl border border-red-500/20 bg-red-500/5 shadow-inner">
          <h3 className="text-lg font-black text-red-500 uppercase tracking-tighter mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground font-medium mb-6 opacity-80 leading-relaxed max-w-md">
            Permanently delete your BRIDGE account and all associated data. This action is irreversible and will cancel any active subscriptions.
          </p>
          <button className="px-8 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
