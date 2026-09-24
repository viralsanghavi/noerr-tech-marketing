/**
 * The shapes components render. Types only — no values, so importing this from
 * a component pulls nothing into the client bundle.
 *
 * Built into the bundle at build time by scripts/fetch-content.mjs and adapted
 * in app/data/site.ts.
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
