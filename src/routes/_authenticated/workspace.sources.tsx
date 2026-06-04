import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { ColumnDef } from "@tanstack/react-table";
import { ActivityTimelineChart, ConfidenceGauge } from "@/components/visualizations";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/workspace/sources")({
  component: SourcesPage,
});

import { collection, onSnapshot, query, orderBy, setDoc, doc } from "firebase/firestore";
import { sourcesRef, SourceData, db } from "@/lib/db";

type Source = SourceData & { id: string };

const columns: ColumnDef<Source>[] = [
  { accessorKey: "handle", header: "Handle/Channel", cell: (info) => <span className="font-medium">{info.getValue() as string}</span> },
  { accessorKey: "platform", header: "Platform" },
  { accessorKey: "riskScore", header: "Risk Score", cell: (info) => (
      <span className={`font-mono ${
        (info.getValue() as number) > 80 ? 'text-[color:var(--color-crit)]' : ''
      }`}>{info.getValue() as number}</span>
  ) },
  { 
    accessorKey: "credibility", 
    header: "Trust Score",
    cell: (info) => {
      const val = info.getValue() as string;
      const score = val === 'high' ? 85 : val === 'medium' ? 50 : 20;
      return (
        <div className="w-12">
          <ConfidenceGauge value={score} size={28} />
        </div>
      );
    }
  },
  { accessorKey: "lastScraped", header: "Last Scraped" },
];

function SourcesPage() {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    const q = query(sourcesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Source[]);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSource = async () => {
    const handle = window.prompt("Enter source handle (e.g., @new_source):");
    if (!handle) return;
    
    setLoading(true);
    try {
      const newId = `SRC-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(sourcesRef, newId), {
        handle,
        platform: "Web",
        riskScore: Math.floor(Math.random() * 100),
        lastScraped: "Just now",
        credibility: Math.random() > 0.5 ? "medium" : "low",
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error(e);
      window.alert("Failed to add source.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Source Intelligence</h1>
          <p className="text-muted-foreground mt-1">Track entity risk and scraping schedules.</p>
        </div>
        <button 
          onClick={handleAddSource}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium"
        >
          Add Source
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        <DataTable columns={columns} data={sources} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
          <div className="lg:col-span-2 border border-border bg-card p-4 glass">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Global Source Reliability vs Risk Evolution</h2>
            <ActivityTimelineChart 
              data={[
                { date: "Jan", reliability: 45, risk: 55 },
                { date: "Feb", reliability: 50, risk: 60 },
                { date: "Mar", reliability: 48, risk: 75 },
                { date: "Apr", reliability: 60, risk: 40 },
                { date: "May", reliability: 72, risk: 35 },
                { date: "Jun", reliability: 68, risk: 45 },
              ]}
              xKey="date"
              yKeys={[
                { key: "reliability", color: "var(--color-ok)" },
                { key: "risk", color: "var(--color-crit)" }
              ]}
              height={180}
            />
          </div>
          
          <div className="border border-border bg-card p-4 glass flex flex-col">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Topic Distribution</h2>
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={[
                      { name: "Infrastructure", value: 400, color: "var(--color-accent)" },
                      { name: "Elections", value: 300, color: "var(--color-ok)" },
                      { name: "Biological", value: 300, color: "var(--color-warn)" },
                      { name: "Energy", value: 200, color: "var(--color-crit)" }
                    ]} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" cy="50%" 
                    innerRadius={45} 
                    outerRadius={65} 
                    paddingAngle={2}
                  >
                    {[
                      { color: "var(--color-accent)" },
                      { color: "var(--color-ok)" },
                      { color: "var(--color-warn)" },
                      { color: "var(--color-crit)" }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="border border-border bg-card rounded-sm overflow-hidden">
          <DataTable columns={columns} data={sources} />
        </div>
      </div>
    </div>
  );
}
