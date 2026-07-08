import {PortableText} from '@portabletext/react'

import type {TextBlockData} from '@/sanity/lib/types'
import styles from './TextBlock.module.css'

interface TextBlockProps {
  block: TextBlockData
  anchorId: string
}

// Two-column on desktop: label + summary in the left column, body in the
// right. Single column on mobile. Label/summary still differ from body only
// by color (the brief's "hierarchy through color, not size" intent).
export function TextBlock({block, anchorId}: TextBlockProps) {
  return (
    <div className="grid">
      <section id={anchorId} className={`col ${styles.section}`}>
        <div className={styles.left}>
          <p className={`heading ${styles.label}`}>{block.label}</p>
          <p className={`heading ${styles.summary}`}>{block.summary}</p>
        </div>
        {block.body && (
          <div className={`bodyText ${styles.body}`}>
            <PortableText value={block.body} />
          </div>
        )}
      </section>
    </div>
  )
}
