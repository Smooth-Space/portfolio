'use client'

import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageDoubleData} from '@/sanity/lib/types'
import {useHeaderCascadeReveal} from '@/hooks/useHeaderCascadeReveal'
import {MOTION_LARGE_STAGGER} from '@/lib/motion'
import styles from './ImageDouble.module.css'

interface ImageDoubleProps {
  block: ImageDoubleData
  /** True only for the project's first media block in document order
   *  (see BlockRenderer) — see useHeaderCascadeReveal for what this
   *  changes. */
  isFirstMediaBlock?: boolean
}

// All multi-slot blocks stack vertically on mobile (single grid column below
// the 768px breakpoint); side by side on larger viewports.
//
// Each slot gets its own wrapper div carrying the entry-reveal — plain
// wrapper, no styling of its own, so ImageDouble.module.css's `.grid > *`
// selector keeps sizing whatever is the direct grid child exactly as
// before (now the wrapper instead of MediaSlot's own root).
export function ImageDouble({block, isFirstMediaBlock = false}: ImageDoubleProps) {
  const firstRef = useHeaderCascadeReveal<HTMLDivElement>(isFirstMediaBlock, 0)
  const secondRef = useHeaderCascadeReveal<HTMLDivElement>(isFirstMediaBlock, MOTION_LARGE_STAGGER)

  return (
    <div className="grid">
      <div className="col">
        <div className={styles.grid}>
          <div ref={firstRef} className="entryReveal">
            <MediaSlot slot={block.first} ratio={[4, 5]} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div ref={secondRef} className="entryReveal">
            <MediaSlot slot={block.second} ratio={[4, 5]} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </div>
    </div>
  )
}
