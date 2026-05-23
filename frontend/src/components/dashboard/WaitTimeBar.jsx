import clsx from "clsx";

const MAX_WAIT = 60;

export function WaitTimeBar({ minutes, label, className }) {
  const mins = typeof minutes === "number" ? minutes : null;
  const pct = mins == null ? 0 : Math.min(100, Math.round((mins / MAX_WAIT) * 100));
  const tone =
    mins == null
      ? "from-slate-300 to-slate-400"
      : mins <= 15
        ? "from-emerald-500 to-emerald-600"
        : mins <= 30
          ? "from-amber-400 to-amber-500"
          : "from-rose-500 to-rose-600";

  return (
    <div className={clsx("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-medium text-slate-500 dark:text-slate-400">Predicted wait</span>
        <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">{label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={clsx("h-full rounded-full bg-gradient-to-r transition-all duration-500", tone)}
          style={{ width: `${mins == null ? 8 : pct}%` }}
        />
      </div>
    </div>
  );
}
