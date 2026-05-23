import clsx from "clsx";

export function SectionTitle({ icon: Icon, title, subtitle, badge, className }) {
  return (
    <div className={clsx("flex w-full flex-wrap items-start justify-between gap-3", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/15 dark:bg-brand-500/15 dark:ring-brand-400/20">
            <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </span>
        ) : null}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle ? <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
        </div>
      </div>
      {badge ? <div className="shrink-0">{badge}</div> : null}
    </div>
  );
}
