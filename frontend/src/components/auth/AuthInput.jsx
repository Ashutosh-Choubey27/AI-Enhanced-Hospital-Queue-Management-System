import { cn } from "../../lib/cn";

export function AuthInput({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
  placeholder,
  disabled,
}) {
  const InputIcon = icon;
  return (
    <label htmlFor={id} className="group block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate-300/90">{label}</span>
      <div className="relative">
        <InputIcon
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2",
            "text-sky-300/55 transition-colors duration-300",
            "group-focus-within:text-sky-200 group-focus-within:drop-shadow-[0_0_8px_rgba(125,211,252,0.45)]"
          )}
          aria-hidden
        />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-11 pr-3 text-sm text-slate-100 shadow-inner shadow-black/20",
            "placeholder:text-slate-500",
            "outline-none transition-all duration-300",
            "hover:border-sky-400/25 hover:bg-white/[0.08]",
            "focus:border-sky-400/45 focus:bg-white/[0.1] focus:shadow-[0_0_0_3px_rgba(56,189,248,0.14)]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>
    </label>
  );
}
