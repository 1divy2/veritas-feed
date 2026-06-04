import { useEffect, useRef, useState } from "react";

type Verdict = "VERIFIED" | "MISLEADING" | "FALSE" | "PARTIAL" | "UNSUPPORTED";
type Item = {
  id: string;
  t: string;
  topic: string;
  text: string;
  verdict: Verdict;
  risk: number;
  conf: number;
  latency: number;
  evidence: string;
};

const CORPUS: Omit<Item, "id" | "t" | "verdict" | "risk" | "conf" | "latency">[] = [
  { topic: "health", text: "Drinking lemon water at 4am cures stage IV cancers within 11 days.", evidence: "WHO/NIH oncology guidelines — no clinical support." },
  { topic: "climate", text: "Global mean temperature rose 1.45°C above pre-industrial baseline in 2024.", evidence: "WMO State of the Climate 2024 report." },
  { topic: "ai", text: "GPT-5 is fully sentient and has been hidden from the public since March.", evidence: "No peer-reviewed or vendor disclosure supports this claim." },
  { topic: "space", text: "JWST imaged a confirmed exoplanet atmosphere with water vapor signatures.", evidence: "STScI press release; transmission spectroscopy 2023-09." },
  { topic: "econ", text: "The U.S. unemployment rate jumped to 27% last quarter, hidden by media.", evidence: "BLS CPS data: 4.1% — claim contradicts primary source." },
  { topic: "politics", text: "A new bill makes private home gardens illegal in 14 states.", evidence: "No such federal or state legislation exists." },
  { topic: "tech", text: "Quantum chips have officially broken RSA-2048 in production.", evidence: "NIST PQC status — no demonstrated break of RSA-2048." },
  { topic: "health", text: "Routine influenza vaccination reduces hospitalization risk in older adults.", evidence: "CDC MMWR meta-analysis; effect size consistent across seasons." },
  { topic: "climate", text: "Solar activity, not CO₂, accounts for >90% of recent warming.", evidence: "IPCC AR6 attribution: solar forcing < 0.1°C of observed trend." },
  { topic: "ai", text: "Open-weight 8B models can run usable RAG pipelines on consumer GPUs.", evidence: "Ollama + llama.cpp benchmarks on 12GB VRAM, q4_K_M quant." },
  { topic: "space", text: "Mars has a liquid-water ocean directly beneath Olympus Mons.", evidence: "MARSIS radar suggests briny layer near south pole only." },
  { topic: "econ", text: "Inflation in the Eurozone fell to 2.4% YoY in latest Eurostat flash.", evidence: "Eurostat HICP flash estimate matches the figure." },
];

const verdictFor = (text: string): { v: Verdict; risk: number; conf: number } => {
  const lower = text.toLowerCase();
  if (/(cure|sentient|illegal|hidden|jumped to|broken rsa|directly beneath)/.test(lower))
    return { v: "FALSE", risk: 88 + Math.floor(Math.random() * 10), conf: 0.92 };
  if (/(>90%|not co₂|cherry)/.test(lower))
    return { v: "MISLEADING", risk: 64 + Math.floor(Math.random() * 12), conf: 0.81 };
  if (/(reduces|consistent|matches|jwst|run usable)/.test(lower))
    return { v: "VERIFIED", risk: 6 + Math.floor(Math.random() * 8), conf: 0.95 };
  return { v: "PARTIAL", risk: 38 + Math.floor(Math.random() * 14), conf: 0.7 };
};

const ts = () => {
  const d = new Date();
  return d.toISOString().split("T")[1]?.replace("Z", "") ?? "00:00:00";
};

const verdictColor: Record<Verdict, string> = {
  VERIFIED: "text-[color:var(--color-ok)] border-[color:var(--color-ok)]",
  MISLEADING: "text-[color:var(--color-warn)] border-[color:var(--color-warn)]",
  FALSE: "text-[color:var(--color-crit)] border-[color:var(--color-crit)]",
  PARTIAL: "text-[color:var(--color-warn)] border-[color:var(--color-warn)]",
  UNSUPPORTED: "text-muted-foreground border-border",
};

export function LiveFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [paused, setPaused] = useState(false);
  const i = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const src = CORPUS[i.current % CORPUS.length];
      i.current += 1;
      const { v, risk, conf } = verdictFor(src.text);
      setItems((prev) =>
        [
          {
            id: crypto.randomUUID().slice(0, 8),
            t: ts(),
            topic: src.topic,
            text: src.text,
            evidence: src.evidence,
            verdict: v,
            risk,
            conf,
            latency: 180 + Math.floor(Math.random() * 420),
          },
          ...prev,
        ].slice(0, 14),
      );
    }, 1400);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-[color:var(--color-ok)] blink" />
          <span>live // redpanda.topic = posts.ingest</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">throughput ~ 24 msg/s</span>
          <button
            onClick={() => setPaused((p) => !p)}
            className="border border-border px-2 py-0.5 hover:bg-accent hover:text-accent-foreground"
          >
            {paused ? "resume" : "pause"}
          </button>
        </div>
      </div>
      <div className="divide-y divide-border font-mono text-[13px]">
        {items.length === 0 && (
          <div className="px-4 py-10 text-center text-muted-foreground">
            booting consumer<span className="blink">_</span>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="feed-in grid grid-cols-12 gap-3 px-4 py-3">
            <div className="col-span-2 text-muted-foreground">
              <div>{it.t}</div>
              <div className="text-[10px] uppercase">{it.topic}</div>
            </div>
            <div className="col-span-7">
              <div className="text-foreground">{it.text}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                ↳ evidence: {it.evidence}
              </div>
            </div>
            <div className="col-span-3 flex flex-col items-end gap-1">
              <span
                className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${verdictColor[it.verdict]}`}
              >
                {it.verdict}
              </span>
              <div className="text-[10px] text-muted-foreground">
                risk <span className="text-foreground">{it.risk}</span> · conf{" "}
                <span className="text-foreground">{it.conf.toFixed(2)}</span> · {it.latency}ms
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
