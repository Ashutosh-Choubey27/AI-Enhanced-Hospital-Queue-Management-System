import clsx from "clsx";

export function LiveIndicator({ live = false, label = "Live", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        live
          ? "border-emerald-200/80 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200"
          : "border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {live ? (
          <>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </>
        ) : (
          <span className="inline-flex h-2 w-2 rounded-full bg-slate-400" />
        )}
      </span>
      {label}
    </span>
  );
}
