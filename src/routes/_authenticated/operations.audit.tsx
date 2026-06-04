import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRole } from "@/lib/rbac";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/operations/audit")({
  component: AuditPage,
});

import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auditLogsRef, AuditLogData } from "@/lib/db";

type AuditEvent = AuditLogData & { id: string };

const columns: ColumnDef<AuditEvent>[] = [
  { accessorKey: "timestamp", header: "Timestamp", cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{info.getValue() as string}</span> },
  { accessorKey: "action", header: "Action", cell: (info) => <span className="font-mono text-accent">{info.getValue() as string}</span> },
  { accessorKey: "actor", header: "Actor" },
  { accessorKey: "target", header: "Target ID", cell: (info) => <span className="font-mono">{info.getValue() as string}</span> },
  { accessorKey: "changes", header: "Diff", cell: (info) => <span className="font-mono text-muted-foreground">{info.getValue() as string}</span> },
];

function AuditPage() {
  const { hasRole } = useRole();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditEvent[]>([]);

  useEffect(() => {
    const q = query(auditLogsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AuditEvent[];
      setLogs(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    
    const headers = ["Timestamp", "Action", "Actor", "Target", "Changes"];
    const rows = logs.map(log => [
      log.timestamp,
      log.action,
      log.actor,
      log.target,
      `"${log.changes.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!hasRole(["admin", "analyst"])) {
    return <EmptyState title="Access Denied" description="You do not have permission to view the audit trail." />;
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">Immutable ledger of all system and user actions.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="border border-border px-3 py-1.5 hover:bg-secondary transition-colors font-medium text-muted-foreground"
        >
          Export CSV
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10">
        <DataTable columns={columns} data={logs} />
      </div>
    </div>
  );
}
