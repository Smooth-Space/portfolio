import {MediaSlot} from '@/components/media/MediaSlot'
import type {ImageBentoData} from '@/sanity/lib/types'
import styles from './ImageBento.module.css'

// DOM order is always [tallImage, stackedTop, stackedBottom] — `tallColumn`
// only swaps which side each renders on via CSS `order`, never touches the
// DOM, so mobile stacking (tall image first) stays stable either way.
export function ImageBento({block}: {block: ImageBentoData}) {
  return (
    <div className="grid">
      <div className="col">
        <div className={styles.grid} data-tall={block.tallColumn}>
          <div className={styles.tallCell}>
            <MediaSlot slot={block.tallImage} ratio={[4, 5]} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className={styles.stackedCol}>
            {/* Ratio here is only a crop hint for the CDN request — the
                rendered box shape comes from .stackedCol's CSS (4:5 stacked
                on mobile, half of the tall column's height on desktop). */}
            <MediaSlot slot={block.stackedImageTop} ratio={[4, 2.5]} sizes="(min-width: 768px) 50vw, 100vw" />
            <MediaSlot slot={block.stackedImageBottom} ratio={[4, 2.5]} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </div>
    </div>
  )
}
