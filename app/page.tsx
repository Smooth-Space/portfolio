import {fetchMediaFeed} from '@/sanity/lib/media-feed'
import {HomeHero} from '@/components/HomeHero'

export default async function Home() {
  const items = await fetchMediaFeed()

  return <HomeHero items={items} />
}
