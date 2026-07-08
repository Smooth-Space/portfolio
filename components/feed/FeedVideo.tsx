'use client'

import {useEffect, useRef, useState} from 'react'
import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'

import {useInView} from '@/hooks/useInView'

interface FeedVideoProps {
  playbackId: string
  alt: string
}

// Feed-specific: IntersectionObserver-gated autoplay (critical with a
// large, randomized media set — never autoplay everything at once), and
// resets to the poster frame on exit rather than just pausing in place.
// With tiles reordered randomly on every load, resuming mid-frame on
// re-entry would read as broken; starting over from the poster is the
// correct feed behavior.
export function FeedVideo({playbackId, alt}: FeedVideoProps) {
  const {ref, inView} = useInView<HTMLDivElement>({rootMargin: '200px'})
  const playerRef = useRef<MuxPlayerElement>(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  if (inView && !hasEnteredView) setHasEnteredView(true)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    if (inView) {
      player.play().catch(() => {})
    } else {
      player.pause()
      player.currentTime = 0
    }
  }, [inView])

  return (
    <div ref={ref} style={{width: '100%', height: '100%'}}>
      {hasEnteredView ? (
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          streamType="on-demand"
          muted
          loop
          playsInline
          poster={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
          title={alt}
          style={{width: '100%', height: '100%', objectFit: 'cover', '--controls': 'none'}}
        />
      ) : (
        <img
          src={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      )}
    </div>
  )
}
