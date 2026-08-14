import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {ComponentIcon} from '@sanity/icons/Component'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** A card in the Capabilities section. */
export const capability = defineType({
  name: 'capability',
  title: 'Capability',
  type: 'document',
  icon: ComponentIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'capability'}),
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'Short label above the title — e.g. "Front of house".',
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tools',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow'},
  },
})
