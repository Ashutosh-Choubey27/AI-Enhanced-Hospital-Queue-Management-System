import { motion as Motion } from "framer-motion";
import { CreditCard, Loader2 } from "lucide-react";
import clsx from "clsx";

export function PayNowButton({ className, onClick, disabled, loading }) {
  return (
    <Motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={clsx(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
        "bg-gradient-to-r from-brand-600 to-brand-700",
        "shadow-md shadow-brand-600/25 ring-1 ring-brand-500/20",
        "hover:from-brand-500 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-600/35 hover:ring-brand-400/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span className="absolute -inset-1 rounded-xl bg-brand-400/30 blur-md" />
      </span>
      {loading ? (
        <Loader2 className="relative h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      )}
      <span className="relative">{loading ? "Processing…" : "Pay now"}</span>
    </Motion.button>
  );
}
