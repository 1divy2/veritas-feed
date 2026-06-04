export function EvidenceNetwork() {
  // A simple static SVG relationship graph mimicking Palantir/Maltego
  return (
    <div className="w-full h-48 bg-card flex items-center justify-center relative overflow-hidden rounded-sm">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--color-grid)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Edges */}
        <path d="M 100 80 Q 200 60 300 100" fill="none" stroke="var(--color-warn)" strokeWidth="1.5" strokeDasharray="4 2" />
        <path d="M 100 120 Q 200 140 300 100" fill="none" stroke="var(--color-ok)" strokeWidth="1.5" />
        <path d="M 300 100 Q 400 100 450 60" fill="none" stroke="var(--color-crit)" strokeWidth="1.5" />
        <path d="M 300 100 Q 400 100 450 140" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />

        {/* Nodes */}
        <g transform="translate(100, 80)">
          <circle cx="0" cy="0" r="6" fill="var(--color-warn)" />
          <text x="0" y="18" fill="var(--color-muted-foreground)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">Src A</text>
        </g>
        <g transform="translate(100, 120)">
          <circle cx="0" cy="0" r="6" fill="var(--color-ok)" />
          <text x="0" y="18" fill="var(--color-muted-foreground)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">Src B</text>
        </g>
        
        <g transform="translate(300, 100)">
          <rect x="-8" y="-8" width="16" height="16" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="2" />
          <text x="0" y="-12" fill="var(--color-foreground)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Claim</text>
        </g>

        <g transform="translate(450, 60)">
          <polygon points="0,-7 7,7 -7,7" fill="var(--color-crit)" />
          <text x="0" y="18" fill="var(--color-muted-foreground)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">BotNet</text>
        </g>
        <g transform="translate(450, 140)">
          <circle cx="0" cy="0" r="6" fill="var(--color-accent)" />
          <text x="0" y="18" fill="var(--color-muted-foreground)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">Entity</text>
        </g>
      </svg>
    </div>
  );
}
