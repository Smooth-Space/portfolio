import type {ServiceRef} from '@/sanity/lib/types'
import styles from './ServiceChips.module.css'

interface ServiceChipsProps {
  services?: ServiceRef[]
}

// Filled Sand-2, 4px-radius chips — shared between the project header and
// the index tiles so both stay in sync automatically. `services` are
// dereferenced `service` documents (see sanity/lib/queries.ts), not raw
// strings — read `.name` for display.
export function ServiceChips({services}: ServiceChipsProps) {
  if (!services || services.length === 0) return null

  return (
    <ul className={`caption ${styles.chips}`}>
      {services.map((service) => (
        <li key={service._id} className={styles.chip}>
          {service.name}
        </li>
      ))}
    </ul>
  )
}
