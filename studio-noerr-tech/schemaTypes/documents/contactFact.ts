import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

/** A label/value pair in the contact block. */
export const contactFact = defineType({
  name: 'contactFact',
  title: 'Contact fact',
  type: 'document',
  icon: EnvelopeIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'contactFact'}),
    defineField({
      name: 'label',
      type: 'string',
      description: 'e.g. "Response"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      type: 'string',
      description: 'e.g. "Within 2 working days"',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
