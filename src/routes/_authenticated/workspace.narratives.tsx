import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { ActivityTimelineChart, Sparkline } from "@/components/visualizations";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/_authenticated/workspace/narratives")({
  component: NarrativesPage,
});

import { collection, query, orderBy, onSnapshot, setDoc, doc } from "firebase/firestore";
import { narrativesRef, NarrativeData, db } from "@/lib/db";

type Narrative = NarrativeData & { id: string };

const columns: ColumnDef<Narrative>[] = [
  { accessorKey: "id", header: "ID", cell: (info) => <span className="font-mono text-muted-foreground">{info.getValue() as string}</span> },
  { accessorKey: "title", header: "Narrative Title", cell: (info) => <span className="font-medium">{info.getValue() as string}</span> },
  { accessorKey: "activeClaims", header: "Claims", cell: (info) => <span className="font-mono">{info.getValue() as number}</span> },
  { accessorKey: "sources", header: "Sources", cell: (info) => <span className="font-mono">{info.getValue() as number}</span> },
  { accessorKey: "riskScore", header: "Risk Score", cell: (info) => (
      <span className={`font-mono ${
        (info.getValue() as number) > 80 ? 'text-[color:var(--color-crit)]' : ''
      }`}>{info.getValue() as number}</span>
  ) },
  { accessorKey: "velocity", header: "Momentum (7d)", cell: (info) => {
      const val = info.getValue() as string;
      const isPositive = val.startsWith('+');
      return (
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[10px] w-12 ${isPositive ? 'text-[color:var(--color-warn)]' : 'text-[color:var(--color-ok)]'}`}>
            {val}
          </span>
          <Sparkline 
            data={Array.from({length: 7}, () => Math.random() * 100 + (isPositive ? 50 : 0))} 
            color={isPositive ? 'var(--color-warn)' : 'var(--color-ok)'} 
          />
        </div>
      );
  } },
];

function NarrativesPage() {
  const [loading, setLoading] = useState(true);
  const [narratives, setNarratives] = useState<Narrative[]>([]);

  useEffect(() => {
    const q = query(narrativesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Narrative[];
      setNarratives(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <PageLoader />;

  const handleCreateNarrative = async () => {
    const title = window.prompt("Enter core narrative claim:");
    if (!title) return;
    
    setLoading(true);
    try {
      const newId = `NAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(narrativesRef, newId), {
        title,
        activeClaims: 1,
        sources: 1,
        riskScore: 50,
        velocity: "+0%/hr",
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error(e);
      window.alert("Failed to create narrative.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Narrative Intelligence</h1>
          <p className="text-muted-foreground mt-1">Clustered semantic claims and their evolution.</p>
        </div>
        <button 
          onClick={handleCreateNarrative}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium"
        >
          Create Narrative
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
          <div className="lg:col-span-2 border border-border bg-card p-4 glass">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Narrative Lifecycle Growth Curves</h2>
            <ActivityTimelineChart 
              data={[
                { date: "Mon", clusterA: 120, clusterB: 40 },
                { date: "Tue", clusterA: 132, clusterB: 80 },
                { date: "Wed", clusterA: 101, clusterB: 150 },
                { date: "Thu", clusterA: 145, clusterB: 220 },
                { date: "Fri", clusterA: 190, clusterB: 180 },
                { date: "Sat", clusterA: 210, clusterB: 100 },
                { date: "Sun", clusterA: 180, clusterB: 80 },
              ]}
              xKey="date"
              yKeys={[
                { key: "clusterA", color: "var(--color-accent)" },
                { key: "clusterB", color: "var(--color-warn)" }
              ]}
              height={180}
            />
          </div>
          
          <div className="border border-border bg-card p-4 glass flex flex-col">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Source Platform Contribution</h2>
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { platform: "Social X", tier1: 40, tier2: 24, bot: 80 },
                  { platform: "Forums", tier1: 20, tier2: 45, bot: 10 },
                  { platform: "News", tier1: 80, tier2: 10, bot: 5 },
                  { platform: "DarkWeb", tier1: 10, tier2: 60, bot: 40 }
                ]} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="platform" tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', fontSize: '11px' }} />
                  <Bar dataKey="bot" stackId="a" fill="var(--color-crit)" />
                  <Bar dataKey="tier2" stackId="a" fill="var(--color-warn)" />
                  <Bar dataKey="tier1" stackId="a" fill="var(--color-accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="border border-border bg-card rounded-sm overflow-hidden">
          <DataTable columns={columns} data={narratives} />
        </div>
      </div>
    </div>
  );
}
