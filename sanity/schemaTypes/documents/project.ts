import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  // Hidden, drag-managed field — see sanity/structure.ts for the
  // orderable list UI. The index page's GROQ query orders by this field.
  fields: [
    orderRankField({type: 'project'}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Large opening statement on the detail page.',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      description: 'Shown on the index alongside the cover.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      description: 'Shown on the index. Image or Mux video.',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'year', title: 'Year', type: 'string'}),
    defineField({
      name: 'contentBlocks',
      title: 'Content blocks',
      type: 'array',
      of: [
        defineArrayMember({type: 'textBlock'}),
        defineArrayMember({type: 'imageWide'}),
        defineArrayMember({type: 'imageDouble'}),
        defineArrayMember({type: 'imageBento'}),
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'projectMetadata',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'thumbnail.image', year: 'year'},
    prepare({title, media, year}) {
      return {title, subtitle: year, media}
    },
  },
})
