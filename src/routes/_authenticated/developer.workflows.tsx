import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auditLogsRef } from "@/lib/db";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/developer/workflows")({
  component: WorkflowsPage,
});

const WORKFLOWS = [
  {
    id: "wf-investigation-default",
    name: "Default Investigation Pipeline",
    steps: [
      { name: "Detect Claim",       action: "claim.detect",       status: "COMPLETED" },
      { name: "Retrieve Evidence",   action: "evidence.retrieve",  status: "COMPLETED" },
      { name: "Verify Claim",        action: "claim.verify",       status: "COMPLETED" },
      { name: "Assign Analyst",      action: "analyst.assign",     status: "RUNNING" },
      { name: "Peer Review",         action: "review.peer",        status: "PENDING" },
      { name: "Publish Report",      action: "report.publish",     status: "PENDING" },
    ],
  },
  {
    id: "wf-narrative-triage",
    name: "Narrative Triage",
    steps: [
      { name: "Cluster Claims",     action: "narrative.cluster",  status: "COMPLETED" },
      { name: "Score Risk",          action: "risk.score",         status: "COMPLETED" },
      { name: "Notify Lead",        action: "notify.lead",        status: "PENDING" },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-[color:var(--color-ok)]",
  RUNNING:   "bg-accent animate-pulse",
  PENDING:   "bg-border",
  FAILED:    "bg-[color:var(--color-crit)]",
};

function WorkflowsPage() {
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState(WORKFLOWS);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const handleExecute = async (id: string) => {
    // Reset status to running
    setWorkflows(prev => prev.map(wf => {
      if (wf.id !== id) return wf;
      return { ...wf, steps: wf.steps.map(s => ({ ...s, status: "PENDING" })) };
    }));

    const wf = workflows.find(w => w.id === id);
    if (!wf) return;

    for (let i = 0; i < wf.steps.length; i++) {
      setWorkflows(prev => prev.map(w => {
        if (w.id !== id) return w;
        const newSteps = [...w.steps];
        newSteps[i] = { ...newSteps[i], status: "RUNNING" };
        return { ...w, steps: newSteps };
      }));
      
      await new Promise(r => setTimeout(r, 600));

      setWorkflows(prev => prev.map(w => {
        if (w.id !== id) return w;
        const newSteps = [...w.steps];
        newSteps[i] = { ...newSteps[i], status: "COMPLETED" };
        return { ...w, steps: newSteps };
      }));
    }

    try {
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: "WORKFLOW_EXECUTED",
        actor: "System",
        target: id,
        changes: `Executed workflow: ${wf.name}`,
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch(e) {}
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 bg-secondary/5 gap-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-lg font-medium">Workflow Engine</h1>
        <p className="text-muted-foreground mt-1">Configure and visualise declarative intelligence workflows. Workflows are data, not code.</p>
      </div>

      {workflows.map((wf) => (
        <div key={wf.id} className="border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-sm font-medium">{wf.name}</h2>
              <span className="font-mono text-[10px] text-muted-foreground">{wf.id}</span>
            </div>
            <button 
              onClick={() => handleExecute(wf.id)}
              disabled={wf.steps.some(s => s.status === 'RUNNING')}
              className={`border border-border bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest transition-colors ${wf.steps.some(s => s.status === 'RUNNING') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'}`}
            >
              {wf.steps.some(s => s.status === 'RUNNING') ? 'Running...' : 'Execute'}
            </button>
          </div>

          {/* Visual Pipeline */}
          <div className="p-6">
            <div className="flex items-center gap-0">
              {wf.steps.map((step, i) => (
                <div key={step.name} className="flex items-center">
                  <div className="flex flex-col items-center gap-2 w-36">
                    <div className={`size-3 rounded-full ${STATUS_COLORS[step.status]}`} />
                    <div className="text-center">
                      <div className="text-[11px] font-medium">{step.name}</div>
                      <div className="font-mono text-[9px] text-muted-foreground">{step.action}</div>
                      <div className={`text-[9px] uppercase tracking-widest mt-1 ${
                        step.status === "COMPLETED" ? "text-[color:var(--color-ok)]" :
                        step.status === "RUNNING" ? "text-accent" :
                        "text-muted-foreground"
                      }`}>{step.status}</div>
                    </div>
                  </div>
                  {i < wf.steps.length - 1 && (
                    <div className="w-8 h-px bg-border shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
