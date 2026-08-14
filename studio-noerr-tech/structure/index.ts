import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {BarChartIcon} from '@sanity/icons/BarChart'
import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {CogIcon} from '@sanity/icons/Cog'
import {ComponentIcon} from '@sanity/icons/Component'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {LinkIcon} from '@sanity/icons/Link'
import {PackageIcon} from '@sanity/icons/Package'
import {RocketIcon} from '@sanity/icons/Rocket'
import {StackIcon} from '@sanity/icons/Stack'
import type {StructureResolver} from 'sanity/structure'

/**
 * Every list here is drag-to-reorder; the site renders in exactly this order,
 * and the work strip derives its 01…07 numbering from it.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('no.err')
    .items([
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Selected work',
        icon: RocketIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'shippedItem',
        title: 'Also shipped',
        icon: PackageIcon,
        S,
        context,
      }),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'capability',
        title: 'Capabilities',
        icon: ComponentIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'methodStep',
        title: 'Method',
        icon: StackIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'testimonial',
        title: 'Testimonials',
        icon: BlockquoteIcon,
        S,
        context,
      }),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'stat',
        title: 'Stats',
        icon: BarChartIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'contactFact',
        title: 'Contact facts',
        icon: EnvelopeIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'navLink',
        title: 'Navigation',
        icon: LinkIcon,
        S,
        context,
      }),
    ])
