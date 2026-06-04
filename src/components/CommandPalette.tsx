import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getDocs } from "firebase/firestore";
import { casesRef, watchlistsRef, narrativesRef, CaseData, WatchlistData, NarrativeData } from "@/lib/db";

type Item = {
  id: string;
  kind: "case" | "source" | "topic" | "entity" | "narrative" | "nav";
  label: string;
  sub?: string;
  go: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const [dbData, setDbData] = useState<{cases: (CaseData & {id:string})[], watchlists: (WatchlistData & {id:string})[], narratives: (NarrativeData & {id:string})[]}>({ cases: [], watchlists: [], narratives: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const [cSnap, wSnap, nSnap] = await Promise.all([
          getDocs(casesRef), getDocs(watchlistsRef), getDocs(narrativesRef)
        ]);
        setDbData({
          cases: cSnap.docs.map(d => ({id: d.id, ...d.data()})),
          watchlists: wSnap.docs.map(d => ({id: d.id, ...d.data()})),
          narratives: nSnap.docs.map(d => ({id: d.id, ...d.data()})),
        });
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const items = useMemo<Item[]>(() => {
    const nav$ = (to: string, label: string): Item => ({
      id: "nav:" + to, kind: "nav", label, go: () => nav({ to: to as never }),
    });
    return [
      nav$("/workspace/live", "Live Feed"),
      nav$("/workspace/investigations", "Investigations"),
      nav$("/workspace/watchlists", "Watchlists"),
      nav$("/workspace/narratives", "Narratives"),
      nav$("/workspace/tasks", "Tasks"),
      nav$("/operations/analytics", "Analytics"),
      ...dbData.cases.map<Item>((c) => ({
        id: "c:" + c.id, kind: "case", label: c.title, sub: `${c.id} · ${c.status} · Priority ${c.priority}`,
        go: () => nav({ to: `/workspace/investigations/${c.id}` as never }),
      })),
      ...dbData.watchlists.map<Item>((w) => ({
        id: "w:" + w.id, kind: "entity", label: w.name, sub: `${w.type} · risk ${w.riskTrend}`,
        go: () => nav({ to: "/workspace/watchlists" as never }),
      })),
      ...dbData.narratives.map<Item>((n) => ({
        id: "n:" + n.id, kind: "narrative", label: n.title, sub: `${n.activeClaims} claims`,
        go: () => nav({ to: "/workspace/narratives" as never }),
      })),
    ];
  }, [dbData, nav]);

  const filtered = useMemo(() => {
    if (!q) return items.slice(0, 30);
    const lc = q.toLowerCase();
    return items
      .map((it) => {
        const hay = (it.label + " " + (it.sub ?? "") + " " + it.kind).toLowerCase();
        const idx = hay.indexOf(lc);
        return idx === -1 ? null : { it, score: idx };
      })
      .filter((x): x is { it: Item; score: number } => !!x)
      .sort((a, b) => a.score - b.score)
      .slice(0, 40)
      .map((x) => x.it);
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ(""); setSel(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 backdrop-blur-sm pt-24"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[640px] max-w-[92vw] border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="text-[10px] uppercase tracking-widest text-accent">⌘k</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              else if (e.key === "Enter") {
                const it = filtered[sel];
                if (it) { it.go(); setOpen(false); }
              }
            }}
            placeholder="search cases, sources, topics, entities, narratives…"
            className="w-full bg-transparent text-[13px] focus:outline-none"
          />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">esc</span>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
              no matches
            </div>
          )}
          {filtered.map((it, i) => (
            <button
              key={it.id}
              onMouseEnter={() => setSel(i)}
              onClick={() => { it.go(); setOpen(false); }}
              className={`flex w-full items-center justify-between gap-3 border-b border-border px-3 py-2 text-left text-[12px] ${
                i === sel ? "bg-secondary" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className={i === sel ? "text-accent" : ""}>{it.kind}</span>
                </div>
                <div className="mt-0.5 truncate text-foreground">{it.label}</div>
                {it.sub && <div className="truncate text-[11px] text-muted-foreground">{it.sub}</div>}
              </div>
              {i === sel && <span className="text-[10px] uppercase tracking-widest text-accent">↵</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>↑ ↓ navigate · ↵ open</span>
          <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}
