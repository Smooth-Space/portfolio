import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {muxInput} from 'sanity-plugin-mux-input'

import {apiVersion, dataset, projectId} from '@/sanity/env'
import {schema} from '@/sanity/schemaTypes'
import {singletonActions, singletonTypes, structure} from '@/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [structureTool({structure}), muxInput()],
  document: {
    // Hide homePage/aboutPage/siteSettings from the global "+ Create" menu —
    // they're only reachable via the fixed singleton entries in structure.ts.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((template) => !singletonTypes.has(template.templateId))
        : prev,
    // Strip delete/duplicate from singleton documents so they can't be removed or cloned.
    actions: (prev, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? prev.filter((action) => action.action && singletonActions.has(action.action))
        : prev,
  },
})
