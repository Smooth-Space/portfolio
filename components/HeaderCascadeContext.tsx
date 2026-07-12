'use client'

import {createContext, useCallback, useContext, useState, type ReactNode} from 'react'

interface HeaderCascadeValue {
  /** Seconds — the header's own 4th-beat delay (title -> intro -> chips
   *  -> this), i.e. when the first project-detail media block should
   *  start IF it's joining the cascade (see useHeaderCascadeReveal).
   *  null until ProjectHeader has computed it (after its title/intro
   *  line splits resolve). */
  fourthBeatDelay: number | null
  /** Called by ProjectHeader only — not meant for other consumers. */
  reportFourthBeatDelay: (seconds: number) => void
}

const HeaderCascadeContext = createContext<HeaderCascadeValue>({
  fourthBeatDelay: null,
  reportFourthBeatDelay: () => {},
})

// Scoped per project-detail page (see app/projects/[slug]/page.tsx) —
// lets ProjectHeader (which computes the cascade's timing from its own
// runtime-measured title/intro line counts) and the first media block
// (a SIBLING, not a descendant, rendered separately via BlockRenderer)
// coordinate without prop-drilling through the page's server component.
export function HeaderCascadeProvider({children}: {children: ReactNode}) {
  const [fourthBeatDelay, setFourthBeatDelay] = useState<number | null>(null)
  const reportFourthBeatDelay = useCallback((seconds: number) => setFourthBeatDelay(seconds), [])

  return (
    <HeaderCascadeContext.Provider value={{fourthBeatDelay, reportFourthBeatDelay}}>
      {children}
    </HeaderCascadeContext.Provider>
  )
}

export function useHeaderCascade() {
  return useContext(HeaderCascadeContext)
}
