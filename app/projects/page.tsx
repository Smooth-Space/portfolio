import {client} from '@/sanity/lib/client'
import {projectsIndexQuery} from '@/sanity/lib/queries'
import type {ProjectListItem} from '@/sanity/lib/types'
import {ProjectCard} from '@/components/ProjectCard'
import styles from '@/components/ProjectGrid.module.css'

export default async function ProjectsIndexPage() {
  const projects = await client.fetch<ProjectListItem[]>(projectsIndexQuery)

  return (
    <main style={{paddingTop: 'var(--header-y)', paddingBottom: 'var(--section-y)'}}>
      <div className="grid">
        <div className={`col ${styles.grid}`}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              slug={project.slug}
              title={project.title}
              thumbnail={project.thumbnail}
              services={project.services}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
