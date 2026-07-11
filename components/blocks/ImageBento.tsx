'use client'

import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageBentoData} from '@/sanity/lib/types'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import styles from './ImageBento.module.css'

// Seconds between slots as they cascade in — see ImageDouble.
const MEDIA_STAGGER_STEP = 0.1

// DOM order is always [tallImage, stackedTop, stackedBottom] — `tallColumn`
// only swaps which side each renders on via CSS `order`, never touches the
// DOM, so mobile stacking (tall image first) stays stable either way. The
// entry-reveal stagger follows this same fixed DOM order (0 / 0.1s / 0.2s),
// regardless of which visual side `tallColumn` puts each on.
//
// The tall cell's own wrapper (.tallCell) carries the reveal directly, same
// as ImageWide's .frame. The two stacked slots each get a plain wrapper div
// so ImageBento.module.css's `.stackedCol > *` selector keeps sizing
// whatever is the direct child exactly as before.
export function ImageBento({block}: {block: ImageBentoData}) {
  const tallRef = useEntryReveal<HTMLDivElement>({delay: 0})
  const stackedTopRef = useEntryReveal<HTMLDivElement>({delay: MEDIA_STAGGER_STEP})
  const stackedBottomRef = useEntryReveal<HTMLDivElement>({delay: MEDIA_STAGGER_STEP * 2})

  return (
    <div className="grid">
      <div className="col">
        <div className={styles.grid} data-tall={block.tallColumn}>
          <div ref={tallRef} className={`entryReveal ${styles.tallCell}`}>
            <MediaSlot slot={block.tallImage} ratio={[4, 5]} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className={styles.stackedCol}>
            {/* Ratio here is only a crop hint for the CDN request — the
                rendered box shape comes from .stackedCol's CSS (4:5 stacked
                on mobile, half of the tall column's height on desktop). */}
            <div ref={stackedTopRef} className="entryReveal">
              <MediaSlot slot={block.stackedImageTop} ratio={[4, 2.5]} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div ref={stackedBottomRef} className="entryReveal">
              <MediaSlot slot={block.stackedImageBottom} ratio={[4, 2.5]} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
