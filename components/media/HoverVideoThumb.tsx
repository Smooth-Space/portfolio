'use client'

import {useRef} from 'react'
import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'

interface HoverVideoThumbProps {
  playbackId: string
  alt: string
}

// Index-thumbnail behavior (distinct from LazyVideo's scroll-triggered
// autoplay): shows the Mux poster at rest, plays on hover, pauses and
// resets to the poster on mouse-out. Gated on `matchMedia('(hover: hover)')`
// rather than UA sniffing, so touch devices — which can fire synthetic
// mouseenter events after a tap — never trigger playback; they only ever
// see the poster.
export function HoverVideoThumb({playbackId, alt}: HoverVideoThumbProps) {
  const playerRef = useRef<MuxPlayerElement>(null)

  const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const handlePointerEnter = () => {
    if (!canHover()) return
    playerRef.current?.play().catch(() => {})
  }

  const handlePointerLeave = () => {
    if (!canHover()) return
    const player = playerRef.current
    if (!player) return
    player.pause()
    player.currentTime = 0
  }

  return (
    <div
      style={{width: '100%', height: '100%'}}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        muted
        loop
        playsInline
        poster={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
        title={alt}
        // Same no-chrome treatment as the detail page's in-page video.
        style={{width: '100%', height: '100%', objectFit: 'cover', '--controls': 'none'}}
      />
    </div>
  )
}
