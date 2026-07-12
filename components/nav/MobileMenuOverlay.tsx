'use client'

import type {CSSProperties} from 'react'
import {useEffect, useState} from 'react'
import Link from 'next/link'

import type {NavLink, SocialLink} from '@/sanity/lib/types'
import {useLineSplit} from '@/hooks/useLineSplit'
import {
  MOTION_BEAT_DELAY,
  MOTION_MEDIUM_STAGGER,
  MOTION_SMALL_STAGGER,
  OVERLAY_EXIT_DURATION,
  OVERLAY_EXIT_STAGGER,
  prefersReducedMotion,
} from '@/lib/motion'
import styles from './MobileMenuOverlay.module.css'

interface MobileMenuOverlayProps {
  open: boolean
  navLinks: NavLink[]
  socials: SocialLink[]
}

type Phase = 'closed' | 'open' | 'closing'

// Panel entrance/exit share the same slide speed — only its DELAY
// differs (0 on open; after the content's own head start on close).
const PANEL_DURATION = 0.28

// One-time safety margin added after the computed exit duration before
// React actually swaps back to the resting 'closed' state (visibility:
// hidden) — guards against the JS timer firing a few ms before the CSS
// transition has genuinely finished, which would just reintroduce a
// smaller version of the same "cut off mid-animation" bug this exit
// was built to fix.
const EXIT_TIMEOUT_BUFFER_MS = 50

function delayStyle(seconds: number): CSSProperties {
  return {'--entry-delay': `${seconds}s`} as CSSProperties
}

// Time until the LAST item in a staggered group STARTS (not finishes
// settling) — see HomeHero/ProjectHeader for the same helper.
function lastStart(count: number, staggerStep: number): number {
  if (count === 0) return 0
  return (count - 1) * staggerStep
}

interface OverlayLinkProps {
  href: string
  label: string
  phase: Phase
  enterDelay: number
  exitDelay: number
}

// One nav link's own masked line reveal — same treatment as project
// titles (useLineSplit + .lineMask/.lineInner), split into its own
// component since useLineSplit is a hook and can't be called inside
// the parent's .map() loop. Which delay actually applies (enter vs
// exit) is picked here, based on the overlay's current phase — the
// EXIT duration itself is overridden separately, by .overlayClosing's
// descendant rule in the CSS; this component only ever sets the delay
// half of the equation.
function OverlayLink({href, label, phase, enterDelay, exitDelay}: OverlayLinkProps) {
  const {ref, lines} = useLineSplit<HTMLAnchorElement>(label)
  const activeDelay = phase === 'closing' ? exitDelay : enterDelay

  return (
    <Link ref={ref} href={href} aria-label={label} className={`display ${styles.link}`}>
      {lines.length > 0 ? (
        <span aria-hidden="true">
          {lines.map((line, index) => (
            <span key={index} className="lineMask">
              <span className="lineInner" style={delayStyle(activeDelay + index * MOTION_MEDIUM_STAGGER)}>
                {line}
              </span>
            </span>
          ))}
        </span>
      ) : (
        label
      )}
    </Link>
  )
}

