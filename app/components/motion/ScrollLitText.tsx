import {motion, useReducedMotion, useTransform} from "framer-motion";
import type {MotionValue} from "framer-motion";
import {cn} from "~/lib/utils";

/** How many words' worth of progress each word takes to light, so neighbours overlap. */
const WORD_SPAN = 1.6;

type ScrollLitTextProps = {
  text: string;
  /**
   * 0 → 1 across the reveal, owned by the caller. The text can't measure its own
   * position: inside a pinned section it stops moving, so its progress would stall.
   */
  progress: MotionValue<number>;
  className?: string;
  /** Words that should resolve in the accent colour rather than full ink. */
  accent?: string[];
};

/**
 * Text that lights word by word as it scrolls through the viewport — the
 * sentence resolving the same way a draft does. Progress drives opacity
 * directly, so the reveal scrubs with the scrollbar rather than firing once.
 */
const ScrollLitText = ({text, progress, className, accent = []}: ScrollLitTextProps) => {
  const prefersReducedMotion = useReducedMotion();

  const words = text.split(" ");

  if (prefersReducedMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <LitWord
          key={`${i}-${word}`}
          progress={progress}
          range={[i / (words.length + WORD_SPAN - 1), (i + WORD_SPAN) / (words.length + WORD_SPAN - 1)]}
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
