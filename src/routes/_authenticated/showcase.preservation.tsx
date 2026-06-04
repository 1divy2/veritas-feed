import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/showcase/preservation")({
  component: PreservationPage,
});

function PreservationPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Knowledge Preservation</h1>
          <p className="text-muted-foreground mt-1 text-sm">Archival views and institutional memory for legacy intelligence.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border bg-card p-6 rounded-sm flex flex-col items-center justify-center text-center hover-glow cursor-pointer hover:border-accent">
            <h3 className="text-sm font-medium">Archive: 2024 Elections</h3>
            <p className="text-[11px] text-muted-foreground mt-2">View read-only historical context and graph snapshots.</p>
          </div>
          <div className="border border-border bg-card p-6 rounded-sm flex flex-col items-center justify-center text-center hover-glow cursor-pointer hover:border-accent">
            <h3 className="text-sm font-medium">Archive: Project X</h3>
            <p className="text-[11px] text-muted-foreground mt-2">Frozen evidence chains and source lineage mapping.</p>
          </div>
          <div className="border border-border bg-card p-6 rounded-sm flex flex-col items-center justify-center text-center hover-glow cursor-pointer hover:border-accent">
            <h3 className="text-sm font-medium">Archive: Alpha Network</h3>
            <p className="text-[11px] text-muted-foreground mt-2">Bot network forensics prior to takedown operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
