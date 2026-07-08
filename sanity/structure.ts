import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// homePage/aboutPage/siteSettings are true singletons: fixed document IDs,
// no "create new" entry point, no delete/duplicate actions.
export const singletonTypes = new Set(['homePage', 'aboutPage', 'siteSettings'])
export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Collection types get an explicit orderable list item (drag-to-reorder,
// backed by the hidden `orderRank` field) instead of the plain
// auto-generated document-type list item.
const orderableTypes = new Set(['project'])

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      orderableDocumentListDeskItem({type: 'project', S, context}),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !singletonTypes.has(listItem.getId() as string) && !orderableTypes.has(listItem.getId() as string),
      ),
    ])
