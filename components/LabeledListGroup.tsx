import styles from './LabeledListGroup.module.css'

interface LabeledListGroupProps {
  label: string
  items: string[]
}

// Plain label + one-line-per-entry list, same weight, distinguished only
// by color (--color-fg label, --color-fg-muted entries) — not a reuse of
// ProjectMetadataBlock, whose groups are {role/name/url} objects rather
// than plain strings. Renders nothing (not even the label) when empty, so
// an unfilled group never leaves a stray heading or gap behind.
export function LabeledListGroup({label, items}: LabeledListGroupProps) {
  if (items.length === 0) return null

  return (
    <div className={styles.group}>
      <p className={styles.label}>{label}</p>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
