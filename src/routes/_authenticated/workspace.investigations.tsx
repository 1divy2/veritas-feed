import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProgressMeter, ActivityTimelineChart } from "@/components/visualizations";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/workspace/investigations")({
  component: InvestigationsPage,
});

import { collection, onSnapshot, query, orderBy, setDoc, doc } from "firebase/firestore";
import { casesRef, CaseData, db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

type Investigation = CaseData & { id: string };

const columns: ColumnDef<Investigation>[] = [
  { 
    accessorKey: "id", 
    header: "ID", 
    cell: (info) => (
      <Link to="/workspace/investigations/$id" params={{ id: info.getValue() as string }} className="font-mono text-accent hover:underline decoration-dashed">
        {info.getValue() as string}
      </Link>
    ) 
  },
  { accessorKey: "title", header: "Title" },
  { 
    accessorKey: "status", 
    header: "Status Evolution",
    cell: (info) => {
      const val = info.getValue() as string;
      const progress = val === 'Closed' ? 100 : val === 'Escalated' ? 80 : val === 'In Progress' ? 50 : 20;
      const color = val === 'Closed' ? "var(--color-ok)" : val === 'Escalated' ? "var(--color-crit)" : val === 'In Progress' ? "var(--color-accent)" : "var(--color-warn)";
      return (
        <div className="w-32">
          <ProgressMeter value={progress} label={val} color={color} />
        </div>
      )
    }
  },
  { accessorKey: "priority", header: "Priority", cell: (info) => (
      <span className={`font-mono ${
        info.getValue() === 'Critical' ? 'text-[color:var(--color-crit)]' : ''
      }`}>{info.getValue() as string}</span>
  ) },
  { accessorKey: "assignee", header: "Assignee" },
  { accessorKey: "updatedAt", header: "Last Updated", cell: (info) => (
      <span className="text-muted-foreground">{formatDistanceToNow(info.getValue() as number, { addSuffix: true })}</span>
  ) },
];

function InvestigationsPage() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<Investigation[]>([]);
  
  useEffect(() => {
    const q = query(casesRef, orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Investigation[];
      setCases(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cases:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateCase = async () => {
    const title = window.prompt("Enter new investigation title:");
    if (!title) return;
    
    setLoading(true);
    try {
      const newId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCase = {
        title,
        status: "Open" as const,
        assignee: "Unassigned",
        priority: "Medium" as const,
        summary: "Newly generated case.",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(doc(casesRef, newId), newCase);
    } catch (e) {
      console.error(e);
      window.alert("Failed to create case.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden slide-up">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass-strong">
        <div>
          <h1 className="text-lg font-medium">Investigations</h1>
          <p className="text-muted-foreground mt-1">Manage and assign active cases.</p>
        </div>
        <button 
          onClick={handleCreateCase}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium hover-lift glow-accent"
        >
          New Investigation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
          <div className="border border-border bg-card p-4 glass">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Resolution Velocity</h2>
            <ActivityTimelineChart 
              data={[
                { week: "W1", opened: 12, closed: 8 },
                { week: "W2", opened: 15, closed: 14 },
                { week: "W3", opened: 9, closed: 12 },
                { week: "W4", opened: 22, closed: 18 }
              ]}
              xKey="week"
              yKeys={[
                { key: "opened", color: "var(--color-warn)" },
                { key: "closed", color: "var(--color-ok)" }
              ]}
              height={140}
            />
          </div>
          <div className="border border-border bg-card p-4 glass flex flex-col gap-4">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground">Pipeline Bottlenecks</h2>
            <ProgressMeter value={65} label="Tier 1 Review Delay" color="var(--color-warn)" />
            <ProgressMeter value={22} label="Entity Extraction Failures" color="var(--color-crit)" />
            <ProgressMeter value={8} label="Escalation SLA Breaches" color="var(--color-accent)" />
          </div>
        </div>

        <div className="border border-border bg-card rounded-sm overflow-hidden">
          {cases.length > 0 ? (
            <DataTable columns={columns} data={cases} />
          ) : (
            <EmptyState 
              title="No active investigations" 
              description="You currently have no investigations assigned to your workspace." 
              action={<button onClick={handleCreateCase} className="border border-border px-3 py-1.5 hover:bg-secondary">Create one</button>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
