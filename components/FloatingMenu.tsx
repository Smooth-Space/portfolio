'use client'

import {useEffect, useMemo, useRef} from 'react'

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

  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())

  // Slides the pill under whichever link is active, whether that change
  // came from scrolling or from clicking a link directly (both just flow
  // through the same `active` value from useActiveSection — a click's
  // native #anchor jump triggers the same IntersectionObserver as
  // scrolling does, so there's no separate click path to keep in sync).
  //
  // Positioned via clip-path (not left/width) so the slide is a
  // compositor-only paint, never a layout reflow. The pill itself is
  // sized to the nav's full scrollable content width (not just its
  // visible viewport width) so clip-path's inset math stays correct
  // even if the link row ever overflows and scrolls horizontally.
  useEffect(() => {
    const nav = navRef.current
    const pill = pillRef.current
    if (!nav || !pill || !active) return

    const update = () => {
      const link = linkRefs.current.get(active)
      if (!link) return
      pill.style.width = `${nav.scrollWidth}px`
      // Matches the active link's own box exactly (see the comment on
      // .pill in FloatingMenu.module.css for why height has to track the
      // link, not nav's full padded height).
      pill.style.top = `${link.offsetTop}px`
      pill.style.height = `${link.offsetHeight}px`
      const left = link.offsetLeft
      const right = nav.scrollWidth - (link.offsetLeft + link.offsetWidth)
      pill.style.clipPath = `inset(0 ${right}px 0 ${left}px round 999px)`
    }

    update()

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(nav)
    return () => resizeObserver.disconnect()
  }, [active])

  if (items.length === 0 || pastContent) return null

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Section navigation">
      <div ref={pillRef} className={styles.pill} aria-hidden="true" />
      {items.map((item) => (
        <a
          key={item.key}
          ref={(el) => {
            if (el) linkRefs.current.set(item.anchorId, el)
            else linkRefs.current.delete(item.anchorId)
          }}
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
