import { AnimatePresence, motion as Motion } from "framer-motion";
import { AlertTriangle, Heart, Radio, SkipForward, UserX } from "lucide-react";
import { cn } from "../lib/cn";
import { GlassCard, GlassCardBody, GlassCardHeader } from "./dashboard/GlassCard";
import { LiveIndicator } from "./dashboard/LiveIndicator";
import { StatusBadge } from "./dashboard/StatusBadge";

function statusBadgeClass(status) {
  switch (status) {
    case "CALLED":
      return "badge-blue";
    case "WAITING":
      return "badge-amber";
    case "DONE":
      return "badge-green";
    case "NO_SHOW":
      return "badge-red";
    default:
      return "";
  }
}

function PriorityBadge({ priority }) {
  if (priority === "EMERGENCY") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-300/80 bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-rose-600/30">
        <AlertTriangle className="h-3 w-3" />
        Emergency
      </span>
    );
  }
  if (priority === "SENIOR") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/80 bg-violet-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-violet-600/25">
        <Heart className="h-3 w-3" />
        Senior
      </span>
    );
  }
  return <span className="badge">Normal</span>;
}

function lanePosition(tokenNo, min, max) {
  if (max <= min) return 50;
  const raw = ((tokenNo - min) / (max - min)) * 100;
  return Math.min(96, Math.max(4, raw));
}

