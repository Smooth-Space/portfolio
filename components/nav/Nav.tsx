'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

import type {NavLink, SocialLink} from '@/sanity/lib/types'
import {MobileMenuOverlay} from './MobileMenuOverlay'
import styles from './Nav.module.css'

// Below this scroll offset the page counts as "at the top" — nav stays
// visible and transparent regardless of direction.
const SCROLL_TOP_THRESHOLD = 4

interface NavProps {
  /** From siteSettings.navLinks (see app/layout.tsx) — the single source
   *  of truth for both the desktop links here and the mobile overlay's
   *  links. Editing/reordering in Studio changes what renders, no code
   *  change needed. */
  navLinks: NavLink[]
  socials: SocialLink[]
}

// Adapts by route and by breakpoint:
// - Home: no small wordmark (the hero IS the wordmark). Desktop shows
//   navLinks directly, same as internal pages.
// - Internal pages: small wordmark top-left, plus navLinks.
// - Below 1200px on any page: collapses to a single "Menu"/"Close" toggle
//   (no explicit tablet/phone mockup exists for internal pages — this
//   mirrors the home pattern for consistency).
// Both link groups always render; CSS shows the right one per breakpoint,
// so there's no client-side breakpoint detection or hydration risk.
//
// The toggle is one persistent element that never unmounts — only its
// label/handler change with menuOpen — so it can't visually jump between
// open and closed states the way two separate buttons (one in Nav, one in
// the overlay) could.
export function Nav({navLinks, socials}: NavProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Direction-aware show/hide: hidden while scrolling down, revealed while
  // scrolling up, always visible (and transparent) at the very top. Scroll
  // position is a browser-only API, so this has to live in an effect.
  //
  // rAF-throttled to at most one check per animation frame (native
  // "scroll" events can fire faster than that). On top of the throttle,
  // setScrolled/setNavHidden are only called when the value actually
  // flips — React already bails out of re-rendering on an unchanged
  // primitive, but skipping the call entirely avoids even that check
  // firing every frame during a continuous scroll gesture.
  useEffect(() => {
    let lastY = window.scrollY
    let lastScrolled = false
    let lastHidden = false
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const atTop = y <= SCROLL_TOP_THRESHOLD
      const nextScrolled = !atTop
      const nextHidden = atTop ? false : y > lastY
      if (nextScrolled !== lastScrolled) {
        setScrolled(nextScrolled)
        lastScrolled = nextScrolled
      }
      if (nextHidden !== lastHidden) {
        setNavHidden(nextHidden)
        lastHidden = nextHidden
      }
      lastY = y
      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Nav lives in the root layout, so it doesn't remount on navigation —
  // clicking a link inside the overlay changes the route but not this
  // component's state. Close on every route change so the overlay doesn't
  // stay open over the new page. Done during render (not an effect) since
  // `pathname` is available synchronously on both server and client.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
  }

  // Studio has its own UI — the site chrome must not render on top of it.
  // Checked after the hooks above (not as an early return before them) so
  // the Rules of Hooks hold regardless of route.
  if (pathname?.startsWith('/studio')) return null

  return (
    <>
      <header
        className={`${styles.nav} ${navHidden ? styles.navHidden : ''} ${scrolled ? styles.navScrolled : ''}`}
      >
        {!isHome && (
          <Link href="/" className={styles.wordmark}>
            SmoothSpace
          </Link>
        )}
        <div className={styles.linksGroup}>
          <nav className={`bodySmall ${styles.desktopLinks}`}>
            {navLinks.map((item) => (
              <Link key={item._key} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className={`${styles.menuButton} ${styles.mobileToggle} ${menuOpen ? styles.mobileToggleOpen : ''}`}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      <MobileMenuOverlay open={menuOpen} navLinks={navLinks} socials={socials} />
    </>
  )
}
