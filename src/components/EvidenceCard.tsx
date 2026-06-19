import { useState } from "react";
import { ConfidenceGauge } from "@/components/visualizations/ConfidenceGauge";

type Verdict = "VERIFIED" | "MISLEADING" | "FALSE" | "PARTIAL" | "UNRESOLVED";

interface EvidenceItem {
  title: string;
  similarity: number;
  source: string;
}

interface EvidenceCardProps {
  id: string;
  text: string;
  source: string;
  verdict: Verdict;
  confidence: number;
  riskScore: number;
  topic: string;
  timestamp: string;
  evidence?: EvidenceItem[];
  className?: string;
}

const VERDICT_STYLES: Record<Verdict, { border: string; bg: string; text: string; label: string }> = {
  VERIFIED:   { border: "border-l-[color:var(--color-ok)]",   bg: "bg-[color:var(--color-ok)]/10",   text: "text-[color:var(--color-ok)]",   label: "VERIFIED" },
  MISLEADING: { border: "border-l-[color:var(--color-warn)]", bg: "bg-[color:var(--color-warn)]/10", text: "text-[color:var(--color-warn)]", label: "MISLEADING" },
  FALSE:      { border: "border-l-[color:var(--color-crit)]", bg: "bg-[color:var(--color-crit)]/10", text: "text-[color:var(--color-crit)]", label: "FALSE" },
  PARTIAL:    { border: "border-l-[color:var(--color-info)]", bg: "bg-[color:var(--color-info)]/10", text: "text-[color:var(--color-info)]", label: "PARTIAL" },
  UNRESOLVED: { border: "border-l-muted-foreground",          bg: "bg-muted/50",                     text: "text-muted-foreground",          label: "UNRESOLVED" },
};

function riskBarColor(score: number): string {
  if (score >= 70) return "bg-[color:var(--color-crit)]";
  if (score >= 40) return "bg-[color:var(--color-warn)]";
  return "bg-[color:var(--color-ok)]";
}

export function EvidenceCard({
  id, text, source, verdict, confidence, riskScore, topic, timestamp, evidence = [], className = "",
}: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const v = VERDICT_STYLES[verdict];

  return (
    <div
      className={`border border-border border-l-[3px] ${v.border} bg-card p-4 hover-lift cursor-default ${className}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] uppercase tracking-widest font-medium ${v.bg} ${v.text}`}>
              {v.label}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{topic}</span>
          </div>
          <p className="text-[12px] leading-relaxed text-foreground line-clamp-2">{text}</p>
        </div>
        <div className="shrink-0">
          <ConfidenceGauge value={confidence} size={36} />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest">
          <span>{source}</span>
          <span className="text-border">·</span>
          <span title={timestamp}>{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Risk bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{riskScore}</span>
            <div className="w-12 h-1 bg-secondary overflow-hidden">
              <div className={`h-full ${riskBarColor(riskScore)} transition-all duration-300`} style={{ width: `${riskScore}%` }} />
            </div>
          </div>
          {evidence.length > 0 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-1"
            >
              {expanded ? "hide" : `${evidence.length} evidence`}
            </button>
          )}
        </div>
      </div>

      {/* Expandable evidence chain */}
      {expanded && evidence.length > 0 && (
        <div className="mt-3 pt-2 border-t border-border/50 space-y-1.5 stagger-in">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">evidence chain</div>
          {evidence.map((ev, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] py-1 px-2 bg-secondary/30">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-accent shrink-0">{">"}</span>
                <span className="truncate text-foreground">{ev.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-muted-foreground text-[10px]">{ev.source}</span>
                <span className="text-[10px] text-neutral-data font-medium">{(ev.similarity * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ID */}
      <div className="mt-2 text-[9px] text-muted-foreground/50 uppercase tracking-widest font-mono">{id}</div>
    </div>
  );
}
