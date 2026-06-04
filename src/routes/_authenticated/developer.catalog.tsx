import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/developer/catalog")({
  component: CatalogPage,
});

const EVENTS = [
  { type: "ClaimCreated",           owner: "IngestionService",      version: "1.0", subscribers: 4, desc: "A new claim has been ingested." },
  { type: "ClaimVerified",          owner: "VerificationService",   version: "1.0", subscribers: 3, desc: "A claim completed verification." },
  { type: "InvestigationCreated",   owner: "InvestigationService",  version: "1.0", subscribers: 5, desc: "A new investigation opened." },
  { type: "InvestigationEscalated", owner: "InvestigationService",  version: "1.0", subscribers: 2, desc: "Investigation escalated to senior." },
  { type: "NarrativeDetected",      owner: "NarrativeService",      version: "1.0", subscribers: 6, desc: "New narrative cluster identified." },
  { type: "NarrativeUpdated",       owner: "NarrativeService",      version: "1.0", subscribers: 3, desc: "Existing narrative gained evidence." },
  { type: "ReportPublished",        owner: "ReportingService",      version: "1.0", subscribers: 4, desc: "Intelligence report published." },
  { type: "SourceTrustUpdated",     owner: "SourceIntelService",    version: "1.0", subscribers: 2, desc: "Source trust score recalculated." },
  { type: "UserInvited",            owner: "IdentityService",       version: "1.0", subscribers: 1, desc: "New user invited to organization." },
  { type: "WorkflowStepCompleted",  owner: "WorkflowEngine",        version: "1.0", subscribers: 3, desc: "A workflow step completed." },
];

const LINEAGE_NODES = [
  { id: "ln-source",       label: "External Source Feed",       type: "source" },
  { id: "ln-ingest",       label: "Ingestion & Normalization",  type: "transform" },
  { id: "ln-verify",       label: "Claim Verification",         type: "transform" },
  { id: "ln-narrative",    label: "Narrative Clustering",        type: "transform" },
  { id: "ln-entity",       label: "Entity Extraction",          type: "transform" },
  { id: "ln-investigation",label: "Intelligence Investigation", type: "output" },
  { id: "ln-report",       label: "Published Report",           type: "output" },
];

const NODE_COLORS: Record<string, string> = {
  source:    "border-accent text-accent",
  transform: "border-[color:var(--color-warn)] text-[color:var(--color-warn)]",
  output:    "border-[color:var(--color-ok)] text-[color:var(--color-ok)]",
};

function CatalogPage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"events" | "lineage">("events");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 bg-secondary/5 gap-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-lg font-medium">Event &amp; Data Catalog</h1>
        <p className="text-muted-foreground mt-1">Browse all platform events, subscribe consumers, and trace data lineage.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-0 border border-border bg-card w-fit">
        <button
          onClick={() => setTab("events")}
          className={`px-4 py-2 text-[11px] uppercase tracking-widest font-medium transition-colors ${tab === "events" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}
        >Event Marketplace</button>
        <button
          onClick={() => setTab("lineage")}
          className={`px-4 py-2 text-[11px] uppercase tracking-widest font-medium transition-colors ${tab === "lineage" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}
        >Data Lineage</button>
      </div>

      {tab === "events" && (
        <div className="border border-border bg-card">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-2.5">Event Type</th>
                <th className="px-4 py-2.5">Owner Service</th>
                <th className="px-4 py-2.5">Version</th>
                <th className="px-4 py-2.5">Subscribers</th>
                <th className="px-4 py-2.5">Description</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {EVENTS.map((evt) => (
                <tr key={evt.type} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono font-medium">{evt.type}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{evt.owner}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px]">v{evt.version}</td>
                  <td className="px-4 py-2.5 font-mono">{evt.subscribers}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{evt.desc}</td>
                  <td className="px-4 py-2.5">
                    <button 
                      onClick={() => window.alert(`Subscribed to ${evt.type}`)}
                      className="text-[10px] uppercase tracking-widest text-accent hover:underline"
                    >
                      Subscribe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "lineage" && (
        <div className="border border-border bg-card p-8">
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {LINEAGE_NODES.map((node, i) => (
              <div key={node.id} className="flex items-center">
                <div className={`border-2 px-4 py-3 text-center ${NODE_COLORS[node.type]}`}>
                  <div className="text-[11px] font-medium">{node.label}</div>
                  <div className="text-[9px] uppercase tracking-widest mt-1 opacity-70">{node.type}</div>
                </div>
                {i < LINEAGE_NODES.length - 1 && (
                  <div className="w-6 h-px bg-border shrink-0" />
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-6">
            Full DAG lineage — every transformation from source ingestion to published intelligence is traceable.
          </p>
        </div>
      )}
    </div>
  );
}
