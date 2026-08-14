import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

/** An item in the top navigation. */
export const navLink = defineType({
  name: 'navLink',
  title: 'Nav link',
  type: 'document',
  icon: LinkIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'navLink'}),
    defineField({
      name: 'name',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      type: 'string',
      description: 'In-page anchor such as "#work", or a full URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      type: 'string',
      description: 'Only one link should normally be the button.',
      options: {
        list: [
          {title: 'Text', value: 'text'},
          {title: 'Button', value: 'button'},
        ],
        layout: 'radio',
      },
      initialValue: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'href'},
  },
})
