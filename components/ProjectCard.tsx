import Link from 'next/link'

import type {MediaSlotData, ServiceRef} from '@/sanity/lib/types'
import {MediaSlot} from '@/components/media/MediaSlot'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  slug: string
  title: string
  thumbnail: MediaSlotData
  services?: ServiceRef[]
}

// Uniform grid — every tile is the same 1x1 cell, a flat 4:5 box. Title is
// always visible; services render as plain text (not chips — see
// ServiceChips, unchanged and still used on the detail page header) that
// fades in on hover, its line always reserved so nothing reflows.
export function ProjectCard({slug, title, thumbnail, services}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className={styles.tile}>
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
