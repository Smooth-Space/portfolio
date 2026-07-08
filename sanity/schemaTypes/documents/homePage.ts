import {defineArrayMember, defineField, defineType} from 'sanity'

// Singleton — enforced via sanity/structure.ts, not schema.
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredProjects',
      title: 'Featured projects',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
