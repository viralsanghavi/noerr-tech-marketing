import {motion, useReducedMotion} from "framer-motion";


/**
 * One continuous rail of the stack we actually ship on. Two identical tracks
 * sit side by side and the pair slides exactly one track-width, so the loop
 * has no seam.
 */
type MarqueeProps = {items: string[]};

const Marquee = ({items}: MarqueeProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="overflow-hidden border-y border-rule py-6">
        <ul className="m-0 flex list-none flex-wrap justify-center gap-x-10 gap-y-3 px-5 p-0">
          {items.map((item) => (
            <li key={item} className="font-display text-2xl text-ink-faint">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-y border-rule py-7">
      <motion.div
        animate={{x: ["0%", "-50%"]}}
        transition={{duration: 38, ease: "linear", repeat: Infinity}}
        className="flex w-max"
      >
        {[0, 1].map((track) => (
          <ul key={track} className="m-0 flex list-none items-center p-0" aria-hidden={track === 1}>
            {items.map((item) => (
              <li key={item} className="flex items-center whitespace-nowrap">
                <span className="px-8 font-display text-[clamp(22px,2.4vw,34px)] text-ink-faint transition-colors hover:text-ink">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
};

export default Marquee;
