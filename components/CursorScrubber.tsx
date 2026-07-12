'use client'

import {useEffect, useState} from 'react'

import {urlFor} from '@/sanity/lib/image'
import type {MediaFeedItem} from '@/sanity/lib/types'
import styles from './CursorScrubber.module.css'

// Tunable: how many horizontal pixels of cursor movement advance one
// frame. Smaller = more sensitive scrubbing.
const SCRUB_DIVISOR = 50
const TOUCH_ADVANCE_MS = 1000

// Stills only, even for video items — the Mux poster frame, never a
// playing <video>/<mux-player>. Scrubbing needs to swap frames instantly
// on every mouse-move tick; decoding video (let alone several at once)
// can't keep up with that, so every item here is a plain <img>.
function getStillUrl(item: MediaFeedItem): string | null {
  if (item.media.kind === 'video' && item.media.video?.playbackId) {
    return `https://image.mux.com/${item.media.video.playbackId}/thumbnail.jpg`
  }
  if (item.media.kind === 'image' && item.media.image) {
    return urlFor(item.media.image).width(800).height(800).fit('crop').auto('format').url()
  }
  return null
}

interface CursorScrubberProps {
  items: MediaFeedItem[]
}

export function CursorScrubber({items}: CursorScrubberProps) {
  const stills = items.map(getStillUrl).filter((url): url is string => url !== null)
  const [index, setIndex] = useState(0)
  // Lazy initializer, not a post-mount effect: `typeof window` gates it
  // safely for SSR (server render leaves this null, same as before), but
  // on the client it resolves on the FIRST render — no longer a whole
  // extra render/effect cycle where isTouch is null and neither the
  // mousemove nor the interval effect below is active yet. That gap was
  // harmless on a fast desktop but left room for the touch case to lose
  // a race on a slower device.
  const [isTouch, setIsTouch] = useState<boolean | null>(() =>
    typeof window === 'undefined' ? null : window.matchMedia('(pointer: coarse)').matches,
  )

  // Keeps isTouch live if the pointer type genuinely changes post-mount
  // (e.g. a mouse/trackpad attached to a tablet) — the lazy initializer
  // above only captures a snapshot at first render.
  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)')
    const handleChange = (event: MediaQueryListEvent) => setIsTouch(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // Preload the whole still set up front so scrubbing never hits a
  // not-yet-loaded frame.
  useEffect(() => {
    stills.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [stills])

  useEffect(() => {
    if (isTouch !== false || stills.length === 0) return

    const handleMouseMove = (event: MouseEvent) => {
      const raw = Math.floor(event.clientX / SCRUB_DIVISOR)
      setIndex(((raw % stills.length) + stills.length) % stills.length)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouch, stills.length])

  useEffect(() => {
    if (isTouch !== true || stills.length === 0) return

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % stills.length)
    }, TOUCH_ADVANCE_MS)
    return () => clearInterval(interval)
  }, [isTouch, stills.length])

  if (stills.length === 0) return null

  return (
    <div className={styles.scrubber}>
      <img src={stills[index]} alt="" className={styles.image} />
    </div>
  )
}
