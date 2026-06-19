import { createFileRoute, Outlet, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppearanceToggle } from "@/components/AppearanceToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { useRole, Role } from "@/lib/rbac";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

type NavItem = { to: string; label: string; key?: string; roles?: Role[] };

const NAV: { section: string; roles: Role[]; items: NavItem[] }[] = [
  { section: "Workspace", roles: ["researcher", "analyst", "admin"], items: [
    { to: "/workspace/live", label: "Live Feed", key: "1" },
    { to: "/workspace/tasks", label: "Tasks", key: "2" },
    { to: "/workspace/investigations", label: "Investigations", key: "3" },
    { to: "/workspace/narratives", label: "Narratives", key: "4" },
    { to: "/workspace/sources", label: "Sources" },
    { to: "/workspace/watchlists", label: "Watchlists" },
    { to: "/workspace/reports", label: "Reports" },
    { to: "/workspace/knowledge", label: "Knowledge Library" },
  ]},
  { section: "Operations", roles: ["researcher", "analyst", "admin"], items: [
    { to: "/operations/analytics", label: "Analytics" },
    { to: "/operations/activity", label: "Activity" },
    { to: "/operations/audit", label: "Audit Trail", roles: ["analyst", "admin"] },
  ]},
  { section: "Organization", roles: ["researcher", "analyst", "admin"], items: [
    { to: "/org/teams", label: "Teams" },
    { to: "/org/profile", label: "My Profile" },
    { to: "/org-settings", label: "Org Settings", roles: ["admin"] },
  ]},
  { section: "Administration", roles: ["admin"], items: [
    { to: "/platform-admin", label: "Platform Console" },
    { to: "/admin/ingestion", label: "Ingestion Management" },
    { to: "/admin/system", label: "System Health" },
    { to: "/admin/users", label: "Users & Roles" },
  ]},
  { section: "Developer", roles: ["analyst", "admin"], items: [
    { to: "/developer/portal", label: "Developer Portal" },
    { to: "/developer/workflows", label: "Workflows" },
    { to: "/developer/rules", label: "Rule Engine" },
    { to: "/developer/catalog", label: "Event Catalog" },
  ]},
  { section: "Research", roles: ["researcher", "admin"], items: [
    { to: "/research/benchmarks", label: "Verification Benchmarks" },
    { to: "/research/experiments", label: "A/B Experiments" },
    { to: "/research/evolution", label: "Narrative Evolution" },
    { to: "/research/longitudinal", label: "Longitudinal Studies" },
    { to: "/research/datasets", label: "Dataset Versions" },
  ]},
  { section: "Validation", roles: ["analyst", "admin"], items: [
    { to: "/validation/queue", label: "Human Review Queue" },
    { to: "/validation/metrics", label: "Trust Metrics" },
    { to: "/validation/outcomes", label: "Decision Support" },
  ]},
  { section: "Showcase", roles: ["admin", "researcher", "analyst"], items: [
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
  const [collapsed, setCollapsed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!session) nav({ to: "/login" });
  }, [session, nav]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setCollapsed(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useKeyboardNav("shift+?", () => setShowHelp(s => !s));
  useKeyboardNav("escape", () => setShowHelp(false));
  useKeyboardNav("mod+k", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  });

  if (!session) return null;

  const sidebarWidth = collapsed ? "w-14" : "w-60";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground text-[12px]">
      <NotificationCenter />
      {/* SIDEBAR */}
      <aside className={`flex ${sidebarWidth} flex-col border-r border-border bg-sidebar shrink-0 glass-strong transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-border px-3 py-3 gradient-border">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block size-2 bg-accent rotate-45 glow-accent shrink-0" />
            {!collapsed && (
              <span className="font-medium tracking-wide uppercase text-[11px] truncate">VERITAS//FEED</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              {collapsed ? (
                <path d="M6 3l5 5-5 5" />
              ) : (
                <path d="M10 3l-5 5 5 5" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          {NAV.filter(g => hasRole(g.roles)).map((group, gi) => (
            <div key={group.section}>
              {gi > 0 && !collapsed && <div className="mx-3 my-2 border-t border-border/50" />}
              {!collapsed ? (
                <>
                  <Link 
                    to={group.items.filter(item => !item.roles || hasRole(item.roles))[0]?.to || "/workspace/live"}
                    className="mx-3 mt-3 mb-1 block text-[10px] uppercase tracking-[0.2em] text-accent/80 font-bold hover:text-accent transition-colors"
                  >
                    {group.section}
                  </Link>
                  <nav className="space-y-px mx-1.5 mt-1">
                    {group.items.filter(item => !item.roles || hasRole(item.roles)).map(item => (
                      <Link
                        key={item.label}
                        to={item.to}
                        activeProps={{ className: "!bg-secondary !text-foreground !font-medium" }}
                        className="group relative flex items-center justify-between rounded-sm px-2 py-1.5 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-150"
                      >
                        {/* Active indicator bar */}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-data-[status=active]:!h-4 bg-accent rounded-full transition-all duration-200" data-status="inactive" />
                        <span className="truncate pl-1">{item.label}</span>
                        {item.key && (
                          <kbd className="hidden group-hover:inline-block font-sans px-1 py-0.5 border border-border rounded-sm bg-secondary text-[9px] text-muted-foreground ml-2 shrink-0">
                            {item.key}
                          </kbd>
                        )}
                      </Link>
                    ))}
                  </nav>
                </>
              ) : (
                <nav className="space-y-px mx-1.5 mt-2">
                  {group.items.filter(item => !item.roles || hasRole(item.roles)).map(item => (
                    <Link
                      key={item.label}
                      to={item.to}
                      activeProps={{ className: "!bg-secondary !text-foreground" }}
                      className="group relative flex items-center justify-center py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-150"
                      title={item.label}
                    >
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-data-[status=active]:!h-4 bg-accent rounded-full transition-all duration-200" data-status="inactive" />
                      <span className="text-[11px] font-medium">{item.label.charAt(0)}</span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border p-2 space-y-2">
          {!collapsed ? (
            <>
              <div className="px-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-background border border-border p-1 text-[11px] rounded-sm focus:outline-none focus:border-accent"
                >
                  <option value="researcher">Researcher</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center justify-between px-2 text-muted-foreground">
                <button 
                  onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                  className="text-[11px] hover:text-foreground flex items-center gap-1.5"
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
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                title="Search (⌘K)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </button>
              <AppearanceToggle />
              <button
                onClick={() => { signOut(); nav({ to: "/login" }); }}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main key={typeof window !== "undefined" ? window.location.pathname : ""} className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative page-enter">
        <Outlet />
      </main>

      <CommandPalette />

      {/* Keyboard shortcuts help overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className="border border-border bg-card p-6 max-w-md w-full mx-4 scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">keyboard shortcuts</span>
              <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground text-[11px]">
                esc
              </button>
            </div>
            <div className="space-y-2 text-[12px]">
              {[
                ["⌘ K", "Open command palette"],
                ["? toggle", "Show this help"],
                ["1-4", "Quick nav: Feed, Tasks, Investigations, Narratives"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <kbd className="font-sans px-1.5 py-0.5 border border-border rounded-sm bg-secondary text-[10px] text-muted-foreground">{key}</kbd>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
