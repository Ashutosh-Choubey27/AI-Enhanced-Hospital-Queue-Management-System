import { motion as Motion } from "framer-motion";

export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white/40 px-6 py-10 text-center dark:border-slate-800/80 dark:from-slate-900/40 dark:to-slate-900/20"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 dark:bg-brand-950/40 dark:ring-brand-900/50">
        <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</div>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Motion.div>
  );
}
