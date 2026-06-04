import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/research/datasets")({
  component: DatasetsPage,
});

function DatasetsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Dataset Versioning & Lineage</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track historical datasets to ensure reproducible benchmark studies.</p>
        </div>
        <button 
          onClick={() => {
            const url = window.prompt("Enter CSV/JSON dataset URL:");
            if (url) window.alert("Import started in background.");
          }}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium rounded-sm"
        >
          Import Dataset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="border border-border rounded-sm bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Dataset ID</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Validation Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { id: "DS-24-Q3-CORE", desc: "Core narrative evaluation benchmark (Q3)", size: "12,450 records", status: "Verified", date: "Oct 12, 2024" },
                { id: "DS-24-ELEC-V1", desc: "Election misinformation subset (Synthetic)", size: "8,900 records", status: "Verified", date: "Sep 28, 2024" },
                { id: "DS-24-MED-UNV", desc: "Medical contradiction raw scrape", size: "45,000 records", status: "Unverified", date: "Sep 15, 2024" },
                { id: "DS-24-BOT-NET", desc: "Known bot network footprints (X/TG)", size: "2.3M records", status: "Verified", date: "Aug 01, 2024" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-4 py-3 font-mono text-[11px] text-accent">{row.id}</td>
                  <td className="px-4 py-3 text-foreground">{row.desc}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.size}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-sm border ${
                      row.status === 'Verified' ? 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]' : 'border-[color:var(--color-warn)] text-[color:var(--color-warn)]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-[11px]">{row.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => window.alert(`Viewing lineage graph for ${row.id}`)}
                      className="text-[10px] text-muted-foreground hover:text-foreground underline decoration-dashed"
                    >
                      View Lineage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
