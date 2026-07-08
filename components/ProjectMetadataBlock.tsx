import type {ProjectMetadata} from '@/sanity/lib/types'
import styles from './ProjectMetadataBlock.module.css'

interface MetadataItem {
  key: string
  text: string
  href?: string
}

interface MetadataGroup {
  label: string
  items: MetadataItem[]
}

// Each field is its own group and only appears if it has data — no empty
// label, no gap for a field with nothing in it.
function buildGroups(metadata: ProjectMetadata): MetadataGroup[] {
  const groups: MetadataGroup[] = []

  if (metadata.scope && metadata.scope.length > 0) {
    groups.push({
      label: 'Scope',
      items: metadata.scope.map((item, index) => ({key: String(index), text: item})),
    })
  }

  if (metadata.credits && metadata.credits.length > 0) {
    groups.push({
      label: 'Credits',
      items: metadata.credits.map((credit, index) => ({
        key: String(index),
        text: credit.role ? `${credit.role} — ${credit.name}` : credit.name,
      })),
    })
  }

  if (metadata.typography && metadata.typography.length > 0) {
    groups.push({
      label: 'Typography',
      items: metadata.typography.map((item, index) => ({
        key: String(index),
        text: item.name,
        href: item.url,
      })),
    })
  }

  if (metadata.recognition && metadata.recognition.length > 0) {
    groups.push({
      label: 'Recognition',
      items: metadata.recognition.map((item, index) => ({
        key: String(index),
        text: item.name,
        href: item.url,
      })),
    })
  }

  if (metadata.website && metadata.website.length > 0) {
    groups.push({
      label: 'Website',
      items: metadata.website.map((item, index) => ({
        key: String(index),
        text: item.label,
        href: item.url,
      })),
    })
  }

  return groups
}

interface ProjectMetadataBlockProps {
  metadata?: ProjectMetadata
}

export function ProjectMetadataBlock({metadata}: ProjectMetadataBlockProps) {
  const groups = metadata ? buildGroups(metadata) : []
  if (groups.length === 0) return null

  return (
    <div className="grid">
      <section className={`col ${styles.metadata}`}>
        <div className={styles.left}>
          <p className={`heading ${styles.label}`}>Project credits</p>
        </div>
        <div className={styles.groups}>
          {groups.map((group) => (
            <div key={group.label} className={styles.group}>
              <p className={styles.groupLabel}>{group.label}</p>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item.key}>
                    {item.href ? (
                      <a href={item.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                        {item.text}
                      </a>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
