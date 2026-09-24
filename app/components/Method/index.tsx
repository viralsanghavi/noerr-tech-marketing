import {motion, useReducedMotion, useTransform} from "framer-motion";
import type {MotionValue} from "framer-motion";
import Container from "~/components/Container";
import Reveal, {RESOLVE_EASE} from "~/components/motion/Reveal";
import ThreeStage from "~/components/three/ThreeStage";
import type {MethodStep} from "~/data/types";
import {useSceneAvailability} from "~/hooks/useSceneAvailability";
import {cn} from "~/lib/utils";

const loadBuild = () =>
  import("~/components/three/scenes/build").then((module) => module.mountBuild);

type MethodProps = {steps: MethodStep[]};

/**
 * Desktop with motion: a pinned isometric build — plot, outlines, buildings,
 * lights — with the steps beside it filling in as each phase plays. Elsewhere:
 * the four steps as a grid.
 */
const Method = ({steps}: MethodProps) => {
  const prefersReducedMotion = useReducedMotion();
  const {sceneEnabled, markSceneUnavailable} = useSceneAvailability();

  return (
    <section
      id="method"
      className={cn("scroll-mt-20 bg-paper-lift", !sceneEnabled && "py-20 lg:py-32")}
    >
      {sceneEnabled ? (
        <ThreeStage
          loadScene={loadBuild}
          data={null}
          screens={3}
          onUnavailable={markSceneUnavailable}
        >
          {(progress) => (
            <Container className="flex h-full items-center">
              <div className="grid max-w-[440px] gap-8">
                <div className="grid gap-3">
                  <MethodIntro size="compact" />
                </div>
                <ol className="m-0 grid list-none gap-4 p-0">
                  {steps.map((step, i) => (
                    <StepProgress
                      key={step.id}
                      step={step}
                      position={i}
                      count={steps.length}
                      progress={progress}
                    />
                  ))}
                </ol>
              </div>
            </Container>
          )}
        </ThreeStage>
      ) : (
        <Container>
          <Reveal className="mb-12 grid gap-4 md:grid-cols-[160px_1fr] md:gap-12 lg:mb-20">
            <MethodIntro size="full" />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
            {steps.map(({id, eyebrow, title, summary, resolved}, i) => (
              <div key={id} className="pt-[18px]">
                <motion.span
                  initial={prefersReducedMotion ? false : {scaleX: 0}}
                  whileInView={{scaleX: 1}}
                  viewport={{once: true}}
                  transition={{duration: 0.7, ease: RESOLVE_EASE, delay: i * 0.1}}
                  className={cn("mb-3 block h-0.5 origin-left", resolved ? "bg-accent" : "bg-ink")}
                />
                <motion.div
                  initial={prefersReducedMotion ? false : {opacity: 0, y: 14}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.6, ease: RESOLVE_EASE, delay: i * 0.1 + 0.15}}
                >
                  <p className="label">{eyebrow}</p>
                  <h3 className="mb-2 mt-3 font-display text-[21px] font-normal">{title}</h3>
                  <p className="m-0 text-[14.5px] text-ink-soft">{summary}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      )}
    </section>
  );
};

export default Method;

type MethodIntroProps = {
  /** Compact fits beside the pinned scene, where the steps share the viewport. */
  size: "compact" | "full";
};

const MethodIntro = ({size}: MethodIntroProps) => (
  <>
    <p className={cn("label m-0", size === "full" && "pt-3")}>04 — How we work</p>
    <div>
      <h2
        className={cn(
          "m-0 max-w-[18ch] text-balance font-display font-normal leading-[1.04] tracking-[-0.025em]",
          size === "full" ? "text-[clamp(32px,4.6vw,64px)]" : "text-[clamp(28px,3vw,44px)]",
        )}
      >
        No jargon. No surprises. <span className="text-accent">You see every step.</span>
      </h2>
      <p className={cn("max-w-[48ch] text-ink-soft", size === "full" ? "mt-5 text-lg" : "mt-3 text-[15px]")}>
        You approve each step before we move to the next — and once it&rsquo;s live, we stay to
        keep it running.
      </p>
    </div>
  </>
);

type StepProgressProps = {
  step: MethodStep;
  position: number;
  count: number;
  progress: MotionValue<number>;
};

/** One step in the pinned list: lights up when its phase starts, fills as it plays. */
const StepProgress = ({step, position, count, progress}: StepProgressProps) => {
  const start = position / count;
  const end = (position + 1) / count;
  const fill = useTransform(progress, [start, end - 0.03], [0, 1]);
  const opacity = useTransform(progress, [start - 0.05, start], [0.4, 1]);

  return (
    <li>
      <motion.div style={{opacity}}>
        <p className="label m-0">{step.eyebrow}</p>
        <h3 className="mb-1 mt-1.5 font-display text-[21px] font-normal">{step.title}</h3>
        <p className="m-0 line-clamp-1 text-[13.5px] text-ink-soft">{step.summary}</p>
      </motion.div>
      <span aria-hidden="true" className="relative mt-2.5 block h-px bg-rule">
        <motion.span
          style={{scaleX: fill}}
          className={cn("absolute inset-0 block origin-left", step.resolved ? "bg-accent" : "bg-ink")}
        />
      </span>
    </li>
  );
};
