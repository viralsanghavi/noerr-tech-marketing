import Container from "~/components/Container";
import Reveal from "~/components/motion/Reveal";
import type {Fact} from "~/data/types";

type ContactProps = {email: string; facts: Fact[]};

const Contact = ({email, facts}: ContactProps) => (
  <section id="contact" className="scroll-mt-20 bg-well py-16 text-well-fg lg:py-[132px]">
    <Container className="grid items-start gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
      <Reveal>
        <p className="label text-well-muted">06 — Start</p>
        <h2 className="mb-5 mt-3.5 text-balance font-display text-[clamp(32px,5.4vw,68px)] font-normal leading-[1.05] tracking-[-0.02em]">
          Tell us what you&apos;re building.
        </h2>
        <p className="m-0 mb-7 max-w-[46ch] text-well-muted">
          Send the shape of it — what it does, who it&apos;s for, when you need it live.
          You&apos;ll get a considered reply, not a brochure.
        </p>
        <a
          href={`mailto:${email}`}
          className="inline-block border-b border-accent pb-1 font-display text-[clamp(20px,2.6vw,31px)] transition-colors hover:text-accent"
        >
          {email}
        </a>
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="m-0 flex flex-col border-t border-rule-well">
          {facts.map(({id, label, value}) => (
            <div
              key={id}
              className="flex justify-between gap-4 border-b border-rule-well py-[15px] text-sm"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-well-muted">
                {label}
              </dt>
              <dd className="m-0 text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Container>
  </section>
);

export default Contact;
