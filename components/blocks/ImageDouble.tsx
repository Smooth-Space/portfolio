import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageDoubleData} from '@/sanity/lib/types'
import styles from './ImageDouble.module.css'

// All multi-slot blocks stack vertically on mobile (single grid column below
// the 768px breakpoint); side by side on larger viewports.
export function ImageDouble({block}: {block: ImageDoubleData}) {
  return (
    <div className="grid">
      <div className="col">
        <div className={styles.grid}>
          <MediaSlot slot={block.first} ratio={[4, 5]} sizes="(min-width: 768px) 50vw, 100vw" />
          <MediaSlot slot={block.second} ratio={[4, 5]} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </div>
    </div>
  )
}
