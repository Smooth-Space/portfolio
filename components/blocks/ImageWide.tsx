import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageWideData} from '@/sanity/lib/types'
import styles from './ImageWide.module.css'

export function ImageWide({block}: {block: ImageWideData}) {
  return (
    <div className="grid">
      <div className="col">
        <div className={styles.frame}>
          <MediaSlot slot={block.media} ratio={[3, 2]} sizes="(min-width: 1200px) 1440px, 100vw" />
        </div>
      </div>
    </div>
  )
}
