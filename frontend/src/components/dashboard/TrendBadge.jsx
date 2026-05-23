import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function TrendBadge({ trend, positiveText, negativeText, flatText }) {
  const dir = trend?.dir || "flat";
  const pct = trend?.pct ?? 0;
  const isUp = dir === "up";
  const isDown = dir === "down";
  const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;
  const tone = isUp
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/50"
    : isDown
      ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-800/50"
      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700";
  const text = isUp
    ? (positiveText?.(pct) ?? `↑ ${pct.toFixed(0)}%`)
    : isDown
      ? (negativeText?.(pct) ?? `↓ ${pct.toFixed(0)}%`)
      : (flatText ?? "≈ steady");

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}
