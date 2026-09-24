import {motion, useReducedMotion} from "framer-motion";
import type {Variants} from "framer-motion";
import {useMemo} from "react";
import Container from "~/components/Container";
import {RESOLVE_EASE} from "~/components/motion/Reveal";
import ThreeStage from "~/components/three/ThreeStage";
import type {ExplodedData} from "~/components/three/scenes/exploded";
import type {Project} from "~/data/types";
import {useSceneAvailability} from "~/hooks/useSceneAvailability";

const rise: Variants = {
  initial: {opacity: 0, y: 24},
  animate: {opacity: 1, y: 0, transition: {duration: 0.9, ease: RESOLVE_EASE}},
};

const loadExploded = () =>
  import("~/components/three/scenes/exploded").then((module) => module.mountExploded);

type HeroProps = {
  /** The client site shown inside the exploded website (or framed, without 3D). */
  showcase: Project;
  clients: string[];
  responseTime?: string;
};

/**
 * Desktop with motion: the copy sits over a pinned 3D website that pulls apart
 * into the five things a client pays for. Everywhere else: the same copy beside
 * a framed screenshot of a real client site.
 */
const Hero = ({showcase, clients, responseTime}: HeroProps) => {
  const {sceneEnabled, markSceneUnavailable} = useSceneAvailability();
  const sceneData = useMemo<ExplodedData>(() => ({poster: showcase.image}), [showcase.image]);

  const copy = (
    <HeroCopy clients={clients} responseTime={responseTime} showScrollHint={sceneEnabled} />
  );

  return (
    // `clip`, not `hidden`: hidden would make this a scroll container and break
    // the sticky 3D stage, while clip still stops the glow widening the page.
    <header id="top" className="relative overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[900px] w-[1200px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[120px]"
        style={{background: "radial-gradient(closest-side, rgb(var(--accent)), transparent)"}}
      />

      {sceneEnabled ? (
        <ThreeStage
          loadScene={loadExploded}
          data={sceneData}
          screens={2.6}
          onUnavailable={markSceneUnavailable}
        >
          {() => <Container className="flex h-full items-center">{copy}</Container>}
        </ThreeStage>
      ) : (
        <Container className="relative grid gap-12 pb-16 pt-10 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-16">
          {copy}
          <figure className="m-0 overflow-hidden rounded-md border border-rule bg-well">
            <div className="flex h-7 items-center gap-1.5 border-b border-rule px-3" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-rule" />
              <span className="h-2 w-2 rounded-full bg-rule" />
              <span className="h-2 w-2 rounded-full bg-rule" />
            </div>
            <img
              src={showcase.image}
              alt={`${showcase.name} — a live website we built`}
              className="block aspect-[16/10] w-full object-cover object-top"
            />
          </figure>
        </Container>
      )}
    </header>
  );
};

export default Hero;

type HeroCopyProps = {
  clients: string[];
  responseTime?: string;
  showScrollHint: boolean;
};

const HeroCopy = ({clients, responseTime, showScrollHint}: HeroCopyProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={rise}
      initial={prefersReducedMotion ? "animate" : "initial"}
      animate="animate"
      className="relative grid max-w-[540px] gap-6"
    >
      <p className="label m-0">Websites &amp; apps for growing businesses</p>
      <h1 className="m-0 text-balance font-display text-[clamp(36px,4.6vw,68px)] font-normal leading-[1.03] tracking-[-0.025em]">
        Everything your website needs, <span className="text-accent">built by one team.</span>
      </h1>
      <p className="m-0 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-ink-soft">
        We design it, build it, launch it, and stay on to keep it running. No hand-offs, no
        disappearing act.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <motion.a
          href="#contact"
          whileHover={{y: -2}}
          whileTap={{y: 0}}
          transition={{duration: 0.2}}
          className="inline-flex items-center rounded-sm bg-accent px-6 py-4 text-[15px] font-medium text-paper"
        >
          Tell us about your idea
        </motion.a>
        <a
          href="#work"
          className="inline-flex items-center rounded-sm border border-rule px-6 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink"
        >
          See our work
        </a>
      </div>

      {responseTime ? (
        <p className="m-0 flex items-center gap-2 text-[13px] text-ink-faint">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#8FBF7A]" />
          We reply {responseTime.charAt(0).toLowerCase() + responseTime.slice(1)}
        </p>
      ) : null}

      <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-rule pt-5 text-[13px] text-ink-soft">
        <span className="label">Trusted by</span>
        {clients.slice(0, 4).map((client) => (
          <span key={client}>{client}</span>
        ))}
      </p>

      {showScrollHint ? (
        <p className="label m-0 opacity-70">Scroll to see what&rsquo;s inside ↓</p>
      ) : null}
    </motion.div>
  );
};
