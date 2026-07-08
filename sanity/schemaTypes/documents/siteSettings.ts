import {defineArrayMember, defineField, defineType} from 'sanity'

// Singleton — enforced via sanity/structure.ts, not schema.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'navLinks',
      title: 'Nav links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'href', title: 'Href', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({name: 'platform', title: 'Platform', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({name: 'footerText', title: 'Footer text', type: 'text', rows: 2}),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
