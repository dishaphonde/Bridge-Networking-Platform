"use client";

import React, { memo } from "react";
import { Video, PlayCircle, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PitchItem {
  name: string;
  title: string;
  date?: string;
  time?: string;
  duration?: string;
  sector?: string;
  status?: "upcoming" | "past" | "live";
}

interface PitchTimelineProps {
  pitches: PitchItem[];
  title?: string;
}

const PitchTimeline = memo(({ pitches, title = "Session History" }: PitchTimelineProps) => {
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-fadeIn">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Video size={14} className="text-primary"/> {title}
           </h3>
           <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border text-[8px] font-black tracking-widest uppercase">
              {pitches.length} Sessions
           </Badge>
        </div>
        
        <div className="space-y-6">
          {pitches.map((p, i) => (
            <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/5 transition-all shadow-inner ${
                 p.status === "upcoming" ? "bg-primary/10 text-primary group-hover:bg-primary/20" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
               }`}>
                 {p.status === "upcoming" ? <Calendar size={18}/> : <PlayCircle size={18}/>}
               </div>
               <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                     <p className="text-[11px] font-black text-foreground leading-none tracking-tight transition-colors group-hover:text-primary">
                        {p.title}
                     </p>
                     {p.status === "upcoming" && (
                        <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/10">Coming Soon</span>
                     )}
                  </div>
                  <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest">
                    Host: {p.name} {p.sector ? `· ${p.sector}` : ""}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                     {p.date && (
                        <div className="flex items-center gap-1 opacity-40">
                          <Clock size={8}/>
                          <span className="text-[8px] font-black uppercase tracking-widest">{p.date}</span>
                        </div>
                     )}
                     {p.time && (
                        <div className="flex items-center gap-1 opacity-40">
                          <Clock size={8}/>
                          <span className="text-[8px] font-black uppercase tracking-widest">{p.time}</span>
                        </div>
                     )}
                     {p.duration && (
                        <div className="flex items-center gap-1">
                          <Clock size={8}/>
                          <span className="text-[8px] font-black uppercase tracking-widest">{p.duration}</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        {pitches.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center opacity-30">
            <Video size={24} className="mb-2"/>
            <p className="text-[10px] font-black uppercase tracking-widest">No active sessions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PitchTimeline.displayName = "PitchTimeline";

export default PitchTimeline;
