import { createFileRoute } from "@tanstack/react-router";
import { ActivityTimelineChart, ProgressMeter, Sparkline } from "@/components/visualizations";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/operations/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden slide-up">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Operations Activity</h1>
          <p className="text-muted-foreground mt-1">Real-time platform utilization and analyst throughput.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 border border-border rounded-sm">
          <div className="w-2 h-2 rounded-full bg-[color:var(--color-ok)] animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest">System Nominal</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
          <div className="lg:col-span-2 border border-border bg-card p-4 glass">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Analyst Action Throughput (24h)</h2>
            <ActivityTimelineChart 
              data={[
                { hour: "00:00", actions: 120, automated: 450 },
                { hour: "04:00", actions: 80, automated: 320 },
                { hour: "08:00", actions: 340, automated: 500 },
                { hour: "12:00", actions: 560, automated: 620 },
                { hour: "16:00", actions: 490, automated: 580 },
                { hour: "20:00", actions: 210, automated: 490 },
              ]}
              xKey="hour"
              yKeys={[
                { key: "actions", color: "var(--color-accent)" },
                { key: "automated", color: "var(--color-ok)" }
              ]}
              height={180}
            />
          </div>
          
          <div className="border border-border bg-card p-4 glass flex flex-col gap-5">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground">Current System Load</h2>
            <ProgressMeter value={42} label="Ingestion Pipeline" color="var(--color-ok)" />
            <ProgressMeter value={88} label="Entity Extraction (NLP)" color="var(--color-warn)" />
            <ProgressMeter value={15} label="Graph Database CPU" color="var(--color-accent)" />
            <div className="mt-auto border-t border-border/50 pt-4">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Analyst Sessions</span>
                 <span className="font-mono text-[12px]">14</span>
               </div>
               <Sparkline data={[12, 14, 15, 13, 16, 14, 14]} color="var(--color-accent)" />
            </div>
          </div>
        </div>

        <div className="border border-border bg-card rounded-sm overflow-hidden flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground">Recent Audit Log</h2>
            <button className="text-[10px] uppercase tracking-widest text-accent hover:underline">Export CSV</button>
          </div>
          <div className="flex flex-col overflow-y-auto stagger-in p-2">
            {[
              { time: "Just now", user: "@sarah", action: "Updated Investigation Status", target: "INV-2026-1042", color: "var(--color-ok)" },
              { time: "2 min ago", user: "SYSTEM", action: "Flagged anomalous narrative growth", target: "NAR-2026-9912", color: "var(--color-warn)" },
              { time: "15 min ago", user: "@david", action: "Created new Source Profile", target: "@infrastructure_watch", color: "var(--color-accent)" },
              { time: "34 min ago", user: "SYSTEM", action: "Escalated case due to SLA breach", target: "INV-2026-0811", color: "var(--color-crit)" },
              { time: "1 hr ago", user: "@sarah", action: "Merged entity records", target: "Entity: Sector 7", color: "var(--color-accent)" },
              { time: "2 hrs ago", user: "@admin", action: "Modified organization settings", target: "Rate Limits", color: "var(--color-ok)" },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-center border-b border-border/50 pb-3 mb-1 hover:bg-secondary/20 transition-colors p-2 rounded-sm cursor-default group">
                <span className="font-mono text-muted-foreground text-[10px] shrink-0 w-20">{log.time}</span>
                <span className={`font-mono text-[10px] w-24 truncate`} style={{ color: log.color }}>{log.user}</span>
                <span className="text-[12px] flex-1 text-foreground">{log.action}</span>
                <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 bg-secondary/50 border border-border rounded-sm">{log.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
