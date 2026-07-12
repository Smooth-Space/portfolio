'use client'

import {useRef, useState} from 'react'

import {prefersReducedMotion, useIsomorphicLayoutEffect} from '@/lib/motion'

const RESIZE_DEBOUNCE_MS = 150

// Measures where `text` actually wraps inside `referenceEl` at its
// CURRENT rendered width, using a detached, invisible clone rather than
// mutating the real (React-owned) element — appended as a sibling so it
// inherits the same width/font context, then removed once measured.
// Word-level spans are only a measurement device (grouped by matching
// offsetTop into lines); nothing from the clone ends up in the final
// render.
function measureLines(referenceEl: HTMLElement, text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  const clone = document.createElement(referenceEl.tagName)
  clone.className = referenceEl.className
  clone.style.position = 'absolute'
  clone.style.visibility = 'hidden'
  clone.style.pointerEvents = 'none'
  clone.style.width = `${referenceEl.clientWidth}px`
  clone.style.height = 'auto'

  const wordSpans: HTMLSpanElement[] = []
  words.forEach((word, index) => {
    const span = document.createElement('span')
    span.textContent = word
    span.style.display = 'inline-block'
    clone.appendChild(span)
    wordSpans.push(span)
    if (index < words.length - 1) clone.appendChild(document.createTextNode(' '))
  })

  referenceEl.parentElement?.appendChild(clone)

  const lines: string[][] = []
  let lastTop: number | null = null
  wordSpans.forEach((span, index) => {
    const top = span.offsetTop
    if (top !== lastTop) {
      lines.push([])
      lastTop = top
    }
    lines[lines.length - 1].push(words[index])
  })

  clone.remove()
  return lines.map((line) => line.join(' '))
}

// Splits `text` into its actual VISUAL lines at the referenced
// element's current rendered width (not markup-authored line breaks),
// re-splitting on resize (debounced) since visual line breaks depend
// on wrap width — used to mask+reveal each line individually (see
// ProjectHeader).
//
// Returns [] until the first split completes, and permanently for
// prefers-reduced-motion (no split at all, per spec — not just no
// animation). Callers must render the plain, unsplit `text` in that
// state: this doubles as what prevents FOUC, since the split runs in
// a layout effect (synchronous, before the browser's first paint) —
// there's never a painted frame showing broken/intermediate markup,
// only a possible one-frame difference between "plain text" and
// "split lines," both of which are complete, valid, accessible
// renders on their own.
export function useLineSplit<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null)
  const [lines, setLines] = useState<string[]>([])

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setLines([])
      return
    }

    const resplit = () => setLines(measureLines(el, text))
    resplit()

    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resplit, RESIZE_DEBOUNCE_MS)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [text])

  return {ref, lines}
}
