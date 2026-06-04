// Subtle monochrome cartography. Continents as low-detail polygons; signals
// plotted as risk-weighted dots. No external GIS / Mapbox dependencies.
import { useState } from "react";

export type Signal = {
  id: string;
  label: string;
  x: number;       // 0..1 longitude normalized
  y: number;       // 0..1 latitude normalized (0 = north)
  count: number;
  risk: number;    // 0..100
  region: string;
};

const CONTINENTS = [
  // Crude polygons in 1000x500 viewport. Intentionally low-detail.
  { id: "na", d: "M120,110 L260,90 L300,140 L290,210 L210,240 L150,210 L110,170 Z" },
  { id: "sa", d: "M250,250 L310,250 L320,330 L290,400 L250,390 L240,320 Z" },
  { id: "eu", d: "M460,110 L560,100 L580,150 L540,180 L470,170 Z" },
  { id: "af", d: "M470,200 L580,200 L610,290 L560,370 L490,360 L470,280 Z" },
  { id: "as", d: "M580,90 L820,80 L860,170 L780,230 L640,210 L580,160 Z" },
  { id: "oc", d: "M780,310 L880,310 L900,360 L820,380 L770,360 Z" },
];

export function WorldMap({ signals, filterRegion, onPick }: {
  signals: Signal[];
  filterRegion?: string;
  onPick?: (s: Signal) => void;
}) {
  const [hover, setHover] = useState<Signal | null>(null);
  const visible = filterRegion ? signals.filter((s) => s.region === filterRegion) : signals;
  return (
    <div className="relative">
      <svg viewBox="0 0 1000 500" className="block w-full">
        {/* graticule */}
        <g stroke="var(--color-grid)" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={500} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 100} x2={1000} y2={i * 100} />
          ))}
        </g>
        {/* continents */}
        <g fill="var(--color-secondary)" stroke="var(--color-border)" strokeWidth="1">
          {CONTINENTS.map((c) => <path key={c.id} d={c.d} />)}
        </g>
        {/* signals */}
        <g>
          {visible.map((s) => {
            const cx = s.x * 1000;
            const cy = s.y * 500;
            const r = 3 + Math.min(14, Math.sqrt(s.count));
            const color =
              s.risk > 80 ? "var(--color-crit)" :
              s.risk > 50 ? "var(--color-warn)" : "var(--color-ok)";
            return (
              <g
                key={s.id}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPick?.(s)}
                style={{ cursor: onPick ? "pointer" : "default" }}
              >
                <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.18} stroke={color} />
                <circle cx={cx} cy={cy} r={1.5} fill={color} />
              </g>
            );
          })}
        </g>
      </svg>
      {hover && (
        <div className="pointer-events-none absolute right-3 top-3 border border-border bg-background/95 px-3 py-2 font-mono text-[11px]">
          <div className="text-foreground">{hover.label}</div>
          <div className="text-muted-foreground">
            count {hover.count} · risk {hover.risk} · {hover.region}
          </div>
        </div>
      )}
    </div>
  );
}
