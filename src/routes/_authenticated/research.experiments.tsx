import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { auditLogsRef, experimentsRef, ExperimentData } from "@/lib/db";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/research/experiments")({
  component: ExperimentsPage,
});

function ExperimentsPage() {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<ExperimentData[]>([]);

  useEffect(() => {
    const q = query(experimentsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQueue(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExperimentData[]);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNewExperiment = async () => {
    const title = window.prompt("Enter new experiment title:");
    if (!title) return;
    
    setLoading(true);
    const newId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
    
    try {
      await setDoc(doc(experimentsRef, newId), {
        title,
        status: "Draft",
        highlight: false,
        createdAt: Date.now()
      });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: "EXPERIMENT_CREATED",
        actor: "System",
        target: newId,
        changes: `Created experiment: ${title}`,
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch (e) {
      console.error(e);
      window.alert("Failed to create experiment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">A/B Experiments & Research</h1>
          <p className="text-muted-foreground mt-1 text-sm">Compare scoring models, retrieval strategies, and prompt chains scientifically.</p>
        </div>
        <button 
          onClick={handleNewExperiment}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium rounded-sm"
        >
          New Experiment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          <div className="lg:col-span-2 border border-border bg-card p-5 rounded-sm hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-accent">Active Evaluation: Llama-3 vs Mistral-Nemo</h2>
              <span className="px-2 py-0.5 bg-secondary/50 text-[10px] rounded border border-border">EXP-0992</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Evaluating narrative extraction capabilities on historical Q3 dataset. Measuring F1 score, latency, and hallucination rate.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col border border-border/50 p-3 bg-secondary/10 rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Precision (L3)</span>
                <span className="text-2xl font-mono text-foreground">94.2%</span>
                <span className="text-[10px] text-[color:var(--color-ok)] mt-1">+1.4% vs baseline</span>
              </div>
              <div className="flex flex-col border border-border/50 p-3 bg-secondary/10 rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Precision (MN)</span>
                <span className="text-2xl font-mono text-foreground">92.8%</span>
                <span className="text-[10px] text-muted-foreground mt-1">baseline</span>
              </div>
              <div className="flex flex-col border border-border/50 p-3 bg-secondary/10 rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Latency Avg</span>
                <span className="text-2xl font-mono text-foreground">1.4s</span>
                <span className="text-[10px] text-[color:var(--color-warn)] mt-1">L3 is 200ms slower</span>
              </div>
            </div>

            <div className="h-4 w-full bg-secondary rounded-sm overflow-hidden flex">
              <div className="h-full bg-accent" style={{ width: '65%' }}></div>
              <div className="h-full bg-border" style={{ width: '35%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
              <span>6,500 samples evaluated</span>
              <span>10,000 total</span>
            </div>
          </div>

          <div className="border border-border bg-card p-5 rounded-sm flex flex-col gap-4 hover-glow">
            <h2 className="text-sm font-semibold tracking-wide uppercase">Experiment Queue</h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              {queue.map(exp => (
                <div key={exp.id} className="border border-border/50 p-3 bg-secondary/5 rounded-sm hover:border-accent/50 cursor-pointer transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground">{exp.id}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-sm border ${
                      exp.status === 'Completed' ? 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]' :
                      exp.status === 'Queued' ? 'border-accent text-accent' : 'border-border text-muted-foreground'
                    }`}>{exp.status}</span>
                  </div>
                  <h3 className={`text-[12px] font-medium ${exp.highlight ? 'text-accent' : ''}`}>{exp.title}</h3>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
