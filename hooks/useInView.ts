'use client'

import {useEffect, useRef, useState} from 'react'

interface UseInViewOptions {
  rootMargin?: string
  threshold?: number
}

// 1:1 element -> boolean. Drives lazy-load / pause-on-exit for in-page video.
export function useInView<T extends Element>({
  rootMargin = '200px',
  threshold = 0,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {rootMargin, threshold},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return {ref, inView}
}
