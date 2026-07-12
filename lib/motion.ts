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

// ProjectHeader's three beats (title lines -> intro lines -> chips)
// OVERLAP rather than queue: each beat starts this many seconds after
// the PREVIOUS beat's own last element STARTS, not after it finishes
// settling. Durations (1.5s lines, 0.8s chips) stay full-length —
// only the stagger between beats' starting points is this tight.
export const MOTION_BEAT_DELAY = 0.1 // seconds

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// SSR-safe layout effect: synchronous (pre-paint) on the client, where
// it's needed so line-splitting never visibly flashes plain, unsplit
// text before the split completes — but aliases to a plain effect
// during the server render (where useLayoutEffect would only print a
// console warning without actually running, since there's no paint to
// run before).
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
