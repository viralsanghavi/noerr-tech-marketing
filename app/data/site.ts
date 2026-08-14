import content from "./generated/content.json";

/**
 * Site copy, sourced from Sanity.
 *
 * Nothing here talks to the network. `scripts/fetch-content.mjs` pulls the
 * content at build time, validates it, and writes generated/content.json; this
 * module adapts that JSON into the shapes the components already expect. So a
 * content change needs a rebuild and redeploy — see README.
 *
 * Ordering is whatever the Studio's drag-and-drop lists say. Nothing in here
 * re-sorts, and the work strip derives its 01…07 numbering from array position.
 */

export type Project = {
  id: string;
  name: string;
  client: string;
  sector: string;
  year: string;
  headline: string;
  summary: string;
  stack: string[];
  image: string;
  video: string;
  href: string;
};

export type ShippedItem = {
  id: string;
  name: string;
  sector: string;
  stack: string;
};

export type Capability = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  tools: string[];
};

export type MethodStep = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  resolved: boolean;
};

export type Stat = {id: string; value: string; label: string};
export type Fact = {id: string; label: string; value: string};
export type NavLinkItem = {
  id: string;
  name: string;
  href: string;
  variant: "text" | "button";
};

export type Testimonial = {
  id: string;
  quote: string;
  metric: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  /** False while the quote is placeholder copy awaiting client sign-off. */
  approved: boolean;
};

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
