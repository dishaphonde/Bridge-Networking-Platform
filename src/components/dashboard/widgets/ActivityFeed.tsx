"use client";

import React, { memo } from "react";
import { Activity, Zap, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityItem {
  icon?: React.ReactNode;
  text: string;
  time?: string;
  type?: "info" | "success" | "warning" | "alert";
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

const ActivityFeed = memo(({ activities, title = "Recent Updates" }: ActivityFeedProps) => {
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-fadeIn">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-primary"/> {title}
          </h3>
          <span className="text-[8px] font-black uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">Live</span>
        </div>
        
        <div className="space-y-6">
          {activities.map((item, i) => (
            <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5 shadow-inner transition-colors group-hover:bg-primary/20">
                {item.icon || < Zap size={14} className="text-primary"/>}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-black text-foreground leading-tight tracking-tight transition-colors group-hover:text-primary">
                  {item.text}
                </p>
                {item.time && (
                  <div className="flex items-center gap-1">
                    <Clock size={8}/>
                    <span className="text-[8px] font-black uppercase tracking-widest">{item.time}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-8 py-3 border-t border-border/50 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          View full logs →
        </button>
      </CardContent>
    </Card>
  );
});

ActivityFeed.displayName = "ActivityFeed";

export default ActivityFeed;
