import { Sparkline } from "./Sparkline";

export function StatTile({
  label, value, sub, trend, accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number[];
  accent?: "default" | "warn" | "crit" | "ok";
}) {
  const color =
    accent === "warn" ? "text-[color:var(--color-warn)]" :
    accent === "crit" ? "text-[color:var(--color-crit)]" :
    accent === "ok" ? "text-[color:var(--color-ok)]" : "text-foreground";
  return (
    <div className="border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <div className={`text-2xl ${color}`}>{value}</div>
        {trend && <Sparkline values={trend} width={84} height={22} />}
      </div>
      {sub && <div className="mt-2 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
