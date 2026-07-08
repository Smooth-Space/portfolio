import type {MediaSlotData} from '@/sanity/lib/types'
import {SanityImage} from './SanityImage'
import {LazyVideo} from './LazyVideo'
import {HoverVideoThumb} from './HoverVideoThumb'
import styles from './MediaSlot.module.css'

interface MediaSlotProps {
  slot: MediaSlotData
  /** Crop ratio [width, height] requested from Sanity's CDN (hotspot-aware).
   *  The rendered box's actual on-screen shape is the caller's CSS
   *  responsibility (aspect-ratio, or a stretched flex/grid cell) — this
   *  is purely input to the image crop request. */
  ratio: [number, number]
  sizes?: string
  priority?: boolean
  /** 'autoplay' (default): in-page content video, lazy-mounts and plays
   *  once scrolled into view. 'hover': index-thumbnail video, rests on its
   *  poster and only plays on pointer hover. */
  videoVariant?: 'autoplay' | 'hover'
}

// The single reusable image-or-video box. Always fills 100% of whatever box
// the parent establishes, so the parent's CSS is what reserves space before
// media loads (zero layout shift) — MediaSlot itself never opinionates on
// its own footprint.
export function MediaSlot({slot, ratio, sizes = '100vw', priority, videoVariant = 'autoplay'}: MediaSlotProps) {
  return (
    <div className={styles.slot}>
      {slot.kind === 'video' && slot.video?.playbackId ? (
        videoVariant === 'hover' ? (
          <HoverVideoThumb playbackId={slot.video.playbackId} alt={slot.alt} />
        ) : (
          <LazyVideo playbackId={slot.video.playbackId} alt={slot.alt} />
        )
      ) : slot.kind === 'image' && slot.image ? (
        <SanityImage image={slot.image} alt={slot.alt} ratio={ratio} sizes={sizes} priority={priority} />
      ) : null}
    </div>
  )
}
