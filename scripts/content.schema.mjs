/**
 * The shape app/data/generated/content.json must have.
 *
 * This is the seam between the CMS and the site, and it is deliberately checked
 * HERE — in the build script — rather than in app code. The site is a
 * client-rendered SPA, so anything validated inside app/ would run in the
 * visitor's browser and fail in front of them. Failing here fails the build.
 */
import {z} from 'zod'

const nonEmpty = z.string().trim().min(1)

const settings = z.object({
  contactEmail: z.string().email(),
  marqueeItems: z.array(nonEmpty).min(1),
})

const project = z.object({
  id: nonEmpty,
  name: nonEmpty,
  client: nonEmpty,
  sector: nonEmpty,
  year: nonEmpty,
  headline: nonEmpty,
  summary: nonEmpty,
  stack: z.array(nonEmpty).min(1),
  href: z.string().url(),
  mediaSlug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and hyphens only'),
})

const shippedItem = z.object({
  id: nonEmpty,
  name: nonEmpty,
  sector: nonEmpty,
  stack: nonEmpty,
})

const capability = z.object({
  id: nonEmpty,
  eyebrow: nonEmpty,
  title: nonEmpty,
  summary: nonEmpty,
  tools: z.array(nonEmpty).min(1),
})

const methodStep = z.object({
  id: nonEmpty,
  eyebrow: nonEmpty,
  title: nonEmpty,
  summary: nonEmpty,
  state: z.enum(['draft', 'resolved']),
})

const stat = z.object({
  id: nonEmpty,
  value: nonEmpty,
  label: nonEmpty,
})

const testimonial = z.object({
  id: nonEmpty,
  status: z.enum(['placeholder', 'approved']),
  quote: nonEmpty,
  metric: nonEmpty,
  name: nonEmpty,
  role: nonEmpty,
  company: nonEmpty,
  initials: z.string().trim().max(3).nullish(),
})

const contactFact = z.object({
  id: nonEmpty,
  label: nonEmpty,
  value: nonEmpty,
})

const navLink = z.object({
  id: nonEmpty,
  name: nonEmpty,
  href: nonEmpty,
  variant: z.enum(['text', 'button']),
})

export const contentSchema = z.object({
  settings,
  projects: z.array(project).min(1),
  shipped: z.array(shippedItem).min(1),
  capabilities: z.array(capability).min(1),
  methodSteps: z.array(methodStep).min(1),
  stats: z.array(stat).min(1),
  testimonials: z.array(testimonial).min(1),
  contactFacts: z.array(contactFact).min(1),
  navLinks: z.array(navLink).min(1),
})
