import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/validation/metrics")({
  component: TrustMetricsPage,
});

function TrustMetricsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Platform Trust & Quality Metrics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Transparency into false positives, evidence strength, and decision confidence.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-border bg-card p-5 rounded-sm hover-glow flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase">System Reliability</h2>
            <div className="flex gap-4 items-end h-32 border-b border-border/50 pb-2">
              <div className="flex-1 flex flex-col justify-end gap-1 items-center">
                <span className="text-[10px] text-muted-foreground">False Positive</span>
                <div className="w-12 bg-[color:var(--color-warn)]/80 rounded-t-sm" style={{ height: '12%' }}></div>
                <span className="text-xs font-mono">1.2%</span>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 items-center">
                <span className="text-[10px] text-muted-foreground">False Negative</span>
                <div className="w-12 bg-[color:var(--color-crit)]/80 rounded-t-sm" style={{ height: '8%' }}></div>
                <span className="text-xs font-mono">0.8%</span>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 items-center">
                <span className="text-[10px] text-muted-foreground">True Positive</span>
                <div className="w-12 bg-[color:var(--color-ok)]/80 rounded-t-sm" style={{ height: '98%' }}></div>
                <span className="text-xs font-mono">98%</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">Based on last 10,000 human-verified evaluations.</p>
          </div>

          <div className="border border-border bg-card p-5 rounded-sm hover-glow flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase">Evidence Quality Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">High Strength (Primary Sources)</span>
                  <span className="font-mono text-foreground">65%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
                  <div className="h-full bg-[color:var(--color-ok)]" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">Medium Strength (Corroborated Secondary)</span>
                  <span className="font-mono text-foreground">28%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
                  <div className="h-full bg-[color:var(--color-warn)]" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">Low Strength (Unverified Claims)</span>
                  <span className="font-mono text-foreground">7%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
                  <div className="h-full bg-[color:var(--color-crit)]" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
