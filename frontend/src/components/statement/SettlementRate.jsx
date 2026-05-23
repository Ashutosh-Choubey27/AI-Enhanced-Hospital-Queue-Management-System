import { motion as Motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnalyticsChip } from "./AnalyticsChip";

export function SettlementRate({ percent, monthTrendPct = 12, hasOutstanding = true }) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="space-y-3.5 rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/90 to-white/60 p-4 shadow-inner shadow-slate-200/20 dark:border-slate-800/60 dark:from-slate-900/50 dark:to-slate-900/20 dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Settlement rate</span>
        <Motion.span
          key={clamped}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100"
        >
          {clamped}%
        </Motion.span>
      </div>

      <div
        className="relative h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Settlement rate"
      >
        <Motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 via-brand-600 to-emerald-500 shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60" />
      </div>

      <div className="flex flex-wrap gap-2">
        <AnalyticsChip icon={ArrowUpRight} label={`↑ ${monthTrendPct}% this month`} tone="emerald" />
        {hasOutstanding ? (
          <AnalyticsChip icon={ArrowDownRight} label="↓ outstanding dues" tone="amber" />
        ) : null}
      </div>
    </div>
  );
}
