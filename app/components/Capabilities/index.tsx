import {motion, useReducedMotion} from "framer-motion";
import {useMemo} from "react";
import Container from "~/components/Container";
import Reveal, {RESOLVE_EASE} from "~/components/motion/Reveal";
import ThreeStage from "~/components/three/ThreeStage";
import type {OrbitData} from "~/components/three/scenes/orbit";
import type {Capability} from "~/data/types";
import {useSceneAvailability} from "~/hooks/useSceneAvailability";
import {cn} from "~/lib/utils";

const loadOrbit = () =>
  import("~/components/three/scenes/orbit").then((module) => module.mountOrbit);

type CapabilitiesProps = {
  capabilities: Capability[];
  /** Orbit the outer ring of the 3D intro. */
  clients: string[];
};

/**
 * Desktop with motion opens on a pinned orbit — the client's business at the
 * centre, our services close in, past clients further out. The card grid below
 * carries the detail either way.
 */
const Capabilities = ({capabilities, clients}: CapabilitiesProps) => {
  const prefersReducedMotion = useReducedMotion();
  const {sceneEnabled, markSceneUnavailable} = useSceneAvailability();
  const sceneData = useMemo<OrbitData>(
    () => ({services: capabilities.map(({title}) => title), clients}),
    [capabilities, clients],
  );

  return (
    <section
      id="capabilities"
      className={cn("scroll-mt-20", sceneEnabled ? "pb-16 lg:pb-[132px]" : "py-16 lg:py-[132px]")}
    >
      {sceneEnabled ? (
        <ThreeStage
          loadScene={loadOrbit}
          data={sceneData}
          screens={2.4}
          onUnavailable={markSceneUnavailable}
        >
          {() => (
            <Container className="flex h-full items-center">
              <div className="grid max-w-[460px] gap-4">
                <CapabilitiesIntro />
              </div>
            </Container>
          )}
        </ThreeStage>
      ) : (
        <Container>
          <Reveal className="mb-10 grid gap-4 md:grid-cols-[140px_1fr] md:gap-12 lg:mb-16">
            <CapabilitiesIntro />
          </Reveal>
        </Container>
      )}

      <Container>
        <div className="grid gap-px border border-rule-soft bg-rule-soft sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({id, eyebrow, title, summary, tools}, i) => (
            <motion.article
              key={id}
              initial={prefersReducedMotion ? false : {opacity: 0, y: 16}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "0px 0px -6% 0px"}}
              transition={{duration: 0.6, ease: RESOLVE_EASE, delay: (i % 3) * 0.08}}
              className="bg-paper p-6 transition-colors duration-300 hover:bg-paper-lift lg:p-[34px]"
            >
              <p className="label">{eyebrow}</p>
              <h3 className="mb-2.5 mt-3.5 font-display text-[23px] font-normal tracking-[-0.01em]">
                {title}
              </h3>
              <p className="m-0 mb-4 text-[14.5px] text-ink-soft">{summary}</p>
              <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-sm border border-rule-soft px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] text-ink-faint"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Capabilities;

/** Label then heading; the parent decides whether they stack or sit side by side. */
const CapabilitiesIntro = () => (
  <>
    <p className="label m-0">03 — What we do</p>
    <div>
      <h2 className="m-0 max-w-[20ch] text-balance font-display text-[clamp(28px,4vw,52px)] font-normal leading-[1.08] tracking-[-0.015em]">
        Everything your business needs online, <span className="text-accent">from one team.</span>
      </h2>
      <p className="mt-3.5 max-w-[48ch] text-ink-soft">
        Website, app, bookings, payments and aftercare — built and looked after by the same
        people, so nothing gets lost between teams.
      </p>
    </div>
  </>
);
