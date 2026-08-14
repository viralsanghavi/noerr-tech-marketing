import {motion, useReducedMotion} from "framer-motion";
import Container from "~/components/Container";
import Reveal, {RESOLVE_EASE} from "~/components/motion/Reveal";
import {CAPABILITIES} from "~/data/site";

const Capabilities = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="capabilities" className="scroll-mt-20 py-16 lg:py-[132px]">
      <Container>
        <Reveal className="mb-10 grid gap-4 md:grid-cols-[140px_1fr] md:gap-12 lg:mb-16">
          <p className="label">03 — Capabilities</p>
          <div>
            <h2 className="m-0 max-w-[20ch] text-balance font-display text-[clamp(28px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.015em]">
              One team from design file to deploy.
            </h2>
            <p className="mt-3.5 max-w-[58ch] text-ink-soft">
              No handoff gap between the people who draw it and the people who build it —
              which is where most of the errors get in.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px border border-rule-soft bg-rule-soft sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({id, eyebrow, title, summary, tools}, i) => (
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
