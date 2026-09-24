import content from "./generated/content.json";
import type {
  Capability,
  Fact,
  MethodStep,
  NavLinkItem,
  Project,
  ShippedItem,
  Stat,
  Testimonial,
} from "./types";

/**
 * Site copy, sourced from Sanity.
 *
 * Nothing here talks to the network. `scripts/fetch-content.mjs` pulls the
 * content at build time, validates it, and writes generated/content.json; this
 * module adapts that JSON into the shapes the components take as props. So a
 * content change needs a rebuild and redeploy — see README.
 *
 * Ordering is whatever the Studio's drag-and-drop lists say. Nothing in here
 * re-sorts, and the work strip derives both its numbering and its pinned-scroll
 * height from array position.
 */

/** "Priya Raghavan" -> "PR". Used when the Studio leaves initials blank. */
const deriveInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const CONTACT_EMAIL: string = content.settings.contactEmail;

export const MARQUEE_ITEMS: string[] = content.settings.marqueeItems;

export const NAV_LINKS: NavLinkItem[] = content.navLinks.map((link) => ({
  id: link.id,
  name: link.name,
  href: link.href,
  variant: link.variant === "button" ? "button" : "text",
}));

export const STATS: Stat[] = content.stats;

/** Posters and clips are captured into /public/work by scripts/capture-work.mjs. */
export const PROJECTS: Project[] = content.projects.map(({mediaSlug, ...project}) => ({
  ...project,
  image: `/work/${mediaSlug}.jpg`,
  video: `/work/${mediaSlug}.mp4`,
}));

export const ALSO_SHIPPED: ShippedItem[] = content.shipped;

export const CAPABILITIES: Capability[] = content.capabilities;

export const METHOD_STEPS: MethodStep[] = content.methodSteps.map(({state, ...step}) => ({
  ...step,
  resolved: state === "resolved",
}));

export const TESTIMONIALS: Testimonial[] = content.testimonials.map(
  ({status, initials, ...testimonial}) => ({
    ...testimonial,
    initials: initials?.trim() || deriveInitials(testimonial.name),
    approved: status === "approved",
  }),
);

export const CONTACT_FACTS: Fact[] = content.contactFacts;

/** The reply-time promise shown beside calls to action, e.g. "Within 2 working days". */
export const RESPONSE_TIME: string | undefined = CONTACT_FACTS.find(
  ({label}) => label === "Response",
)?.value;

/** Recognisable names for "trusted by" rows, in Studio order. */
export const CLIENT_NAMES: string[] = PROJECTS.map(({client}) => client);
