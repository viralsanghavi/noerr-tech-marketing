import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {PackageIcon} from '@sanity/icons/Package'
import {defineField, defineType} from 'sanity'

/** A line in the "Also shipped" list under the work strip. */
export const shippedItem = defineType({
  name: 'shippedItem',
  title: 'Also shipped',
  type: 'document',
  icon: PackageIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'shippedItem'}),
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sector',
      type: 'string',
      description: 'e.g. "D2C · Mobile"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stack',
      type: 'string',
      description: 'Free text, dot-separated — e.g. "Flutter · Amplify · Next.js"',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'sector'},
  },
})