// Shared, full-screen overlay — opened/closed by Nav's single persistent
// toggle (which sits visually on top of this, via a higher z-index, so it
// never moves between the open and closed states). This overlay owns no
// close control of its own — clicking a link just navigates, and Nav
// itself closes `open` on the resulting route change.
//
// Always mounted (never conditionally unmounted) so open/close/exit
// transitions can all actually play. Three CSS phases — .overlay
// (closed, at rest) / .overlayOpen / .overlayClosing — rather than a
// simple boolean toggle, because the exit is a genuinely different
// choreography from the entrance, not its mirror image:
//
// ENTRANCE: panel slides down immediately; nav links reveal
// (.lineMask/.lineInner) starting MOTION_BEAT_DELAY after the panel
// begins (an overlap, not a queued step), staggered
// MOTION_MEDIUM_STAGGER apart, in order; socials (.entryRevealSmall)
// follow, MOTION_BEAT_DELAY after the last nav link begins.
//
// EXIT: reverse of the above, LIFO — socials retract first (in reverse
// order among themselves), then nav links in reverse order (last-
// entered first), all much faster and tighter (OVERLAY_EXIT_DURATION/
// OVERLAY_EXIT_STAGGER) than their own entrance — arriving is an
// event, leaving is not. The panel only starts its own slide-up once
// the content has had its own head start (transitionDelay on
// .overlayClosing, computed below): links retract first, then the
// panel, while the whole sequence still stays under ~0.5s.
//
// visibility only snaps to hidden once React itself swaps back to the
// 'closed' phase, timed to the computed total exit duration (plus a
// small safety buffer) — not a fixed CSS transition-delay — so it
// can't cut the exit short the way visibility snapping in right as
// the old (panel-only) 0.28s transition ended used to.
export function MobileMenuOverlay({open, navLinks, socials}: MobileMenuOverlayProps) {
  // Only the 'closing' transition needs its own tracked state — 'open'
  // is derived directly from the prop below.
  const [isClosing, setIsClosing] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)

  const navLinksLastStart = MOTION_BEAT_DELAY + lastStart(navLinks.length, MOTION_MEDIUM_STAGGER)
  const socialsEnterBaseDelay = navLinksLastStart + MOTION_BEAT_DELAY

  // Exit order is socials-then-nav-links, each group reversed (LIFO —
  // last entered, first to exit): social[last]...social[0],
  // nav[last]...nav[0]. exitItemCount/contentExitSpread/panelExitDelay
  // are used both to compute each item's own exit delay below and to
  // work out the total sequence length for the close timer.
  const exitItemCount = navLinks.length + socials.length
  const contentExitSpread = lastStart(exitItemCount, OVERLAY_EXIT_STAGGER)
  const panelExitDelay = exitItemCount * OVERLAY_EXIT_STAGGER
  const totalExitSeconds = Math.max(contentExitSpread + OVERLAY_EXIT_DURATION, panelExitDelay + PANEL_DURATION)

  // Detect the open -> false edge DURING RENDER (not in an effect) —
  // same established pattern as Nav's own pathname-change detection
  // just above this component in the tree. This is critical, not just
  // tidier: if isClosing were instead set inside a useEffect, THIS
  // render would already commit 'closed' (transform: translateY(-100%),
  // visibility: hidden — the base .overlay rule carries no transition
  // property at all) with ZERO transition, since isClosing is still
  // stale-false at this point (effects run after commit). Only the
  // FOLLOWING render — one commit later — would switch to 'closing',
  // by which point the DOM's last-committed transform is already the
  // target value, leaving nothing to visually animate from. Whether
  // that showed up as a hard-cut or (rarely) a working transition came
  // down to whether the browser happened to recalculate style between
  // those two commits — a genuine, unpredictable race. Setting state
  // synchronously during render instead means the DOM only ever
  // commits 'closing' directly from the already-painted 'open' state,
  // never through an intermediate 'closed' commit — so there's always
  // a real, previously-painted "from" value for the transition.
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setIsClosing(false)
    } else if (!prefersReducedMotion()) {
      setIsClosing(true)
    }
  }

  useEffect(() => {
    if (!isClosing) return
    const timer = setTimeout(() => setIsClosing(false), totalExitSeconds * 1000 + EXIT_TIMEOUT_BUFFER_MS)
    return () => clearTimeout(timer)
  }, [isClosing, totalExitSeconds])

  const phase: Phase = open ? 'open' : isClosing ? 'closing' : 'closed'

  const overlayClassName =
    phase === 'open' ? `${styles.overlayOpen} entryRevealVisible` : phase === 'closing' ? styles.overlayClosing : ''

  return (
    <div
      className={`${styles.overlay} ${overlayClassName}`}
      style={
        {
          '--panel-exit-delay': `${panelExitDelay}s`,
          '--overlay-exit-duration': `${OVERLAY_EXIT_DURATION}s`,
        } as CSSProperties
      }
    >
      <nav className={styles.links}>
        {navLinks.map((item, index) => {
          const reverseIndex = navLinks.length - 1 - index
          return (
            <OverlayLink
              key={item._key}
              href={item.href}
              label={item.label}
              phase={phase}
              enterDelay={MOTION_BEAT_DELAY + index * MOTION_MEDIUM_STAGGER}
              exitDelay={(socials.length + reverseIndex) * OVERLAY_EXIT_STAGGER}
            />
          )
        })}
      </nav>
      {socials.length > 0 && (
        <div className={styles.socials}>
          {socials.map((item, index) => {
            const reverseIndex = socials.length - 1 - index
            const enterDelay = socialsEnterBaseDelay + index * MOTION_SMALL_STAGGER
            const exitDelay = reverseIndex * OVERLAY_EXIT_STAGGER
            const activeDelay = phase === 'closing' ? exitDelay : enterDelay
            return (
              <a
                key={item._key}
                href={item.url}
                className={`entryRevealSmall ${styles.social}`}
                style={delayStyle(activeDelay)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.platform}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
