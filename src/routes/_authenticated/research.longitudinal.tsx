import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/research/longitudinal")({
  component: LongitudinalPage,
});

function LongitudinalPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Longitudinal Analysis</h1>
          <p className="text-muted-foreground mt-1 text-sm">Historical intelligence reviews across months and years.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-background border border-border p-1.5 text-[12px] rounded-sm focus:outline-none focus:border-accent">
            <option>2026 Q1</option>
            <option>2025 Q4</option>
            <option>2025 Q3</option>
            <option>2025 Q2</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border bg-card p-5 rounded-sm hover-glow flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase">Persistent Narratives</h2>
            <div className="space-y-3">
              {[
                { name: "Synthetic Fuel Suppression", duration: "14 months", trend: "stable" },
                { name: "Central Bank Digital Currency Overreach", duration: "8 months", trend: "up" },
                { name: "Electoral Process Tampering", duration: "24 months", trend: "down" },
              ].map((n, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border/50 pb-2">
                  <span className="text-[12px] text-foreground">{n.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground">{n.duration}</span>
                    <span className={`text-[10px] uppercase ${n.trend === 'up' ? 'text-[color:var(--color-crit)]' : n.trend === 'down' ? 'text-[color:var(--color-ok)]' : 'text-muted-foreground'}`}>
                      {n.trend === 'up' ? '↗' : n.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-card p-5 rounded-sm hover-glow flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase">Source Shifts</h2>
            <div className="space-y-3">
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Migration analysis indicates a 42% decrease in bot-driven amplification on <strong>X/Twitter</strong>, offset by a 68% volume increase in encrypted <strong>Telegram</strong> channels over the selected period.
              </p>
              <div className="flex gap-2 h-24 items-end pt-4 border-b border-border/50">
                <div className="flex-1 bg-accent/20 hover:bg-accent/40 transition-colors relative" style={{ height: '100%' }}>
                  <span className="absolute -top-4 text-[9px] text-muted-foreground left-1/2 -translate-x-1/2">Telegram</span>
                </div>
                <div className="flex-1 bg-[color:var(--color-warn)]/20 hover:bg-[color:var(--color-warn)]/40 transition-colors relative" style={{ height: '60%' }}>
                  <span className="absolute -top-4 text-[9px] text-muted-foreground left-1/2 -translate-x-1/2">X/Twitter</span>
                </div>
                <div className="flex-1 bg-[color:var(--color-crit)]/20 hover:bg-[color:var(--color-crit)]/40 transition-colors relative" style={{ height: '30%' }}>
                  <span className="absolute -top-4 text-[9px] text-muted-foreground left-1/2 -translate-x-1/2">DarkWeb</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
