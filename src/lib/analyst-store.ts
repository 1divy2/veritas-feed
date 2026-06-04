// Local-only analyst workspace store. TODO: sync to backend audit trail.
export type CaseStatus = "open" | "in_review" | "resolved" | "escalated";

type CaseMeta = {
  notes?: string;
  status?: CaseStatus;
  bookmarked?: boolean;
  tags?: string[];
};

const KEY = "veritas.analyst";

function read(): Record<string, CaseMeta> {
  if (typeof localStorage === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function write(v: Record<string, CaseMeta>) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
}

export const analystStore = {
  get(id: string): CaseMeta { return read()[id] ?? {}; },
  set(id: string, patch: Partial<CaseMeta>) {
    const all = read();
    all[id] = { ...all[id], ...patch };
    write(all);
  },
  all: read,
};
