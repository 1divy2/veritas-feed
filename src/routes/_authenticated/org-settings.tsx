import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/org-settings")({
  component: OrgSettingsPage,
});

function OrgSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "org"), {
        displayName: "Acme Intelligence",
        brandColor: "#00ff9d",
        updatedAt: Date.now()
      });
      window.alert("Settings saved successfully.");
    } catch (e) {
      console.error(e);
      window.alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-secondary/5">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div>
          <h1 className="text-lg font-medium">Organization Settings</h1>
          <p className="text-muted-foreground mt-1">Manage Acme Intelligence workspace, billing, and integrations.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-6">
        
        {/* Billing & Subscription */}
        <div className="border border-border bg-card p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-sm font-medium uppercase tracking-widest">Subscription Details</h2>
            <span className="px-2 py-0.5 border border-[color:var(--color-ok)] text-[color:var(--color-ok)] text-[9px] uppercase tracking-widest rounded-sm">Enterprise Plan</span>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-[12px]">
            <div>
              <span className="text-muted-foreground block">Seats Used</span>
              <span className="font-mono text-foreground">42 / 50</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Storage</span>
              <span className="font-mono text-foreground">112 GB / 500 GB</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Renewal Date</span>
              <span className="font-mono text-foreground">Nov 12, 2026</span>
            </div>
          </div>
          <button onClick={() => window.alert('Redirecting to Stripe Billing Portal...')} className="mt-2 border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-widest font-medium hover:bg-secondary self-start">
            Manage Billing
          </button>
        </div>

        {/* API & Webhooks */}
        <div className="border border-border bg-card p-6 flex flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-widest border-b border-border pb-2">Developer Platform</h2>
          
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium">API Keys</span>
              <button onClick={() => window.alert(`New API Key Generated: pk_live_${Math.random().toString(36).substring(2, 10)}`)} className="text-[10px] uppercase tracking-widest text-accent hover:underline">Generate Key</button>
            </div>
            <div className="flex justify-between items-center p-2 border border-border bg-background">
              <span className="font-mono text-[10px] text-muted-foreground">prod_key_***4x9</span>
              <span className="text-[10px] uppercase tracking-widest">Read/Write</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium">Webhooks</span>
              <button onClick={() => window.prompt('Enter webhook URL:')} className="text-[10px] uppercase tracking-widest text-accent hover:underline">Add Webhook</button>
            </div>
            <div className="flex justify-between items-center p-2 border border-border bg-background">
              <span className="font-mono text-[10px] text-muted-foreground">https://api.acme.com/veritas-hook</span>
              <span className="size-2 rounded-full bg-[color:var(--color-ok)]"></span>
            </div>
          </div>
        </div>

        {/* Branding & White Label */}
        <div className="col-span-2 border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest border-b border-border pb-2 mb-4">Brand Preferences</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Display Name</label>
                <input type="text" defaultValue="Acme Intelligence" className="w-full bg-background border border-border p-2 text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Brand Color (Hex)</label>
                <div className="flex gap-2">
                  <div className="size-9 border border-border bg-accent"></div>
                  <input type="text" defaultValue="#00ff9d" className="flex-1 bg-background border border-border p-2 font-mono text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Workspace Logo</label>
              <div className="border border-dashed border-border h-24 flex items-center justify-center text-[11px] text-muted-foreground hover:border-accent hover:text-accent cursor-pointer transition-colors">
                Click to upload SVG or PNG (max 1MB)
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSave} className="bg-foreground text-background px-4 py-2 text-[11px] font-medium uppercase tracking-widest hover:bg-accent transition-colors">
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
