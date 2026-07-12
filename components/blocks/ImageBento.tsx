'use client'

import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageBentoData} from '@/sanity/lib/types'
import {useHeaderCascadeReveal} from '@/hooks/useHeaderCascadeReveal'
import {MOTION_LARGE_STAGGER} from '@/lib/motion'
import styles from './ImageBento.module.css'

interface ImageBentoProps {
  block: ImageBentoData
  /** True only for the project's first media block in document order
   *  (see BlockRenderer) — see useHeaderCascadeReveal for what this
   *  changes. */
  isFirstMediaBlock?: boolean
}

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
export function ImageBento({block, isFirstMediaBlock = false}: ImageBentoProps) {
  const tallRef = useHeaderCascadeReveal<HTMLDivElement>(isFirstMediaBlock, 0)
  const stackedTopRef = useHeaderCascadeReveal<HTMLDivElement>(isFirstMediaBlock, MOTION_LARGE_STAGGER)
  const stackedBottomRef = useHeaderCascadeReveal<HTMLDivElement>(isFirstMediaBlock, MOTION_LARGE_STAGGER * 2)

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
