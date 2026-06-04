import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { claimsRef, ClaimData } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<(ClaimData & {id:string})[]>([]);

  useEffect(() => {
    const q = query(claimsRef, where("level", "==", "critical"), orderBy("timestamp", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full shadow-lg transition-colors flex items-center justify-center font-mono text-[12px] ${
          notifications.length > 0 ? "bg-[color:var(--color-crit)] text-background hover:bg-[color:var(--color-warn)]" : "bg-foreground text-background hover:bg-accent"
        }`}
        title="Notifications"
      >
        {notifications.length}
      </button>

      {open && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-border p-4 bg-background">
            <h2 className="text-[11px] font-medium uppercase tracking-widest">Inbox</h2>
            <button onClick={() => setOpen(false)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Close [Esc]
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-secondary/10">
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground text-[11px] mt-8 uppercase tracking-widest">No unread notifications</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="flex flex-col gap-1 p-3 border border-[color:var(--color-crit)] bg-[color:var(--color-crit)]/10 cursor-pointer hover:bg-[color:var(--color-crit)]/20 transition-colors">
                  <span className="text-[9px] text-[color:var(--color-crit)] uppercase tracking-widest">Critical Alert</span>
                  <span className="text-[12px] font-medium mt-1">{notif.text}</span>
                  <span className="text-[10px] text-muted-foreground">Source: {notif.source} · {formatDistanceToNow(notif.timestamp, { addSuffix: true })}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
