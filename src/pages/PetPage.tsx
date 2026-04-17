import { useMemo } from 'react'
import { dateKey } from '../dates'
import { PetPanel } from '../pet/PetPanel'
import { useTrackerUi } from '../useTrackerUi'

/** Buddy page: pet always tracks *today* so care stays in sync with real life. */
export function PetPage() {
  const { trackedHabits, completions } = useTrackerUi()

  const dayKey = dateKey(new Date())
  const isToday = true

  const doneSet = useMemo(
    () => new Set(completions[dayKey] ?? []),
    [completions, dayKey],
  )

  const { doneCount, total, pct } = useMemo(() => {
    const total = trackedHabits.length
    const doneCount = trackedHabits.filter((h) => doneSet.has(h.id)).length
    const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)
    return { doneCount, total, pct }
  }, [trackedHabits, doneSet])

  return (
    <div className="app app-pet-page">
      <div className="shell">
        <header className="brand brand-compact">
          <div className="brand-badge">Win-buddy</div>
          <h1>Buddy deck</h1>
          <p className="copy-prose">
            Care runs on{' '}
            <span className="inline-badge inline-badge--yellow">today&apos;s list</span>
            . Finish habits to push{' '}
            {total > 0 ? (
              <span className="inline-badge inline-badge--green">
                {doneCount}/{total}
              </span>
            ) : (
              <span className="inline-badge inline-badge--green">0 habits</span>
            )}{' '}
            {total > 0 ? (
              <>
                — that&apos;s{' '}
                <span className="inline-badge inline-badge--blue">{pct}%</span> fed in.
              </>
            ) : (
              <>
                — add{' '}
                <span className="inline-badge inline-badge--rose">habits</span> on Today
                first.
              </>
            )}
          </p>
        </header>

        <p className="pet-page-note copy-prose">
          Meters always track{' '}
          <span className="inline-badge inline-badge--slate">live today</span> — flip to
          Today to log wins.
        </p>

        <div className="pet-page-panel">
          <PetPanel
            dayKey={dayKey}
            doneCount={doneCount}
            total={total}
            pct={pct}
            isToday={isToday}
          />
        </div>
      </div>
    </div>
  )
}
