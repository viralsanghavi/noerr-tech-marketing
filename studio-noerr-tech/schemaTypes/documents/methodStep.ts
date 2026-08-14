import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {StackIcon} from '@sanity/icons/Stack'
import {defineField, defineType} from 'sanity'

/** A step in the Method section. */
export const methodStep = defineType({
  name: 'methodStep',
  title: 'Method step',
  type: 'document',
  icon: StackIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'methodStep'}),
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'e.g. "Draft one", or "Resolved" for the final step.',
      validation: (rule) => rule.required(),
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
      name: 'state',
      title: 'Step state',
      type: 'string',
      description: 'The resolved step is styled as the endpoint of the sequence.',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Resolved', value: 'resolved'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow'},
  },
})
