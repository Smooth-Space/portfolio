import createImageUrlBuilder from '@sanity/image-url'
import type {Image} from 'sanity'

import {dataset, projectId} from '@/sanity/env'

const builder = createImageUrlBuilder({projectId, dataset})

export const urlFor = (source: Image) => builder.image(source)
