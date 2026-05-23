import clsx from "clsx";
import { motion as Motion } from "framer-motion";

export function GlassCard({ className, children, delay = 0, hover = true }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "glass-card overflow-hidden",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200/50 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:border-brand-800/40 dark:hover:shadow-slate-950/60",
        className
      )}
    >
      {children}
    </Motion.div>
  );
}

export function GlassCardHeader({ className, children }) {
  return (
    <div className={clsx("card-header border-slate-200/60 bg-gradient-to-r from-white/80 to-slate-50/50 dark:border-slate-800/60 dark:from-slate-900/80 dark:to-slate-900/40", className)}>
      {children}
    </div>
  );
}

export function GlassCardBody({ className, children }) {
  return <div className={clsx("card-body", className)}>{children}</div>;
}
