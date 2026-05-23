import { motion as Motion } from "framer-motion";

const blobTransition = {
  duration: 22,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
};

export function AuthBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-[#071225] to-[#020617]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(56,189,248,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(99,102,241,0.18),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(14,165,233,0.12),transparent_45%)]" />

      <Motion.div
        className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-sky-500/25 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.05, 1] }}
        transition={blobTransition}
      />
      <Motion.div
        className="absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-indigo-500/20 blur-[90px]"
        animate={{ x: [0, -36, 0], y: [0, 48, 0], scale: [1, 1.08, 1] }}
        transition={{ ...blobTransition, duration: 26 }}
      />
      <Motion.div
        className="absolute bottom-0 left-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[110px]"
        animate={{ y: [0, -30, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ ...blobTransition, duration: 18 }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.65))]" />
    </div>
  );
}
