import Link from 'next/link'

import type {MediaFeedItem} from '@/sanity/lib/types'
import {SanityImage} from '@/components/media/SanityImage'
import {FeedVideo} from './FeedVideo'
import styles from './FeedTile.module.css'

const FALLBACK_RATIO: [number, number] = [4, 5]

// Sanity image asset refs encode their native pixel dimensions:
// "image-<hash>-<width>x<height>-<ext>" — parsing this avoids a second
// query just to learn the aspect ratio.
function parseImageRatio(ref: string): [number, number] | null {
  const match = ref.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  return [Number(match[1]), Number(match[2])]
}

function parseVideoRatio(aspectRatio?: string): [number, number] | null {
  if (!aspectRatio) return null
  const [w, h] = aspectRatio.split(':').map(Number)
  return w && h ? [w, h] : null
}

interface FeedTileProps {
  item: MediaFeedItem
}

// Clothesline row: each tile is a fixed share of the row's width (see
// FeedGrid's --per-row), and keeps its media's own native ratio — the
// frame's aspect-ratio is set dynamically per item, so at a fixed width
// its height is whatever that ratio resolves to (native height, not a
// shared row height). The media inside still fills the frame via
// object-fit: cover as a safety net for any rounding mismatch.
export function FeedTile({item}: FeedTileProps) {
  const {media, projectTitle, projectSlug} = item

  const ratio: [number, number] =
    media.kind === 'video'
      ? (parseVideoRatio(media.video?.aspectRatio) ?? FALLBACK_RATIO)
      : media.image
        ? (parseImageRatio(media.image.asset._ref) ?? FALLBACK_RATIO)
        : FALLBACK_RATIO

  return (
    <Link href={`/projects/${projectSlug}`} className={styles.tile}>
      <div className={styles.frame} style={{aspectRatio: `${ratio[0]} / ${ratio[1]}`}}>
        {media.kind === 'video' && media.video?.playbackId ? (
          <FeedVideo playbackId={media.video.playbackId} alt={media.alt} />
        ) : media.kind === 'image' && media.image ? (
          <SanityImage
            image={media.image}
            alt={media.alt}
            ratio={ratio}
            sizes="(min-width: 1200px) 15vw, (min-width: 768px) 25vw, 50vw"
          />
        ) : null}
      </div>
      <p className={`caption ${styles.caption}`}>{projectTitle}</p>
    </Link>
  )
}
