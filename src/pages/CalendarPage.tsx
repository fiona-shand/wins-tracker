import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addMonths,
  dateKey,
  formatMonthYear,
  getMonthGrid,
  isSameDay,
  startOfMonth,
  weekdayNarrowLabels,
} from '../dates'
import { allHabitsDoneForDay } from '../perfectDay'
import { useTrackerUi } from '../useTrackerUi'

export function CalendarPage() {
  const navigate = useNavigate()
  const {
    trackedIds,
    completions,
    viewDate,
    setViewDate,
    calMonthOverride,
    setCalMonthOverride,
  } = useTrackerUi()

  const calendarMonth = calMonthOverride ?? startOfMonth(viewDate)

  const calCells = useMemo(
    () => getMonthGrid(calendarMonth),
    [calendarMonth],
  )

  const starDaysThisMonth = useMemo(() => {
    if (trackedIds.length === 0) return 0
    let n = 0
    for (const { date, inCurrentMonth } of calCells) {
      if (!inCurrentMonth) continue
      if (allHabitsDoneForDay(dateKey(date), trackedIds, completions)) n++
    }
    return n
  }, [calCells, trackedIds, completions])

  const weekdayLabels = useMemo(() => weekdayNarrowLabels(), [])

  return (
    <div className="app app-calendar">
      <div className="bg-blobs" aria-hidden />

      <div className="shell">
        <header className="brand brand-compact">
          <div className="brand-badge">Your streak</div>
          <h1>Star calendar</h1>
          <p>
            ⭐ shows days you finished every habit.
          </p>
        </header>

        <section className="calendar-card calendar-card-page" aria-labelledby="cal-heading">
          <div className="cal-head">
            <button
              type="button"
              className="icon-btn cal-nav-btn"
              aria-label="Previous month"
              onClick={() =>
                setCalMonthOverride((prev) => {
                  const shown = prev ?? startOfMonth(viewDate)
                  return startOfMonth(addMonths(shown, -1))
                })
              }
            >
              <ChevronLeftIcon className="icon-btn-glyph" aria-hidden />
            </button>
            <div className="cal-title">
              <h2 id="cal-heading" className="sr-only">
                Month
              </h2>
              <p className="cal-sub cal-sub-center">
                {trackedIds.length === 0
                  ? `${formatMonthYear(calendarMonth)} — add habits on Today to earn stars.`
                  : starDaysThisMonth === 0
                    ? `${formatMonthYear(calendarMonth)} — your stars will land here.`
                    : `${starDaysThisMonth} star day${starDaysThisMonth === 1 ? '' : 's'} this month ✨`}
              </p>
            </div>
            <button
              type="button"
              className="icon-btn cal-nav-btn"
              aria-label="Next month"
              onClick={() =>
                setCalMonthOverride((prev) => {
                  const shown = prev ?? startOfMonth(viewDate)
                  return startOfMonth(addMonths(shown, 1))
                })
              }
            >
              <ChevronRightIcon className="icon-btn-glyph" aria-hidden />
            </button>
          </div>
          <p className="cal-month-banner">{formatMonthYear(calendarMonth)}</p>
          <div className="cal-weekdays">
            {weekdayLabels.map((w) => (
              <span key={w} className="cal-wd">
                {w}
              </span>
            ))}
          </div>
          <div className="cal-grid">
            {calCells.map(({ date, inCurrentMonth }) => {
              const k = dateKey(date)
              const star =
                trackedIds.length > 0 &&
                allHabitsDoneForDay(k, trackedIds, completions)
              const isTodayCell = isSameDay(date, new Date())
              const isViewCell = isSameDay(date, viewDate)
              const isFuture = k > dateKey(new Date())

              return (
                <button
                  key={k}
                  type="button"
                  className={[
                    'cal-cell',
                    !inCurrentMonth ? 'outside' : '',
                    isTodayCell ? 'today' : '',
                    isViewCell ? 'picked' : '',
                    isFuture ? 'future' : '',
                    star ? 'star-day' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setCalMonthOverride(null)
                    setViewDate(date)
                    navigate('/')
                  }}
                  aria-label={
                    star
                      ? `${date.getDate()}, all habits done, star day`
                      : `${date.getDate()}, open this day`
                  }
                  aria-current={isViewCell ? 'date' : undefined}
                >
                  <span className="cal-daynum">{date.getDate()}</span>
                  {star ? (
                    <span className="cal-star" aria-hidden>
                      ⭐
                    </span>
                  ) : (
                    <span className="cal-star-spacer" aria-hidden />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <p className="calendar-hint">
          Tap a day to jump to it on the Today tab.
        </p>
      </div>
    </div>
  )
}
