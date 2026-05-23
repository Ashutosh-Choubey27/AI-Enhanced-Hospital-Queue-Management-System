import { motion as Motion } from "framer-motion";
import { Calendar, ChevronRight, Clock, Stethoscope } from "lucide-react";
import clsx from "clsx";
import { StatusBadge } from "../dashboard/StatusBadge";

export function AppointmentCard({ appointment: a, index = 0, variant = "upcoming", onJoinQueue, onCheckIn }) {
  const isUpcoming = variant === "upcoming";
  const slotDate = new Date(a.slotStartAt);
  const dateStr = Number.isNaN(slotDate.getTime()) ? "—" : slotDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeStr = Number.isNaN(slotDate.getTime()) ? "" : slotDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <Motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative flex gap-4"
    >
      <div className="flex flex-col items-center pt-1">
        <div
          className={clsx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
            isUpcoming
              ? "bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-200 dark:ring-brand-900/50"
              : "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
          )}
        >
          <Stethoscope className="h-4 w-4" />
        </div>
        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700" />
      </div>

      <div
        className={clsx(
          "mb-1 min-w-0 flex-1 rounded-2xl border px-4 py-3.5 shadow-sm transition-all duration-200",
          "border-slate-200/80 bg-white/70 hover:border-brand-200/50 hover:bg-white hover:shadow-md",
          "dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-brand-800/40"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{a.doctorName}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{a.department}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dateStr}
              </span>
              {timeStr ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeStr}
                </span>
              ) : null}
            </div>
          </div>
          <StatusBadge status={a.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {a.status === "BOOKED" ? (
            <button type="button" className="btn btn-primary px-3 py-1.5 text-xs" onClick={() => onCheckIn(a)}>
              Check-in
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : null}
          {a.slotStartAt ? (
            <button type="button" className="btn btn-ghost px-3 py-1.5 text-xs" onClick={() => onJoinQueue(a)}>
              View queue
            </button>
          ) : null}
        </div>
      </div>
    </Motion.div>
  );
}
