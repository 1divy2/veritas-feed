import { Skeleton } from "./skeleton";

export function PageLoader() {
  return (
    <div className="p-6 space-y-5 w-full h-full bg-background flex flex-col slide-up">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="skeleton-premium h-5 w-40 rounded-sm" />
        <div className="skeleton-premium h-3 w-24 rounded-sm opacity-60" />
      </div>
      {/* Body skeleton */}
      <div className="space-y-3 stagger-in">
        <div className="skeleton-premium h-4 w-full rounded-sm" />
        <div className="skeleton-premium h-4 w-[92%] rounded-sm" />
        <div className="skeleton-premium h-4 w-[88%] rounded-sm" />
        <div className="skeleton-premium h-4 w-[95%] rounded-sm" />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-3 gap-4 pt-2 flex-1">
        <div className="skeleton-premium rounded-sm" />
        <div className="skeleton-premium rounded-sm" />
        <div className="skeleton-premium rounded-sm" />
      </div>
    </div>
  );
}
