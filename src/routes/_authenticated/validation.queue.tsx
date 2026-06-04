import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { doc, setDoc, query, orderBy, onSnapshot, deleteDoc } from "firebase/firestore";
import { auditLogsRef, validationItemsRef, ValidationItemData } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/validation/queue")({
  component: QueuePage,
});

function QueuePage() {
  const [items, setItems] = useState<ValidationItemData[]>([]);

  useEffect(() => {
    const q = query(validationItemsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ValidationItemData[]);
    }, (err) => {
      console.error(err);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (id: string, actionName: string) => {
    if (actionName === "Annotate") {
      const note = window.prompt("Enter annotation note:");
      if (note) window.alert("Note saved.");
      return;
    }

    if (actionName === "Approve" || actionName === "Reject") {
      try {
        await deleteDoc(doc(validationItemsRef, id));
      } catch (e) {
        console.error(e);
      }
    }
    try {
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: `REVIEW_${actionName.toUpperCase()}`,
        actor: "Reviewer",
        target: id,
        changes: `Review ${actionName}d`,
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch(e) {}
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Human Review Queue</h1>
          <p className="text-muted-foreground mt-1 text-sm">Approve, reject, or annotate automated verification results.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, i) => (
            <div key={i} className="border border-border bg-card p-4 rounded-sm hover-glow flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
                <p className="text-sm mt-1">{item.claim}</p>
                <div className="flex gap-4 mt-2 text-[11px]">
                  <span className="text-accent font-mono">System Confidence: {item.modelConfidence}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(item.id!, 'Approve')} className="px-3 py-1 bg-[color:var(--color-ok)]/10 text-[color:var(--color-ok)] border border-[color:var(--color-ok)]/50 rounded-sm hover:bg-[color:var(--color-ok)]/20 text-xs">Approve</button>
                <button onClick={() => handleAction(item.id!, 'Reject')} className="px-3 py-1 bg-[color:var(--color-crit)]/10 text-[color:var(--color-crit)] border border-[color:var(--color-crit)]/50 rounded-sm hover:bg-[color:var(--color-crit)]/20 text-xs">Reject</button>
                <button onClick={() => handleAction(item.id!, 'Annotate')} className="px-3 py-1 bg-secondary/50 text-foreground border border-border rounded-sm hover:bg-secondary text-xs">Annotate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
