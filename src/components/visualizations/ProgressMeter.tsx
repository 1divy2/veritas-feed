export function ProgressMeter({ value, label, color = "var(--color-accent)" }: { value: number; label: string; color?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-end">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-[10px] font-mono font-medium">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-secondary overflow-hidden rounded-full">
        <div 
          className="h-full transition-all duration-1000 ease-out" 
          style={{ width: `${value}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
}