function TokenLane({ entries, currentToken }) {
  const laneEntries = entries.filter((e) => e.status === "WAITING" || e.status === "CALLED");
  const activeCount = laneEntries.length;

  if (!activeCount && currentToken == null) {
    return (
      <div className="mb-5 rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/40 px-4 py-6 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <p className="text-xs text-slate-500 dark:text-slate-400">No active tokens in this lane right now.</p>
      </div>
    );
  }

  const tokenNos = [
    ...laneEntries.map((e) => e.tokenNo),
    ...(currentToken != null ? [currentToken] : []),
  ];
  const min = Math.min(...tokenNos);
  const max = Math.max(...tokenNos);
  const servingPct =
    currentToken != null ? Math.min(100, Math.max(0, lanePosition(currentToken, min, max))) : null;

  const markers = [...laneEntries]
    .sort((a, b) => a.tokenNo - b.tokenNo)
    .map((e) => ({
      ...e,
      pct: lanePosition(e.tokenNo, min, max),
      isServing: e.tokenNo === currentToken,
    }));

  return (
    <div className="mb-5 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-slate-800/70 dark:bg-slate-900/40">
      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>Queue lane</span>
        <span>{activeCount} active</span>
      </div>

      <div className="relative px-1 pt-1 pb-8">
        {/* Track */}
        <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-800">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-brand-500/15 via-brand-500/25 to-emerald-500/20" />
          {servingPct != null ? (
            <Motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500/50 to-brand-600/40"
              initial={false}
              animate={{ width: `${servingPct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />
          ) : null}
        </div>

        {/* Token markers on track */}
        {markers.map((m) => (
          <div
            key={m.tokenNo}
            className="absolute top-0.5 -translate-x-1/2"
            style={{ left: `${m.pct}%` }}
            title={`#${m.tokenNo} · ${m.status}`}
          >
            <span
              className={cn(
                "block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-900",
                m.isServing
                  ? "hidden"
                  : m.status === "CALLED"
                    ? "bg-brand-400"
                    : m.priority === "EMERGENCY"
                      ? "bg-rose-500"
                      : m.priority === "SENIOR"
                        ? "bg-violet-500"
                        : "bg-slate-400 dark:bg-slate-500"
              )}
            />
          </div>
        ))}

        {/* Now serving indicator — aligned to current token */}
        {currentToken != null && servingPct != null ? (
          <Motion.div
            layout
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${servingPct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          >
            <Motion.div
              className="mx-auto h-5 w-5 rounded-full border-2 border-white bg-brand-600 shadow-lg shadow-brand-600/40 dark:border-slate-900"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="mt-2 whitespace-nowrap text-center text-[10px] font-bold text-brand-700 dark:text-brand-300">
              Now serving #{currentToken}
            </div>
          </Motion.div>
        ) : null}
      </div>

      <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
        <span>First · #{min}</span>
        <span className="text-slate-400">Tokens in lane</span>
        <span>Last · #{max}</span>
      </div>
    </div>
  );
}

function QueueEntryRow({ e, currentToken, index, onSkip, onNoShow }) {
  const isCurrent = e.tokenNo === currentToken;
  const isCalled = e.status === "CALLED";
  const isEmergency = e.priority === "EMERGENCY";
  const isSenior = e.priority === "SENIOR";

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={cn(
        "relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 transition-all duration-200",
        isCurrent && isCalled
          ? "border-brand-400/70 bg-gradient-to-r from-brand-50/90 to-white shadow-lg shadow-brand-500/15 ring-2 ring-brand-200/50 dark:from-brand-950/50 dark:to-slate-900/80 dark:ring-brand-800/40"
          : isEmergency
            ? "border-rose-300/70 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
            : isSenior
              ? "border-violet-300/60 bg-violet-50/30 dark:border-violet-900/50 dark:bg-violet-950/20"
              : "border-slate-200/80 bg-white/60 hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/70"
      )}
    >
      {isCurrent && isCalled ? (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-500 to-emerald-500" />
      ) : null}

      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold tabular-nums",
            isEmergency ? "bg-rose-600 text-white shadow-md shadow-rose-600/30" : isSenior ? "bg-violet-600 text-white shadow-md shadow-violet-600/25" : "bg-slate-900 text-white dark:bg-slate-700",
            isCurrent && isCalled && "token-pulse ring-4 ring-brand-300/50 dark:ring-brand-700/50"
          )}
        >
          {e.tokenNo}
          {isCurrent ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </span>
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{e.name}</div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <PriorityBadge priority={e.priority} />
            <StatusBadge status={e.status} className={statusBadgeClass(e.status)} />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right text-xs sm:block">
          <div className={cn("font-semibold", isCurrent ? "text-brand-700 dark:text-brand-300" : "text-slate-500")}>
            {isCurrent ? (isCalled ? "Now serving" : "Your turn next") : "In lane"}
          </div>
        </div>
        {e.queueEntryId && (e.status === "WAITING" || e.status === "CALLED") ? (
          <div className="flex items-center gap-1.5">
            {onSkip ? (
              <button
                type="button"
                className="btn btn-ghost px-2.5 py-1.5 text-xs"
                onClick={() => onSkip(e.queueEntryId)}
                title="Skip this token"
              >
                <SkipForward className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Skip</span>
              </button>
            ) : null}
            {onNoShow ? (
              <button
                type="button"
                className="btn btn-ghost px-2.5 py-1.5 text-xs"
                onClick={() => onNoShow(e.queueEntryId)}
                title="Mark as no-show"
              >
                <UserX className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">No-show</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Motion.div>
  );
}

export function QueueViz({ entries, currentToken, updateSeq, onSkip, onNoShow, isLive = false }) {
  const activeCount = entries.filter((e) => e.status === "WAITING" || e.status === "CALLED").length;

  return (
    <GlassCard delay={0.08} hover={false}>
      <GlassCardHeader>
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Radio className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              Live queue
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Real-time token lane · priority ordering</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LiveIndicator live={isLive} label={isLive ? "Streaming" : "Preview"} />
            <span className="rounded-full border border-brand-200/80 bg-brand-50/90 px-3 py-1 text-xs font-bold tabular-nums text-brand-800 dark:border-brand-800/50 dark:bg-brand-950/40 dark:text-brand-200">
              Token #{currentToken ?? "—"}
            </span>
          </div>
        </div>
      </GlassCardHeader>

      <GlassCardBody>
        {currentToken != null ? (
          <Motion.div
            key={`hero-${currentToken}-${updateSeq}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-50/80 via-white/80 to-emerald-50/50 px-5 py-4 dark:border-brand-800/40 dark:from-brand-950/40 dark:via-slate-900/60 dark:to-emerald-950/20"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">Now serving</div>
              <div className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">#{currentToken}</div>
            </div>
            <div className="text-right text-sm text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-slate-900 dark:text-slate-100">{activeCount} patients in lane</div>
              <div className="mt-0.5 text-xs">Live updates as patients move through the lane</div>
            </div>
          </Motion.div>
        ) : null}

        <TokenLane entries={entries} currentToken={currentToken} />

        <div key={updateSeq ?? 0} className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {entries.map((e, i) => (
              <QueueEntryRow
                key={e.queueEntryId || e.tokenNo}
                e={e}
                currentToken={currentToken}
                index={i}
                onSkip={onSkip}
                onNoShow={onNoShow}
              />
            ))}
          </AnimatePresence>
        </div>
      </GlassCardBody>
    </GlassCard>
  );
}
