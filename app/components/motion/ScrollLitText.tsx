import {motion, useReducedMotion, useScroll, useTransform} from "framer-motion";
import type {MotionValue} from "framer-motion";
import {useRef} from "react";
import {cn} from "~/lib/utils";

type ScrollLitTextProps = {
  text: string;
  className?: string;
  /** Words that should resolve in the accent colour rather than full ink. */
  accent?: string[];
};

/**
 * Text that lights word by word as it scrolls through the viewport — the
 * sentence resolving the same way a draft does. Progress drives opacity
 * directly, so the reveal scrubs with the scrollbar rather than firing once.
 */
const ScrollLitText = ({text, className, accent = []}: ScrollLitTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });

  const words = text.split(" ");

  if (prefersReducedMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <LitWord
          key={`${i}-${word}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1.6) / words.length]}
          accented={accent.includes(word.replace(/[^A-Za-z]/g, ""))}
        >
          {word}
        </LitWord>
      ))}
    </p>
  );
};

export default ScrollLitText;

type LitWordProps = {
  progress: MotionValue<number>;
  range: [number, number];
  accented: boolean;
  children: string;
};

const LitWord = ({progress, range, accented, children}: LitWordProps) => {
  const opacity = useTransform(progress, range, [0.12, 1]);

  return (
    <span className="relative mr-[0.28em] inline-block">
      <span className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
        {children}
      </span>
      <motion.span style={{opacity}} className={accented ? "text-accent" : undefined}>
        {children}
      </motion.span>
    </span>
  );
};
