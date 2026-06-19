import { createFileRoute } from "@tanstack/react-router";
import { ApprovalBanner } from "@/components/ui/ApprovalBanner";
import { DiscussionThread } from "@/components/ui/DiscussionThread";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { getCaseRef, CaseData } from "@/lib/db";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProgressMeter, EvidenceNetwork } from "@/components/visualizations";
import { ActivityTimelineChart } from "@/components/visualizations";
import { ConfidenceGauge } from "@/components/visualizations/ConfidenceGauge";

export const Route = createFileRoute("/_authenticated/workspace/investigations/$id")({
  component: InvestigationDetailPage,
});

const TIMELINE_EVENTS = [
  { time: "14 months ago", label: "First sighting", detail: "Initial claim detected on X/Twitter", severity: "info" as const },
  { time: "11 months ago", label: "Narrative cluster formed", detail: "Linked to 3 related claims across Reddit", severity: "info" as const },
  { time: "6 months ago", label: "Escalation trigger", detail: "Bot network amplification detected", severity: "warn" as const },
  { time: "3 months ago", label: "Peak velocity", detail: "1,200+ mentions in 48 hours", severity: "crit" as const },
  { time: "2 weeks ago", label: "Analyst assigned", detail: "@sarah opened investigation", severity: "info" as const },
  { time: "2 hours ago", label: "Network confirmed synthetic", detail: "400+ coordinated nodes identified", severity: "ok" as const },
];

const RELATED_NARRATIVES = [
  { title: "5G Infrastructure Interference", match: 88, risk: "high" },
  { title: "Local Election Disruption", match: 45, risk: "medium" },
  { title: "Public Health Coverup", match: 32, risk: "low" },
];

function TimelineNode({ event, isLast }: { event: typeof TIMELINE_EVENTS[0]; isLast: boolean }) {
  const dotColor = {
    info: "bg-[color:var(--color-info)]",
    warn: "bg-[color:var(--color-warn)]",
    crit: "bg-[color:var(--color-crit)]",
    ok: "bg-[color:var(--color-ok)]",
  }[event.severity];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`size-2.5 rounded-full ${dotColor} shrink-0`} />
        {!isLast && <div className="w-px flex-1 bg-border min-h-[24px]" />}
      </div>
      <div className={`pb-4 ${isLast ? "" : ""}`}>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{event.time}</div>
        <div className="text-[12px] font-medium text-foreground mt-0.5">{event.label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{event.detail}</div>
      </div>
    </div>
  );
}

function InvestigationDetailPage() {
  const { id } = Route.useParams();
  const [approvalStatus, setApprovalStatus] = useState<"Draft" | "Pending Review" | "Approved" | "Rejected" | "Published">("Pending Review");
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  useEffect(() => {
    async function fetchCase() {
      try {
        const docSnap = await getDoc(getCaseRef(id));
        if (docSnap.exists()) {
          setCaseData(docSnap.data());
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Action bar */}
      <div className="shrink-0 border-b border-border px-4 py-2">
        <ApprovalBanner
          status={approvalStatus}
          onAction={(action) => {
            if (action === "approve") setApprovalStatus("Approved");
            if (action === "reject") setApprovalStatus("Rejected");
          }}
        />
      </div>

      {/* Case header */}
      <div className="shrink-0 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-[14px] font-medium truncate font-display">{id}</h1>
          <span className={`px-1.5 py-0.5 border text-[9px] uppercase tracking-widest shrink-0 ${
            caseData.priority === "Critical" ? "border-[color:var(--color-crit)] text-[color:var(--color-crit)]" :
            caseData.priority === "High" ? "border-[color:var(--color-warn)] text-[color:var(--color-warn)]" :
            "border-border text-muted-foreground"
          }`}>{caseData.priority}</span>
          <span className="text-[10px] text-muted-foreground truncate">{caseData.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setLeftOpen(o => !o)} className={`p-1 text-muted-foreground hover:text-foreground transition-colors ${leftOpen ? "text-foreground" : ""}`} title="Toggle timeline">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></svg>
          </button>
          <button onClick={() => setRightOpen(o => !o)} className={`p-1 text-muted-foreground hover:text-foreground transition-colors ${rightOpen ? "text-foreground" : ""}`} title="Toggle narratives">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M15 3v18" /></svg>
          </button>
        </div>
      </div>

      {/* 3-panel dossier layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — Evidence Timeline */}
        {leftOpen && (
          <div className="w-[260px] shrink-0 border-r border-border overflow-y-auto bg-sidebar/50 p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">evidence timeline</div>
            <div className="space-y-0">
              {TIMELINE_EVENTS.map((event, i) => (
                <TimelineNode key={i} event={event} isLast={i === TIMELINE_EVENTS.length - 1} />
              ))}
            </div>
          </div>
        )}

        {/* Center panel — Claim Detail */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">
          {/* Claim text */}
          <div className="border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">claim under investigation</div>
              <ConfidenceGauge value={45} size={32} />
            </div>
            <p className="text-[13px] leading-relaxed font-medium">"{caseData.title}"</p>
            <div className="mt-3 flex gap-4">
              <ProgressMeter value={82} label="Contradiction" color="var(--color-warn)" />
              <ProgressMeter value={45} label="Confidence" color="var(--color-accent)" />
            </div>
          </div>

          {/* Evidence Network */}
          <div className="border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">evidence flow</div>
            <EvidenceNetwork />
          </div>

          {/* Risk Trend */}
          <div className="border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">risk & mentions (7d)</div>
            <ActivityTimelineChart
              data={[
                { date: "Mon", mentions: 120, risk: 45 },
                { date: "Tue", mentions: 230, risk: 60 },
                { date: "Wed", mentions: 150, risk: 55 },
                { date: "Thu", mentions: 340, risk: 85 },
                { date: "Fri", mentions: 450, risk: 95 },
                { date: "Sat", mentions: 380, risk: 90 },
                { date: "Sun", mentions: 290, risk: 80 },
              ]}
              xKey="date"
              yKeys={[
                { key: "mentions", color: "var(--color-accent)" },
                { key: "risk", color: "var(--color-warn)" },
              ]}
              height={160}
            />
          </div>

          {/* Discussion Thread */}
          <div className="border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">comm-link</div>
            <DiscussionThread comments={comments} />
          </div>
        </div>

        {/* Right panel — Related Narratives */}
        {rightOpen && (
          <div className="w-[240px] shrink-0 border-l border-border overflow-y-auto bg-sidebar/50 p-4 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">related narratives</div>
              <div className="space-y-2">
                {RELATED_NARRATIVES.map((n, i) => (
                  <div key={i} className={`p-2 border-l-2 cursor-pointer hover:bg-secondary/50 transition-colors ${
                    n.risk === "high" ? "border-l-[color:var(--color-crit)]" :
                    n.risk === "medium" ? "border-l-[color:var(--color-warn)]" :
                    "border-l-[color:var(--color-ok)]"
                  }`}>
                    <div className="text-[11px] font-medium text-foreground">{n.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{n.match}% match</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">metadata</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-muted-foreground">First seen</span><span>14 months ago</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Recurrence</span><span>High</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Origin</span><span className="text-accent">@infrastructure_watch</span></div>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">entities</div>
              <div className="flex flex-wrap gap-1">
                {["Sector 7", "Infrastructure", "Bot Network"].map(e => (
                  <span key={e} className="px-1.5 py-0.5 bg-secondary text-[9px] uppercase tracking-widest border border-border">{e}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
