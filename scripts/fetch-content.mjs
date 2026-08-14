/**
 * Pulls every piece of site copy out of Sanity and writes it to
 * app/data/generated/content.json, which app/data/site.ts validates and serves
 * to the components.
 *
 *   node scripts/fetch-content.mjs
 *
 * This runs at BUILD time, not in the browser. The app is a client-rendered SPA
 * (`ssr: false`), so there is no server to fetch from at runtime — content is
 * baked into the bundle and a content change needs a rebuild + redeploy.
 *
 * The generated file is committed. That keeps `npm run dev`, CI and offline
 * builds working when Sanity is unreachable; the fetch refreshes it, it does
 * not become a hard dependency of every build.
 */
import {createClient} from '@sanity/client'
import {existsSync, mkdirSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {contentSchema} from './content.schema.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'app/data/generated/content.json')

const projectId = process.env.VITE_SANITY_PROJECT_ID ?? '8unjg8gl'
const dataset = process.env.VITE_SANITY_DATASET ?? 'production'

const client = createClient({
  projectId,
  dataset,
  // Pinned deliberately: a floating date would let API behaviour drift under us.
  apiVersion: '2025-08-14',
  useCdn: false, // Always build from the latest published content.
  // The dataset is public, so no token. If it is ever made private, add
  // token: process.env.SANITY_API_READ_TOKEN here — never a VITE_ name, or it
  // would be inlined into the client bundle.
})

/** One round trip; every list ordered by the drag-and-drop rank from the Studio. */
const CONTENT_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{contactEmail, marqueeItems},
  "projects": *[_type == "project"] | order(orderRank){
    "id": _id, name, client, sector, year, headline, summary, stack, href, mediaSlug
  },
  "shipped": *[_type == "shippedItem"] | order(orderRank){
    "id": _id, name, sector, stack
  },
  "capabilities": *[_type == "capability"] | order(orderRank){
    "id": _id, eyebrow, title, summary, tools
  },
  "methodSteps": *[_type == "methodStep"] | order(orderRank){
    "id": _id, eyebrow, title, summary, state
  },
  "stats": *[_type == "stat"] | order(orderRank){
    "id": _id, value, label
  },
  "testimonials": *[_type == "testimonial"] | order(orderRank){
    "id": _id, status, quote, metric, name, role, company, initials
  },
  "contactFacts": *[_type == "contactFact"] | order(orderRank){
    "id": _id, label, value
  },
  "navLinks": *[_type == "navLink"] | order(orderRank){
    "id": _id, name, href, variant
  }
}`

const raw = await client.fetch(CONTENT_QUERY)

// Validate before writing, so a bad fetch can never overwrite a good snapshot.
// The `.min(1)` rules also catch the dangerous silent case: a typo'd dataset or
// unpublished drafts returning empty arrays and blanking a section on deploy.
const parsed = contentSchema.safeParse(raw)

if (!parsed.success) {
  console.error(`Content from project "${projectId}", dataset "${dataset}" is not usable:\n`)
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
  console.error('\nNothing was written. Fix the content in the Studio and re-run.')
  process.exit(1)
}

const content = parsed.data

// Posters and clips live in the repo, not in Sanity — Sanity file assets have no
// transcoding and bill as raw bandwidth, which is the wrong home for autoplaying
// video. The trade-off is that a project added in the Studio needs its media
// captured here, so check for it now rather than shipping a broken panel.
const missingMedia = content.projects.flatMap(({name, mediaSlug}) =>
  ['jpg', 'mp4', 'webm']
    .filter((ext) => !existsSync(resolve(ROOT, `public/work/${mediaSlug}.${ext}`)))
    .map((ext) => `${name}: public/work/${mediaSlug}.${ext}`),
)

if (missingMedia.length > 0) {
  console.error('Missing media for one or more projects:\n')
  for (const line of missingMedia) console.error(`  ${line}`)
  console.error('\nGenerate it with: node scripts/capture-work.mjs <mediaSlug> <url>')
  process.exit(1)
}

const placeholders = content.testimonials.filter(({status}) => status === 'placeholder')

mkdirSync(dirname(OUT), {recursive: true})
writeFileSync(OUT, `${JSON.stringify(content, null, 2)}\n`)

console.log(`Wrote ${OUT}`)
for (const [key, value] of Object.entries(content)) {
  if (Array.isArray(value)) console.log(`  ${key}: ${value.length}`)
}

if (placeholders.length > 0) {
  console.warn(
    `\nWarning: ${placeholders.length} testimonial(s) still marked placeholder and will render as real quotes:`,
  )
  for (const {name, company} of placeholders) console.warn(`  ${name} — ${company}`)
}
