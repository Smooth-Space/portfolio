'use client'

import {useEffect, useState} from 'react'

import type {MediaFeedItem} from '@/sanity/lib/types'
import {FeedTile} from './FeedTile'
import styles from './FeedGrid.module.css'

function shuffle<T>(input: T[]): T[] {
  const result = [...input]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

interface FeedGridProps {
  items: MediaFeedItem[]
}

// Renders in fetch order on the server/first paint (deterministic, so
// hydration matches), then shuffles once client-side after mount —
// randomizing during the initial render would make the server and client
// disagree on order and trigger a hydration mismatch.
export function FeedGrid({items}: FeedGridProps) {
  const [ordered, setOrdered] = useState(items)

  useEffect(() => {
    // Intentional exception: this can only run post-mount. Shuffling
    // during render would desync server and client output (Math.random()
    // isn't deterministic) and cause a hydration mismatch — the update
    // has to land in a separate commit after hydration completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdered(shuffle(items))
  }, [items])

  return (
    <div className={styles.grid}>
      {ordered.map((item) => (
        <FeedTile key={item.key} item={item} />
      ))}
    </div>
  )
}
