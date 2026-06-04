import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/showcase/walkthrough")({
  component: WalkthroughPage,
});

function WalkthroughPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background relative">
      {/* Mocking an interactive overlay/walkthrough */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 slide-up">
        <div className="max-w-md w-full border border-border bg-card p-8 rounded-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-[color:var(--color-warn)] to-[color:var(--color-crit)]"></div>
          
          <h2 className="text-xl font-medium mb-4 text-center">Welcome to VERITAS//FEED</h2>
          <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
            This interactive walkthrough will guide you through the core workflows of the platform. You will experience how we detect, investigate, and mitigate misinformation networks in real-time.
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => window.alert('Initializing 3D Demo Canvas...')}
              className="w-full bg-foreground text-background py-3 font-medium hover:bg-accent transition-colors"
            >
              Start Interactive Demo
            </button>
            <button 
              onClick={() => window.location.href = '/workspace/live'}
              className="w-full bg-secondary/20 border border-border py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip to Dashboard
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <div className="size-2 rounded-full bg-accent"></div>
            <div className="size-2 rounded-full bg-secondary"></div>
            <div className="size-2 rounded-full bg-secondary"></div>
            <div className="size-2 rounded-full bg-secondary"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
