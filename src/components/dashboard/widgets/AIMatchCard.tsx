"use client";

import React, { memo } from "react";
import { Lock, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIMatchCardProps {
  name: string;
  role: string;
  sector: string[];
  location: string;
  score: number;
  tags?: string[];
  isTrial?: boolean;
  onUpgrade?: () => void;
  metadata?: string; // Optional field for metrics or funding ask
}

const AIMatchCard = memo(({ 
  name, 
  role, 
  sector, 
  location, 
  score, 
  isTrial = false, 
  onUpgrade,
  metadata
}: AIMatchCardProps) => {
  const colorClass = score > 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-slate-400";
  
  return (
    <Card className="bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all rounded-3xl border border-border group relative overflow-hidden">
      {/* Blur removed for Discovery Phase */}
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary shrink-0 border border-primary/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
              {name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-black text-foreground text-sm tracking-tight">
                  {name}
                </p>
                <CheckCircle2 size={10} className="text-emerald-500"/>
              </div>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-wider">
                {role}
              </p>
            </div>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg className="absolute w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="17" className="text-muted/30" strokeWidth="3" stroke="currentColor" fill="none" />
              <circle cx="20" cy="20" r="17" className={colorClass} strokeWidth="3" strokeDasharray="106.8" strokeDashoffset={106.8 - (106.8 * score / 100)} strokeLinecap="round" stroke="currentColor" fill="none" />
            </svg>
            <span className={`text-[9px] font-black ${colorClass}`}>{score}%</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {sector.slice(0, 2).map((s, idx) => (
            <span key={idx} className="bg-muted text-muted-foreground text-[9px] font-bold px-2 py-0.5 rounded-full border border-border">
              {s}
            </span>
          ))}
          <span className="bg-muted text-muted-foreground text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-border">
            <MapPin size={8}/> {location.split(',')[0]}
          </span>
        </div>

        {metadata && (
          <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mt-2">
            {metadata}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

AIMatchCard.displayName = "AIMatchCard";

export default AIMatchCard;
