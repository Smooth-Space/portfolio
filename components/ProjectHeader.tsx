import type {ServiceRef} from '@/sanity/lib/types'
import {ServiceChips} from './ServiceChips'
import styles from './ProjectHeader.module.css'

interface ProjectHeaderProps {
  title: string
  intro: string
  services?: ServiceRef[]
}

// Title and intro use the display role (--text-2xl) — one clear step
// larger than textBlock's label/summary (--text-lg) — and share that same
// size with each other; hierarchy between title and intro comes from
// color only (primary vs. muted), not size.
export function ProjectHeader({title, intro, services}: ProjectHeaderProps) {
  return (
    <div className="grid">
      <header className={`col ${styles.header}`}>
        <div className={styles.titleGroup}>
          <p className={`display ${styles.title}`}>{title}</p>
          <p className={`display ${styles.intro}`}>{intro}</p>
        </div>
        <ServiceChips services={services} />
      </header>
    </div>
  )
}
