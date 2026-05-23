import clsx from "clsx";

const TONES = {
  emerald:
    "border-emerald-200/70 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200",
  amber:
    "border-amber-200/70 bg-amber-50/80 text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-200",
  slate:
    "border-slate-200/70 bg-white/70 text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/50 dark:text-slate-300",
};

export function AnalyticsChip({ icon: Icon, label, tone = "slate", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold tabular-nums",
        TONES[tone] || TONES.slate,
        className
      )}
    >
      {Icon ? <Icon className="h-3 w-3 shrink-0 opacity-80" /> : null}
      {label}
    </span>
  );
}
