import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton — enforced by Studio Structure pinning it to the document id
 * "siteSettings", not by anything in this file.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'contactEmail',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'marqueeItems',
      title: 'Marquee items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'The scrolling tech strip under the hero.',
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(4).unique(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
