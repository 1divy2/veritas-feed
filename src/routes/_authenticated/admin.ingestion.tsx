import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auditLogsRef } from "@/lib/db";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/admin/ingestion")({
  component: IngestionAdminPage,
});

type IngestionJob = {
  id: string;
  pipeline: string;
  status: "RUNNING" | "COMPLETED" | "FAILED" | "PENDING";
  startTime: string;
  duration: string;
  recordsProcessed: number;
};

const mockJobs: IngestionJob[] = [
  { id: "job-101", pipeline: "reuters_global", status: "COMPLETED", startTime: "10m ago", duration: "45s", recordsProcessed: 1420 },
  { id: "job-102", pipeline: "who_health_bulletin", status: "RUNNING", startTime: "2m ago", duration: "-", recordsProcessed: 310 },
  { id: "job-103", pipeline: "twitter_firehose_sec7", status: "FAILED", startTime: "1h ago", duration: "12s", recordsProcessed: 0 },
];

const columns: ColumnDef<IngestionJob>[] = [
  { accessorKey: "id", header: "Job ID", cell: (info) => <span className="font-mono text-[10px] text-muted-foreground">{info.getValue() as string}</span> },
  { accessorKey: "pipeline", header: "Pipeline", cell: (info) => <span className="font-medium text-[12px]">{info.getValue() as string}</span> },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: (info) => (
      <span className={`px-1.5 py-0.5 border rounded-sm text-[9px] uppercase tracking-widest ${
        info.getValue() === 'COMPLETED' ? 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]' : 
        info.getValue() === 'FAILED' ? 'border-[color:var(--color-crit)] text-[color:var(--color-crit)]' : 
        info.getValue() === 'RUNNING' ? 'border-accent text-accent animate-pulse' :
        'border-border text-muted-foreground'
      }`}>
        {info.getValue() as string}
      </span>
    )
  },
  { accessorKey: "startTime", header: "Started", cell: (info) => <span className="font-mono text-[11px]">{info.getValue() as string}</span> },
  { accessorKey: "duration", header: "Duration", cell: (info) => <span className="font-mono text-[11px]">{info.getValue() as string}</span> },
  { accessorKey: "recordsProcessed", header: "Records", cell: (info) => <span className="font-mono text-[11px]">{info.getValue() as number}</span> },
];

function IngestionAdminPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState(mockJobs);
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleTriggerPipeline = async () => {
    const pipelineName = window.prompt("Enter pipeline name (e.g., reuters_global):");
    if (!pipelineName) return;

    setIsTriggering(true);
    const newId = `job-${Math.floor(200 + Math.random() * 800)}`;
    
    setJobs([{
      id: newId,
      pipeline: pipelineName,
      status: "RUNNING",
      startTime: "Just now",
      duration: "-",
      recordsProcessed: 0
    }, ...jobs]);

    try {
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: "PIPELINE_TRIGGERED",
        actor: "Admin",
        target: pipelineName,
        changes: `Triggered ingestion job ${newId}`,
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch(e) {}

    setIsTriggering(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div>
          <h1 className="text-lg font-medium">Ingestion Pipeline Management</h1>
          <p className="text-muted-foreground mt-1">Monitor automated data ingestion jobs and throughput.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleTriggerPipeline}
            disabled={isTriggering}
            className={`border border-border bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest transition-colors ${isTriggering ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'}`}
          >
            {isTriggering ? "Triggering..." : "Trigger Pipeline"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Pipelines</div>
          <div className="text-2xl font-mono mt-1">14</div>
        </div>
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Records (24h)</div>
          <div className="text-2xl font-mono mt-1">1.2M</div>
        </div>
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Latency</div>
          <div className="text-2xl font-mono mt-1">420ms</div>
        </div>
        <div className="border border-[color:var(--color-warn)] bg-[color:var(--color-warn)]/5 p-4">
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-warn)]">Error Rate</div>
          <div className="text-2xl font-mono mt-1 text-[color:var(--color-warn)]">1.2%</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium">Recent Jobs</h2>
        </div>
        <div className="p-4">
          <DataTable columns={columns} data={jobs} />
        </div>
      </div>
    </div>
  );
}
