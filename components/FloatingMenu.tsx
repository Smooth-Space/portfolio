'use client'

import {useMemo} from 'react'

import type {MenuItem} from '@/lib/menu'
import {useActiveSection} from '@/hooks/useActiveSection'
import {useSectionVisible} from '@/hooks/useSectionVisible'
import styles from './FloatingMenu.module.css'

interface FloatingMenuProps {
  items: MenuItem[]
  /** Id of the metadata/next-project footer below the last textBlock/media
   *  section — once it scrolls into view, the pill hides entirely rather
   *  than just losing its active link. */
  hideBoundaryId: string
}

export function FloatingMenu({items, hideBoundaryId}: FloatingMenuProps) {
  const anchorIds = useMemo(() => items.map((item) => item.anchorId), [items])
  const active = useActiveSection(anchorIds)
  const pastContent = useSectionVisible(hideBoundaryId)

  if (items.length === 0 || pastContent) return null

  return (
    <nav className={styles.nav} aria-label="Section navigation">
      {items.map((item) => (
        <a
          key={item.key}
          href={`#${item.anchorId}`}
          className={`${styles.link} ${active === item.anchorId ? styles.linkActive : ''}`}
          aria-current={active === item.anchorId ? 'true' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
