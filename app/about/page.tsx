import {client} from '@/sanity/lib/client'
import {aboutPageQuery} from '@/sanity/lib/queries'
import type {AboutPage} from '@/sanity/lib/types'
import {LabeledListGroup} from '@/components/LabeledListGroup'
import styles from './page.module.css'

export default async function AboutPage() {
  const about = await client.fetch<AboutPage | null>(aboutPageQuery)

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 'var(--section-y)',
        paddingTop: 'var(--header-y)',
        paddingBottom: 'var(--section-y)',
      }}
    >
      {about?.bio && (
        <div className="grid">
          <div className="col">
            <p className={`bodyText ${styles.bio}`}>{about.bio}</p>
          </div>
        </div>
      )}
      <div className="grid">
        <div className={`col ${styles.groups}`}>
          <LabeledListGroup label="Experience" items={about?.experience ?? []} />
          <LabeledListGroup label="Appointments" items={about?.appointments ?? []} />
          <LabeledListGroup label="Speaking & Recognition" items={about?.speakingRecognition ?? []} />
          <LabeledListGroup label="Services" items={about?.services ?? []} />
        </div>
      </div>
    </main>
  )
}
