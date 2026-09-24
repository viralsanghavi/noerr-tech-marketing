import {motion, useReducedMotion} from "framer-motion";
import Container from "~/components/Container";
import Reveal, {RESOLVE_EASE} from "~/components/motion/Reveal";
import type {Testimonial} from "~/data/types";

type ClientsProps = {testimonials: Testimonial[]};

const Clients = ({testimonials}: ClientsProps) => (
  <section id="clients" className="scroll-mt-20 py-20 lg:py-32">
    <Container>
      <Reveal className="mb-12 grid gap-4 md:grid-cols-[160px_1fr] md:gap-12 lg:mb-20">
        <p className="label pt-3">05 — In their words</p>
        <div>
          <h2 className="m-0 max-w-[18ch] text-balance font-display text-[clamp(32px,5.5vw,72px)] font-normal leading-[1.04] tracking-[-0.025em]">
            What clients say.
          </h2>
          <p className="mt-5 max-w-[54ch] text-lg text-ink-soft">
            The work speaks first, but it helps to hear it from the people who had to
            live with the result.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        {testimonials.map((testimonial, i) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} order={i} />
        ))}
      </div>
    </Container>
  </section>
);

export default Clients;

type TestimonialCardProps = {
  testimonial: Testimonial;
  order: number;
};

const TestimonialCard = ({testimonial, order}: TestimonialCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const {quote, metric, name, role, company, initials} = testimonial;

  return (
    <motion.figure
      initial={prefersReducedMotion ? false : {opacity: 0, y: 26}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "0px 0px -8% 0px"}}
      transition={{duration: 0.7, ease: RESOLVE_EASE, delay: order * 0.1}}
      className="m-0 flex h-full flex-col gap-6 rounded-lg border border-rule bg-paper-lift p-6 lg:p-8"
    >
      <span className="inline-flex w-fit rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent">
        {metric}
      </span>

      <blockquote className="m-0 text-[17px] leading-relaxed text-ink">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-rule-soft pt-5">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-well font-mono text-[11px] tracking-[0.06em] text-ink-soft">
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="font-display text-lg leading-tight">{name}</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">
            {role} · {company}
          </span>
        </span>
      </figcaption>
    </motion.figure>
  );
};
