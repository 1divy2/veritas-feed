import { useEffect, useState } from "react";

const STAGES = [
  { k: "INGEST", sub: "event bus", note: "kafka-compatible stream" },
  { k: "RETRIEVE", sub: "evidence store", note: "top-k vector search" },
  { k: "VERIFY", sub: "hybrid model", note: "tfidf · cosine · contradiction" },
  { k: "ANALYZE", sub: "verification engine", note: "on-device adjudication" },
  { k: "SCORE", sub: "risk engine", note: "0–100 weighted composite" },
  { k: "PERSIST", sub: "audit store", note: "postgres · sqlalchemy" },
];


export function Pipeline() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-2 font-mono text-xs uppercase tracking-widest">
        pipeline.trace
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6">
        {STAGES.map((s, idx) => {
          const isActive = idx === active;
          return (
            <div
              key={s.k}
              className={`relative border-border p-4 md:border-r last:md:border-r-0 ${
                isActive ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
                stage_{String(idx).padStart(2, "0")}
              </div>
              <div className="mt-1 font-display text-xl font-semibold leading-tight">{s.k}</div>
              <div className="font-mono text-[11px] uppercase tracking-widest">{s.sub}</div>
              <div className="mt-2 text-[11px] leading-snug text-muted-foreground">
                {isActive ? <span className="text-accent-foreground">{s.note}</span> : s.note}
              </div>
              {isActive && (
                <div className="absolute right-2 top-2 size-2 rounded-full bg-[color:var(--color-ink)] blink" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
