import { useEffect, useState, useRef } from "react";

const STAGES = [
  { k: "INGEST", sub: "event bus", note: "kafka-compatible stream", latency: "12ms" },
  { k: "RETRIEVE", sub: "evidence store", note: "top-k vector search", latency: "23ms" },
  { k: "VERIFY", sub: "hybrid model", note: "tfidf · cosine · contradiction", latency: "89ms" },
  { k: "ANALYZE", sub: "verification engine", note: "on-device adjudication", latency: "171ms" },
  { k: "SCORE", sub: "risk engine", note: "0-100 weighted composite", latency: "8ms" },
  { k: "PERSIST", sub: "audit store", note: "postgres · sqlalchemy", latency: "14ms" },
];

function AnimatedPackets({ pathRef }: { pathRef: React.RefObject<SVGPathElement | null> }) {
  const [packets, setPackets] = useState<{ id: number; offset: number; color: string }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      counter.current += 1;
      const colors = ["var(--color-accent)", "var(--color-ok)", "var(--color-info)"];
      setPackets(prev => [
        ...prev.filter(p => p.offset < 1).map(p => ({ ...p, offset: p.offset + 0.008 })),
        { id: counter.current, offset: 0, color: colors[counter.current % 3] },
      ].slice(-6));
    }, 600);
    return () => clearInterval(id);
  }, []);

  if (!pathRef.current) return null;
  const path = pathRef.current;
  const totalLength = path.getTotalLength();

  return (
    <>
      {packets.map(p => {
        const point = path.getPointAtLength(p.offset * totalLength);
        return (
          <circle
            key={p.id}
            cx={point.x}
            cy={point.y}
            r={3}
            fill={p.color}
            className="transition-opacity duration-300"
            style={{ opacity: p.offset < 1 ? 1 : 0 }}
          >
            <animate attributeName="r" from="2" to="4" dur="0.6s" repeatCount="1" />
          </circle>
        );
      })}
    </>
  );
}

export function Pipeline() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive(a => (a + 1) % STAGES.length), 1200);
    return () => clearInterval(id);
  }, [paused]);

  // SVG layout: horizontal path with nodes at each stage
  const nodeCount = STAGES.length;
  const svgWidth = 900;
  const svgHeight = 120;
  const padding = 60;
  const spacing = (svgWidth - padding * 2) / (nodeCount - 1);

  const nodes = STAGES.map((_, i) => ({
    x: padding + i * spacing,
    y: 60,
  }));

  // Build path through nodes
  const pathD = nodes.map((n, i) => `${i === 0 ? "M" : "L"} ${n.x} ${n.y}`).join(" ");

  const displayIdx = hovered !== null ? hovered : active;

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>pipeline.trace</span>
          <span className="inline-block size-1.5 rounded-full bg-[color:var(--color-ok)] pulse-live" />
        </div>
        <button
          onClick={() => setPaused(p => !p)}
          className="border border-border px-2 py-0.5 hover:bg-secondary transition-colors"
        >
          {paused ? "resume" : "pause"}
        </button>
      </div>

      {/* SVG Pipeline */}
      <div className="px-4 py-6 overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[600px]" fill="none">
          {/* Background path */}
          <path
            ref={pathRef}
            d={pathD}
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Animated packets */}
          <AnimatedPackets pathRef={pathRef} />
          {/* Nodes */}
          {nodes.map((n, i) => {
            const isActive = i === displayIdx;
            const isPast = i < displayIdx;
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-default"
              >
                {/* Node circle */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isActive ? 10 : 7}
                  fill={isActive ? "var(--color-accent)" : isPast ? "var(--color-ok)" : "var(--color-card)"}
                  stroke={isActive ? "var(--color-accent)" : "var(--color-border)"}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="transition-all duration-200"
                />
                {isActive && (
                  <circle cx={n.x} cy={n.y} r={14} fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.3">
                    <animate attributeName="r" from="10" to="18" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Stage label above */}
                <text
                  x={n.x}
                  y={n.y - 20}
                  textAnchor="middle"
                  className="fill-foreground text-[10px]"
                  fontFamily="var(--font-mono)"
                  fontSize="10"
                  letterSpacing="0.1em"
                >
                  {STAGES[i].k}
                </text>
                {/* Latency below */}
                <text
                  x={n.x}
                  y={n.y + 24}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                >
                  {STAGES[i].latency}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div className="border-t border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            stage_{String(displayIdx).padStart(2, "0")}
          </span>
          <span className="text-[12px] text-foreground">{STAGES[displayIdx].sub}</span>
          <span className="text-[11px] text-muted-foreground">{STAGES[displayIdx].note}</span>
        </div>
        <span className="text-[11px] text-[color:var(--color-ok)]">{STAGES[displayIdx].latency}</span>
      </div>
    </div>
  );
}
