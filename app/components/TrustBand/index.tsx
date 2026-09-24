import {motion, useMotionValue, useReducedMotion, useScroll, useTransform} from "framer-motion";
import type {MotionValue} from "framer-motion";
import type {ReactNode} from "react";
import {useRef} from "react";
import Container from "~/components/Container";
import Reveal from "~/components/motion/Reveal";
import type {Stat, Testimonial} from "~/data/types";
import {useMediaQuery} from "~/hooks/useMediaQuery";
import {cn} from "~/lib/utils";

type TrustBandProps = {
  stats: Stat[];
  /** Only an approved quote — placeholder copy never reaches this band. */
  testimonial?: Testimonial;
  responseTime?: string;
};

/** Where each card floats before it settles, by grid position. Pixels and degrees. */
type Scatter = {x: number; y: number; tilt: number; turn: number; roll: number};

const SCATTER: Scatter[] = [
  {x: -220, y: -120, tilt: 24, turn: -30, roll: -8},
  {x: 200, y: -160, tilt: -18, turn: 34, roll: 10},
  {x: 280, y: -60, tilt: 30, turn: 20, roll: 6},
  {x: -280, y: 90, tilt: -26, turn: -24, roll: -12},
  {x: -120, y: 150, tilt: 14, turn: 40, roll: 14},
  {x: 140, y: 190, tilt: -30, turn: -18, roll: -6},
  {x: 300, y: 120, tilt: 22, turn: -28, roll: 9},
];

const scatterAt = (position: number): Scatter =>
  SCATTER[position % SCATTER.length] ?? {x: 0, y: 0, tilt: 0, turn: 0, roll: 0};

/**
 * The trust band under the hero. Frosted cards — a client's words, the track
 * record, what the client's own customers get, the next step — float scattered
 * and snap into a tidy grid as you scroll: mess into order, which is the job.
 * Phones and reduced motion get the settled grid, unpinned.
 */
const TrustBand = ({stats, testimonial, responseTime}: TrustBandProps) => {
  const trackRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useReducedMotion();
  const pinned = isDesktop && !prefersReducedMotion;

  const {scrollYProgress} = useScroll({target: trackRef, offset: ["start start", "end end"]});
  const settled = useMotionValue(1);
  const progress = pinned ? scrollYProgress : settled;

  const featuredStats = stats.slice(0, 2);

  return (
    <section
      id="trust"
      ref={trackRef}
      aria-labelledby="trust-heading"
      className={cn("relative", pinned ? "h-[220vh]" : "py-16 sm:py-20")}
    >
      <div className={cn("relative overflow-hidden", pinned && "sticky top-0 flex h-screen items-center")}>
        <Glow />

        <Container className="relative w-full">
          <Reveal className="mb-10 grid gap-3 text-center lg:mb-14">
            <p className="label m-0">Why businesses trust us</p>
            <h2
              id="trust-heading"
              className="m-0 text-balance font-display text-[clamp(30px,4.2vw,60px)] font-normal leading-[1.04] tracking-[-0.02em]"
            >
              Your business, running smoothly <span className="text-accent">online.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {testimonial ? (
              <GlassCard progress={progress} scatter={scatterAt(0)} className="col-span-2">
                <blockquote className="m-0 font-display text-[clamp(18px,1.6vw,22px)] leading-snug text-ink">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <p className="m-0 mt-2 text-[13px] text-ink-soft">
                  {testimonial.name} · {testimonial.role}, {testimonial.company}
                </p>
              </GlassCard>
            ) : null}

            {featuredStats.map((stat, i) => (
              <GlassCard key={stat.id} progress={progress} scatter={scatterAt(1 + i)}>
                <span className="font-display text-[clamp(36px,3.6vw,52px)] leading-none">
                  {stat.value}
                </span>
                <span className="text-[13px] text-ink-soft">{stat.label}</span>
              </GlassCard>
            ))}

            <GlassCard progress={progress} scatter={scatterAt(3)}>
              <CardTitle kicker="Bookings">Your customers book online</CardTitle>
              <span className="text-[13px] text-ink-soft">
                Appointments, stays and orders, straight from your website.
              </span>
            </GlassCard>

            <GlassCard progress={progress} scatter={scatterAt(4)}>
              <CardTitle kicker="Payments">Your customers pay online</CardTitle>
              <span className="text-[13px] text-ink-soft">
                Razorpay and Stripe checkout, tested before launch.
              </span>
            </GlassCard>

            <GlassCard progress={progress} scatter={scatterAt(5)} className="col-span-2 lg:col-span-1">
              <CardTitle kicker="Every screen">Works on phones and laptops</CardTitle>
              <span className="text-[13px] text-ink-soft">One website, built for every screen.</span>
            </GlassCard>

            <GlassCard
              progress={progress}
              scatter={scatterAt(6)}
              className="col-span-2 border-accent/50 bg-accent/15 lg:col-span-1"
            >
              <CardTitle kicker="Next step">Tell us about your idea</CardTitle>
              {responseTime ? (
                <span className="text-[13px] text-ink-soft">We reply {responseTime.toLowerCase()}.</span>
              ) : null}
              <a
                href="#contact"
                className="mt-2 inline-flex w-fit items-center rounded-sm bg-accent px-4 py-2.5 text-[14px] font-medium text-paper"
              >
                Start the conversation
              </a>
            </GlassCard>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default TrustBand;

type GlassCardProps = {
  progress: MotionValue<number>;
  scatter: Scatter;
  className?: string;
  children: ReactNode;
};

const GlassCard = ({progress, scatter, className, children}: GlassCardProps) => {
  const x = useTransform(progress, [0, 0.65], [scatter.x, 0]);
  const y = useTransform(progress, [0, 0.65], [scatter.y, 0]);
  const rotateX = useTransform(progress, [0, 0.65], [scatter.tilt, 0]);
  const rotateY = useTransform(progress, [0, 0.65], [scatter.turn, 0]);
  const rotateZ = useTransform(progress, [0, 0.65], [scatter.roll, 0]);

  return (
    <motion.div
      style={{x, y, rotateX, rotateY, rotateZ, transformPerspective: 900}}
      className={cn(
        "grid content-start gap-1.5 rounded-2xl border border-ink/15 bg-ink/[0.06] p-4 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

type CardTitleProps = {kicker: string; children: ReactNode};

const CardTitle = ({kicker, children}: CardTitleProps) => (
  <>
    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{kicker}</span>
    <span className="text-[15px] font-medium leading-snug text-ink sm:text-[16px]">{children}</span>
  </>
);

/** Warm blobs behind the glass — CSS only, no WebGL needed for a blur. */
const Glow = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
    <span className="absolute left-[12%] top-[20%] h-[380px] w-[380px] rounded-full bg-accent/60 blur-[90px] animate-[drift_22s_ease-in-out_infinite] motion-reduce:animate-none" />
    <span className="absolute right-[10%] top-[35%] h-[460px] w-[460px] rounded-full bg-[#8a3d14]/70 blur-[100px] animate-[drift_28s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
    <span className="absolute bottom-[8%] left-[40%] h-[300px] w-[300px] rounded-full bg-[#f2b27a]/40 blur-[90px] animate-[drift_18s_ease-in-out_infinite] motion-reduce:animate-none" />
  </div>
);
