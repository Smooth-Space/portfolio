import type {ProjectListItem} from '@/sanity/lib/types'

const ROW_SIZE = 4

// Ranks other projects by shared-service overlap (most shared services
// first), ties broken by proximity in the curated orderRank sequence —
// `projects` is already ordered that way (see projectsIndexQuery), so
// "distance" is just index distance, no raw orderRank value needed.
// Remaining slots are filled sequentially, walking forward from the
// current project and wrapping past the end (same loop-to-start behavior
// the old single next-project card used), skipping the current project
// and anything already matched. A project with no services at all skips
// straight to the sequential fallback for the whole row.
export function pickRelatedProjects(
  projects: ProjectListItem[],
  currentSlug: string,
  rowSize: number = ROW_SIZE,
): ProjectListItem[] {
  const currentIndex = projects.findIndex((project) => project.slug === currentSlug)
  if (currentIndex === -1) return []

  const currentServiceIds = new Set((projects[currentIndex].services ?? []).map((service) => service._id))

  const matched =
    currentServiceIds.size === 0
      ? []
      : projects
          .map((project, index) => ({project, index}))
          .filter(({project}) => project.slug !== currentSlug)
          .map(({project, index}) => ({
            project,
            overlap: (project.services ?? []).filter((service) => currentServiceIds.has(service._id)).length,
            distance: Math.abs(index - currentIndex),
          }))
          .filter(({overlap}) => overlap > 0)
          .sort((a, b) => (b.overlap !== a.overlap ? b.overlap - a.overlap : a.distance - b.distance))
          .map(({project}) => project)

  const result = matched.slice(0, rowSize)
  const placedSlugs = new Set(result.map((project) => project.slug))

  for (let offset = 1; offset < projects.length && result.length < rowSize; offset++) {
    const candidate = projects[(currentIndex + offset) % projects.length]
    if (candidate.slug === currentSlug || placedSlugs.has(candidate.slug)) continue
    result.push(candidate)
    placedSlugs.add(candidate.slug)
  }

  return result
}
