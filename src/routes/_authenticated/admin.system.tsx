import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/admin/system")({
  component: SystemAdminPage,
});

function SystemAdminPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleExportLogs = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1000);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div>
          <h1 className="text-lg font-medium">System Administration Console</h1>
          <p className="text-muted-foreground mt-1">Platform health, feature flags, and global settings.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportLogs}
            className="border border-border bg-background px-3 py-1.5 hover:bg-secondary text-[11px] font-medium uppercase tracking-widest transition-colors"
          >
            {exporting ? "Exporting..." : "Export Audit Logs"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-6">
        
        {/* Environment Settings */}
        <div className="border border-border bg-card p-6 flex flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-widest border-b border-border pb-2">Environment Configuration</h2>
          <div className="grid grid-cols-2 gap-y-4 text-[12px]">
            <div>
              <span className="text-muted-foreground block">Deployment Env</span>
              <span className="font-mono text-foreground">PRODUCTION</span>
            </div>
            <div>
              <span className="text-muted-foreground block">API Version</span>
              <span className="font-mono text-foreground">v2.1.4</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Database Engine</span>
              <span className="font-mono text-foreground">PostgreSQL 15</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Storage Backend</span>
              <span className="font-mono text-foreground">AWS S3 (us-east-1)</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="border border-border bg-card p-6 flex flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-widest border-b border-border pb-2">Component Health & Distributed Metrics</h2>
          <div className="flex flex-col gap-3 text-[12px]">
            <div className="flex justify-between items-center">
              <span className="font-mono">Global Event Bus (Redpanda)</span>
              <span className="text-[color:var(--color-ok)] font-bold">OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center pl-4 border-l-2 border-border">
              <span className="text-muted-foreground">Events Per Second (EPS)</span>
              <span className="font-mono">1,420</span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="font-mono">Search Indexing Workers</span>
              <span className="text-[color:var(--color-warn)] font-bold">DEGRADED</span>
            </div>
            <div className="flex justify-between items-center pl-4 border-l-2 border-border">
              <span className="text-muted-foreground">Queue Depth</span>
              <span className="font-mono text-[color:var(--color-warn)]">14,204 messages</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="font-mono">Redis Query Cache</span>
              <span className="text-[color:var(--color-ok)] font-bold">OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center pl-4 border-l-2 border-border">
              <span className="text-muted-foreground">Global Cache Hit Rate</span>
              <span className="font-mono">92.4%</span>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="col-span-2 border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest border-b border-border pb-2 mb-4">Global Feature Flags</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-3 border border-border bg-background">
              <div className="flex flex-col">
                <span className="font-medium text-[12px]">Experimental AI Search</span>
                <span className="text-[10px] text-muted-foreground">Uses LLM vector embeddings</span>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-foreground" />
            </div>
            <div className="flex justify-between items-center p-3 border border-border bg-background">
              <div className="flex flex-col">
                <span className="font-medium text-[12px]">Strict Rate Limiting</span>
                <span className="text-[10px] text-muted-foreground">Limits API to 100 req/min</span>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-foreground" defaultChecked />
            </div>
            <div className="flex justify-between items-center p-3 border border-border bg-background">
              <div className="flex flex-col">
                <span className="font-medium text-[12px]">Auto-Publish Briefs</span>
                <span className="text-[10px] text-muted-foreground">Bypasses manual Lead Analyst approval</span>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-foreground" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
