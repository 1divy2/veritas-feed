import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/workspace/watchlists")({
  component: WatchlistsPage,
});

import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { watchlistsRef, WatchlistData } from "@/lib/db";

type WatchlistItem = WatchlistData & { id: string };

const columns: ColumnDef<WatchlistItem>[] = [
  { accessorKey: "type", header: "Type", cell: (info) => <span className="text-[10px] uppercase tracking-widest border border-border px-1 rounded-sm">{info.getValue() as string}</span> },
  { accessorKey: "name", header: "Name/Handle", cell: (info) => <span className="font-medium">{info.getValue() as string}</span> },
  { accessorKey: "lastActive", header: "Last Active", cell: (info) => <span className="font-mono text-muted-foreground">{info.getValue() as string}</span> },
  { accessorKey: "riskTrend", header: "Risk Trend", cell: (info) => (
      <span className={`font-mono ${
        info.getValue() === 'Spiking' ? 'text-[color:var(--color-crit)]' : 
        info.getValue() === 'Increasing' ? 'text-[color:var(--color-warn)]' : 'text-muted-foreground'
      }`}>{info.getValue() as string}</span>
  ) },
];

function WatchlistsPage() {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const q = query(watchlistsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WatchlistItem[];
      setWatchlists(data);
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
          <h1 className="text-lg font-medium">Personal Watchlists</h1>
          <p className="text-muted-foreground mt-1">Track sources, entities, and narratives closely.</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10">
        <DataTable columns={columns} data={watchlists} />
      </div>
    </div>
  );
}
