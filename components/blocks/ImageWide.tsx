'use client'

import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageWideData} from '@/sanity/lib/types'
import {useHeaderCascadeReveal} from '@/hooks/useHeaderCascadeReveal'
import styles from './ImageWide.module.css'

interface ImageWideProps {
  block: ImageWideData
  /** True only for the project's first media block in document order
   *  (see BlockRenderer) — see useHeaderCascadeReveal for what this
   *  changes. */
  isFirstMediaBlock?: boolean
}

// Single slot — no stagger needed (see ImageDouble/ImageBento for the
// multi-slot cascade).
export function ImageWide({block, isFirstMediaBlock = false}: ImageWideProps) {
  const ref = useHeaderCascadeReveal<HTMLDivElement>(isFirstMediaBlock)

  return (
    <div className="grid">
      <div className="col">
        <div ref={ref} className={`entryReveal ${styles.frame}`}>
          <MediaSlot slot={block.media} ratio={[3, 2]} sizes="(min-width: 1200px) 1440px, 100vw" />
        </div>
      </div>
    </div>
  )
}
