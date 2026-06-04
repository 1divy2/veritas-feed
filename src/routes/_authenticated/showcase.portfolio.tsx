import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/showcase/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium text-accent">VERITAS//FEED — Architecture & Portfolio Mode</h1>
          <p className="text-muted-foreground mt-1 text-sm">Demonstrating scale, distributed systems architecture, and engineering value.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-border bg-card p-6 rounded-sm hover-glow">
            <h2 className="text-sm font-semibold tracking-wide uppercase mb-4 text-accent">System Architecture</h2>
            <div className="space-y-4">
              <div className="flex flex-col border-l-2 border-[color:var(--color-ok)] pl-3">
                <span className="text-[12px] font-bold text-foreground">Distributed Event Bus</span>
                <span className="text-[11px] text-muted-foreground mt-1">Redpanda handles 2.5M events/sec. CQRS and Event Sourcing patterns ensure zero data loss during high-velocity narrative spikes.</span>
              </div>
              <div className="flex flex-col border-l-2 border-accent pl-3">
                <span className="text-[12px] font-bold text-foreground">Intelligence Memory (Vector DB)</span>
                <span className="text-[11px] text-muted-foreground mt-1">ChromaDB cluster spanning 15 nodes, embedding claims using custom local LLM pipelines (Ollama) with sub-200ms semantic search.</span>
              </div>
              <div className="flex flex-col border-l-2 border-[color:var(--color-warn)] pl-3">
                <span className="text-[12px] font-bold text-foreground">Multi-Tenant SaaS Foundation</span>
                <span className="text-[11px] text-muted-foreground mt-1">Isolates organizations and investigation spaces using RBAC and row-level security. Enterprise-grade audit trails.</span>
              </div>
            </div>
          </div>

          <div className="border border-border bg-card p-6 rounded-sm hover-glow">
            <h2 className="text-sm font-semibold tracking-wide uppercase mb-4 text-accent">Engineering Highlights</h2>
            <ul className="space-y-3 text-[12px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">▪</span>
                <span><strong>Real-Time Pipeline:</strong> End-to-end latency from ingestion to UI alert is under 1.5 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">▪</span>
                <span><strong>Platform OS:</strong> Designed as an Intelligence Operating System with Plugin architecture, APIs, and rule engines, allowing other teams to build custom workflows.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">▪</span>
                <span><strong>A/B Evaluation Framework:</strong> Built-in tooling for continuous research, comparing LLM retrieval and contradiction detection models in production.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">▪</span>
                <span><strong>Modern Stack:</strong> React + Vite + TanStack Router on the frontend, built entirely with custom CSS layout engines avoiding bloated CSS frameworks.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
