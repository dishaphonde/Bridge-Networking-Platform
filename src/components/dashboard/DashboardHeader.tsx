"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
  backHref?: string;
  children?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  showBack = true,
  backHref,
  children
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fadeIn">
      <div className="flex items-start gap-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="w-10 h-10 rounded-xl bg-card border border-border mt-1 shadow-sm hover:bg-muted transition-all shrink-0"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </Button>
        )}
        <div className="flex flex-col min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase leading-none">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm font-black mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}
