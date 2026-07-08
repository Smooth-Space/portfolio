import {defineField, defineType} from 'sanity'

// Referenced by `project.services` — a small, reusable, editable collection
// (e.g. "Brand", "Digital", "Generative") instead of free-typed strings.
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
