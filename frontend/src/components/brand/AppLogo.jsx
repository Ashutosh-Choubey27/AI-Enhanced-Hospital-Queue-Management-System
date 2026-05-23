import clsx from "clsx";
import logoSrc from "../../assets/updated_logo_nobg.png";

/**
 * Reusable hospital queue brand mark.
 * @param {"sm" | "md" | "lg"} size
 * @param {boolean} showText — sidebar-style title + tagline
 * @param {"default" | "light"} variant — text colors for dark hero panels
 */
export function AppLogo({ size = "md", showText = true, className, variant = "default" }) {
  const box =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-10 w-10";

  const titleTone =
    variant === "light" ? "text-white" : "text-slate-900 dark:text-slate-100";
  const subTone =
    variant === "light" ? "text-sky-200/70" : "text-slate-500 dark:text-slate-400";

  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
          box
        )}
      >
        <img
          src={logoSrc}
          alt="Hospital Queue Management"
          className="h-full w-full object-contain"
          decoding="async"
        />
      </div>
      {showText ? (
        <div className="min-w-0 leading-tight">
          <div className={clsx("truncate text-sm font-semibold", titleTone)}>Hospital Queue</div>
          <div className={clsx("truncate text-xs", subTone)}>AI-enhanced ops</div>
        </div>
      ) : null}
    </div>
  );
}

export { logoSrc };
