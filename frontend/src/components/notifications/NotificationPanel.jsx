import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  CalendarPlus,
  CheckCheck,
  Clock3,
  Megaphone,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { DEMO_ALERTS } from "../../data/demoAlerts";
import { useToast } from "../../feedback/ToastContext";

const TYPE_ICON = {
  emergency: { Icon: AlertTriangle, tone: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" },
  queue: { Icon: Megaphone, tone: "bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300" },
  wait: { Icon: Clock3, tone: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200" },
  appointment: { Icon: CalendarPlus, tone: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200" },
  ml: { Icon: Sparkles, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
};

const PRIORITY_BADGE = {
  high: "badge-red",
  medium: "badge-amber",
  low: "badge-blue",
};

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const panelRef = useRef(null);
  const nav = useNavigate();
  const toast = useToast();

  const unreadCount = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    function onDocClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    toast.success("All notifications marked as read.");
  }

  function openAlert(alert) {
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a)));
    setOpen(false);
    if (alert.href) {
      nav(alert.href);
      toast.info(alert.message, { title: alert.title });
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "relative btn btn-ghost transition-shadow hover:shadow-sm",
          open && "border-brand-200 bg-brand-50/80 dark:border-brand-800 dark:bg-brand-950/40"
        )}
      >
        <Bell className={clsx("h-4 w-4 transition-transform", open && "text-brand-600 dark:text-brand-400")} />
        <span className="hidden sm:inline">Alerts</span>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <Motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl shadow-slate-300/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/50 sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {unreadCount ? `${unreadCount} unread` : "All caught up"}
                </div>
              </div>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/40"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              ) : null}
            </div>

            <ul className="max-h-[min(24rem,60vh)] overflow-y-auto py-1">
              {alerts.map((alert, i) => {
                const meta = TYPE_ICON[alert.type] || TYPE_ICON.queue;
                const Icon = meta.Icon;
                return (
                  <Motion.li
                    key={alert.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      type="button"
                      onClick={() => openAlert(alert)}
                      className={clsx(
                        "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60",
                        !alert.read && "bg-brand-50/40 dark:bg-brand-950/20"
                      )}
                    >
                      <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.tone)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{alert.title}</span>
                          <span className={clsx("badge shrink-0 text-[10px]", PRIORITY_BADGE[alert.priority])}>
                            {alert.priority}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{alert.message}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-400">{alert.time}</span>
                          {!alert.read ? <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden /> : null}
                        </div>
                      </div>
                    </button>
                  </Motion.li>
                );
              })}
            </ul>

            <div className="border-t border-slate-100 px-4 py-2.5 text-center text-[10px] text-slate-400 dark:border-slate-800">
              Live operational feed · updates in real time
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
