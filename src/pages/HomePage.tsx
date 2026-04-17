import {
  CalendarDaysIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import {
  addDays,
  dateKey,
  formatNice,
  isSameDay,
  parseDateKey,
} from '../dates'
import { useTrackerUi } from '../useTrackerUi'

export function HomePage() {
  const {
    trackedHabits,
    completions,
    toggleCompleted,
    setSheetOpen,
    viewDate,
    setViewDate,
    setCalMonthOverride,
  } = useTrackerUi()

  const dayKey = dateKey(viewDate)
  const isToday = isSameDay(viewDate, new Date())

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
      <div className="bg-blobs" aria-hidden />

      <div className="shell">
        <header className="brand">
          <div className="brand-badge">Daily joy</div>
          <h1>Tiny Wins</h1>
          <p>Pick sweet habits, celebrate small victories.</p>
        </header>

        <section className="date-card" aria-label="Choose day">
          <div className="date-row">
            <div className="date-nav">
              <button
                type="button"
                className="icon-btn"
                aria-label="Previous day"
                onClick={() => {
                  setCalMonthOverride(null)
                  setViewDate((d) => addDays(d, -1))
                }}
              >
                <ChevronLeftIcon className="icon-btn-glyph" aria-hidden />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Next day"
                onClick={() => {
                  setCalMonthOverride(null)
                  setViewDate((d) => addDays(d, 1))
                }}
              >
                <ChevronRightIcon className="icon-btn-glyph" aria-hidden />
              </button>
            </div>
            <div className="date-label">
              <strong>{formatNice(viewDate)}</strong>
              <span>
                {isToday
                  ? 'Your list for today'
                  : `Checking ${parseDateKey(dayKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          </div>
          {isToday ? (
            <div className="today-pill" role="status">
              <CalendarDaysIcon className="today-pill-icon" aria-hidden />
              Today
            </div>
          ) : (
            <div style={{ marginTop: '0.65rem', textAlign: 'center' }}>
              <button
                type="button"
                className="ghost-btn"
                style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}
                onClick={() => {
                  setCalMonthOverride(null)
                  setViewDate(new Date())
                }}
              >
                Jump to today
              </button>
            </div>
          )}
        </section>

        {trackedHabits.length > 0 && (
          <div className="progress-block">
            <div className="progress-top">
              <span>
                {doneCount} of {total} wins
              </span>
              <em>{pct}%</em>
            </div>
            <div className="progress-track" aria-hidden>
              <div
                className={`progress-fill ${pct === 100 && total > 0 ? 'all-done' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {pct === 100 && total > 0 && (
              <p className="celebrate">
                You did it — today is officially sparkly! ✨
              </p>
            )}
          </div>
        )}

        {trackedHabits.length === 0 ? (
          <div className="empty-card">
            <p>
              Choose a few habits from the bank to start your streak of tiny,
              happy wins.
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
        )}
      </div>
    </div>
  )
}
