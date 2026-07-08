import type {ContentBlock} from '@/sanity/lib/types'
import {TextBlock} from './TextBlock'
import {ImageWide} from './ImageWide'
import {ImageDouble} from './ImageDouble'
import {ImageBento} from './ImageBento'

interface BlockRendererProps {
  blocks: ContentBlock[]
  /** _key -> anchor id, for textBlock sections (see lib/menu.ts). */
  anchorIds: Record<string, string>
}

export function BlockRenderer({blocks, anchorIds}: BlockRendererProps) {
  return (
    <div className="blocks">
      {blocks.map((block) => {
        switch (block._type) {
          case 'textBlock':
            return <TextBlock key={block._key} block={block} anchorId={anchorIds[block._key]} />
          case 'imageWide':
            return <ImageWide key={block._key} block={block} />
          case 'imageDouble':
            return <ImageDouble key={block._key} block={block} />
          case 'imageBento':
            return <ImageBento key={block._key} block={block} />
          default:
            return null
        }
      })}
    </div>
  )
}
