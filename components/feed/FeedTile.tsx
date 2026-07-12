'use client'

import Link from 'next/link'

import type {MediaFeedItem} from '@/sanity/lib/types'
import {SanityImage} from '@/components/media/SanityImage'
import {FeedVideo} from './FeedVideo'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import {MOTION_FEED_STAGGER, getPositionInRow} from '@/lib/motion'
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
//
// Entry reveal: same Large-tier .entryReveal as project cards/media
// blocks (56px offset, 2s transform, 1s opacity, same easing) — only
// the stagger step is tighter (MOTION_FEED_STAGGER, 0.05s vs. the
// usual 0.1s), since a row here can be up to 7 tiles wide. Delay is
// computed via getPositionInRow (DOM-measured), not a React index prop
// — FeedGrid shuffles tile order client-side shortly after mount, and
// useEntryReveal's observer effect is intentionally mount-only, so a
// prop-derived index captured at mount would go stale the instant that
// shuffle re-renders with a new order. All tiles in a row share the
// same top edge (FeedGrid's align-items: flex-start), so despite the
// clothesline's ragged BOTTOM edges, threshold: 0 means every tile in a
// row still starts intersecting at the same scroll position — the
// row-relative wave reads correctly regardless of each tile's own
// (varying) height.
export function FeedTile({item}: FeedTileProps) {
  const {media, projectTitle, projectSlug} = item
  const tileRef = useEntryReveal<HTMLAnchorElement>({
    getDelay: (el) => getPositionInRow(el) * MOTION_FEED_STAGGER,
  })

  const ratio: [number, number] =
    media.kind === 'video'
      ? (parseVideoRatio(media.video?.aspectRatio) ?? FALLBACK_RATIO)
      : media.image
        ? (parseImageRatio(media.image.asset._ref) ?? FALLBACK_RATIO)
        : FALLBACK_RATIO

  return (
    <Link ref={tileRef} href={`/projects/${projectSlug}`} className={`entryReveal ${styles.tile}`}>
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
