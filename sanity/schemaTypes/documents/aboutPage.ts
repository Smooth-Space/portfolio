import {defineArrayMember, defineField, defineType} from 'sanity'

// Singleton — enforced via sanity/structure.ts, not schema.
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 4}),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'appointments',
      title: 'Appointments',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'speakingRecognition',
      title: 'Speaking & Recognition',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
