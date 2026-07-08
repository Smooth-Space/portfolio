import {defineField, defineType} from 'sanity'

// The single reusable image-or-video slot. Referenced by `project.thumbnail`
// and every block type that holds media — never redefine this shape inline.
export const mediaSlot = defineType({
  name: 'mediaSlot',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.kind !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as {kind?: string})?.kind === 'image' && !value
            ? 'Image is required when media type is Image'
            : true,
        ),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      hidden: ({parent}) => parent?.kind !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as {kind?: string})?.kind === 'video' && !value
            ? 'Video is required when media type is Video'
            : true,
        ),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {kind: 'kind', alt: 'alt', media: 'image'},
    prepare({kind, alt, media}) {
      return {
        title: alt || '(no alt text)',
        subtitle: kind === 'video' ? 'Video' : 'Image',
        media,
      }
    },
  },
})
