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
      <div className="shell">
        <header className="brand">
          <div className="brand-badge">Daily module</div>
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

        <div className="bento-stack">
          <section
            className="date-card bento-tile bento-tile--sky"
            aria-label="Choose day"
          >
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
            <div className="progress-bento bento-tile bento-tile--sage">
              <div className="progress-block">
                <p className="copy-prose" style={{ margin: '0 0 0.65rem' }}>
                  Session status:{' '}
                  <span className="inline-badge inline-badge--green">
                    {doneCount} cleared
                  </span>
                  {pct === 100 ? (
                    <>
                      {' '}
                      ·{' '}
                      <span className="inline-badge inline-badge--rose">
                        full sweep
                      </span>
                    </>
                  ) : (
                    <>
                      {' '}
                      ·{' '}
                      <span className="inline-badge inline-badge--slate">
                        {total - doneCount} left
                      </span>
                    </>
                  )}
                </p>
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
            </div>
          )}
        </div>

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
