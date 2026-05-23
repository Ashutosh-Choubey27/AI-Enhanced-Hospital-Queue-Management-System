import clsx from "clsx";
import { motion as Motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { StaggeredReveal, StaggerItem } from "./loading/StaggeredReveal";

export function PageShell({ title, subtitle, actions, children, maxWidth = "max-w-7xl", contentClassName }) {
  return (
    <div className="min-h-full">
      <div className="flex min-h-full">
        <Sidebar />
        <div className="flex min-h-full flex-1 flex-col">
          <Topbar />
          <main className={clsx("mx-auto w-full flex-1 px-4 py-6 lg:px-6", maxWidth)}>
            <StaggeredReveal>
              <StaggerItem>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <Motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{title}</h1>
                    {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
                  </Motion.div>
                  {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
                </div>
              </StaggerItem>
              <StaggerItem className={contentClassName}>{children}</StaggerItem>
            </StaggeredReveal>
          </main>
        </div>
      </div>
    </div>
  );
}

