'use client'

import {useEffect, useState} from 'react'

// N sections -> single active id. Drives the floating menu's active-section
// highlight. A section counts as active once it passes the upper band of the
// viewport; the earliest id (in document order) currently intersecting wins.
// Defaults to the FIRST id rather than null — at the very top of the page,
// above every section's own observed band, the pill still shows something
// (the first section) instead of reading as blank/unloaded.
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(() => ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id)
          else intersecting.delete(entry.target.id)
        }
        const next = ids.find((id) => intersecting.has(id))
        if (next) setActive(next)
      },
      {rootMargin: '0px 0px -60% 0px', threshold: 0},
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
