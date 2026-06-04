import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveFeed } from "@/components/LiveFeed";
import { Pipeline } from "@/components/Pipeline";
import { Metrics } from "@/components/Metrics";
import { AppearanceToggle } from "@/components/AppearanceToggle";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "VERITAS//FEED — Evidence Investigation Platform" },
      {
        name: "description",
        content:
          "A local-first signal investigation platform. Stream claims, retrieve evidence, score risk, and audit every verdict with a fully traceable verification pipeline.",
      },
    ],
  }),
  component: Index,
});

const STACK = [
  ["redpanda", "event bus · kafka-compatible"],
  ["chromadb", "evidence store · vector index"],
  ["verification engine", "on-device inference"],
  ["sentence-transformers", "embedding model"],
  ["scikit-learn", "tfidf · classical signals"],
  ["fastapi", "query · admin surface"],
  ["postgres", "audit trail · analytics"],
  ["prometheus·grafana", "observability"],
];

const SERVICES = [
  { code: "01", name: "producer/", desc: "Synthetic signal generator. UUID posts across 7 domains with configurable throughput.", status: "ready" },
  { code: "02", name: "retrieval/", desc: "Embeddings → evidence-store top-k with relevance scoring.", status: "ready" },
  { code: "03", name: "verifier/", desc: "Multi-stage hybrid: semantic · tfidf · cosine · contradiction · claim-support.", status: "ready" },
  { code: "04", name: "engine/", desc: "On-device verification engine. Timeout · retries · malformed-output recovery.", status: "ready" },
  { code: "05", name: "consumer/", desc: "Bus → pipeline → audit store with DLQ topic + graceful shutdown.", status: "ready" },
  { code: "06", name: "api/", desc: "FastAPI: /posts /investigations /analytics /system/health.", status: "ready" },
  { code: "07", name: "metrics/", desc: "Prometheus exporter — latency, throughput, error budgets, risk distribution.", status: "ready" },
  { code: "08", name: "evaluation/", desc: "Accuracy · F1 · confusion matrix · CSV export.", status: "scaffold" },
  { code: "09", name: "datasets/", desc: "Synthetic generator: omission · exaggeration · quantifier-shift · cherry-pick.", status: "scaffold" },
  { code: "10", name: "tests/", desc: "Unit · integration · e2e · bus · api (target >80% coverage).", status: "scaffold" },
];

