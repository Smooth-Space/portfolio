'use client'

import Link from 'next/link'

import type {MediaSlotData, ServiceRef} from '@/sanity/lib/types'
import {MediaSlot} from '@/components/media/MediaSlot'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import {MOTION_LARGE_STAGGER} from '@/lib/motion'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  slug: string
  title: string
  thumbnail: MediaSlotData
  services?: ServiceRef[]
  /** This tile's 0-based position in the whole grid, in DOM order — used
   *  only to work out its position WITHIN ITS OWN ROW (see
   *  COLUMN_BREAKPOINTS below), not as a raw animation delay. */
  index: number
}

// Mirrors ProjectGrid.module.css's grid-template-columns breakpoints
// exactly (1 / 2 / 4 cols) — the single source of truth for "how many
// tiles per row," so the entry stagger can reset every row instead of
// accumulating across the whole grid. Keep in sync if that file changes.
const COLUMN_BREAKPOINTS = [
  {minWidth: 1200, columns: 4},
  {minWidth: 768, columns: 2},
  {minWidth: 0, columns: 1},
]

function getColumnsPerRow() {
  const width = window.innerWidth
  return COLUMN_BREAKPOINTS.find((breakpoint) => width >= breakpoint.minWidth)?.columns ?? 1
}

// Uniform grid — every tile is the same 1x1 cell, a flat 4:5 box. Title is
// always visible; services render as plain text (not chips — see
// ServiceChips, unchanged and still used on the detail page header) that
// fades in on hover, its line always reserved so nothing reflows.
//
// Entry animation: fades/rises into place the first time it scrolls into
// view (see useEntryReveal — fires once, then unobserves; skips the
// observer entirely for prefers-reduced-motion).
export function ProjectCard({slug, title, thumbnail, services, index}: ProjectCardProps) {
  const tileRef = useEntryReveal<HTMLAnchorElement>({
    // Resolved at trigger time (not mount) so a resize/breakpoint change
    // before this tile scrolls into view is still reflected.
    getDelay: () => (index % getColumnsPerRow()) * MOTION_LARGE_STAGGER,
  })

  return (
    <Link ref={tileRef} href={`/projects/${slug}`} className={`entryReveal ${styles.tile}`}>
      <div className={styles.frame}>
        <MediaSlot
          slot={thumbnail}
          ratio={[4, 5]}
          sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
          videoVariant="hover"
        />
      </div>
      <p className={`bodySmall ${styles.title}`}>{title}</p>
      {services && services.length > 0 && (
        <p className={`bodySmall ${styles.services}`}>{services.map((service) => service.name).join(', ')}</p>
      )}
    </Link>
  )
}
