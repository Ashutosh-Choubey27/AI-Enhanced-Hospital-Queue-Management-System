import { motion as Motion } from "framer-motion";
import { Activity, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { AppLogo } from "../brand/AppLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function AuthHeroPanel() {
  return (
    <div className="relative flex min-h-[38vh] flex-col justify-between overflow-hidden px-6 py-10 sm:px-10 lg:min-h-screen lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10" />
      <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl lg:top-32" />

      <Motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <AppLogo size="lg" variant="light" />
      </Motion.div>

      <div className="relative z-10 mt-8 flex flex-1 flex-col justify-center lg:mt-0">
        <Motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-sky-100/90 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky-300" />
          AI-assisted triage & live queue intelligence
        </Motion.div>

        <Motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]"
        >
          The control room for{" "}
          <span className="bg-gradient-to-r from-sky-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
            modern hospital flow
          </span>
          .
        </Motion.h1>

        <Motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-4 max-w-md text-sm leading-relaxed text-slate-300/90 sm:text-[15px]"
        >
          Secure access to appointments, live queue telemetry, and priority signals—built for clinicians and
          operations teams who need clarity under pressure.
        </Motion.p>

        <Motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {[
            { icon: Activity, title: "Live queue", sub: "Socket-backed updates" },
            { icon: ShieldCheck, title: "Secure sessions", sub: "JWT-backed API access" },
            { icon: HeartPulse, title: "Care-first UX", sub: "Built for bedside pace" },
          ].map((item) => {
            const FeatureIcon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-slate-950/30 backdrop-blur-md transition-colors duration-300 hover:border-sky-400/25 hover:bg-white/[0.07]"
              >
                <FeatureIcon className="h-5 w-5 text-sky-300" strokeWidth={1.75} />
                <div className="mt-2 text-sm font-semibold text-white">{item.title}</div>
                <div className="mt-0.5 text-xs text-slate-400">{item.sub}</div>
              </div>
            );
          })}
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="relative z-10 mt-10 hidden text-xs text-slate-500 lg:block"
      >
        © {new Date().getFullYear()} AI Hospital Queue System · Secure care operations
      </Motion.div>
    </div>
  );
}
