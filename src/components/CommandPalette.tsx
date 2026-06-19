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

const RECENT_KEY = "veritas_cmd_recent";
const MAX_RECENT = 5;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch { return []; }
}

function saveRecent(id: string) {
  const recent = getRecent().filter(r => r !== id);
  recent.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function fuzzyMatch(query: string, text: string): { match: boolean; indices: Set<number> } {
  const lq = query.toLowerCase();
  const lt = text.toLowerCase();
  const indices = new Set<number>();
  let qi = 0;
  for (let ti = 0; ti < lt.length && qi < lq.length; ti++) {
    if (lt[ti] === lq[qi]) {
      indices.add(ti);
      qi++;
    }
  }
  return { match: qi === lq.length, indices };
}

function HighlightedText({ text, indices }: { text: string; indices: Set<number> }) {
  if (indices.size === 0) return <>{text}</>;
  return (
    <>
      {text.split("").map((char, i) => (
        indices.has(i) ? <span key={i} className="text-accent font-medium">{char}</span> : <span key={i}>{char}</span>
      ))}
    </>
  );
}

const KIND_ICONS: Record<Item["kind"], string> = {
  nav: "→",
  case: "◈",
  entity: "◉",
  narrative: "◎",
  source: "◇",
  topic: "△",
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
      id: "nav:" + to, kind: "nav", label, go: () => { saveRecent("nav:" + to); nav({ to: to as never }); },
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
        go: () => { saveRecent("c:" + c.id); nav({ to: `/workspace/investigations/${c.id}` as never }); },
      })),
      ...dbData.watchlists.map<Item>((w) => ({
        id: "w:" + w.id, kind: "entity", label: w.name, sub: `${w.type} · risk ${w.riskTrend}`,
        go: () => { saveRecent("w:" + w.id); nav({ to: "/workspace/watchlists" as never }); },
      })),
      ...dbData.narratives.map<Item>((n) => ({
        id: "n:" + n.id, kind: "narrative", label: n.title, sub: `${n.activeClaims} claims`,
        go: () => { saveRecent("n:" + n.id); nav({ to: "/workspace/narratives" as never }); },
      })),
    ];
  }, [dbData, nav]);

  const recentIds = useMemo(() => getRecent(), [open]);

  const filtered = useMemo(() => {
    if (!q) {
      // Show recent first, then nav items
      const recent = recentIds
        .map(id => items.find(it => it.id === id))
        .filter(Boolean) as Item[];
      const navItems = items.filter(it => it.kind === "nav").slice(0, 8);
      return [...recent, ...navItems.filter(n => !recent.some(r => r.id === n.id))].slice(0, 20);
    }
    const results: { it: Item; score: number; indices: Set<number> }[] = [];
    for (const it of items) {
      const hay = it.label + " " + (it.sub ?? "");
      const { match, indices } = fuzzyMatch(q, hay);
      if (match) results.push({ it, score: indices.size > 0 ? 1 / indices.size : 0, indices });
    }
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(x => x.it);
  }, [q, items, recentIds]);

  // Group by kind for display
  const grouped = useMemo(() => {
    const groups: { kind: string; items: Item[] }[] = [];
    const map = new Map<string, Item[]>();
    for (const it of filtered) {
      if (!map.has(it.kind)) map.set(it.kind, []);
      map.get(it.kind)!.push(it);
    }
    for (const [kind, items] of map) {
      groups.push({ kind, items });
    }
    return groups;
  }, [filtered]);

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 backdrop-blur-sm pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[640px] max-w-[92vw] border border-border bg-card shadow-2xl scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
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
            placeholder="search cases, entities, narratives, pages..."
            className="w-full bg-transparent text-[13px] focus:outline-none placeholder:text-muted-foreground/50"
          />
          <kbd className="font-sans px-1.5 py-0.5 border border-border rounded-sm bg-secondary text-[10px] text-muted-foreground shrink-0">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
              no matches
            </div>
          )}

          {/* Recent searches (only when no query) */}
          {!q && recentIds.length > 0 && filtered.some(it => recentIds.includes(it.id)) && (
            <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground/60">
              recent
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.kind}>
              <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground/60 border-t border-border/50 first:border-t-0 first:pt-1">
                {group.kind}
              </div>
              {group.items.map((it) => {
                const globalIdx = filtered.indexOf(it);
                return (
                  <button
                    key={it.id}
                    onMouseEnter={() => setSel(globalIdx)}
                    onClick={() => { it.go(); setOpen(false); }}
                    className={`flex w-full items-center gap-3 border-b border-border/50 px-3 py-2 text-left text-[12px] transition-colors ${
                      globalIdx === sel ? "bg-secondary" : ""
                    }`}
                  >
                    <span className={`text-[11px] w-4 text-center shrink-0 ${globalIdx === sel ? "text-accent" : "text-muted-foreground"}`}>
                      {KIND_ICONS[it.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-foreground">{it.label}</div>
                      {it.sub && <div className="truncate text-[11px] text-muted-foreground">{it.sub}</div>}
                    </div>
                    {globalIdx === sel && (
                      <kbd className="font-sans px-1.5 py-0.5 border border-border rounded-sm bg-secondary text-[10px] text-muted-foreground shrink-0">
                        ↵
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="font-sans">↑↓</kbd> navigate</span>
            <span><kbd className="font-sans">↵</kbd> open</span>
          </div>
          <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}
