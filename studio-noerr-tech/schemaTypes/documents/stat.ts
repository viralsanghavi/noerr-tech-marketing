import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {BarChartIcon} from '@sanity/icons/BarChart'
import {defineField, defineType} from 'sanity'

/** A figure in the hero stat row. */
export const stat = defineType({
  name: 'stat',
  title: 'Stat',
  type: 'document',
  icon: BarChartIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'stat'}),
    defineField({
      name: 'value',
      type: 'string',
      description: 'Displayed as-is, so "30+" and "9" both work.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'value', subtitle: 'label'},
  },
})
