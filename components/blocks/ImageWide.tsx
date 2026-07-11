'use client'

import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageWideData} from '@/sanity/lib/types'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import styles from './ImageWide.module.css'

// Single slot — no stagger needed (see ImageDouble/ImageBento for the
// multi-slot cascade).
export function ImageWide({block}: {block: ImageWideData}) {
  const ref = useEntryReveal<HTMLDivElement>()

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
