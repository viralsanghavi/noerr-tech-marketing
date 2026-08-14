import {motion, useReducedMotion} from "framer-motion";
import type {ReactNode} from "react";

export const RESOLVE_EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Scroll-triggered entrance used across every section, so the whole page
 * resolves with one motion vocabulary rather than per-section effects.
 */
const Reveal = ({children, delay = 0, className}: RevealProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : {opacity: 0, y: 18}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "0px 0px -8% 0px"}}
      transition={{duration: 0.7, ease: RESOLVE_EASE, delay}}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
