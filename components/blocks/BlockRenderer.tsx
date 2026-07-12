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

const MEDIA_BLOCK_TYPES = new Set(['imageWide', 'imageDouble', 'imageBento'])

export function BlockRenderer({blocks, anchorIds}: BlockRendererProps) {
  // The first media block (in document order, whatever type it is) is
  // eligible to join the header's motion cascade as its 4th beat — see
  // hooks/useHeaderCascadeReveal.ts. Every other media block keeps its
  // own normal, independent scroll-triggered reveal.
  const firstMediaBlockKey = blocks.find((block) => MEDIA_BLOCK_TYPES.has(block._type))?._key

  return (
    <div className="blocks">
      {blocks.map((block) => {
        const isFirstMediaBlock = block._key === firstMediaBlockKey
        switch (block._type) {
          case 'textBlock':
            return <TextBlock key={block._key} block={block} anchorId={anchorIds[block._key]} />
          case 'imageWide':
            return <ImageWide key={block._key} block={block} isFirstMediaBlock={isFirstMediaBlock} />
          case 'imageDouble':
            return <ImageDouble key={block._key} block={block} isFirstMediaBlock={isFirstMediaBlock} />
          case 'imageBento':
            return <ImageBento key={block._key} block={block} isFirstMediaBlock={isFirstMediaBlock} />
          default:
            return null
        }
      })}
    </div>
  )
}
