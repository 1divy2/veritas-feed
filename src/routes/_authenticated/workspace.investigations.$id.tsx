import { createFileRoute } from "@tanstack/react-router";
import { HistoricalTimeline } from "@/components/ui/HistoricalTimeline";
import { ApprovalBanner } from "@/components/ui/ApprovalBanner";
import { DiscussionThread } from "@/components/ui/DiscussionThread";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { getCaseRef, CaseData } from "@/lib/db";
import { PageLoader } from "@/components/ui/PageLoader";
import { ActivityTimelineChart, ProgressMeter, EvidenceNetwork } from "@/components/visualizations";

export const Route = createFileRoute("/_authenticated/workspace/investigations/$id")({
  component: InvestigationDetailPage,
});

function InvestigationDetailPage() {
  const { id } = Route.useParams();
  const [approvalStatus, setApprovalStatus] = useState<"Draft" | "Pending Review" | "Approved" | "Rejected" | "Published">("Pending Review");
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCase() {
      try {
        const docSnap = await getDoc(getCaseRef(id));
        if (docSnap.exists()) {
          setCaseData(docSnap.data());
          // Update approval status based on case status if applicable
          if (docSnap.data().status === "Closed") setApprovalStatus("Approved");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id]);

  const comments = [
    { id: "1", author: "System", content: "Investigation escalated to High Risk based on Early Warning anomaly.", timestamp: "1d ago", isSystemEvent: true },
    { id: "2", author: "@sarah", content: "I've reviewed the structural claims. Assigning to @david for secondary verification of the bot network.", timestamp: "10h ago" },
    { id: "3", author: "System", content: "Task 'Identify bots in @health_truth network' created and assigned to @david.", timestamp: "10h ago", isSystemEvent: true },
    { id: "4", author: "@david", content: "Network confirmed synthetic. Over 400 nodes acting in tandem.", timestamp: "2h ago" },
  ];

  if (loading) return <PageLoader />;
  if (!caseData) return <div className="p-4">Case not found</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5 slide-up">
      <ApprovalBanner 
        status={approvalStatus} 
        onAction={(action) => {
          if (action === "approve") setApprovalStatus("Approved");
          if (action === "reject") setApprovalStatus("Rejected");
        }} 
      />
      
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium">{id}</h1>
          <span className={`px-2 py-0.5 border text-[10px] uppercase tracking-widest rounded-sm ${
            caseData.priority === 'Critical' ? 'border-[color:var(--color-crit)] text-[color:var(--color-crit)]' :
            caseData.priority === 'High' ? 'border-[color:var(--color-warn)] text-[color:var(--color-warn)]' :
            'border-border text-muted-foreground'
          }`}>{caseData.priority} Priority</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const task = window.prompt("Enter task name to assign:");
              if (task) window.alert(`Task '${task}' assigned successfully!`);
            }}
            className="border border-border bg-background px-3 py-1.5 hover:bg-secondary text-[11px] font-medium uppercase tracking-widest"
          >
            Assign Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="xl:col-span-2 flex flex-col gap-4 overflow-y-auto pr-2">
          
          {/* Top Info row with Gauges */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 border border-border bg-card p-4">
              <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Claim Under Investigation</h2>
              <p className="text-[14px] leading-relaxed font-medium">"{caseData.title}"</p>
            </div>
            <div className="border border-border bg-card p-4 flex flex-col justify-center gap-3">
              <ProgressMeter value={82} label="Contradiction Strength" color="var(--color-warn)" />
              <ProgressMeter value={45} label="Confidence Score" color="var(--color-accent)" />
            </div>
          </div>

          {/* Network Graph */}
          <div className="border border-border bg-card p-4">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <h2 className="text-sm font-medium">Evidence Flow Diagram</h2>
              <span className="text-[10px] uppercase tracking-widest text-accent">Real-time</span>
            </div>
            <EvidenceNetwork />
          </div>

          {/* Historical Trend */}
          <div className="border border-border bg-card p-4">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <h2 className="text-sm font-medium">Risk & Mentions Trend (7 Days)</h2>
            </div>
            <ActivityTimelineChart 
              data={[
                { date: "Mon", mentions: 120, risk: 45 },
                { date: "Tue", mentions: 230, risk: 60 },
                { date: "Wed", mentions: 150, risk: 55 },
                { date: "Thu", mentions: 340, risk: 85 },
                { date: "Fri", mentions: 450, risk: 95 },
                { date: "Sat", mentions: 380, risk: 90 },
                { date: "Sun", mentions: 290, risk: 80 }
              ]}
              xKey="date"
              yKeys={[
                { key: "mentions", color: "var(--color-accent)" },
                { key: "risk", color: "var(--color-warn)" }
              ]}
              height={180}
            />
          </div>
          
          <div className="border border-border bg-card p-4 flex-shrink-0 min-h-[400px] flex flex-col mb-8">
            <h2 className="text-sm font-medium mb-4 border-b border-border pb-2">Operational Comm-Link</h2>
            <div className="flex-1 overflow-hidden">
              <DiscussionThread comments={comments} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Related Metadata visually improved */}
          <div className="border border-border bg-card p-4">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Contextual Network</h2>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-[12px] border-b border-border/50 pb-2">
                <span className="text-muted-foreground">First Seen:</span>
                <span className="font-mono">14 Months Ago</span>
              </div>
              <div className="flex justify-between text-[12px] border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Recurrence:</span>
                <span className="font-mono">High (Peaks every 3 months)</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-muted-foreground">Origin Source:</span>
                <span className="font-mono text-accent cursor-pointer hover:underline">@infrastructure_watch</span>
              </div>
            </div>

            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 mt-6">Entities Detected</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-secondary text-[10px] uppercase tracking-widest border border-border hover:border-[color:var(--color-warn)] text-foreground cursor-pointer transition-colors">Sector 7</span>
              <span className="px-2 py-1 bg-secondary text-[10px] uppercase tracking-widest border border-border hover:border-accent text-foreground cursor-pointer transition-colors">Infrastructure</span>
            </div>
          </div>
          
          <div className="border border-border bg-card p-4">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Narrative Clusters</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 border-l-2 border-[color:var(--color-warn)] pl-2 hover:bg-secondary/50 cursor-pointer p-1">
                <span className="text-[12px] font-medium">5G Infrastructure Interference</span>
                <ProgressMeter value={88} label="Match" color="var(--color-warn)" />
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-[color:var(--color-ok)] pl-2 hover:bg-secondary/50 cursor-pointer p-1 mt-2">
                <span className="text-[12px] font-medium">Local Election Disruption</span>
                <ProgressMeter value={45} label="Match" color="var(--color-ok)" />
              </div>
            </div>
          </div>
          
          <div className="border border-border bg-card p-4 mt-auto">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Escalation Path</h2>
            <HistoricalTimeline 
              data={[
                { date: "Automated", value: 10 }, { date: "Tier 1", value: 45 }, { date: "Tier 2", value: 12 }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
