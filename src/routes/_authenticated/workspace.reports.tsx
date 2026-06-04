import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { ActivityTimelineChart, EvidenceNetwork } from "@/components/visualizations";

export const Route = createFileRoute("/_authenticated/workspace/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleExportReport = () => {
    const reportText = `
Executive Intelligence Brief
Weekly Risk Summary — 2026-W22

Total Claims Analyzed: 14,204 (+12% vs last week)
High Risk Narratives: 24 (+4 vs last week)
Avg Source Reliability: 68.4 (Stable)

Emerging Trends:
We observed a 34% increase in climate-related misattribution claims beginning on Tuesday. The primary vector appears to be a coordinated network of 12 previously dormant accounts, now flagged in the Early Warning System. The dominant narrative clustering indicates an attempt to manipulate local election sentiment in Sector 7.

Generated on: ${new Date().toISOString()}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `intelligence_brief_W22.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div>
          <h1 className="text-lg font-medium">Executive Intelligence Briefs</h1>
          <p className="text-muted-foreground mt-1">Automated data-driven operational reports.</p>
        </div>
        <button 
          onClick={handleExportReport}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium"
        >
          Generate Brief
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full border border-border bg-card p-8 my-4 shadow-sm">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-border pb-4 mb-6">Weekly Risk Summary — 2026-W22</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Claims Analyzed</div>
              <div className="text-2xl font-mono mt-1 text-foreground">14,204</div>
              <div className="text-[10px] text-[color:var(--color-warn)] mt-1 font-mono">+12% vs last week</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">High Risk Narratives</div>
              <div className="text-2xl font-mono mt-1 text-foreground">24</div>
              <div className="text-[10px] text-[color:var(--color-crit)] mt-1 font-mono">+4 vs last week</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Source Reliability</div>
              <div className="text-2xl font-mono mt-1 text-foreground">68.4</div>
              <div className="text-[10px] text-muted-foreground mt-1 font-mono">Stable</div>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-3">Emerging Trends</h3>
            <p className="text-[13px] leading-relaxed mb-8">
              We observed a <span className="font-mono text-[color:var(--color-warn)]">34% increase</span> in climate-related misattribution claims beginning on Tuesday. The primary vector appears to be a coordinated network of 12 previously dormant accounts, now flagged in the Early Warning System. The dominant narrative clustering indicates an attempt to manipulate local election sentiment in Sector 7.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">Risk Velocity (7 Day Span)</h3>
                <div className="border border-border p-4 bg-background">
                  <ActivityTimelineChart 
                    data={[
                      { date: "Mon", risk: 200, narratives: 50 },
                      { date: "Tue", risk: 310, narratives: 65 },
                      { date: "Wed", risk: 450, narratives: 80 },
                      { date: "Thu", risk: 480, narratives: 85 },
                      { date: "Fri", risk: 520, narratives: 90 },
                      { date: "Sat", risk: 600, narratives: 110 },
                      { date: "Sun", risk: 710, narratives: 140 }
                    ]}
                    xKey="date"
                    yKeys={[
                      { key: "risk", color: "var(--color-warn)" },
                      { key: "narratives", color: "var(--color-accent)" }
                    ]}
                    height={200}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">Dominant Narrative Map</h3>
                <div className="border border-border p-4 bg-background h-[234px] flex items-center justify-center">
                  <EvidenceNetwork />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
