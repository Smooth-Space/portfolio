import {defineArrayMember, defineField, defineType} from 'sanity'

// Shared shape for typography + recognition rows — both are `{ name, url? }`.
export const namedLink = defineType({
  name: 'namedLink',
  title: 'Named link',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'url'},
  },
})

export const creditItem = defineType({
  name: 'creditItem',
  title: 'Credit',
  type: 'object',
  fields: [
    defineField({name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})

export const websiteLink = defineType({
  name: 'websiteLink',
  title: 'Website link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})

// The credits group on `project`. Every field is optional — and has no
// per-field required rule at this level — so a project with no metadata
// filled in still validates. Front end hides empty sections at render time.
export const projectMetadata = defineType({
  name: 'projectMetadata',
  title: 'Metadata',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'scope',
      title: 'Scope',
      description: 'e.g. "Brand Identity", "Website"',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [defineArrayMember({type: 'creditItem'})],
    }),
    defineField({
      name: 'typography',
      title: 'Typography',
      type: 'array',
      of: [defineArrayMember({type: 'namedLink'})],
    }),
    defineField({
      name: 'recognition',
      title: 'Recognition / Awards',
      type: 'array',
      of: [defineArrayMember({type: 'namedLink'})],
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'array',
      of: [defineArrayMember({type: 'websiteLink'})],
    }),
  ],
})
