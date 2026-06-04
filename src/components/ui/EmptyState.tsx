export function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-1 min-h-[300px] flex-col items-center justify-center border border-dashed border-border bg-background p-8 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Notice</div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-[12px] text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
