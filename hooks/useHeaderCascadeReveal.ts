'use client'

import {useEffect, useRef, useState} from 'react'

import {useHeaderCascade} from '@/components/HeaderCascadeContext'
import {prefersReducedMotion, useIsomorphicLayoutEffect} from '@/lib/motion'
import {observeAndReveal} from './useEntryReveal'

// For the FIRST media block on a project detail page ONLY (see
// BlockRenderer/ImageWide/ImageDouble/ImageBento): joins the header's
// title -> intro -> chips -> [this] cascade (see HeaderCascadeContext)
// instead of independently observing its own scroll position — but
// ONLY if it's actually on-screen at initial mount, matching the same
// moment the header itself typically reveals. If it's NOT on-screen at
// mount (the user has to scroll to reach it), it falls back to the
// completely normal, independent trigger-once behavior — never
// stranded waiting on a sequence it isn't part of, and never animating
// while off-screen.
//
// `isEligible` should be true ONLY for the first media block's own
// slot(s) — pass false (or omit) for every other slot, which then
// behaves EXACTLY like calling useEntryReveal directly (see the
// 'independent' branch below — it's the same observeAndReveal call
// useEntryReveal itself uses).
export function useHeaderCascadeReveal<T extends HTMLElement>(isEligible: boolean, internalDelay = 0) {
  const ref = useRef<T>(null)
  const {fourthBeatDelay} = useHeaderCascade()
  const [mode, setMode] = useState<'pending' | 'cascade' | 'independent'>(isEligible ? 'pending' : 'independent')

  // Decided once, synchronously before paint: is this element already
  // on-screen right now? Only relevant for cascade-eligible elements —
  // ineligible ones start (and stay) 'independent' from the first
  // render, never running this at all.
  useIsomorphicLayoutEffect(() => {
    if (!isEligible) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const inViewAtMount = rect.top < window.innerHeight && rect.bottom > 0
    setMode(inViewAtMount ? 'cascade' : 'independent')
  }, [isEligible])

  // Independent path — identical to useEntryReveal's own behavior
  // (same observeAndReveal call), and the ONLY path ineligible slots
  // ever take.
  useEffect(() => {
    if (mode !== 'independent') return
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return
    return observeAndReveal(el, {delay: internalDelay})
    // internalDelay intentionally excluded — mirrors useEntryReveal's
    // own mount-only semantics; 'mode' is what actually gates this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Cascade path — already confirmed on-screen above, so no observer
  // needed here; just wait for the header to report its 4th-beat delay
  // and reveal directly once it does.
  useEffect(() => {
    if (mode !== 'cascade') return
    if (fourthBeatDelay === null) return
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return
    el.style.setProperty('--entry-delay', `${fourthBeatDelay + internalDelay}s`)
    el.classList.add('entryRevealVisible')
  }, [mode, fourthBeatDelay, internalDelay])

  return ref
}
