"use client";

import React, { memo } from "react";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Step {
  label: string;
  status: "done" | "active" | "pending";
}

interface FundraisingProgressProps {
  currentStep?: number;
  totalSteps?: number;
  steps: Step[];
  statusLabel?: string;
}

const FundraisingProgress = memo(({ 
  currentStep = 3, 
  totalSteps = 6, 
  steps, 
  statusLabel = "Step 3 — Discovery Active" 
}: FundraisingProgressProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-none animate-fadeIn transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-foreground font-black flex items-center gap-2 uppercase tracking-widest text-[10px] opacity-70">
          <TrendingUp size={16} className="text-primary"/> Roadmap
        </h3>
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border text-[9px] font-black tracking-widest uppercase">
          Step {currentStep} of {totalSteps}
        </Badge>
      </div>
      
      <div className="relative flex justify-between items-center mb-8 px-4">
        <div className="absolute top-[11px] left-0 right-0 h-1 bg-muted -z-10 rounded-full"/>
        <div 
          className="absolute top-[11px] left-0 h-1 bg-gradient-to-r from-emerald-500 to-primary -z-10 rounded-full transition-all duration-700" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
        
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500 ${
              step.status === "done" ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20" :
              step.status === "active" ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 animate-pulse" :
              "bg-card border-border text-muted-foreground/40"
            }`}>
              {step.status === "done" ? <CheckCircle2 size={12}/> : i + 1}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter hidden sm:block ${
              step.status === "active" ? "text-primary" : 
              step.status === "done" ? "text-muted-foreground" : 
              "text-muted-foreground/30"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className="bg-primary/5 rounded-2xl p-4 text-center border border-primary/10">
        <p className="text-foreground text-sm font-medium tracking-tight">
          <span className="opacity-60">Status:</span> 
          <span className="font-black text-primary uppercase text-[10px] tracking-widest mx-1">{statusLabel}</span> 
          <span className="opacity-60">· {steps[currentStep-1]?.label || "Next steps"} pipeline ready.</span>
        </p>
      </div>
    </div>
  );
});

FundraisingProgress.displayName = "FundraisingProgress";

export default FundraisingProgress;
