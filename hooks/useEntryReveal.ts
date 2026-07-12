'use client'

import {useEffect, useRef} from 'react'

interface RevealOptions {
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

// Tuned so an element reveals once it's genuinely in view, not the
// instant a sliver of it crosses the bottom edge: 20% of the element
// visible, plus the -10% bottom rootMargin shrinks the "counts as
// visible" zone up from the true viewport edge by another 10% of the
// viewport height on top of that.
//
// (Historical note, kept because it explains the CURRENT values below:
// tuned to give the animation a head start rather than trigger once an
// element is already substantially on-screen — threshold 0 fires as
// soon as any part of the element enters the detection area, and the
// +15% bottom rootMargin extends that detection area BELOW the true
// viewport edge, so elements start revealing slightly before they
// scroll into view.)
export const DEFAULT_THRESHOLD = 0
export const DEFAULT_ROOT_MARGIN = '0px 0px 15% 0px'

// Observes `el`, revealing it (see .entryReveal/.entryRevealVisible in
// globals.css) the first time it intersects, then unobserving. This is
// the core trigger-once mechanism behind useEntryReveal below — pulled
// out as a standalone function so useHeaderCascadeReveal (the first
// project-detail media block's independent-mode fallback) can reuse the
// EXACT same logic instead of re-implementing it.
export function observeAndReveal(
  el: HTMLElement,
  {delay = 0, getDelay, threshold = DEFAULT_THRESHOLD, rootMargin = DEFAULT_ROOT_MARGIN}: RevealOptions = {},
) {
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
}

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
export function useEntryReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    return observeAndReveal(el, options)
    // Mount-only, intentionally: this is a trigger-ONCE reveal, so
    // re-running on a later delay/threshold/rootMargin change (e.g. a
    // fresh inline getDelay closure on every render) would be wrong even
    // if it were safe — the whole point is "the first time this element
    // enters view," not "whenever these options change."
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
