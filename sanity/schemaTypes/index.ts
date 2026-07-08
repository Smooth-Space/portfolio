import {type SchemaTypeDefinition} from 'sanity'

import {mediaSlot} from './objects/mediaSlot'
import {imageBento, imageDouble, imageWide, textBlock} from './objects/blocks'
import {creditItem, namedLink, projectMetadata, websiteLink} from './objects/projectMetadata'
import {project} from './documents/project'
import {service} from './documents/service'
import {homePage} from './documents/homePage'
import {aboutPage} from './documents/aboutPage'
import {siteSettings} from './documents/siteSettings'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // documents
    project,
    service,
    homePage,
    aboutPage,
    siteSettings,
    // shared objects
    mediaSlot,
    projectMetadata,
    creditItem,
    namedLink,
    websiteLink,
    textBlock,
    imageWide,
    imageDouble,
    imageBento,
  ],
}