function Index() {
  return (
    <div className="min-h-screen text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border glass-strong">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest">
            <span className="inline-block size-2 rotate-45 bg-accent" />
            <span>veritas//feed</span>
            <span className="hidden text-muted-foreground sm:inline">· signal investigation platform</span>
          </div>
          <div className="flex items-center gap-3">
            <AppearanceToggle />
            <Link
              to="/login"
              className="border border-border px-3 py-1 text-[11px] uppercase tracking-widest hover:bg-foreground hover:text-background"
            >
              open workspace ↗
            </Link>
          </div>
        </div>
        {/* ticker */}
        <div className="overflow-hidden border-t border-border bg-foreground text-background">
          <div className="ticker-track flex gap-12 whitespace-nowrap py-1 text-[11px] uppercase tracking-widest">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 gap-12 px-6">
                <span>● ingest 1,284/m</span>
                <span>● verify.p95 612ms</span>
                <span>● risk.crit 6%</span>
                <span>● topic.health 32%</span>
                <span>● dlq 0</span>
                <span>● evidence.facts 142</span>
                <span>● engine local</span>
                <span>● redpanda 3 brokers</span>
                <span>● postgres 14</span>
                <span>● prom · grafana</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 noise pointer-events-none opacity-30" />
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 py-16 md:py-24">
          <div className="col-span-12 md:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              dossier · case file <span className="text-foreground">#2026-06-02</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl slide-up">
              We don't moderate the internet.<br />
              <span className="bg-foreground px-2 text-background glow-accent">We instrument it.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              An evidence investigation platform that runs on a laptop. Stream claims through{" "}
              a Kafka-compatible bus, retrieve verified records from a local evidence store,
              adjudicate with a local verification engine, score risk on a 0–100 composite,
              and land the audit trail in Postgres. No SaaS. No vendor lock-in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-widest">
              <Link
                to="/login"
                className="border border-foreground bg-foreground px-4 py-2 text-background hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                ▸ open investigation workspace
              </Link>
              <a href="#feed" className="border border-border px-4 py-2 hover:bg-accent hover:text-accent-foreground hover:border-accent">
                inspect live feed
              </a>
              <a href="#run" className="border border-border px-4 py-2 hover:bg-accent hover:text-accent-foreground hover:border-accent">
                run locally ↗
              </a>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="border border-border bg-card p-5 glass hover-lift">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                operating constraints
              </div>
              <ul className="mt-3 space-y-2 text-[12px] stagger-in">
                <li className="flex justify-between border-b border-border pb-2"><span>compute</span><span>local · cpu+gpu</span></li>
                <li className="flex justify-between border-b border-border pb-2"><span>cost / month</span><span>$0.00</span></li>
                <li className="flex justify-between border-b border-border pb-2"><span>external apis</span><span>none</span></li>
                <li className="flex justify-between border-b border-border pb-2"><span>throughput target</span><span>1k+ msg/min</span></li>
                <li className="flex justify-between border-b border-border pb-2"><span>explainability</span><span>per-claim trace</span></li>
                <li className="flex justify-between"><span>license</span><span>MIT</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE FEED */}
      <section id="feed" className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeader code="02" kicker="real-time" title="A feed, mid-investigation." note="simulated traffic · same shape as production consumer" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2"><LiveFeed /></div>
            <aside className="border border-border bg-card p-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">how a verdict is reached</div>
              <ol className="mt-3 space-y-3 text-[12px] leading-relaxed">
                <li><span className="text-accent">›</span> encode → evidence store top-k (k=5)</li>
                <li><span className="text-accent">›</span> hybrid score = α·cos + β·tfidf − γ·contradiction</li>
                <li><span className="text-accent">›</span> verification engine returns {`{verdict, confidence, evidence}`}</li>
                <li><span className="text-accent">›</span> risk = f(conf, sim, contradiction, engagement)</li>
                <li><span className="text-accent">›</span> persist · expose · trace</li>
              </ol>
              <div className="mt-5 border-t border-border pt-4 text-[11px] text-muted-foreground">
                every verdict ships with its evidence. nothing is a black box.
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeader code="03" kicker="pipeline" title="Six stages. One traceable path." />
          <div className="mt-8"><Pipeline /></div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeader code="04" kicker="observability" title="If you can't measure it, you don't ship it." />
          <div className="mt-8"><Metrics /></div>
        </div>
      </section>

      {/* SERVICES MAP */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeader code="05" kicker="repository" title="Ten services. Each one isolated, each one boring on purpose." />
          <div className="mt-8 grid grid-cols-1 gap-px bg-border md:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.code} className="bg-card p-5 hover-lift">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] tracking-widest text-muted-foreground">{s.code}</span>
                    <span className="text-base text-foreground">{s.name}</span>
                  </div>
                  <span
                    className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                      s.status === "ready"
                        ? "border-[color:var(--color-ok)] text-[color:var(--color-ok)]"
                        : "border-[color:var(--color-warn)] text-[color:var(--color-warn)]"
                    }`}
                  >
                    {s.status === "ready" ? "scaffolded" : "stub · todo"}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeader code="06" kicker="stack" title="Open source, end to end." />
          <div className="mt-8 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
            {STACK.map(([k, v]) => (
              <div key={k} className="bg-card p-5">
                <div className="text-sm text-foreground">{k}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUN LOCALLY */}
      <section id="run" className="border-b border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 py-16">
          <div className="col-span-12 md:col-span-5">
            <div className="text-[10px] uppercase tracking-widest opacity-60">07 · runbook</div>
            <h2 className="mt-3 text-3xl font-medium leading-tight md:text-5xl">
              Three commands. <span className="text-accent">No accounts.</span>
            </h2>
            <p className="mt-4 max-w-md text-[12px] opacity-70">
              The entire control plane is a docker-compose file. Pull the verification engine
              once, start the stack, post into the producer. The consumer drains it, the
              dashboards light up.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <pre className="border border-background/20 bg-background/5 p-5 text-[12px] leading-relaxed overflow-x-auto">
{`# 1 — pull the verification engine (one-time)
ollama pull llama3

# 2 — start the platform
docker compose -f backend/docker-compose.yml up -d

# 3 — seed the evidence store & run the producer
python backend/scripts/seed_knowledge_base.py
python backend/producer/producer.py --rate 10

# inspect
# › api         http://localhost:8000/docs
# › grafana     http://localhost:3000
# › redpanda    http://localhost:8080
# › prometheus  http://localhost:9090`}
            </pre>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-b border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 py-8 md:flex-row md:items-center">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            reference architecture · not a moderation product
          </div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            mit license · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  code, kicker, title, note,
}: { code: string; kicker: string; title: string; note?: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {code} · {kicker}
        </div>
        <h2 className="mt-2 text-2xl font-medium leading-tight md:text-4xl">{title}</h2>
      </div>
      {note && (
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{note}</div>
      )}
    </div>
  );
}
