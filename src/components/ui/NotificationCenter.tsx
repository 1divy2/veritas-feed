import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { claimsRef, ClaimData } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

type Severity = "critical" | "warning" | "info";

function getSeverity(level: string): Severity {
  if (level === "critical") return "critical";
  if (level === "warning") return "warning";
  return "info";
}

const SEVERITY_STYLES: Record<Severity, { border: string; bg: string; text: string; dot: string }> = {
  critical: { border: "border-[color:var(--color-crit)]",  bg: "bg-[color:var(--color-crit)]/10",  text: "text-[color:var(--color-crit)]",  dot: "bg-[color:var(--color-crit)]" },
  warning:  { border: "border-[color:var(--color-warn)]",  bg: "bg-[color:var(--color-warn)]/10",  text: "text-[color:var(--color-warn)]",  dot: "bg-[color:var(--color-warn)]" },
  info:     { border: "border-[color:var(--color-info)]",  bg: "bg-[color:var(--color-info)]/10",  text: "text-[color:var(--color-info)]",  dot: "bg-[color:var(--color-info)]" },
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<(ClaimData & {id:string})[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [undoStack, setUndoStack] = useState<{ items: (ClaimData & {id:string})[]; timer: ReturnType<typeof setTimeout> } | null>(null);

  useKeyboardNav("mod+.", () => setOpen(o => !o));
  useKeyboardNav("escape", () => setOpen(false));

  useEffect(() => {
    const q = query(claimsRef, where("level", "==", "critical"), orderBy("timestamp", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const unread = notifications.filter(n => !dismissed.has(n.id));

  const dismiss = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  const dismissAll = () => {
    const allIds = unread.map(n => n.id);
    setDismissed(new Set(allIds));
    // Undo timer
    if (undoStack) clearTimeout(undoStack.timer);
    const timer = setTimeout(() => setUndoStack(null), 3000);
    setUndoStack({ items: unread, timer });
  };

  const undoDismiss = () => {
    if (undoStack) {
      setDismissed(prev => {
        const next = new Set(prev);
        undoStack.items.forEach(n => next.delete(n.id));
        return next;
      });
      clearTimeout(undoStack.timer);
      setUndoStack(null);
    }
  };

  // Group by severity
  const grouped = {
    critical: unread.filter(n => getSeverity(n.level) === "critical"),
    warning: unread.filter(n => getSeverity(n.level) === "warning"),
    info: unread.filter(n => getSeverity(n.level) === "info"),
  };

  return (
    <>
      {/* Bell trigger — top right in header */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        title={`Notifications (${unread.length})`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-[color:var(--color-crit)] text-[8px] text-background flex items-center justify-center font-bold pulse-live">
            {unread.length}
          </span>
        )}
      </button>

      {/* Slide-in panel */}
      {open && (
        <div className="fixed inset-y-0 right-0 w-[400px] max-w-[90vw] bg-card border-l border-border shadow-2xl z-50 flex flex-col slide-in-from-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-medium uppercase tracking-widest">Inbox</h2>
              <span className="text-[10px] text-muted-foreground">({unread.length})</span>
            </div>
            <div className="flex items-center gap-2">
              {unread.length > 0 && (
                <button onClick={dismissAll} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                  clear all
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Undo toast */}
          {undoStack && (
            <div className="border-b border-border bg-secondary/50 px-4 py-2 flex items-center justify-between text-[11px] slide-up">
              <span className="text-muted-foreground">{undoStack.items.length} notification{undoStack.items.length > 1 ? "s" : ""} dismissed</span>
              <button onClick={undoDismiss} className="text-accent hover:text-foreground transition-colors font-medium">undo</button>
            </div>
          )}

          {/* Notification list grouped by severity */}
          <div className="flex-1 overflow-y-auto">
            {unread.length === 0 ? (
              <div className="text-center text-muted-foreground text-[11px] mt-12 uppercase tracking-widest">All clear</div>
            ) : (
              (["critical", "warning", "info"] as Severity[]).map(sev => {
                const items = grouped[sev];
                if (items.length === 0) return null;
                const styles = SEVERITY_STYLES[sev];
                return (
                  <div key={sev}>
                    <div className={`px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold ${styles.text} border-b border-border/50`}>
                      {sev} ({items.length})
                    </div>
                    {items.map(notif => (
                      <div key={notif.id} className={`group flex items-start gap-3 border-b border-border/50 px-4 py-3 hover:bg-secondary/30 transition-colors`}>
                        <div className={`mt-1 size-2 rounded-full shrink-0 ${styles.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-foreground leading-snug line-clamp-2">{notif.text}</p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{notif.source}</span>
                            <span className="text-border">·</span>
                            <span>{formatDistanceToNow(notif.timestamp, { addSuffix: true })}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => dismiss(notif.id)}
                          className="shrink-0 mt-0.5 p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                          title="Dismiss"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
            <span><kbd className="font-sans">⌘.</kbd> toggle</span>
            <span>{notifications.length} total</span>
          </div>
        </div>
      )}
    </>
  );
}
