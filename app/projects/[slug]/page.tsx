import {notFound} from 'next/navigation'

import {client} from '@/sanity/lib/client'
import {projectBySlugQuery, projectSlugsQuery, projectsIndexQuery} from '@/sanity/lib/queries'
import type {Project, ProjectListItem} from '@/sanity/lib/types'
import {buildMenuItems} from '@/lib/menu'
import {pickRelatedProjects} from '@/lib/related-projects'
import {BlockRenderer} from '@/components/blocks/BlockRenderer'
import {FloatingMenu} from '@/components/FloatingMenu'
import {HeaderCascadeProvider} from '@/components/HeaderCascadeContext'
import {ProjectHeader} from '@/components/ProjectHeader'
import {ProjectMetadataBlock} from '@/components/ProjectMetadataBlock'
import {RelatedProjects} from '@/components/RelatedProjects'

// Id of the metadata/related-projects footer — see FloatingMenu's hideBoundaryId.
const FOOTER_ID = 'project-footer'

export async function generateStaticParams() {
  const projects = await client.fetch<{slug: string}[]>(projectSlugsQuery)
  return projects.map((project) => ({slug: project.slug}))
}

export default async function ProjectPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const [project, allProjects] = await Promise.all([
    client.fetch<Project | null>(projectBySlugQuery, {slug}),
    client.fetch<ProjectListItem[]>(projectsIndexQuery),
  ])
  if (!project) notFound()

  const relatedProjects = pickRelatedProjects(allProjects, slug)

  const menuItems = buildMenuItems(project.contentBlocks ?? [])
  const anchorIds = Object.fromEntries(menuItems.map((item) => [item.key, item.anchorId]))

  return (
    <>
      <FloatingMenu items={menuItems} hideBoundaryId={FOOTER_ID} />
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--header-y)',
          paddingTop: 'var(--header-y)',
        }}
      >
        <HeaderCascadeProvider>
          <ProjectHeader title={project.title} intro={project.intro} services={project.services} />
          <div style={{display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--section-y)'}}>
            <BlockRenderer blocks={project.contentBlocks ?? []} anchorIds={anchorIds} />
            <div
              id={FOOTER_ID}
              style={{display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--section-y)'}}
            >
              <ProjectMetadataBlock metadata={project.metadata} />
              <RelatedProjects projects={relatedProjects} />
            </div>
          </div>
        </HeaderCascadeProvider>
      </main>
    </>
  )
}
