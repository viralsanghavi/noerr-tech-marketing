import {motion, useInView, useReducedMotion, useScroll, useTransform} from "framer-motion";
import {useEffect, useRef} from "react";
import Container from "~/components/Container";
import Reveal from "~/components/motion/Reveal";
import type {Project} from "~/data/site";
import {ALSO_SHIPPED, PROJECTS} from "~/data/site";
import {useMediaQuery} from "~/hooks/useMediaQuery";

/**
 * Panel width and gutter in vw; the sideways travel follows from them.
 * With 6 projects this is 269vw, so the pin needs 369vh of scroll — kept as the
 * literal `lg:h-[369vh]` below because Tailwind cannot read a computed value.
 * Change the panel geometry or the project count and that class moves with it.
 */
const PANEL_VW = 58;
const GAP_VW = 3;
const TRACK_VW = PROJECTS.length * (PANEL_VW + GAP_VW);
const TRAVEL_VW = TRACK_VW - 100 + GAP_VW;

const Work = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !prefersReducedMotion;

  const {scrollYProgress} = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${TRAVEL_VW}vw`]);

  return (
    <section id="work" className="scroll-mt-20 pt-20 lg:pt-32">
      <Container>
        <Reveal className="mb-12 grid gap-4 md:grid-cols-[160px_1fr] md:gap-12 lg:mb-16">
          <p className="label pt-3">01 — Selected work</p>
          <div>
            <h2 className="m-0 max-w-[18ch] text-balance font-display text-[clamp(32px,5.5vw,72px)] font-normal leading-[1.04] tracking-[-0.025em]">
              Live, in production, doing a job.
            </h2>
            <p className="mt-5 max-w-[54ch] text-lg text-ink-soft">
              Every panel is a recording of a real deployment you can open right now —
              designed, built and shipped by us.
            </p>
          </div>
        </Reveal>
      </Container>

      {/*
        Desktop pins this block and drives the strip sideways with scroll
        progress. Below lg it degrades to a native horizontal swipe, which is
        the gesture a phone already has.
      */}
      <div ref={trackRef} className="relative lg:h-[369vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
          <motion.div
            style={pinned ? {x} : undefined}
            className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:snap-none lg:gap-[3vw] lg:overflow-visible lg:px-[72px] lg:pb-0"
          >
            {PROJECTS.map((project) => (
              <ProjectPanel key={project.id} project={project} />
            ))}
          </motion.div>
        </div>
      </div>

      <Container className="mt-16 lg:mt-24">
        <Reveal className="border-t border-rule pt-10">
          <p className="label mb-8">Also shipped</p>
          <ul className="m-0 grid list-none gap-x-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {ALSO_SHIPPED.map(({id, name, sector, stack}) => (
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

type ProjectPanelProps = {
  project: Project;
};

const ProjectPanel = ({project}: ProjectPanelProps) => {
  const {index, name, sector, year, headline, summary, stack, image, video, href} = project;
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
