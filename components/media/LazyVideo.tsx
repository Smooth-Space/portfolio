'use client'

import {useEffect, useRef, useState} from 'react'
import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'

import {useInView} from '@/hooks/useInView'

interface LazyVideoProps {
  playbackId: string
  alt: string
}

// Lazy-load: only mounts the player once the slot nears the viewport.
// Pause-on-exit: once mounted, play/pause tracks visibility.
export function LazyVideo({playbackId, alt}: LazyVideoProps) {
  const {ref, inView} = useInView<HTMLDivElement>({rootMargin: '200px'})
  const playerRef = useRef<MuxPlayerElement>(null)
  // Latches true the first time the slot enters view, and stays mounted
  // afterwards. Set during render (not an effect) so entering view and
  // mounting the player happen in the same pass — React's documented
  // pattern for state derived from a prop/state change.
  const [hasEnteredView, setHasEnteredView] = useState(false)
  if (inView && !hasEnteredView) setHasEnteredView(true)

  useEffect(() => {
    if (inView) playerRef.current?.play().catch(() => {})
    else playerRef.current?.pause()
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
          autoPlay
          playsInline
          poster={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
          title={alt}
          // Decorative background-style video: no controls, ever — mux-player
          // wires every control layer's display through this custom property
          // (--media-control-display: var(--controls)), so setting it to
          // 'none' removes the play/seek/volume/fullscreen chrome regardless
          // of hover or focus state.
          style={{width: '100%', height: '100%', objectFit: 'cover', '--controls': 'none'}}
        />
      ) : (
        // Resting placeholder before the slot is ever in view.
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
