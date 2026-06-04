import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/research/evolution")({
  component: EvolutionPage,
});

function EvolutionPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Narrative Evolution Studies</h1>
          <p className="text-muted-foreground mt-1 text-sm">Visual lifecycle analysis: Birth, Growth, Mutation, and Decline.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="border border-border bg-card p-5 rounded-sm hover-glow">
          <h2 className="text-sm font-semibold tracking-wide uppercase mb-4 text-accent">Narrative Topology: Event T-881</h2>
          <div className="h-64 border border-dashed border-border/50 rounded flex items-center justify-center bg-secondary/10 relative overflow-hidden">
            {/* Mocking a node graph / timeline topology visually */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 size-4 rounded-full bg-[color:var(--color-warn)] shadow-[0_0_15px_var(--color-warn)]" title="Birth"></div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-32 h-[2px] bg-[color:var(--color-warn)]/50"></div>
            
            <div className="absolute left-40 top-1/3 size-6 rounded-full bg-[color:var(--color-crit)] shadow-[0_0_25px_var(--color-crit)]" title="Mutation A"></div>
            <div className="absolute left-10 top-1/2 w-[125px] h-[2px] bg-gradient-to-tr from-[color:var(--color-warn)]/50 to-[color:var(--color-crit)]/50 origin-left rotate-[-25deg]"></div>

            <div className="absolute left-40 bottom-1/3 size-5 rounded-full bg-accent shadow-[0_0_20px_var(--color-accent)]" title="Mutation B"></div>
            <div className="absolute left-10 top-1/2 w-[125px] h-[2px] bg-gradient-to-br from-[color:var(--color-warn)]/50 to-accent/50 origin-left rotate-[25deg]"></div>

            <div className="absolute left-[300px] top-1/2 -translate-y-1/2 size-12 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center text-[10px] text-muted-foreground">Decline</div>
            
            <div className="absolute left-40 top-1/3 w-[150px] h-[2px] bg-gradient-to-br from-[color:var(--color-crit)]/50 to-muted-foreground/30 origin-left rotate-[20deg]"></div>
            <div className="absolute left-40 bottom-1/3 w-[150px] h-[2px] bg-gradient-to-tr from-accent/50 to-muted-foreground/30 origin-left rotate-[-20deg]"></div>

            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground font-mono">T-881: Lifecycle Map</div>
          </div>
          
          <div className="mt-6 grid grid-cols-4 gap-4 text-center">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">Birth</span>
              <span className="block text-sm font-mono mt-1">Oct 12, 14:00z</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">Peak Velocity</span>
              <span className="block text-sm font-mono mt-1">4.2k claims/hr</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">Mutations</span>
              <span className="block text-sm font-mono mt-1">2 Major Branches</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">Status</span>
              <span className="block text-sm font-mono mt-1 text-muted-foreground">Dormant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
