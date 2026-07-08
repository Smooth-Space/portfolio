'use client'

import {useEffect, useState} from 'react'

// Same intersection band as useActiveSection (top 40% of the viewport),
// but for a single boundary element rather than a set of mutually
// exclusive sections — drives hiding the floating pill entirely once
// scrolled into the metadata/next-project footer below the last
// textBlock/media section, instead of just deactivating a link.
export function useSectionVisible(id: string): boolean {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = document.getElementById(id)
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -60% 0px',
      threshold: 0,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [id])

  return visible
}
