import clsx from "clsx";

/** Shimmer block for skeleton placeholders */
export function Shimmer({ className, style }) {
  return <div style={style} className={clsx("shimmer rounded-xl bg-slate-200/60 dark:bg-slate-800/60", className)} />;
}

export function SkeletonCard({ className, lines = 2 }) {
  return (
    <div className={clsx("card overflow-hidden", className)}>
      <div className="card-body space-y-3">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-8 w-24" />
        {lines > 2 ? <Shimmer className="h-3 w-full max-w-xs" /> : null}
      </div>
    </div>
  );
}

export function ChartSkeletonBlock({ height = 240 }) {
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <Shimmer className="h-4 w-40" />
      </div>
      <div className="card-body">
        <Shimmer style={{ height }} className="w-full rounded-2xl" />
      </div>
    </div>
  );
}
