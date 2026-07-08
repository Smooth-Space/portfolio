import Link from 'next/link'

import {fetchMediaFeed} from '@/sanity/lib/media-feed'
import {CursorScrubber} from '@/components/CursorScrubber'
import styles from './page.module.css'

export default async function Home() {
  const items = await fetchMediaFeed()

  return (
    <main className={styles.hero}>
      <div className={styles.wordmarkContainer}>
        <h1 className={`wordmark ${styles.wordmarkRow}`}>SmoothSpace</h1>
      </div>
      <div className={styles.lowerBand}>
        <div className={styles.introPosition}>
          <div className={styles.introContent}>
            <div>
              <p className={`bodyText ${styles.introPrimary}`}>The design practice of Jason Wilkins</p>
              <p className={`bodyText ${styles.introSecondary}`}>Brand, digital, and generative systems</p>
            </div>
            <Link href="/projects" className={`caption ${styles.viewWork}`}>
              View Work
            </Link>
          </div>
        </div>
        <div className={styles.squareWrap}>
          <CursorScrubber items={items} />
        </div>
      </div>
    </main>
  )
}
