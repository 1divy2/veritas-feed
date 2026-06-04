import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "VERITAS//FEED" }],
  }),
  component: Gate,
});

function Gate() {
  const { session } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    nav({ to: session ? "/workspace/live" : "/login", replace: true });
  }, [session, nav]);

  return (
    <div className="flex min-h-screen items-center justify-center text-[11px] uppercase tracking-widest text-muted-foreground">
      <span className="caret">routing</span>
    </div>
  );
}
