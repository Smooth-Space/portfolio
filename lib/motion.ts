import {useEffect, useLayoutEffect} from 'react'

// Motion tiers, scaled to element size — all three share the same easing
// (--entry-easing in globals.css) and trigger-once-on-appear semantics
// (useEntryReveal). Offset/duration values that a stylesheet consumes
// directly live as CSS custom properties in globals.css (:root):
// --entry-* for the large tier (already existed — media blocks, project
// cards), --motion-medium-*/--motion-small-* for the two added here.
//
// Stagger steps live here instead of as CSS custom properties — they
// drive JS delay math (index * step, written into --entry-delay per
// element), not a CSS property a stylesheet reads directly, so a CSS
// custom property wouldn't actually be consumed anywhere. This also
// replaces what used to be the same 0.1 large-tier stagger value
// independently redeclared in ProjectCard.tsx, ImageDouble.tsx, and
// ImageBento.tsx.
export const MOTION_LARGE_STAGGER = 0.1 // seconds — media blocks, project card tiles
export const MOTION_MEDIUM_STAGGER = 0.1 // seconds — title/intro lines
export const MOTION_SMALL_STAGGER = 0.05 // seconds — service chips

// Large tier, but a tighter stagger step — the Feed's clothesline grid
// runs up to 7-per-row (vs. 4 on the project index), and 0.1s across 7
// tiles is a 0.6s spread per row, which reads as busy. Offset/duration/
// easing stay the plain Large tier (--entry-* in globals.css,
// unchanged) — only this step differs.
export const MOTION_FEED_STAGGER = 0.05 // seconds — feed tiles

// ProjectHeader's three beats (title lines -> intro lines -> chips)
// OVERLAP rather than queue: each beat starts this many seconds after
// the PREVIOUS beat's own last element STARTS, not after it finishes
// settling. Durations (1.5s lines, 0.8s chips) stay full-length —
// only the stagger between beats' starting points is this tight.
export const MOTION_BEAT_DELAY = 0.1 // seconds

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// A row-wrapping item's 0-based position within its OWN row, measured
// directly from its rendered layout rather than tracked via a React
// index prop or a hand-maintained column-count breakpoint table. Works
// for any uniform-width row-wrapping layout — CSS grid (ProjectCard) OR
// flexbox flex-wrap with equal-width items (FeedTile's clothesline
// grid) — as long as every item in a row shares the same left edge
// spacing, which both do.
//
// Deliberately DOM-measured, not prop-derived: useEntryReveal's
// getDelay is resolved lazily inside the IntersectionObserver callback
// specifically so it reflects reality AT THE MOMENT OF INTERSECTION —
// this fits that same contract, and is required (not just nicer) for
// FeedTile, whose list order shuffles client-side shortly after mount
// (see FeedGrid) — a prop-derived index captured via closure at mount
// would go stale the instant that shuffle re-renders with a new index,
// since useEntryReveal's own effect is intentionally mount-only.
export function getPositionInRow(el: HTMLElement): number {
  const parent = el.parentElement
  if (!parent) return 0

  const parentRect = parent.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const itemWidth = elRect.width
  if (itemWidth === 0) return 0

  const gap = parseFloat(getComputedStyle(parent).columnGap || '0') || 0
  const relativeLeft = elRect.left - parentRect.left
  return Math.round(relativeLeft / (itemWidth + gap))
}

// SSR-safe layout effect: synchronous (pre-paint) on the client, where
// it's needed so line-splitting never visibly flashes plain, unsplit
// text before the split completes — but aliases to a plain effect
// during the server render (where useLayoutEffect would only print a
// console warning without actually running, since there's no paint to
// run before).
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
