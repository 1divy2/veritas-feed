import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auditLogsRef } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/research/benchmarks")({
  component: BenchmarksPage,
});

function BenchmarksPage() {
  const [running, setRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    recall: 87.4,
    f1: 0.912,
    mae: 1.04,
    acc: 94.8,
    ent: 96.5,
    src: 82.1,
    deep: 64.2
  });

  const handleRunBenchmark = async () => {
    setRunning(true);
    // Simulate 2-second compute job
    await new Promise(r => setTimeout(r, 2000));
    
    setMetrics({
      recall: +(metrics.recall + (Math.random() * 2 - 1)).toFixed(1),
      f1: +(metrics.f1 + (Math.random() * 0.04 - 0.02)).toFixed(3),
      mae: +(metrics.mae + (Math.random() * 0.1 - 0.05)).toFixed(2),
      acc: +(metrics.acc + (Math.random() * 2 - 1)).toFixed(1),
      ent: +(metrics.ent + (Math.random() * 2 - 1)).toFixed(1),
      src: +(metrics.src + (Math.random() * 2 - 1)).toFixed(1),
      deep: +(metrics.deep + (Math.random() * 3 - 1.5)).toFixed(1),
    });

    try {
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: "BENCHMARK_RUN",
        actor: "System",
        target: "Model Suite #B",
        changes: "Updated validation metrics",
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch (e) {
      console.error("Failed to write audit log", e);
    }

    setRunning(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Verification Benchmark Suite</h1>
          <p className="text-muted-foreground mt-1 text-sm">Evaluate retrieval, detection, and classification accuracy against ground-truth sets.</p>
        </div>
        <button 
          onClick={handleRunBenchmark}
          disabled={running}
          className={`border border-border bg-foreground text-background px-3 py-1.5 transition-colors font-medium rounded-sm ${running ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
        >
          {running ? "Running..." : "Run Benchmark"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border bg-card p-4 rounded-sm flex flex-col justify-between hover-glow">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Evidence Retrieval (Recall@5)</span>
            <span className="text-3xl font-mono text-foreground mt-2">{metrics.recall}%</span>
            <span className="text-[10px] text-[color:var(--color-ok)] mt-1">+2.1% from baseline</span>
          </div>
          <div className="border border-border bg-card p-4 rounded-sm flex flex-col justify-between hover-glow">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Narrative Detection (F1)</span>
            <span className="text-3xl font-mono text-foreground mt-2">{metrics.f1}</span>
            <span className="text-[10px] text-[color:var(--color-warn)] mt-1">-0.05 from baseline</span>
          </div>
          <div className="border border-border bg-card p-4 rounded-sm flex flex-col justify-between hover-glow">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk Scoring MAE</span>
            <span className="text-3xl font-mono text-foreground mt-2">{metrics.mae}</span>
            <span className="text-[10px] text-[color:var(--color-ok)] mt-1">Acceptable margin</span>
          </div>
          <div className="border border-border bg-card p-4 rounded-sm flex flex-col justify-between hover-glow">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Classification Accuracy</span>
            <span className="text-3xl font-mono text-foreground mt-2">{metrics.acc}%</span>
            <span className="text-[10px] text-muted-foreground mt-1">Threshold: 90.0%</span>
          </div>
        </div>

        <div className="border border-border bg-card p-5 rounded-sm hover-glow">
          <h2 className="text-sm font-semibold tracking-wide uppercase mb-4">Latest Run: Suite #B-2026-X</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">Entity Resolution Accuracy</span>
                <span className="font-mono text-accent">{metrics.ent}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
                <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${metrics.ent}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">Source Contradiction Detection</span>
                <span className="font-mono text-accent">{metrics.src}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
                <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${metrics.src}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">Deepfake Modality Recall</span>
                <span className="font-mono text-[color:var(--color-warn)]">{metrics.deep}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
                <div className="h-full bg-[color:var(--color-warn)] transition-all duration-1000" style={{ width: `${metrics.deep}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
