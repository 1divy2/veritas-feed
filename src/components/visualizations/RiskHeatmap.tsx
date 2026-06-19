import { useState, useRef, useCallback } from "react";

interface HeatmapProps {
  data: { label: string; values: number[] }[];
  hours?: string[];
}

function getColor(v: number): string {
  if (v > 80) return "var(--color-crit)";
  if (v > 50) return "var(--color-warn)";
  if (v > 20) return "var(--color-accent)";
  if (v > 0) return "color-mix(in oklab, var(--color-accent) 30%, transparent)";
  return "var(--color-secondary)";
}

export function RiskHeatmap({ data, hours }: HeatmapProps) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; topic: string; hour: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const h = hours ?? defaultHours;

  const handleCell = useCallback((row: number, col: number, e: React.MouseEvent) => {
    setHover({ row, col });
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setTooltip({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
        value: data[row]?.values[col] ?? 0,
        topic: data[row]?.label ?? "",
        hour: h[col] ?? "",
      });
    }
  }, [data, h]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Crosshair lines */}
      {hover && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div
            className="absolute top-0 bottom-0 w-px bg-foreground/10"
            style={{ left: `${((hover.col + 0.5) / h.length) * 100}%` }}
          />
          <div
            className="absolute left-0 right-0 h-px bg-foreground/10"
            style={{ top: `${((hover.row + 0.5) / data.length) * 100}%` }}
          />
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="border border-border bg-card px-2 py-1 text-[10px] shadow-lg glass-strong">
            <div className="font-medium text-foreground">{tooltip.topic}</div>
            <div className="text-muted-foreground">{tooltip.hour} — risk <span className="text-foreground">{tooltip.value}</span></div>
          </div>
        </div>
      )}

      {/* Hour labels */}
      <div className="flex items-center gap-0 mb-1">
        <div className="w-16 shrink-0" />
        <div className="flex-1 flex">
          {h.map((hour, i) => (
            <div key={i} className="flex-1 text-[8px] text-muted-foreground text-center">
              {i % 4 === 0 ? hour.slice(0, 2) : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex flex-col gap-0.5">
        {data.map((row, ri) => (
          <div key={ri} className="flex items-center gap-0.5">
            <div className="w-16 text-[9px] uppercase tracking-widest text-muted-foreground truncate shrink-0 pr-2 text-right">
              {row.label}
            </div>
            <div className="flex-1 flex gap-px">
              {row.values.map((v, ci) => (
                <div
                  key={ci}
                  className="flex-1 h-5 rounded-[1px] transition-all duration-150 hover:ring-1 hover:ring-foreground/30 cursor-crosshair"
                  style={{
                    backgroundColor: getColor(v),
                    opacity: v === 0 ? 0.3 : 1,
                  }}
                  onMouseEnter={(e) => handleCell(ri, ci, e)}
                  onMouseMove={(e) => handleCell(ri, ci, e)}
                  onMouseLeave={() => { setHover(null); setTooltip(null); }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">risk</span>
        {[
          { label: "0-20", color: getColor(10) },
          { label: "20-50", color: getColor(30) },
          { label: "50-80", color: getColor(60) },
          { label: "80+", color: getColor(90) },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-3 h-2 rounded-[1px]" style={{ backgroundColor: l.color }} />
            <span className="text-[9px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
