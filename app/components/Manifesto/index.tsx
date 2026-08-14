import {motion, useReducedMotion, useScroll, useTransform} from "framer-motion";
import {useRef} from "react";
import Container from "~/components/Container";
import ScrollLitText from "~/components/motion/ScrollLitText";

const STATEMENT =
  "Most studios hand over the first draft that compiles. We ship the third one — the version with nothing left to fix, built by the same people who designed it, and kept alive long after launch.";

/**
 * The pinned beat of the page: the section holds still while the statement
 * resolves and the three drafts converge into one line behind it.
 */
const Manifesto = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Two ghost rules slide into register with the solid one as you scroll.
  const topX = useTransform(scrollYProgress, [0, 0.75], ["-28%", "0%"]);
  const bottomX = useTransform(scrollYProgress, [0, 0.75], ["28%", "0%"]);
  const ghostFade = useTransform(scrollYProgress, [0, 0.75], [0.35, 0.1]);
  const countOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);

  return (
    <section ref={ref} className="relative h-[240vh] bg-paper-lift">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-24">
        <Container className="relative">
          <p className="label mb-10">02 — The promise</p>

          <ScrollLitText
            text={STATEMENT}
            accent={["third", "nothing"]}
            className="m-0 max-w-[20ch] font-display text-[clamp(28px,4.6vw,64px)] font-normal leading-[1.14] tracking-[-0.02em] lg:max-w-[24ch]"
          />

          {/* three rules converging — the mark's logic, drawn */}
          <div className="mt-16 flex flex-col gap-3" aria-hidden="true">
            <motion.span
              style={prefersReducedMotion ? undefined : {x: topX, opacity: ghostFade}}
              className="block h-px w-full bg-ink"
            />
            <span className="block h-0.5 w-full bg-accent" />
            <motion.span
              style={prefersReducedMotion ? undefined : {x: bottomX, opacity: ghostFade}}
              className="block h-px w-full bg-ink"
            />
          </div>

          <motion.p
            style={prefersReducedMotion ? undefined : {opacity: countOpacity}}
            className="label mt-6"
          >
            Three drafts in · one version out
          </motion.p>
        </Container>
      </div>
    </section>
  );
};

export default Manifesto;
