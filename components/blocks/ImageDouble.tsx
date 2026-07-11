'use client'

import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageDoubleData} from '@/sanity/lib/types'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import styles from './ImageDouble.module.css'

// Seconds between slots as they cascade in (see globals.css for the
// shared opacity/transform duration + easing tokens) — same step as
// ProjectCard's row stagger, so the whole site reads as one motion
// language.
const MEDIA_STAGGER_STEP = 0.1

// All multi-slot blocks stack vertically on mobile (single grid column below
// the 768px breakpoint); side by side on larger viewports.
//
// Each slot gets its own wrapper div carrying the entry-reveal — plain
// wrapper, no styling of its own, so ImageDouble.module.css's `.grid > *`
// selector keeps sizing whatever is the direct grid child exactly as
// before (now the wrapper instead of MediaSlot's own root).
export function ImageDouble({block}: {block: ImageDoubleData}) {
  const firstRef = useEntryReveal<HTMLDivElement>({delay: 0})
  const secondRef = useEntryReveal<HTMLDivElement>({delay: MEDIA_STAGGER_STEP})

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
