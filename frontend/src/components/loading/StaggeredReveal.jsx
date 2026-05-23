import { motion as Motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Staggered fade/slide-in for page sections (dashboard cards, grids).
 */
export function StaggeredReveal({ children, className }) {
  return (
    <Motion.div variants={container} initial="hidden" animate="visible" className={className}>
      {children}
    </Motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <Motion.div variants={item} className={className}>
      {children}
    </Motion.div>
  );
}
