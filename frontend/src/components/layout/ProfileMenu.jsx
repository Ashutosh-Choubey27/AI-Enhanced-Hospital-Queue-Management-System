import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronDown, LogOut, Settings, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../feedback/ToastContext";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    toast.info("You have been signed out securely.");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={clsx(
          "flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-2 py-1.5 shadow-sm backdrop-blur transition hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80",
          open && "border-brand-200 ring-2 ring-brand-100/80 dark:border-brand-800 dark:ring-brand-900/40"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-left text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name || "User"}</div>
          <div className="text-left text-[10px] text-slate-500 dark:text-slate-400">{user?.role || "PATIENT"}</div>
        </div>
        <ChevronDown className={clsx("hidden h-4 w-4 text-slate-400 transition sm:block", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open ? (
          <Motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
          >
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
            >
              <UserCircle2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              View profile
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                nav("/profile");
                toast.info("Open Security to update password and preferences.");
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
            >
              <Settings className="h-4 w-4" />
              Account settings
            </button>
            <div className="border-t border-slate-100 dark:border-slate-800" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
