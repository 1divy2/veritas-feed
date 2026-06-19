import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppearanceToggle } from "@/components/AppearanceToggle";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "VERITAS//FEED — sign in" },
      { name: "description", content: "Sign in to the VERITAS investigation workspace." },
    ],
  }),
  component: LoginPage,
});

const PIPELINE_STEPS = [
  { label: "ingest", status: "ok", detail: "1,284 msg/min" },
  { label: "retrieve", status: "ok", detail: "top-k=5 · 12ms" },
  { label: "verify", status: "ok", detail: "llama3 · 171ms" },
  { label: "analyze", status: "ok", detail: "risk=42 · MED" },
  { label: "score", status: "ok", detail: "conf=0.87" },
  { label: "persist", status: "ok", detail: "postgres · 8ms" },
];

function LiveTerminal() {
  const [step, setStep] = useState(0);
  const [throughput, setThroughput] = useState(1284);

  useEffect(() => {
    const id = setInterval(() => {
      setThroughput(t => Math.max(900, t + Math.floor((Math.random() - 0.5) * 80)));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (step >= PIPELINE_STEPS.length) {
      const timeout = setTimeout(() => setStep(0), 2000);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setStep(s => s + 1), 320);
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="border border-border bg-background/60 glass font-mono text-[11px] leading-relaxed">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-[color:var(--color-ok)] pulse-live" />
          pipeline.status
        </div>
        <span>{throughput.toLocaleString()} msg/min</span>
      </div>
      <div className="p-3 space-y-1">
        {PIPELINE_STEPS.slice(0, step).map((s, i) => (
          <div key={i} className="flex items-center justify-between feed-in">
            <div className="flex items-center gap-2">
              <span className="text-[color:var(--color-ok)]">+</span>
              <span>{s.label}</span>
            </div>
            <span className="text-muted-foreground">{s.detail}</span>
          </div>
        ))}
        {step < PIPELINE_STEPS.length && (
          <div className="flex items-center gap-2">
            <span className="text-accent blink">▍</span>
            <span className="text-muted-foreground">processing...</span>
          </div>
        )}
        {step >= PIPELINE_STEPS.length && (
          <div className="mt-2 border-t border-border pt-2 text-[color:var(--color-ok)] feed-in">
            pipeline complete · all stages nominal
          </div>
        )}
      </div>
    </div>
  );
}

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{value.toLocaleString()}</span>;
}

function LoginPage() {
  const { session, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) nav({ to: "/workspace/live" });
  }, [loading, session, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!email.includes("@")) return setErr("invalid email format");
    if (pw.length < 4) return setErr("password too short");
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email, pw);
      else await signUp(email, pw);
    } catch (e: any) {
      setErr(e?.message ?? "auth failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen slide-up">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <Link to="/" className="flex items-center gap-3 text-[11px] uppercase tracking-widest">
          <span className="inline-block size-2 rotate-45 bg-accent" />
          <span>veritas//feed</span>
        </Link>
        <AppearanceToggle />
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-49px)] max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <section className="flex flex-col justify-between border-border p-8 lg:border-r lg:p-14">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground cursor-blink">
            workspace · v0.2.0
          </div>
          <div>
            <h1 className="font-display text-[44px] font-normal leading-[1.05] tracking-tight md:text-[56px] slide-up">
              Evidence over<br />speculation<span className="text-accent glow-accent">.</span>
            </h1>
            <p className="mt-5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              Monitor claims, inspect evidence chains, and investigate risk signals
              through a fully traceable verification workflow. No black boxes — every
              verdict ships with its citations, contradictions, and confidence trace.
            </p>
            <div className="mt-8 max-w-md">
              <LiveTerminal />
            </div>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-px border border-border bg-border text-[10px] uppercase tracking-widest">
            {[
              ["local-first", "no cloud"],
              ["open source", "mit license"],
              ["zero api keys", "$0 / month"],
            ].map(([a, b]) => (
              <div key={a} className="bg-background p-3">
                <div className="text-foreground">{a}</div>
                <div className="text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center p-8 lg:p-14">
          <form onSubmit={submit} className="w-full max-w-sm scale-in">
            <div className="flex items-center justify-between border-b border-border pb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{mode === "signin" ? "auth.signin" : "auth.register"}</span>
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-foreground hover:text-accent transition-colors"
              >
                {mode === "signin" ? "-> create account" : "<- sign in"}
              </button>
            </div>

            <label className="mt-5 block text-[10px] uppercase tracking-widest text-muted-foreground">
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="analyst@veritas.local"
              className="mt-1 w-full border border-border bg-background px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />

            <label className="mt-4 block text-[10px] uppercase tracking-widest text-muted-foreground">
              password
            </label>
            <div className="relative mt-1">
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="w-full border border-border bg-background px-3 py-2 pr-14 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                {show ? "hide" : "show"}
              </button>
            </div>

            {err && (
              <div className="mt-3 border border-[color:var(--color-crit)] px-3 py-2 text-[11px] text-[color:var(--color-crit)]">
                ! {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full border border-foreground bg-foreground px-3 py-2 text-[12px] uppercase tracking-widest text-background hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-60 transition-colors"
            >
              {busy ? "authenticating..." : mode === "signin" ? "> sign in" : "> create account"}
            </button>

            <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full border border-border bg-card px-3 py-2 text-[12px] uppercase tracking-widest hover:bg-secondary flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              sign in with google
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
