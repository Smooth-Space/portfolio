'use client'

import {useEffect, useRef} from 'react'

interface UseEntryRevealOptions {
  /** Static stagger delay in seconds, evaluated once at mount. Ignored
   *  if getDelay is provided. */
  delay?: number
  /** Lazy delay resolver (seconds), evaluated at the moment the element
   *  intersects rather than at mount — use this when the delay depends
   *  on viewport-only state (e.g. current column count) that isn't
   *  stable during SSR/hydration. */
  getDelay?: () => number
  threshold?: number
  rootMargin?: string
}

// Tuned to give the animation a head start rather than trigger once an
// element is already substantially on-screen: threshold 0 fires as soon
// as any part of the element enters the detection area, and the +15%
// bottom rootMargin extends that detection area BELOW the true viewport
// edge, so elements start revealing slightly before they scroll into
// view — largely resolved by the time they're actually on-screen,
// instead of still fading/rising while the user is already reading past
// them. (A previous -10% margin + 0.2 threshold did the opposite —
// shrank the detection zone and required 20% visibility — which fired
// far too late, especially for tall media blocks and for a grid's
// second row only partially visible at the bottom of the viewport.)
const DEFAULT_THRESHOLD = 0
const DEFAULT_ROOT_MARGIN = '0px 0px 15% 0px'

// Drives the site's shared scroll-triggered fade+rise reveal (see
// .entryReveal/.entryRevealVisible + the --entry-* tokens in
// globals.css). The visible-class toggle is applied imperatively
// (classList.add), not via React state — this is a fire-once DOM
// side effect with nothing else in the component that needs to
// re-render off of it, so routing it through state would just be
// indirection. Fires once per element, then unobserves; skips the
// observer entirely for prefers-reduced-motion (the CSS override on
// .entryReveal already renders final state unconditionally for those
// users).
export function useEntryReveal<T extends HTMLElement>({
  delay = 0,
  getDelay,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
}: UseEntryRevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const resolvedDelay = getDelay ? getDelay() : delay
        el.style.setProperty('--entry-delay', `${resolvedDelay}s`)
        el.classList.add('entryRevealVisible')
        observer.unobserve(el)
      },
      {threshold, rootMargin},
    )
    observer.observe(el)
    return () => observer.disconnect()
    // Mount-only, intentionally: this is a trigger-ONCE reveal, so
    // re-running on a later delay/threshold/rootMargin change (e.g. a
    // fresh inline getDelay closure on every render) would be wrong even
    // if it were safe — the whole point is "the first time this element
    // enters view," not "whenever these options change."
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
