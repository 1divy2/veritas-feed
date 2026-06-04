import { createFileRoute } from "@tanstack/react-router";
import { HistoricalTimeline } from "@/components/ui/HistoricalTimeline";

export const Route = createFileRoute("/_authenticated/org/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div>
          <h1 className="text-lg font-medium">My Profile</h1>
          <p className="text-muted-foreground mt-1">Activity metrics and expertise areas.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="border border-border bg-card p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-sm bg-secondary flex items-center justify-center text-xl font-bold mb-4">
              SA
            </div>
            <h2 className="font-medium text-lg">Sarah Analyst</h2>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Lead Analyst</span>
            
            <div className="w-full mt-6 flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">Team</span>
                <span>Policy Analysis</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">Clearance</span>
                <span className="text-accent font-mono">L3-Restricted</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cases Closed</span>
                <span className="font-mono">1,042</span>
              </div>
            </div>
          </div>
          
          <div className="border border-border bg-card p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-secondary text-[10px] uppercase tracking-widest border border-border">Geo-Politics</span>
              <span className="px-2 py-1 bg-secondary text-[10px] uppercase tracking-widest border border-border">Climate</span>
              <span className="px-2 py-1 bg-secondary text-[10px] uppercase tracking-widest border border-border">Bot Networks</span>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="border border-border bg-card p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">Activity (30 Days)</h3>
            <HistoricalTimeline 
              data={[
                { date: "W1", value: 12 }, { date: "W2", value: 45 }, { date: "W3", value: 34 }, { date: "W4", value: 50 }
              ]} 
            />
          </div>
          
          <div className="border border-border bg-card p-4 flex-1">
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">Recent Contributions</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">2h ago</span>
                <div>
                  <p className="text-[12px]"><span className="text-accent cursor-pointer hover:underline">Published Report</span> "Analysis of Sector 7 Interference Claims"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">1d ago</span>
                <div>
                  <p className="text-[12px]"><span className="text-accent cursor-pointer hover:underline">Closed Case</span> INV-2026-004</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">2d ago</span>
                <div>
                  <p className="text-[12px]"><span className="text-accent cursor-pointer hover:underline">Added 4 sources</span> to Watchlist "Election 2026"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
