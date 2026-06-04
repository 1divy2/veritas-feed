import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { tenantsRef, TenantData } from "@/lib/db";
import { query, orderBy, onSnapshot } from "firebase/firestore";

export const Route = createFileRoute("/_authenticated/platform-admin")({
  component: PlatformAdminPage,
});

const columns: ColumnDef<TenantData>[] = [
  { accessorKey: "id", header: "Tenant ID", cell: (info) => <span className="font-mono text-[10px] text-muted-foreground">{info.getValue() as string}</span> },
  { accessorKey: "name", header: "Organization", cell: (info) => <span className="font-medium cursor-pointer hover:underline">{info.getValue() as string}</span> },
  { accessorKey: "tier", header: "Tier", cell: (info) => <span className="text-[11px] uppercase tracking-widest">{info.getValue() as string}</span> },
  { accessorKey: "storage", header: "Storage", cell: (info) => <span className="font-mono">{info.getValue() as string}</span> },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: (info) => (
      <span className={`px-1.5 py-0.5 border rounded-sm text-[9px] uppercase tracking-widest ${
        info.getValue() === 'Active' ? 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]' : 
        info.getValue() === 'Trial' ? 'border-[color:var(--color-warn)] text-[color:var(--color-warn)]' : 
        'border-[color:var(--color-crit)] text-[color:var(--color-crit)]'
      }`}>
        {info.getValue() as string}
      </span>
    )
  },
];

function PlatformAdminPage() {
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<TenantData[]>([]);

  useEffect(() => {
    const q = query(tenantsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTenants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TenantData[]);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium text-[color:var(--color-warn)]">Global Platform Administration</h1>
          <p className="text-muted-foreground mt-1">SaaS Operator Console. Manage all tenants, billing, and infrastructure.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4 shrink-0 border-b border-border bg-secondary/5">
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Tenants</div>
          <div className="text-2xl font-mono mt-1">3</div>
        </div>
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Users</div>
          <div className="text-2xl font-mono mt-1">158</div>
        </div>
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Platform MRR</div>
          <div className="text-2xl font-mono mt-1 text-[color:var(--color-ok)]">$13,600</div>
        </div>
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Database Storage</div>
          <div className="text-2xl font-mono mt-1">1.4 TB</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        <div className="border border-border bg-card p-4">
          <h2 className="text-sm font-medium mb-4">Organization Tenants</h2>
          <DataTable columns={columns} data={tenants} />
        </div>
      </div>
    </div>
  );
}
