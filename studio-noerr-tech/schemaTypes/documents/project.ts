import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {RocketIcon} from '@sanity/icons/Rocket'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A panel in the "Selected work" strip. Display numbering (01, 02, …) is not
 * stored — the frontend derives it from list position, so reordering here is
 * the only thing needed to renumber the site.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'project'}),
    defineField({
      name: 'name',
      title: 'Project name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sector',
      type: 'string',
      description: 'Shown in the panel meta line, e.g. "Shipping & logistics".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'string',
      description: 'Displayed as-is, so a range like "2024–25" is fine.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      type: 'string',
      description: 'The one italic line under the project name.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      description: 'Clamped to three lines on the site — front-load the point.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'href',
      title: 'Live site URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({scheme: ['http', 'https']}).error('Must start with http:// or https://'),
    }),
    defineField({
      name: 'mediaSlug',
      title: 'Media slug',
      type: 'string',
      description:
        'Basename of the poster and clip in the website repo (public/work). Generate them with: node scripts/capture-work.mjs <slug> <url> — the site build fails if the files are missing.',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || /^[a-z0-9-]+$/.test(value)
              ? true
              : 'Lowercase letters, numbers and hyphens only',
          ),
    }),
  ],
  preview: {
    select: {title: 'name', sector: 'sector', year: 'year'},
    prepare: ({title, sector, year}) => ({title, subtitle: [sector, year].filter(Boolean).join(' · ')}),
  },
})
