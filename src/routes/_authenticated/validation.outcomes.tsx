import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/validation/outcomes")({
  component: OutcomesPage,
});

function OutcomesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Decision Support Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Measuring operational outcomes and platform value.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border bg-card p-6 rounded-sm flex flex-col items-center justify-center text-center hover-glow">
            <span className="text-4xl font-mono text-accent mb-2">4,200+</span>
            <h3 className="text-sm font-medium">Investigations Accelerated</h3>
            <p className="text-[11px] text-muted-foreground mt-2">Cases resolved 3x faster using automated evidence retrieval.</p>
          </div>
          <div className="border border-border bg-card p-6 rounded-sm flex flex-col items-center justify-center text-center hover-glow">
            <span className="text-4xl font-mono text-[color:var(--color-crit)] mb-2">184</span>
            <h3 className="text-sm font-medium">High-Risk Cases Identified</h3>
            <p className="text-[11px] text-muted-foreground mt-2">Zero-day narrative detections escalated automatically.</p>
          </div>
          <div className="border border-border bg-card p-6 rounded-sm flex flex-col items-center justify-center text-center hover-glow">
            <span className="text-4xl font-mono text-[color:var(--color-ok)] mb-2">12k hrs</span>
            <h3 className="text-sm font-medium">Analyst Time Saved</h3>
            <p className="text-[11px] text-muted-foreground mt-2">Estimated reduction in manual fact-checking labor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
