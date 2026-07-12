'use client'

import Link from 'next/link'
import type {CSSProperties} from 'react'

import type {MediaFeedItem} from '@/sanity/lib/types'
import {CursorScrubber} from './CursorScrubber'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import {useLineSplit} from '@/hooks/useLineSplit'
import {MOTION_BEAT_DELAY, MOTION_MEDIUM_STAGGER} from '@/lib/motion'
import styles from '@/app/page.module.css'

interface HomeHeroProps {
  items: MediaFeedItem[]
}

const WORDMARK = 'SmoothSpace'
const INTRO_PRIMARY = 'The design practice of Jason Wilkins'
const INTRO_SECONDARY = 'Brand, digital, and generative systems'

function delayStyle(seconds: number): CSSProperties {
  return {'--entry-delay': `${seconds}s`} as CSSProperties
}

// Time until the LAST item in a staggered group STARTS (not finishes
// settling) — the next beat/group begins some delay after this, so
// beats overlap rather than queue behind each other's full duration.
function lastStart(count: number, staggerStep: number): number {
  if (count === 0) return 0
  return (count - 1) * staggerStep
}

// Home hero: FOUR overlapping beats, cascading off ONE trigger (this
// section's own useEntryReveal) — the wordmark, then intro lines, then
// the View Work button, then the cursor scrubber square. Each beat
// starts MOTION_BEAT_DELAY after the PREVIOUS beat's own last element
// STARTS, not after it finishes settling — same overlapping logic as
// ProjectHeader's title -> intro -> chips cascade.
//
// Unlike ProjectHeader, no HeaderCascadeContext (or equivalent) is
// needed: every beat here renders within this ONE component, not split
// across sibling components, so the delays are just computed directly
// — the same way ProjectHeader itself computes title/intro/chips
// before ever reaching for context (that context exists ONLY because
// its 4th beat, the first media block, is a sibling rendered
// elsewhere).
//
// The wordmark itself is ONE element (see .entryRevealHero in
// globals.css) — a single fade+rise, no per-letter split. It's the
// biggest, quietest gesture on the site; splitting it into letters
// risked subtle kerning/width differences on an element that's already
// fought overflow bugs (a fragile cqw-based fit calculation), for a
// busier effect that wasn't wanted anyway. Plain text needs no
// aria-label/aria-hidden workaround either — it's already exactly what
// a screen reader should read.
export function HomeHero({items}: HomeHeroProps) {
  const heroRef = useEntryReveal<HTMLElement>()
  const {ref: introPrimaryRef, lines: introPrimaryLines} = useLineSplit<HTMLParagraphElement>(INTRO_PRIMARY)
  const {ref: introSecondaryRef, lines: introSecondaryLines} = useLineSplit<HTMLParagraphElement>(INTRO_SECONDARY)

  // Beat 1 (wordmark, one element, starts at 0) -> beat 2 (intro lines)
  const introBaseDelay = MOTION_BEAT_DELAY
  // introSecondary continues the SAME stagger sequence introPrimary started
  // — both strings together are beat 2, not two separate beats.
  const introSecondaryBaseDelay = introBaseDelay + introPrimaryLines.length * MOTION_MEDIUM_STAGGER
  const introLastLineStart = introSecondaryBaseDelay + lastStart(introSecondaryLines.length, MOTION_MEDIUM_STAGGER)
  // Beat 2 -> beat 3 (View Work button)
  const buttonDelay = introLastLineStart + MOTION_BEAT_DELAY
  // Beat 3 -> beat 4 (scrubber square)
  const squareDelay = buttonDelay + MOTION_BEAT_DELAY

  return (
    <main ref={heroRef} className={styles.hero}>
      <div className={styles.wordmarkContainer}>
        <h1 className={`wordmark entryRevealHero ${styles.wordmarkRow}`}>{WORDMARK}</h1>
      </div>
      <div className={styles.lowerBand}>
        <div className={styles.introPosition}>
          <div className={styles.introContent}>
            <div>
              <p ref={introPrimaryRef} aria-label={INTRO_PRIMARY} className={`bodySmall ${styles.introPrimary}`}>
                {introPrimaryLines.length > 0 ? (
                  <span aria-hidden="true">
                    {introPrimaryLines.map((line, index) => (
                      <span key={index} className="lineMask">
                        <span
                          className="lineInner"
                          style={delayStyle(introBaseDelay + index * MOTION_MEDIUM_STAGGER)}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </span>
                ) : (
                  INTRO_PRIMARY
                )}
              </p>
              <p
                ref={introSecondaryRef}
                aria-label={INTRO_SECONDARY}
                className={`bodySmall ${styles.introSecondary}`}
              >
                {introSecondaryLines.length > 0 ? (
                  <span aria-hidden="true">
                    {introSecondaryLines.map((line, index) => (
                      <span key={index} className="lineMask">
                        <span
                          className="lineInner"
                          style={delayStyle(introSecondaryBaseDelay + index * MOTION_MEDIUM_STAGGER)}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </span>
                ) : (
                  INTRO_SECONDARY
                )}
              </p>
            </div>
            <Link
              href="/projects"
              className={`caption entryRevealSmall ${styles.viewWork}`}
              style={delayStyle(buttonDelay)}
            >
              View Work
            </Link>
          </div>
        </div>
        <div className={`entryReveal ${styles.squareWrap}`} style={delayStyle(squareDelay)}>
          <CursorScrubber items={items} />
        </div>
      </div>
    </main>
  )
}
