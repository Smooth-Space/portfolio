import type {CSSProperties} from 'react'

import type {ServiceRef} from '@/sanity/lib/types'
import {MOTION_SMALL_STAGGER} from '@/lib/motion'
import styles from './ServiceChips.module.css'

interface ServiceChipsProps {
  services?: ServiceRef[]
  /** Seconds to wait before this block's OWN stagger starts — set by
   *  ProjectHeader to the combined duration of the title+intro line
   *  reveal, so chips read as the third beat, not simultaneous with
   *  them. Cascades off the same ancestor .entryRevealVisible trigger
   *  as the line reveal (see .entryRevealSmall in globals.css) —
   *  defaults to 0 for any other/future caller that doesn't sequence
   *  chips after something else. */
  baseDelay?: number
}

// Filled Sand-2, 4px-radius chips — shared between the project header and
// the index tiles so both stay in sync automatically. `services` are
// dereferenced `service` documents (see sanity/lib/queries.ts), not raw
// strings — read `.name` for display.
export function ServiceChips({services, baseDelay = 0}: ServiceChipsProps) {
  if (!services || services.length === 0) return null

  return (
    <ul className={`caption ${styles.chips}`}>
      {services.map((service, index) => (
        <li
          key={service._id}
          className={`entryRevealSmall ${styles.chip}`}
          style={{'--entry-delay': `${baseDelay + index * MOTION_SMALL_STAGGER}s`} as CSSProperties}
        >
          {service.name}
        </li>
      ))}
    </ul>
  )
}
