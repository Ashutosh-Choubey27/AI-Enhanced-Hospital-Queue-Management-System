import { motion as Motion } from "framer-motion";
import { Clock, Sparkles, Star } from "lucide-react";
import { cn } from "../../lib/cn";
import { WaitTimeBar } from "../dashboard/WaitTimeBar";

export function DoctorCard({ d, isRecommended, rankIndex = 0, onSelect, selected, ml }) {
  const wait = ml?.wait_minutes ?? d.predictedWaitMins;
  const waitLabel = typeof wait === "number" ? `${Math.round(wait)} min` : `${d.predictedWaitMins} min`;
  const confidence = isRecommended ? Math.min(98, 88 + (d.rating || 4) * 2) : Math.max(52, 82 - rankIndex * 9);

  return (
    <Motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: rankIndex * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(d.id)}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
        selected
          ? "border-brand-400/80 bg-brand-50/80 shadow-md shadow-brand-500/10 ring-2 ring-brand-200/60 dark:border-brand-600/50 dark:bg-brand-950/30 dark:ring-brand-800/40"
          : "border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-slate-700",
        isRecommended && !selected && "border-brand-200/60 ring-1 ring-brand-100/80 dark:border-brand-800/40 dark:ring-brand-900/50"
      )}
    >
      {isRecommended ? (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-violet-500 to-brand-600" />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{d.name}</div>
            {isRecommended ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                <Sparkles className="h-3 w-3" />
                AI pick
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {d.department} · {d.specialization}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50/80 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-200">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {d.rating}
            </span>
            {d.isEmergencyCapable ? (
              <span className="badge badge-red">Emergency ready</span>
            ) : (
              <span className="badge">Standard care</span>
            )}
            {isRecommended ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-200/80 bg-brand-50/90 px-2 py-0.5 text-[11px] font-semibold text-brand-800 dark:border-brand-800/50 dark:bg-brand-950/40 dark:text-brand-200">
                {confidence}% match
              </span>
            ) : null}
          </div>

          <div className="mt-3 max-w-md">
            <WaitTimeBar
              minutes={typeof wait === "number" ? wait : d.predictedWaitMins}
              label={typeof wait === "number" ? `${waitLabel} · ML` : waitLabel}
            />
          </div>

          {ml?.explanation ? (
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
              {ml.explanation}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            <Clock className="mb-0.5 inline h-3 w-3 opacity-60" /> {d.nextSlotLabel}
          </span>
          {selected ? (
            <span className="text-[10px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">Selected</span>
          ) : null}
        </div>
      </div>

    </Motion.button>
  );
}
