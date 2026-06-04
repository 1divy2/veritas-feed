import { createFileRoute, Outlet, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppearanceToggle } from "@/components/AppearanceToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { useRole, Role } from "@/lib/rbac";
import { NotificationCenter } from "@/components/ui/NotificationCenter";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

const NAV = [
  { section: "Workspace", roles: ["researcher", "analyst", "admin"] as Role[], items: [
    { to: "/workspace/live", label: "Live Feed" },
    { to: "/workspace/tasks", label: "Tasks" },
    { to: "/workspace/investigations", label: "Investigations" },
    { to: "/workspace/narratives", label: "Narratives" },
    { to: "/workspace/sources", label: "Sources" },
    { to: "/workspace/watchlists", label: "Watchlists" },
    { to: "/workspace/reports", label: "Reports" },
    { to: "/workspace/knowledge", label: "Knowledge Library" },
  ]},
  { section: "Operations", roles: ["researcher", "analyst", "admin"] as Role[], items: [
    { to: "/operations/analytics", label: "Analytics" },
    { to: "/operations/activity", label: "Activity" },
    { to: "/operations/audit", label: "Audit Trail", roles: ["analyst", "admin"] as Role[] },
  ]},
  { section: "Organization", roles: ["researcher", "analyst", "admin"] as Role[], items: [
    { to: "/org/teams", label: "Teams" },
    { to: "/org/profile", label: "My Profile" },
    { to: "/org-settings", label: "Org Settings", roles: ["admin"] as Role[] },
  ]},
  { section: "Administration", roles: ["admin"] as Role[], items: [
    { to: "/platform-admin", label: "Platform Console" },
    { to: "/admin/ingestion", label: "Ingestion Management" },
    { to: "/admin/system", label: "System Health" },
    { to: "/admin/users", label: "Users & Roles" },
  ]},
  { section: "Developer", roles: ["analyst", "admin"] as Role[], items: [
    { to: "/developer/portal", label: "Developer Portal" },
    { to: "/developer/workflows", label: "Workflows" },
    { to: "/developer/rules", label: "Rule Engine" },
    { to: "/developer/catalog", label: "Event Catalog" },
  ]},
  { section: "Research", roles: ["researcher", "admin"] as Role[], items: [
    { to: "/research/benchmarks", label: "Verification Benchmarks" },
    { to: "/research/experiments", label: "A/B Experiments" },
    { to: "/research/evolution", label: "Narrative Evolution" },
    { to: "/research/longitudinal", label: "Longitudinal Studies" },
    { to: "/research/datasets", label: "Dataset Versions" },
  ]},
  { section: "Validation", roles: ["analyst", "admin"] as Role[], items: [
    { to: "/validation/queue", label: "Human Review Queue" },
    { to: "/validation/metrics", label: "Trust Metrics" },
    { to: "/validation/outcomes", label: "Decision Support" },
  ]},
  { section: "Showcase", roles: ["admin", "researcher", "analyst"] as Role[], items: [
    { to: "/showcase/portfolio", label: "Portfolio Mode" },
    { to: "/showcase/case-studies", label: "Case Studies" },
    { to: "/showcase/preservation", label: "Archival Views" },
    { to: "/showcase/walkthrough", label: "Platform Walkthrough" },
  ]}
];

function AuthenticatedLayout() {
  const { session, signOut } = useAuth();
  const nav = useNavigate();
  const { role, hasRole, setRole } = useRole();

  useEffect(() => {
    if (!session) nav({ to: "/login" });
  }, [session, nav]);

  if (!session) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground text-[12px]">
      <NotificationCenter />
      {/* SIDEBAR */}
      <aside className="flex w-60 flex-col border-r border-border bg-sidebar shrink-0 glass-strong">
        <div className="flex items-center gap-2 border-b border-border p-4 gradient-border">
          <span className="inline-block size-2 bg-accent rotate-45 glow-accent" />
          <span className="font-medium tracking-wide uppercase text-[11px]">VERITAS//FEED</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {NAV.filter(g => hasRole(g.roles)).map(group => (
            <div key={group.section} className="slide-up">
              <Link 
                to={group.items.filter(item => !item.roles || hasRole(item.roles))[0]?.to || "/workspace/live"}
                className="mb-2 mt-4 block px-2 pb-1 text-[10px] uppercase tracking-[0.2em] text-accent/90 font-bold border-b border-border/50 hover:text-accent transition-colors"
              >
                {group.section}
              </Link>
              <nav className="space-y-0.5 stagger-in mt-2">
                {group.items.filter(item => !item.roles || hasRole(item.roles)).map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    activeProps={{ className: "bg-secondary text-foreground font-medium glow-accent" }}
                    className="flex items-center rounded-sm px-2 py-1.5 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-150"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3 space-y-3">
          <div className="px-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Simulate Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full bg-background border border-border p-1 text-[11px] rounded-sm focus:outline-none focus:border-accent"
            >
              <option value="researcher">Researcher (Read Only)</option>
              <option value="analyst">Analyst (Write)</option>
              <option value="admin">Admin (All Access)</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-2 text-muted-foreground">
            <button 
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className="text-[11px] hover:text-foreground flex items-center gap-1"
            >
              <kbd className="font-sans px-1 border border-border rounded-sm bg-secondary text-[10px]">⌘</kbd>
              <kbd className="font-sans px-1 border border-border rounded-sm bg-secondary text-[10px]">K</kbd>
              <span>Search</span>
            </button>
            <AppearanceToggle />
          </div>
          <button
            onClick={() => { signOut(); nav({ to: "/login" }); }}
            className="w-full text-left px-2 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative scale-in">
        <Outlet />
      </main>

      <CommandPalette />
    </div>
  );
}
