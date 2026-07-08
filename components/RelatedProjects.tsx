import type {ProjectListItem} from '@/sanity/lib/types'
import {ProjectCard} from '@/components/ProjectCard'
import gridStyles from '@/components/ProjectGrid.module.css'
import styles from './RelatedProjects.module.css'

interface RelatedProjectsProps {
  projects: ProjectListItem[]
}

// Same tile component and grid columns as the project index (see
// ProjectGrid.module.css) — service-matched + sequential-fallback picks
// come from lib/related-projects.ts. Always fetches 4 candidates; .row
// (below) explicitly caps how many are visible per breakpoint (1/2/4),
// independent of the index's own breakpoint behavior, so this row never
// wraps past a single row.
export function RelatedProjects({projects}: RelatedProjectsProps) {
  if (projects.length === 0) return null

  return (
    <div className="grid">
      <div className={`col ${styles.section}`}>
        <p className={`heading ${styles.label}`}>More Projects</p>
        <div className={`${gridStyles.grid} ${styles.row}`}>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              slug={project.slug}
              title={project.title}
              thumbnail={project.thumbnail}
              services={project.services}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
