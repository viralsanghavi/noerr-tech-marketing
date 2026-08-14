import {motion, useReducedMotion} from "framer-motion";
import Container from "~/components/Container";
import Reveal, {RESOLVE_EASE} from "~/components/motion/Reveal";
import {METHOD_STEPS} from "~/data/site";
import {cn} from "~/lib/utils";

const Method = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="method" className="scroll-mt-20 bg-paper-lift py-20 lg:py-32">
      <Container>
        <Reveal className="mb-12 grid gap-4 md:grid-cols-[160px_1fr] md:gap-12 lg:mb-20">
          <p className="label pt-3">04 — Method</p>
          <div>
            <h2 className="m-0 max-w-[18ch] text-balance font-display text-[clamp(32px,5.5vw,72px)] font-normal leading-[1.04] tracking-[-0.025em]">
              Why the name is a promise.
            </h2>
            <p className="mt-5 max-w-[54ch] text-lg text-ink-soft">
              The mark sets our name three times — two drafts ghosted, one resolved. That is
              the process, not a graphic.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {METHOD_STEPS.map(({id, eyebrow, title, summary, resolved}, i) => (
            <div key={id} className="pt-[18px]">
              <motion.span
                initial={prefersReducedMotion ? false : {scaleX: 0}}
                whileInView={{scaleX: 1}}
                viewport={{once: true}}
                transition={{duration: 0.7, ease: RESOLVE_EASE, delay: i * 0.1}}
                className={cn(
                  "mb-3 block h-0.5 origin-left",
                  resolved ? "bg-accent" : "bg-ink"
                )}
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

        <BuildLog reduced={Boolean(prefersReducedMotion)} />
      </Container>
    </section>
  );
};

export default Method;

/**
 * The real pipeline output for this site, replayed on scroll. Every figure is
 * this repo's actual build — the claim is checkable against `npm run build`.
 */
const LOG_LINES = [
  {id: "cmd", label: "$ noerr ship", value: "", tone: "cmd"},
  {id: "typecheck", label: "typecheck", value: "0 errors", tone: "ok"},
  {id: "lint", label: "lint", value: "0 errors", tone: "ok"},
  {id: "build", label: "build", value: "405 modules · 1.02s", tone: "info"},
  {id: "bundle", label: "bundle", value: "52.87 kB gzip", tone: "info"},
  {id: "deploy", label: "deploy", value: "live", tone: "info"},
] as const;

type BuildLogProps = {reduced: boolean};

const BuildLog = ({reduced}: BuildLogProps) => (
  <motion.div
    initial={reduced ? false : {opacity: 0, y: 24}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true, margin: "0px 0px -12% 0px"}}
    transition={{duration: 0.7, ease: RESOLVE_EASE}}
    className="mt-16 overflow-hidden rounded-lg border border-rule bg-paper lg:mt-24"
  >
    <div className="flex items-center gap-2 border-b border-rule-soft px-5 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      <span className="label">noerr — production pipeline</span>
    </div>

    <div className="overflow-x-auto p-5 lg:p-8">
      <motion.pre
        whileInView="run"
        viewport={{once: true}}
        initial={reduced ? "run" : "idle"}
        variants={{idle: {}, run: {transition: {staggerChildren: 0.16, delayChildren: 0.2}}}}
        className="m-0 font-mono text-[13px] leading-[2] lg:text-sm"
      >
        {LOG_LINES.map(({id, label, value, tone}) => (
          <motion.div
            key={id}
            variants={{idle: {opacity: 0, x: -8}, run: {opacity: 1, x: 0}}}
            transition={{duration: 0.35, ease: RESOLVE_EASE}}
            className="flex flex-wrap items-baseline gap-x-3 whitespace-nowrap"
          >
            {tone === "cmd" ? (
              <span className="text-ink">{label}</span>
            ) : (
              <>
                <span className="text-accent">›</span>
                <span className="text-ink-soft">{label}</span>
                <span aria-hidden="true" className="text-ink-faint/40">
                  ····························
                </span>
                <span className={tone === "ok" ? "text-ink" : "text-ink-soft"}>{value}</span>
              </>
            )}
          </motion.div>
        ))}

        <motion.div
          variants={{idle: {opacity: 0}, run: {opacity: 1}}}
          transition={{duration: 0.4, ease: RESOLVE_EASE}}
          className="mt-3 flex items-baseline gap-3 border-t border-rule-soft pt-3"
        >
          <span className="text-accent">✓</span>
          <span className="text-ink">shipped clean</span>
          {reduced ? null : (
            <motion.span
              animate={{opacity: [1, 1, 0, 0]}}
              transition={{duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1]}}
              className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-accent"
            />
          )}
        </motion.div>
      </motion.pre>
    </div>
  </motion.div>
);
