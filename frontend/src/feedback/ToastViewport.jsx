import { motion as Motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import clsx from "clsx";

const TONES = {
  success: {
    icon: CheckCircle2,
    wrap: "border-emerald-200/80 bg-emerald-50/95 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/90 dark:text-emerald-100",
    iconTone: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    wrap: "border-rose-200/80 bg-rose-50/95 text-rose-900 dark:border-rose-800/60 dark:bg-rose-950/90 dark:text-rose-100",
    iconTone: "text-rose-600 dark:text-rose-400",
  },
  info: {
    icon: Info,
    wrap: "border-slate-200/80 bg-white/95 text-slate-900 dark:border-slate-700/60 dark:bg-slate-900/95 dark:text-slate-100",
    iconTone: "text-brand-600 dark:text-brand-400",
  },
};

export function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(100vw-2rem,22rem)] flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const meta = TONES[t.type] || TONES.info;
        const Icon = meta.icon;
        return (
          <Motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={clsx(
              "pointer-events-auto flex gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-300/25 backdrop-blur-xl dark:shadow-slate-950/50",
              meta.wrap
            )}
          >
            <Icon className={clsx("mt-0.5 h-5 w-5 shrink-0", meta.iconTone)} />
            <div className="min-w-0 flex-1">
              {t.title ? <div className="text-sm font-bold">{t.title}</div> : null}
              <p className={clsx("text-sm", t.title && "mt-0.5 opacity-90")}>{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </Motion.div>
        );
      })}
    </div>
  );
}
