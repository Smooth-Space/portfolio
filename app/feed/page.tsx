import {fetchMediaFeed} from '@/sanity/lib/media-feed'
import {FeedGrid} from '@/components/feed/FeedGrid'

export default async function FeedPage() {
  const items = await fetchMediaFeed()

  return (
    <main style={{paddingTop: 'var(--header-y)', paddingBottom: 'var(--section-y)'}}>
      <div className="grid">
        <div className="col">
          <FeedGrid items={items} />
        </div>
      </div>
    </main>
  )
}
