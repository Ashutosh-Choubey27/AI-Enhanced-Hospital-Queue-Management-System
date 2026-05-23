import { AnimatePresence, motion as Motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  LayoutDashboard,
  ListOrdered,
  ReceiptIndianRupee,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { AppLogo } from "../brand/AppLogo";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/book", label: "Book", icon: CalendarDays },
  { to: "/queue", label: "Queue", icon: ListOrdered },
  { to: "/appointments", label: "Appointments", icon: Activity },
  { to: "/statement", label: "Statement", icon: ReceiptIndianRupee },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="btn btn-ghost px-2.5"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <Motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <Motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
                <AppLogo size="sm" />
                <button type="button" className="btn btn-ghost px-2.5" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3">
                <ul className="space-y-1">
                  {links.map((l) => {
                    const Icon = l.icon;
                    return (
                      <li key={l.to}>
                        <NavLink
                          to={l.to}
                          end={l.to === "/"}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            clsx(
                              "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors",
                              isActive
                                ? "bg-brand-50 text-brand-800 ring-1 ring-brand-200 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-800/50"
                                : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                            )
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {l.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </Motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
