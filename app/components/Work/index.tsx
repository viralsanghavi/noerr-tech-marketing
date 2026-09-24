import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type {MotionValue} from "framer-motion";
import type {CSSProperties} from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import Container from "~/components/Container";
import Reveal from "~/components/motion/Reveal";
import ThreeStage from "~/components/three/ThreeStage";
import {focusedIndex} from "~/components/three/parallaxFocus";
import type {ParallaxData} from "~/components/three/scenes/parallax";
import type {Project, ShippedItem} from "~/data/types";
import {useMediaQuery} from "~/hooks/useMediaQuery";
import {useSceneAvailability} from "~/hooks/useSceneAvailability";

const loadParallax = () =>
  import("~/components/three/scenes/parallax").then((module) => module.mountParallax);

/** Panel width and gutter in vw; the sideways travel follows from them. */
const PANEL_VW = 58;
const GAP_VW = 3;

type WorkProps = {
  projects: Project[];
  alsoShipped: ShippedItem[];
};

const Work = ({projects, alsoShipped}: WorkProps) => {
  const {sceneEnabled, markSceneUnavailable} = useSceneAvailability();

  return (
    <section id="work" className="scroll-mt-20 pt-20 lg:pt-32">
      <Container>
        <Reveal className="mb-12 grid gap-4 md:grid-cols-[160px_1fr] md:gap-12 lg:mb-16">
          <p className="label pt-3">01 — Our work</p>
          <div>
            <h2 className="m-0 max-w-[18ch] text-balance font-display text-[clamp(32px,5.5vw,72px)] font-normal leading-[1.04] tracking-[-0.025em]">
              Real businesses, live right now.
            </h2>
            <p className="mt-5 max-w-[54ch] text-lg text-ink-soft">
              Every one of these is a real website you can open today — designed and built by
              us, for clinics, hotels, shops, clubs and more.
            </p>
          </div>
        </Reveal>
      </Container>

      {sceneEnabled ? (
        <ProjectFlythrough projects={projects} onUnavailable={markSceneUnavailable} />
      ) : (
        <ProjectStrip projects={projects} />
      )}

      <Container className="mt-16 lg:mt-24">
        <Reveal className="border-t border-rule pt-10">
          <p className="label mb-8">Also shipped</p>
          <ul className="m-0 grid list-none gap-x-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {alsoShipped.map(({id, name, sector, stack}) => (
              <li
                key={id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule-soft py-4"
              >
                <span className="font-display text-xl">{name}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">
                  {sector}
                </span>
                <span className="w-full font-mono text-[10.5px] tracking-[0.06em] text-ink-faint">
                  {stack}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
};

export default Work;

type ProjectStripProps = {projects: Project[]};

/**
 * The HTML fallback: desktop pins this block and drives the strip sideways
 * with scroll; below lg it's a native horizontal swipe.
 */
const ProjectStrip = ({projects}: ProjectStripProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !prefersReducedMotion;

  /**
   * Travel is how far the strip slides; the track is that plus the one viewport
   * the sticky child occupies, which keeps the pace at roughly one vw of strip
   * per vh of scroll. Both follow from the project count, so adding a project is
   * just a content change.
   *
   * Passed to CSS as a custom property rather than an inline height so the `lg:`
   * breakpoint still decides whether it applies at all — no JS gate, no shift on
   * hydration.
   */
  const travelVw = projects.length * (PANEL_VW + GAP_VW) - 100 + GAP_VW;
  const trackStyle: CSSProperties & Record<"--track-height", string> = {
    "--track-height": `${travelVw + 100}vh`,
  };

  const {scrollYProgress} = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${travelVw}vw`]);

  return (
    <div ref={trackRef} style={trackStyle} className="relative lg:h-[var(--track-height)]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <motion.div
          style={pinned ? {x} : undefined}
          className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:snap-none lg:gap-[3vw] lg:overflow-visible lg:px-[72px] lg:pb-0"
        >
          {projects.map((project, position) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={String(position + 1).padStart(2, "0")}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

type ProjectFlythroughProps = {
  projects: Project[];
  onUnavailable: () => void;
};

/**
 * Desktop with motion: the camera flies past each client site in 3D, the one in
 * focus sharp and the rest soft, with its name and live link beside it.
 */
const ProjectFlythrough = ({projects, onUnavailable}: ProjectFlythroughProps) => {
  const sceneData = useMemo<ParallaxData>(
    () => ({posters: projects.map(({image}) => image)}),
    [projects],
  );

  return (
    <>
      <ThreeStage
        loadScene={loadParallax}
        data={sceneData}
        screens={1 + projects.length * 0.7}
        onUnavailable={onUnavailable}
      >
        {(progress) => <FocusedProject projects={projects} progress={progress} />}
      </ThreeStage>

      {/* The canvas can't be tabbed through, so every live link is here too. */}
      <ul className="sr-only">
        {projects.map(({id, name, sector, href}) => (
          <li key={id}>
            <a href={href} target="_blank" rel="noreferrer">
              {name}, {sector} — open the live site
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

type FocusedProjectProps = {
  projects: Project[];
  progress: MotionValue<number>;
};

const FocusedProject = ({projects, progress}: FocusedProjectProps) => {
  const [index, setIndex] = useState(0);
  useMotionValueEvent(progress, "change", (latest) => {
    setIndex(focusedIndex(latest, projects.length));
  });

  const project = projects[index];
  if (!project) return null;
  const {id, name, sector, year, headline, summary, href} = project;

  return (
    <Container className="flex h-full flex-col justify-end pb-16">
      <motion.div
        key={id}
        initial={{opacity: 0, y: 12}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.45}}
        aria-hidden="true"
        className="max-w-[400px]"
      >
        <div className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-rule" />
          <span>{sector}</span>
          <span>·</span>
          <span>{year}</span>
        </div>
        <h3 className="m-0 font-display text-[clamp(26px,2.6vw,38px)] font-normal leading-[1.05] tracking-[-0.02em]">
          {name}
        </h3>
        <p className="mb-3 mt-2 font-display text-lg italic text-accent">{headline}</p>
        <p className="m-0 mb-5 line-clamp-3 text-[15px] text-ink-soft">{summary}</p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          className="inline-flex items-center rounded-sm border border-rule bg-paper/70 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink backdrop-blur-sm transition-colors hover:border-ink"
        >
          Open live site ↗
        </a>
      </motion.div>
    </Container>
  );
};

type ProjectPanelProps = {
  project: Project;
  /** Display number, derived from list position so reordering can't desync it. */
  index: string;
};

const ProjectPanel = ({project, index}: ProjectPanelProps) => {
  const {name, sector, year, headline, summary, stack, image, video, href} = project;
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(panelRef, {margin: "0px 0px -10% 0px"});

  // Only the panels on screen decode video; the rest stay parked on their poster.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || prefersReducedMotion) return;

    if (inView) {
      const attempt = el.play();
      if (attempt) attempt.catch(() => undefined);
    } else {
      el.pause();
    }
  }, [inView, prefersReducedMotion]);

  return (
    <article
      ref={panelRef}
      style={{width: `${PANEL_VW}vw`}}
      className="w-[86vw] flex-shrink-0 snap-center sm:w-[70vw] lg:!w-[58vw]"
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden rounded-lg border border-rule bg-well"
        aria-label={`${name} — open the live site`}
      >
        <div className="relative overflow-hidden">
          <video
            ref={videoRef}
            poster={image}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`${name} — recording of the live site`}
            className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-resolve group-hover:scale-[1.03]"
          >
            <source src={video.replace(".mp4", ".webm")} type="video/webm" />
            <source src={video} type="video/mp4" />
          </video>

          <span className="pointer-events-none absolute bottom-4 right-4 translate-y-2 rounded-sm bg-paper/90 px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Open live site ↗
          </span>
        </div>
      </a>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:gap-10">
        <div>
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            <span className="text-accent">{index}</span>
            <span className="h-px w-8 bg-rule" />
            <span>{sector}</span>
            <span>·</span>
            <span>{year}</span>
          </div>
          <h3 className="m-0 font-display text-[clamp(24px,2.6vw,38px)] font-normal leading-[1.05] tracking-[-0.02em]">
            {name}
          </h3>
          <p className="mb-3 mt-2 font-display text-lg italic text-accent">{headline}</p>
          <p className="m-0 line-clamp-3 max-w-[54ch] text-[15px] text-ink-soft">{summary}</p>
        </div>

        <ul className="m-0 flex list-none flex-wrap content-start gap-2 p-0 lg:max-w-[180px]">
          {stack.map((tool) => (
            <li
              key={tool}
              className="rounded-sm border border-rule-soft px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] text-ink-faint"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
