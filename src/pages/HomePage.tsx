import { useMemo } from 'react'
import { TodayHabitList } from '../components/TodayHabitList'
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
    <div className="app app-home">
      <div className="shell">
        <header className="brand brand--home">
          <h1>Tiny Wins</h1>
          <p className="copy-prose">
            {total === 0 ? (
              <>
                You&apos;re in{' '}
                <span className="inline-badge inline-badge--slate">setup</span> — open{' '}
                <span className="inline-badge inline-badge--blue">Habits</span> and turn
                on{' '}
                <span className="inline-badge inline-badge--blue">3–5</span> you&apos;ll
                actually run today.
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
              Nothing on your list yet — add presets or your own rules from{' '}
              <span className="inline-badge inline-badge--blue">Habits</span>, then work
              the list.
            </p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => setSheetOpen(true)}
            >
              Open Habits
            </button>
          </div>
        ) : (
          <TodayHabitList
            key={dayKey}
            dayKey={dayKey}
            trackedHabits={trackedHabits}
            doneSet={doneSet}
            toggleCompleted={toggleCompleted}
          />
        )}
      </div>
    </div>
  )
}
