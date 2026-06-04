import { useEffect, useState } from "react";

function Bars() {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 20 + Math.random() * 80),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setBars((b) => [...b.slice(1), 20 + Math.random() * 80]);
    }, 400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-24 items-end gap-[3px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-foreground"
          style={{ height: `${h}%`, opacity: 0.35 + (i / bars.length) * 0.65 }}
        />
      ))}
    </div>
  );
}

function Dist() {
  const segs = [
    { k: "LOW", v: 58, c: "var(--color-ok)" },
    { k: "MED", v: 22, c: "var(--color-warn)" },
    { k: "HIGH", v: 14, c: "var(--color-signal)" },
    { k: "CRIT", v: 6, c: "var(--color-crit)" },
  ];
  return (
    <div>
      <div className="flex h-6 w-full overflow-hidden border border-border">
        {segs.map((s) => (
          <div key={s.k} style={{ width: `${s.v}%`, backgroundColor: s.c }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2 font-mono text-[11px]">
        {segs.map((s) => (
          <div key={s.k} className="flex items-center justify-between border border-border px-2 py-1">
            <span className="text-muted-foreground">{s.k}</span>
            <span>{s.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Metrics() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
      <div className="bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          throughput.msg_per_sec · 24h
        </div>
        <div className="mt-2 font-display text-3xl font-semibold">1,284<span className="text-accent">/m</span></div>
        <div className="mt-4"><Bars /></div>
      </div>
      <div className="bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          latency · p50 / p95 / p99
        </div>
        <div className="mt-2 font-display text-3xl font-semibold">
          218 <span className="text-muted-foreground">/</span> 612 <span className="text-muted-foreground">/</span> 940
          <span className="ml-1 text-base text-muted-foreground">ms</span>
        </div>
        <div className="mt-4 space-y-1 font-mono text-[11px]">
          {[
            ["retrieve", 38],
            ["verify", 72],
            ["analyze", 412],
            ["score+persist", 96],
          ].map(([k, v]) => (

            <div key={k as string} className="flex items-center gap-3">
              <span className="w-32 text-muted-foreground">{k}</span>
              <div className="h-1.5 flex-1 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: `${(v as number) / 5}%` }} />
              </div>
              <span className="w-10 text-right">{v}ms</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          risk.distribution · rolling 1h
        </div>
        <div className="mt-2 font-display text-3xl font-semibold">
          0.91<span className="text-accent">/1</span>{" "}
          <span className="text-sm text-muted-foreground">f1</span>
        </div>
        <div className="mt-4"><Dist /></div>
      </div>
    </div>
  );
}
