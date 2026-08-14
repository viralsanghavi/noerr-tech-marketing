import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {defineField, defineType} from 'sanity'

/**
 * Client quotes. The seeded entries are PLACEHOLDER copy — invented people at
 * invented companies, written to size the layout. Anything still marked
 * "Placeholder" must be replaced with signed-off copy before launch; the site
 * build warns while any remain.
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: BlockquoteIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'testimonial'}),
    defineField({
      name: 'status',
      title: 'Approval status',
      type: 'string',
      options: {
        list: [
          {title: 'Placeholder — do not publish', value: 'placeholder'},
          {title: 'Approved by client', value: 'approved'},
        ],
        layout: 'radio',
      },
      initialValue: 'placeholder',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metric',
      type: 'string',
      description: 'The hard number pulled out of the quote — e.g. "Live in 5 weeks".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'initials',
      type: 'string',
      description: 'Leave blank to derive from the name. Set it only when that reads wrong.',
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {name: 'name', company: 'company', status: 'status'},
    prepare: ({name, company, status}) => ({
      title: status === 'placeholder' ? `${name} (placeholder)` : name,
      subtitle: company,
    }),
  },
})
