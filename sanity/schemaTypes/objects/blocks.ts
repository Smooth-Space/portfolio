import {defineArrayMember, defineField, defineType} from 'sanity'

// The modular content-block system. Every media position uses `mediaSlot`
// by reference — no block redefines an image-or-video shape inline.
//
// imageDouble/imageBento use fixed named fields rather than an array of
// mediaSlot: Sanity's `Rule.length(n)` only blocks publish, it doesn't stop
// the array UI from accepting extra items, so a real slot-count cap has to
// be structural. Named fields also make bento's "which image is tall"
// unambiguous — the tall one is always `tallImage`, independent of which
// side `tallColumn` renders it on.

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Drives the floating section menu.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Bold one-liner.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'summary'},
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {title: title || 'Text', subtitle}
    },
  },
})

export const imageWide = defineType({
  name: 'imageWide',
  title: 'Wide (3:2)',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {alt: 'media.alt', media: 'media.image'},
    prepare({alt, media}) {
      return {title: 'Wide', subtitle: alt, media}
    },
  },
})

export const imageDouble = defineType({
  name: 'imageDouble',
  title: 'Double (4:5 x2)',
  type: 'object',
  fields: [
    defineField({
      name: 'first',
      title: 'First image',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'second',
      title: 'Second image',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {alt: 'first.alt', media: 'first.image'},
    prepare({alt, media}) {
      return {title: 'Double', subtitle: alt, media}
    },
  },
})

export const imageBento = defineType({
  name: 'imageBento',
  title: 'Bento (3)',
  type: 'object',
  fields: [
    defineField({
      name: 'tallColumn',
      title: 'Tall column',
      description: 'Which side holds the tall image; the other holds the stacked pair.',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tallImage',
      title: 'Tall image',
      description: 'The large image filling the tall column.',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stackedImageTop',
      title: 'Stacked image — top',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stackedImageBottom',
      title: 'Stacked image — bottom',
      type: 'mediaSlot',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {tallColumn: 'tallColumn', media: 'tallImage.image'},
    prepare({tallColumn, media}) {
      return {title: 'Bento', subtitle: `Tall column: ${tallColumn || '—'}`, media}
    },
  },
})
