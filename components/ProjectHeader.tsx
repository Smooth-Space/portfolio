'use client'

import {useEffect, type CSSProperties} from 'react'

import type {ServiceRef} from '@/sanity/lib/types'
import {ServiceChips} from './ServiceChips'
import {useHeaderCascade} from './HeaderCascadeContext'
import {useEntryReveal} from '@/hooks/useEntryReveal'
import {useLineSplit} from '@/hooks/useLineSplit'
import {MOTION_BEAT_DELAY, MOTION_MEDIUM_STAGGER} from '@/lib/motion'
import styles from './ProjectHeader.module.css'

interface ProjectHeaderProps {
  title: string
  intro: string
  services?: ServiceRef[]
}

function delayStyle(seconds: number): CSSProperties {
  return {'--entry-delay': `${seconds}s`} as CSSProperties
}

// Time until this block's LAST line STARTS (not finishes settling) —
// the next beat begins MOTION_BEAT_DELAY after this, so beats overlap
// rather than queue behind each other's full duration.
function lastLineStart(lineCount: number): number {
  if (lineCount === 0) return 0
  return (lineCount - 1) * MOTION_MEDIUM_STAGGER
}

// Title and intro use the display role (--text-2xl) — one clear step
// larger than textBlock's label/summary (--text-lg) — and share that same
// size with each other; hierarchy between title and intro comes from
// color only (primary vs. muted), not size.
//
// Motion: FOUR OVERLAPPING beats — title's lines, then intro's lines,
// then the service chips, then (if it's on-screen at initial load) the
// project's first media block — all cascading off ONE trigger (this
// header's own useEntryReveal, fired once it scrolls into view) rather
// than each piece having its own observer. Each beat starts
// MOTION_BEAT_DELAY after the PREVIOUS beat's own last element starts,
// not after it finishes settling — durations stay full-length, only the
// gap between beats' starting points is tight. See hooks/useLineSplit.ts
// for the masked line-reveal's splitting approach, and its module
// comment for the accessibility/FOUC handling — summary: aria-hidden on
// the split, presentational lines; aria-label on each <p> carries the
// real, unsplit string for screen readers, and since aria-hidden
// doesn't remove content from the page (only from the accessibility
// tree), the visible split text is still normal, selectable text for
// sighted mouse users.
//
// The 4th beat (first media block) isn't rendered here at all — it's a
// SIBLING, not a descendant (rendered separately via BlockRenderer), so
// its timing is reported through HeaderCascadeContext instead — see
// hooks/useHeaderCascadeReveal.ts for how it decides whether to
// actually join.
export function ProjectHeader({title, intro, services}: ProjectHeaderProps) {
  const headerRef = useEntryReveal<HTMLElement>()
  const {ref: titleRef, lines: titleLines} = useLineSplit<HTMLParagraphElement>(title)
  const {ref: introRef, lines: introLines} = useLineSplit<HTMLParagraphElement>(intro)
  const {reportFourthBeatDelay} = useHeaderCascade()

  const introBaseDelay = lastLineStart(titleLines.length) + MOTION_BEAT_DELAY
  const chipsBaseDelay = introBaseDelay + lastLineStart(introLines.length) + MOTION_BEAT_DELAY
  const mediaBlockDelay = chipsBaseDelay + MOTION_BEAT_DELAY

  useEffect(() => {
    reportFourthBeatDelay(mediaBlockDelay)
  }, [mediaBlockDelay, reportFourthBeatDelay])

  return (
    <div className="grid">
      <header ref={headerRef} className={`col ${styles.header}`}>
        <div className={styles.titleGroup}>
          <p ref={titleRef} aria-label={title} className={`display ${styles.title}`}>
            {titleLines.length > 0 ? (
              <span aria-hidden="true">
                {titleLines.map((line, index) => (
                  <span key={index} className="lineMask">
                    <span className="lineInner" style={delayStyle(index * MOTION_MEDIUM_STAGGER)}>
                      {line}
                    </span>
                  </span>
                ))}
              </span>
            ) : (
              title
            )}
          </p>
          <p ref={introRef} aria-label={intro} className={`display ${styles.intro}`}>
            {introLines.length > 0 ? (
              <span aria-hidden="true">
                {introLines.map((line, index) => (
                  <span key={index} className="lineMask">
                    <span className="lineInner" style={delayStyle(introBaseDelay + index * MOTION_MEDIUM_STAGGER)}>
                      {line}
                    </span>
                  </span>
                ))}
              </span>
            ) : (
              intro
            )}
          </p>
        </div>
        <ServiceChips services={services} baseDelay={chipsBaseDelay} />
      </header>
    </div>
  )
}
