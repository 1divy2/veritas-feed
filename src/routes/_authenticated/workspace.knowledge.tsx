import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { EvidenceNetwork, ActivityTimelineChart } from "@/components/visualizations";
import { knowledgeRef, KnowledgeData } from "@/lib/db";
import { query, orderBy, onSnapshot } from "firebase/firestore";

export const Route = createFileRoute("/_authenticated/workspace/knowledge")({
  component: KnowledgePage,
});

const columns: ColumnDef<KnowledgeData>[] = [
  { accessorKey: "type", header: "Type", cell: (info) => <span className="text-[10px] uppercase tracking-widest border border-border px-1 bg-secondary">{info.getValue() as string}</span> },
  { accessorKey: "title", header: "Title", cell: (info) => <span className="font-medium hover:underline cursor-pointer">{info.getValue() as string}</span> },
  { accessorKey: "author", header: "Author", cell: (info) => <span className="font-mono text-muted-foreground">{info.getValue() as string}</span> },
  { accessorKey: "date", header: "Published", cell: (info) => <span className="font-mono">{info.getValue() as string}</span> },
];

function KnowledgePage() {
  const [loading, setLoading] = useState(true);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeData[]>([]);

  useEffect(() => {
    const q = query(knowledgeRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setKnowledgeList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as KnowledgeData[]);
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
          <h1 className="text-lg font-medium">Knowledge Graph Explorer</h1>
          <p className="text-muted-foreground mt-1">Visually explore entity relationships and thematic intersections.</p>
        </div>
        <div className="flex gap-2">
          <input 
            placeholder="Search repository..." 
            className="border border-border bg-background px-3 py-1.5 text-[12px] focus:outline-none focus:border-accent w-64"
          />
          <button 
            onClick={() => window.alert('Graph sync initiated. This may take a few minutes.')}
            className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium"
          >
            Sync Graph
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 shrink-0">
          <div className="xl:col-span-2 border border-border bg-card p-4 glass">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Global Semantic Network</h2>
            <div className="w-full h-[300px]">
               <EvidenceNetwork />
            </div>
          </div>
          
          <div className="border border-border bg-card p-4 glass flex flex-col">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Entity Mention Frequency</h2>
            <ActivityTimelineChart 
              data={[
                { date: "M1", entityA: 400, entityB: 240, entityC: 240 },
                { date: "M2", entityA: 300, entityB: 139, entityC: 221 },
                { date: "M3", entityA: 200, entityB: 980, entityC: 229 },
                { date: "M4", entityA: 278, entityB: 390, entityC: 200 },
                { date: "M5", entityA: 189, entityB: 480, entityC: 218 },
                { date: "M6", entityA: 239, entityB: 380, entityC: 250 },
                { date: "M7", entityA: 349, entityB: 430, entityC: 210 },
              ]}
              xKey="date"
              yKeys={[
                { key: "entityA", color: "var(--color-accent)" },
                { key: "entityB", color: "var(--color-warn)" },
                { key: "entityC", color: "var(--color-ok)" }
              ]}
              height={260}
            />
          </div>
        </div>

        <div className="border border-border bg-card rounded-sm overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground">Index Documents</h2>
          </div>
          <DataTable columns={columns} data={knowledgeList} />
        </div>
      </div>
    </div>
  );
}
