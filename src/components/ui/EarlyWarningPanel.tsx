export function EarlyWarningPanel() {
  const warnings = [
    { type: "NARRATIVE_SPIKE", title: "Retail Bank Freeze", metric: "+314% velocity (bot-driven)", time: "2m ago" },
    { type: "DEEPFAKE_ALERT", title: "Election Official Audio", metric: "98.4% synthetic probability", time: "14m ago" },
    { type: "COORDINATED_INAUTHENTIC", title: "Operation 'Grid Down'", metric: "12,400 linked accounts", time: "1h ago" },
  ];

  return (
    <div className="border border-[color:var(--color-warn)] bg-[color:var(--color-warn)]/10 p-3 mb-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[color:var(--color-warn)] mb-2">
        <span className="size-1.5 bg-current rounded-full animate-pulse" />
        Early Warning System
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {warnings.map((w, i) => (
          <div key={i} className="flex flex-col border-l-2 border-[color:var(--color-warn)]/50 pl-2">
            <span className="text-[11px] font-medium text-foreground">{w.title}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{w.metric} · {w.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
