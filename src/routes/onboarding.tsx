import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const nav = useNavigate();

  const handleComplete = () => {
    // Simulate API call to provision tenant
    setTimeout(() => {
      nav({ to: "/workspace/live" });
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground overflow-hidden font-sans">
      <div className="w-[500px] border border-border bg-card shadow-2xl p-8">
        
        <div className="flex items-center gap-4 border-b border-border pb-6 mb-8">
          <div className="size-8 bg-foreground text-background flex items-center justify-center font-bold font-mono tracking-widest text-[10px]">
            V//F
          </div>
          <h1 className="text-xl font-bold uppercase tracking-widest">Platform Setup</h1>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-medium mb-2">Create Organization</h2>
            <p className="text-sm text-muted-foreground mb-6">Provision a new secure tenant environment.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Organization Name</label>
                <input 
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Intelligence" 
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Organization Slug</label>
                <div className="flex">
                  <span className="bg-secondary border border-r-0 border-border p-3 text-sm text-muted-foreground">veritas.feed/</span>
                  <input 
                    type="text" 
                    value={orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                    disabled
                    className="w-full bg-background border border-border p-3 text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!orgName}
                className="mt-4 bg-foreground text-background py-3 font-medium uppercase tracking-widest text-[12px] hover:bg-accent transition-colors disabled:opacity-50"
              >
                Continue to Workspaces
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-medium mb-2">Initial Workspace</h2>
            <p className="text-sm text-muted-foreground mb-6">Data is siloed into workspaces within your organization.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Workspace Name</label>
                <input 
                  type="text"
                  defaultValue="Global Threat Intelligence"
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <button 
                onClick={() => setStep(3)}
                className="mt-4 bg-foreground text-background py-3 font-medium uppercase tracking-widest text-[12px] hover:bg-accent transition-colors"
              >
                Continue to Invite
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-medium mb-2">Invite Team</h2>
            <p className="text-sm text-muted-foreground mb-6">Add initial members to {orgName || 'your organization'}.</p>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input 
                  type="email"
                  placeholder="colleague@company.com"
                  className="flex-1 bg-background border border-border p-3 text-sm focus:outline-none focus:border-accent"
                />
                <select className="bg-background border border-border p-3 text-sm focus:outline-none focus:border-accent">
                  <option>Analyst</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
              <button 
                onClick={() => window.alert('Multiple invites are restricted on the Free tier.')}
                className="text-left text-[11px] font-medium uppercase tracking-widest text-accent hover:underline mb-4"
              >
                + Add another
              </button>
              
              <button 
                onClick={handleComplete}
                className="bg-foreground text-background py-3 font-medium uppercase tracking-widest text-[12px] hover:bg-accent transition-colors"
              >
                Provision Tenant & Launch
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
