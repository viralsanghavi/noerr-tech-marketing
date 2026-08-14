import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type {MotionProps, MotionValue, Variants} from "framer-motion";
import {useRef} from "react";
import type {PointerEvent as ReactPointerEvent} from "react";
import Container from "~/components/Container";
import Wordmark from "~/components/Wordmark";
import {RESOLVE_EASE} from "~/components/motion/Reveal";
import {PROJECTS, STATS} from "~/data/site";

const rise: Variants = {
  initial: {opacity: 0, y: 24},
  animate: {opacity: 1, y: 0, transition: {duration: 0.9, ease: RESOLVE_EASE}},
};

const SHOWREEL = PROJECTS.slice(0, 3);

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const start = prefersReducedMotion ? "animate" : "initial";
  const sectionRef = useRef<HTMLElement>(null);

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const plateFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <header id="top" ref={sectionRef} className="relative overflow-hidden pt-10 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[900px] w-[1200px] -translate-x-1/2 rounded-full opacity-[0.16] blur-[120px]"
        style={{background: "radial-gradient(closest-side, rgb(var(--accent)), transparent)"}}
      />

      <Container className="relative">
        <EchoMark reduced={Boolean(prefersReducedMotion)} />

        <motion.div
          variants={rise}
          initial={start}
          animate="animate"
          transition={{delay: 0.5}}
          className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
        >
          <div>
            <p className="label mb-5">Product studio · Mumbai · Design &amp; engineering</p>
            <h1 className="m-0 text-balance font-display text-[clamp(34px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em]">
              We build the version
              <br />
              that <span className="text-accent">ships clean</span>.
            </h1>
          </div>

          <div className="flex flex-col justify-end gap-7 pb-2">
            <p className="m-0 max-w-[52ch] text-[clamp(15px,1.4vw,18px)] leading-relaxed text-ink-soft">
              Three drafts, one that holds up in production. Interface, web, mobile,
              backend, payments — designed and engineered by the same team, then
              maintained after launch.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <motion.a
                href="#work"
                whileHover={{y: -2}}
                whileTap={{y: 0}}
                transition={{duration: 0.2}}
                className="inline-flex items-center rounded-sm bg-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.12em] text-paper"
              >
                See the work
              </motion.a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-sm border border-rule px-7 py-4 font-mono text-xs uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Start a project
              </a>
            </div>
          </div>
        </motion.div>
      </Container>

      <motion.div
        style={prefersReducedMotion ? undefined : {y: plateY, opacity: plateFade}}
        className="relative mt-14 lg:mt-24"
      >
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
            {SHOWREEL.map((project, i) => (
              <motion.figure
                key={project.id}
                initial={prefersReducedMotion ? false : {opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0, rotate: i === 0 ? -1.5 : i === 2 ? 1.5 : 0}}
                transition={{duration: 1, ease: RESOLVE_EASE, delay: 0.7 + i * 0.12}}
                className={
                  i === 1
                    ? "m-0 overflow-hidden rounded-md border border-rule bg-well sm:-translate-y-6"
                    : "m-0 overflow-hidden rounded-md border border-rule bg-well"
                }
              >
                <img
                  src={project.image}
                  alt={`${project.name} — live deployment`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="block aspect-[16/10] w-full object-cover object-top"
                />
              </motion.figure>
            ))}
          </div>
        </Container>
      </motion.div>

      <div className="mt-16 border-y border-rule lg:mt-24">
        <Container className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map(({id, value, label}, i) => (
            <motion.div
              key={id}
              initial={prefersReducedMotion ? false : {opacity: 0, y: 14}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, ease: RESOLVE_EASE, delay: i * 0.08}}
              className="border-l border-rule-soft py-8 pl-[22px] first:border-l-0 first:pl-0 md:[&:nth-child(3)]:border-l"
            >
              <b className="block font-display text-[clamp(36px,5vw,60px)] font-normal leading-none tracking-[-0.02em] tabular-nums">
                {value}
              </b>
              <span className="label mt-2.5 block">{label}</span>
            </motion.div>
          ))}
        </Container>
      </div>
    </header>
  );
};

export default Hero;

const ECHO_TYPE =
  "block font-display text-[clamp(48px,12.5vw,176px)] leading-[0.8] tracking-[-0.03em]";

type EchoMarkProps = {
  reduced: boolean;
};

/**
 * The mark is the pitch, so it is playable: the pointer pulls the two ghost
 * drafts away from the resolved line, and letting go springs them back into
 * register. Drift out, resolve back — the studio's whole argument in one gesture.
 */
const EchoMark = ({reduced}: EchoMarkProps) => {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = {stiffness: 110, damping: 16, mass: 0.7};
  const sx = useSpring(pointerX, spring);
  const sy = useSpring(pointerY, spring);

  const topX = useTransform(sx, [-0.5, 0.5], [70, -70]);
  const topY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const bottomX = useTransform(sx, [-0.5, 0.5], [-70, 70]);
  const bottomY = useTransform(sy, [-0.5, 0.5], [-16, 16]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const releasePointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      aria-hidden="true"
      onPointerMove={reduced ? undefined : handlePointerMove}
      onPointerLeave={reduced ? undefined : releasePointer}
      className="relative flex cursor-crosshair flex-col"
    >
      <EchoLine
        reduced={reduced}
        from={{opacity: 0, x: "-0.36em"}}
        to={{opacity: 0.12, x: 0}}
        delay={0.1}
        x={reduced ? undefined : topX}
        y={reduced ? undefined : topY}
      />

      <EchoLine
        reduced={reduced}
        from={{opacity: 0, y: "0.16em"}}
        to={{opacity: 1, y: 0}}
        delay={0.16}
      />

      <EchoLine
        reduced={reduced}
        from={{opacity: 0, x: "0.32em"}}
        to={{opacity: 0.12, x: 0}}
        delay={0.22}
        x={reduced ? undefined : bottomX}
        y={reduced ? undefined : bottomY}
      />

      <span className="label absolute -bottom-1 right-0 hidden opacity-60 lg:block">
        ← drag your cursor across
      </span>
    </div>
  );
};

type EchoLineProps = {
  reduced: boolean;
  from: MotionProps["initial"];
  to: MotionProps["animate"];
  delay: number;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
};

/**
 * Each line drives its own entrance rather than inheriting a parent variant,
 * so the pointer-driven inner transform can't interfere with it.
 */
const EchoLine = ({reduced, from, to, delay, x, y}: EchoLineProps) => (
  <motion.span
    initial={reduced ? false : from}
    animate={to}
    transition={{duration: 1.1, ease: RESOLVE_EASE, delay}}
    className={ECHO_TYPE}
  >
    <motion.span style={{x, y}} className="block">
      <Wordmark />
    </motion.span>
  </motion.span>
);
