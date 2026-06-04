import { createFileRoute } from "@tanstack/react-router";
import { EarlyWarningPanel } from "@/components/ui/EarlyWarningPanel";
import { PageLoader } from "@/components/ui/PageLoader";
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { claimsRef, ClaimData } from "@/lib/db";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkline, RiskHeatmap, ConfidenceGauge } from "@/components/visualizations";

export const Route = createFileRoute("/_authenticated/workspace/live")({
  component: LiveFeedPage,
});

function LiveFeedPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ClaimData[]>([]);

  useEffect(() => {
    const q = query(claimsRef, orderBy("timestamp", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ClaimData[];
      setEvents(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Mock visual data
  const heatmapData = [
    { label: "Today", values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)) },
    { label: "Yesterday", values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 80)) },
  ];
  const riskData = [
    { name: "Critical", value: 12, color: "var(--color-crit)" },
    { name: "High", value: 24, color: "var(--color-warn)" },
    { name: "Medium", value: 64, color: "var(--color-accent)" },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5 slide-up gap-4">
      <EarlyWarningPanel />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <div className="lg:col-span-2 border border-border bg-card p-4 glass">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium">Global Claim Velocity Heatmap (24h)</h2>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Updated live</span>
          </div>
          <RiskHeatmap data={heatmapData} />
        </div>
        <div className="border border-border bg-card p-4 glass">
          <h2 className="text-sm font-medium mb-2">Risk Distribution</h2>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex-1 border border-border bg-card p-4 flex flex-col glass hover-glow overflow-hidden">
        <div className="flex justify-between items-end mb-4 border-b border-border/50 pb-2">
          <h2 className="text-sm font-medium">Live Firehose</h2>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Velocity / Confidence</span>
        </div>
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto stagger-in pr-2">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 items-center border-b border-border/50 pb-3 mb-1 hover:bg-secondary/20 transition-colors p-2 rounded-sm cursor-default group">
              <span className="font-mono text-muted-foreground text-[10px] shrink-0 w-16">{event.time}</span>
              <div className="flex-1">
                <p className="text-[12px] leading-relaxed flex items-center flex-wrap gap-x-2">
                  <span className={`font-semibold ${
                    event.level === "critical" ? "text-[color:var(--color-crit)]" : 
                    event.level === "high" ? "text-[color:var(--color-warn)]" : "text-accent"
                  }`}>
                    [{event.source}]
                  </span>
                  <span className="text-muted-foreground">{event.text}</span>
                  <span className="bg-secondary/50 px-1.5 py-0.5 text-[10px] text-foreground font-mono rounded-sm border border-border">
                    {event.entity}
                  </span>
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={Array.from({ length: 10 }, () => Math.random() * 100)} color={
                  event.level === 'critical' ? 'var(--color-crit)' : event.level === 'high' ? 'var(--color-warn)' : 'var(--color-accent)'
                } />
                <ConfidenceGauge value={Math.floor(40 + Math.random() * 60)} size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
