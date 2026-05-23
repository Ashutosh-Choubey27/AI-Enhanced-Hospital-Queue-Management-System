import { motion as Motion } from "framer-motion";
import { ChartSkeletonBlock, SkeletonCard, Shimmer } from "./Shimmer";

/** Full dashboard placeholder while ML/analytics data loads */
export function DashboardSkeleton() {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-brand-200/50 bg-brand-50/30 px-4 py-3 dark:border-brand-900/40 dark:bg-brand-950/20">
        <Motion.div
          className="h-8 w-8 rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div>
          <div className="text-sm font-semibold text-brand-800 dark:text-brand-200">Loading analytics</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Fetching ML predictions & queue intelligence…</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} lines={3} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ChartSkeletonBlock height={240} />
          <ChartSkeletonBlock height={240} />
          <ChartSkeletonBlock height={220} />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartSkeletonBlock height={220} />
            <ChartSkeletonBlock height={220} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <Shimmer className="h-4 w-28" />
            </div>
            <div className="card-body space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Shimmer key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          <SkeletonCard lines={4} />
        </div>
      </div>
    </Motion.div>
  );
}
