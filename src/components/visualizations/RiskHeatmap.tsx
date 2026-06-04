export function RiskHeatmap({ data }: { data: { label: string; values: number[] }[] }) {
  // Simple grid based heatmap
  return (
    <div className="flex flex-col gap-1 w-full">
      {data.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-16 text-[9px] uppercase tracking-widest text-muted-foreground truncate">{row.label}</div>
          <div className="flex-1 flex gap-1">
            {row.values.map((v, j) => {
              let bg = 'bg-secondary/30';
              if (v > 80) bg = 'bg-[color:var(--color-crit)]';
              else if (v > 50) bg = 'bg-[color:var(--color-warn)]';
              else if (v > 20) bg = 'bg-[color:var(--color-accent)] opacity-60';
              else if (v > 0) bg = 'bg-[color:var(--color-accent)] opacity-20';
              
              return (
                <div 
                  key={j} 
                  className={`flex-1 h-4 rounded-[1px] ${bg} transition-colors duration-500 hover:opacity-100 hover:ring-1 ring-border`}
                  title={`Value: ${v}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
