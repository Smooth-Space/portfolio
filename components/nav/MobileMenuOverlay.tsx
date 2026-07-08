'use client'

import Link from 'next/link'

import type {NavLink, SocialLink} from '@/sanity/lib/types'
import styles from './MobileMenuOverlay.module.css'

interface MobileMenuOverlayProps {
  open: boolean
  navLinks: NavLink[]
  socials: SocialLink[]
}

// Shared, full-screen overlay — opened/closed by Nav's single persistent
// toggle (which sits visually on top of this, via a higher z-index, so it
// never moves between the open and closed states). This overlay owns no
// close control of its own — clicking a link just navigates, and Nav
// itself closes `open` on the resulting route change.
export function MobileMenuOverlay({open, navLinks, socials}: MobileMenuOverlayProps) {
  if (!open) return null

  return (
    <div className={styles.overlay}>
      <nav className={styles.links}>
        {navLinks.map((item) => (
          <Link key={item._key} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
      </nav>
      {socials.length > 0 && (
        <div className={styles.socials}>
          {socials.map((item) => (
            <a key={item._key} href={item.url} className={styles.social} target="_blank" rel="noopener noreferrer">
              {item.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
