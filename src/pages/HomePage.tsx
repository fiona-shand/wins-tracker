import { CheckIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { dateKey } from '../dates'
import { useTrackerUi } from '../useTrackerUi'

export function HomePage() {
  const {
    trackedHabits,
    completions,
    toggleCompleted,
    setSheetOpen,
    viewDate,
  } = useTrackerUi()

  const dayKey = dateKey(viewDate)

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
    <div className="app">
      <div className="shell">
        <header className="brand">
          <h1>Tiny Wins</h1>
          <p className="copy-prose">
            {total === 0 ? (
              <>
                You&apos;re in{' '}
                <span className="inline-badge inline-badge--slate">setup</span> — open
                the bank and tag{' '}
                <span className="inline-badge inline-badge--blue">3–5 habits</span> to
                start logging{' '}
                <span className="inline-badge inline-badge--yellow">tiny wins</span>.
              </>
            ) : (
              <>
                On deck today:{' '}
                <span className="inline-badge inline-badge--blue">
                  {total} habit{total === 1 ? '' : 's'}
                </span>
                . Clear{' '}
                <span className="inline-badge inline-badge--green">
                  {doneCount} of {total}
                </span>{' '}
                for{' '}
                <span className="inline-badge inline-badge--yellow">{pct}%</span> of the
                bar.
              </>
            )}
          </p>
        </header>

        {trackedHabits.length === 0 ? (
          <div className="empty-card">
            <p className="copy-prose">
              No modules yet — pick habits so this screen fills with{' '}
              <span className="inline-badge inline-badge--blue">check-ins</span> and{' '}
              <span className="inline-badge inline-badge--yellow">streak fuel</span>.
            </p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => setSheetOpen(true)}
            >
              Open habit bank
            </button>
          </div>
        ) : (
          <div className="habit-bento bento-tile bento-tile--blush">
            <div className="habit-list" role="list">
              {trackedHabits.map((h) => {
                const done = doneSet.has(h.id)
                return (
                  <button
                    key={h.id}
                    type="button"
                    role="listitem"
                    className={`habit-row ${done ? 'done' : ''}`}
                    onClick={() => toggleCompleted(dayKey, h.id)}
                    aria-pressed={done}
                  >
                    <span className="check" aria-hidden>
                      <CheckIcon className="check-glyph" strokeWidth={2.75} />
                    </span>
                    <span className="habit-emoji" aria-hidden>
                      {h.emoji}
                    </span>
                    <span className="habit-text">
                      <strong>{h.label}</strong>
                      <span>
                        {done ? 'Nice! Logged for this day.' : 'Tap when done'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
