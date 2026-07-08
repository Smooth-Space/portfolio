import type {ContentBlock, TextBlockData} from '@/sanity/lib/types'

export interface MenuItem {
  key: string
  label: string
  anchorId: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'

// Deterministic, unique anchor ids in document order — computed once on the
// server and used both to render the menu and to id each textBlock section.
export function buildMenuItems(blocks: ContentBlock[] = []): MenuItem[] {
  const seen = new Map<string, number>()
  return blocks
    .filter((block): block is TextBlockData => block._type === 'textBlock')
    .map((block) => {
      const base = slugify(block.label)
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      const anchorId = count === 0 ? base : `${base}-${count}`
      return {key: block._key, label: block.label, anchorId}
    })
}
