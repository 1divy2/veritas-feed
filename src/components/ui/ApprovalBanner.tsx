export type ApprovalStatus = "Draft" | "Pending Review" | "Approved" | "Rejected" | "Published";

export function ApprovalBanner({ status, onAction }: { status: ApprovalStatus; onAction: (action: string) => void }) {
  const isPending = status === "Pending Review";
  const isApproved = status === "Approved" || status === "Published";
  
  return (
    <div className={`flex items-center justify-between p-3 border-l-4 mb-4 ${
      isApproved ? 'border-l-[color:var(--color-ok)] bg-[color:var(--color-ok)]/10' : 
      isPending ? 'border-l-[color:var(--color-warn)] bg-[color:var(--color-warn)]/10' : 
      'border-l-border bg-secondary'
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-[10px] uppercase tracking-widest font-bold">
          Workflow Status: <span className={isApproved ? "text-[color:var(--color-ok)]" : isPending ? "text-[color:var(--color-warn)]" : "text-muted-foreground"}>{status}</span>
        </div>
        {isPending && <div className="text-[11px] text-muted-foreground">Requires Lead Analyst approval before closure.</div>}
      </div>
      
      <div className="flex gap-2">
        {status === "Draft" && (
          <button onClick={() => onAction("request_review")} className="text-[10px] uppercase tracking-widest border border-border bg-background px-3 py-1 hover:bg-secondary">
            Request Review
          </button>
        )}
        {status === "Pending Review" && (
          <>
            <button onClick={() => onAction("reject")} className="text-[10px] uppercase tracking-widest border border-[color:var(--color-crit)] text-[color:var(--color-crit)] bg-background px-3 py-1 hover:bg-[color:var(--color-crit)]/10">
              Reject
            </button>
            <button onClick={() => onAction("approve")} className="text-[10px] uppercase tracking-widest border border-[color:var(--color-ok)] text-[color:var(--color-ok)] bg-background px-3 py-1 hover:bg-[color:var(--color-ok)]/10">
              Approve
            </button>
          </>
        )}
        {status === "Approved" && (
          <button onClick={() => onAction("publish")} className="text-[10px] uppercase tracking-widest bg-foreground text-background px-3 py-1 hover:bg-accent">
            Publish
          </button>
        )}
      </div>
    </div>
  );
}
