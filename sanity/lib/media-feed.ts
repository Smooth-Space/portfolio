import {client} from '@/sanity/lib/client'
import {mediaFeedQuery} from '@/sanity/lib/queries'
import type {MediaFeedItem, MediaSlotData} from '@/sanity/lib/types'

type RawMediaFeedItem = MediaSlotData & {
  projectTitle: string
  projectSlug: string
}

// Shared by the Feed page and the homepage cursor scrubber — one query,
// one fetch path, so both consumers see the exact same set in the exact
// same document order. Each caller decides its own client-side ordering
// (Feed shuffles; the scrubber uses fetch order directly).
export async function fetchMediaFeed(): Promise<MediaFeedItem[]> {
  const raw = await client.fetch<RawMediaFeedItem[]>(mediaFeedQuery)
  return raw.map((item, index) => ({
    key: `${item.projectSlug}-${index}`,
    media: {kind: item.kind, alt: item.alt, image: item.image, video: item.video},
    projectTitle: item.projectTitle,
    projectSlug: item.projectSlug,
  }))
}
