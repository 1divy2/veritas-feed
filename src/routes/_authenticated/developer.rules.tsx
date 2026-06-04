import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auditLogsRef } from "@/lib/db";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/developer/rules")({
  component: RulesPage,
});

const RULES = [
  {
    id: "rule-escalate-high-risk",
    name: "Auto-Escalate High Risk",
    enabled: true,
    conditions: [{ field: "risk_score", operator: ">", value: "90" }],
    action: { type: "escalate", params: { priority: "P0", notify: "lead_analyst" } },
  },
  {
    id: "rule-flag-untrusted-source",
    name: "Flag Untrusted Sources",
    enabled: true,
    conditions: [{ field: "source_trust", operator: "<", value: "20" }],
    action: { type: "flag", params: { label: "LOW_TRUST_SOURCE" } },
  },
  {
    id: "rule-notify-narrative-growth",
    name: "Notify on Narrative Growth",
    enabled: true,
    conditions: [{ field: "narrative_growth_pct", operator: ">", value: "40" }],
    action: { type: "notify_team", params: { channel: "narrative_alerts" } },
  },
  {
    id: "rule-auto-archive",
    name: "Auto-Archive Stale Investigations",
    enabled: false,
    conditions: [{ field: "days_since_activity", operator: ">", value: "90" }],
    action: { type: "archive", params: {} },
  },
];

function RulesPage() {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState(RULES);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const toggleRule = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    const newEnabled = !rule.enabled;
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: newEnabled } : r));

    try {
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: newEnabled ? "RULE_ENABLED" : "RULE_DISABLED",
        actor: "System",
        target: id,
        changes: `Rule ${id} was ${newEnabled ? 'enabled' : 'disabled'}`,
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch(e) {}
  };

  const handleNewRule = async () => {
    const name = window.prompt("Enter new rule name:");
    if (!name) return;
    
    const newId = `rule-${name.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`;
    const newRule = {
      id: newId,
      name,
      enabled: true,
      conditions: [{ field: "risk_score", operator: ">", value: "80" }],
      action: { type: "flag", params: { label: "REVIEW_NEEDED" } },
    };
    
    setRules([newRule, ...rules]);
    
    try {
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(auditLogsRef, logId), {
        action: "RULE_CREATED",
        actor: "System",
        target: newId,
        changes: `Created rule: ${name}`,
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      });
    } catch(e) {}
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 bg-secondary/5 gap-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-lg font-medium">Rule Engine</h1>
          <p className="text-muted-foreground mt-1">Configure automated responses. Rules are evaluated at runtime against incoming intelligence.</p>
        </div>
        <button 
          onClick={handleNewRule}
          className="border border-border bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest hover:bg-secondary transition-colors"
        >
          + New Rule
        </button>
      </div>

      <div className="border border-border bg-card divide-y divide-border">
        {rules.map((rule) => (
          <div key={rule.id} className={`p-4 transition-opacity ${rule.enabled ? '' : 'opacity-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${rule.enabled ? 'bg-[color:var(--color-ok)]' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 size-3 rounded-full bg-white transition-transform ${rule.enabled ? 'left-4' : 'left-0.5'}`} />
                </button>
                <span className="text-sm font-medium">{rule.name}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{rule.id}</span>
            </div>

            {/* Condition → Action */}
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-muted-foreground uppercase tracking-widest text-[9px]">IF</span>
              {rule.conditions.map((c, i) => (
                <span key={i} className="font-mono px-2 py-0.5 border border-border bg-background">
                  {c.field} {c.operator} {c.value}
                </span>
              ))}
              <span className="text-muted-foreground uppercase tracking-widest text-[9px]">THEN</span>
              <span className="font-mono px-2 py-0.5 border border-accent/40 bg-accent/5 text-accent">
                {rule.action.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
