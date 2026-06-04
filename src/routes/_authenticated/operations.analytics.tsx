import { createFileRoute } from "@tanstack/react-router";
import { HistoricalTimeline } from "@/components/ui/HistoricalTimeline";
import { PageLoader } from "@/components/ui/PageLoader";
import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { casesRef, tasksRef, narrativesRef, CaseData } from "@/lib/db";
import { ActivityTimelineChart, RiskHeatmap } from "@/components/visualizations";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/operations/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ openCases: 0, closedCases: 0, activeTasks: 0, topNarratives: [] as any[] });

  useEffect(() => {
    async function loadStats() {
      try {
        const [cSnap, tSnap, nSnap] = await Promise.all([
          getDocs(casesRef), getDocs(tasksRef), getDocs(narrativesRef)
        ]);
        
        let open = 0, closed = 0;
        cSnap.forEach(doc => {
          const d = doc.data() as CaseData;
          if (d.status === "Closed") closed++;
          else open++;
        });

        const activeTasks = tSnap.docs.filter(d => d.data().status !== "Completed").length;
        
        const nData = nSnap.docs.map(d => d.data());
        nData.sort((a, b) => b.riskScore - a.riskScore);

        setStats({
          openCases: open,
          closedCases: closed,
          activeTasks,
          topNarratives: nData.slice(0, 2)
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Analytical Comparisons</h1>
          <p className="text-muted-foreground mt-1">Cross-examine entity and narrative velocity.</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-8">
        
        {/* Question 1: Which narratives are spreading? */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-medium text-accent">Q: Which narratives are spreading fastest?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats.topNarratives.map((nar, i) => (
              <div key={i} className="border border-border bg-card p-4 glass">
                <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                   <span className="text-[11px] font-medium truncate max-w-[70%]">{nar.title}</span>
                   <span className={`text-[10px] uppercase tracking-widest px-1 border rounded-sm ${nar.riskScore > 80 ? 'text-[color:var(--color-warn)] border-[color:var(--color-warn)]' : 'text-muted-foreground border-border'}`}>
                     Risk {nar.riskScore}
                   </span>
                </div>
                <ActivityTimelineChart 
                  xKey="date"
                  yKeys={[{ key: "volume", color: nar.riskScore > 80 ? "var(--color-warn)" : "var(--color-ok)" }]}
                  data={[
                    { date: "W1", volume: Math.floor(nar.activeClaims * 0.4) }, 
                    { date: "W2", volume: Math.floor(nar.activeClaims * 0.6) }, 
                    { date: "W3", volume: Math.floor(nar.activeClaims * 0.8) }, 
                    { date: "W4", volume: Math.floor(nar.activeClaims * 0.9) }, 
                    { date: "W5", volume: nar.activeClaims }
                  ]} 
                  height={120}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Question 2: Where are risks increasing? (Topic Overlap) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-medium text-[color:var(--color-warn)]">Q: Where are thematic risks increasing?</h2>
          <div className="border border-border bg-card p-4 glass w-full">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Topic Overlap Risk Matrix</h3>
            <RiskHeatmap data={[
              { label: "Elections vs Cyber", values: [20, 30, 45, 60, 85, 90, 95] },
              { label: "Bio vs Supply", values: [10, 15, 20, 25, 30, 35, 40] },
              { label: "Finance vs Energy", values: [50, 60, 70, 75, 80, 85, 80] },
              { label: "Infra vs Social", values: [5, 10, 15, 5, 20, 30, 45] },
            ]} />
          </div>
        </div>

        {/* Question 3: Which sources are becoming less reliable? */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-medium text-[color:var(--color-crit)]">Q: Which sources are becoming less reliable?</h2>
          <div className="border border-border bg-card p-4 glass">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Source Reliability Degradation Index</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={[
                    { name: 'Social Platform X', size: 400, fill: 'var(--color-crit)' },
                    { name: 'Forum Y', size: 300, fill: 'var(--color-warn)' },
                    { name: 'News Network Z', size: 200, fill: 'var(--color-accent)' },
                    { name: 'Fringe Board A', size: 150, fill: 'var(--color-warn)' },
                    { name: 'Encrypted Chat B', size: 100, fill: 'var(--color-crit)' },
                    { name: 'Mainstream Blog C', size: 50, fill: 'var(--color-ok)' },
                  ]}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="var(--color-background)"
                >
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', fontSize: '11px' }} />
                </Treemap>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
