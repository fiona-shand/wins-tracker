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
    trackedHabits,
    completions,
    viewDate,
    setViewDate,
    calMonthOverride,
    setCalMonthOverride,
  } = useTrackerUi()

  const habitIdsOnList = useMemo(
    () => trackedHabits.map((h) => h.id),
    [trackedHabits],
  )

  const calendarMonth = calMonthOverride ?? startOfMonth(viewDate)

  const calCells = useMemo(
    () => getMonthGrid(calendarMonth),
    [calendarMonth],
  )

  const todayKey = dateKey(new Date())

  const starDaysThisMonth = useMemo(() => {
    if (habitIdsOnList.length === 0) return 0
    let n = 0
    for (const { date, inCurrentMonth } of calCells) {
      if (!inCurrentMonth) continue
      const k = dateKey(date)
      if (k > todayKey) continue
      if (allHabitsDoneForDay(k, habitIdsOnList, completions)) n++
    }
    return n
  }, [calCells, habitIdsOnList, completions, todayKey])

  const weekdayLabels = useMemo(() => weekdayNarrowLabels(), [])

  return (
    <div className="app app-calendar">
      <div className="shell">
        <header className="brand brand--calendar">
          <h1>Star calendar</h1>
          <p className="copy-prose">
            <span className="inline-badge inline-badge--yellow">⭐</span> marks a day when
            you closed{' '}
            <span className="inline-badge inline-badge--green">every habit</span> on your
            list.
            {habitIdsOnList.length > 0 && (
              <>
                {' '}
                This month:{' '}
                <span className="inline-badge inline-badge--blue">
                  {starDaysThisMonth} star{starDaysThisMonth === 1 ? '' : 's'}
                </span>
                .
              </>
            )}
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
              <p className="cal-sub cal-sub-center copy-prose">
                {habitIdsOnList.length === 0
                  ? 'Add habits on Today — then star days appear here.'
                  : 'Tap a date to jump to that day on Today.'}
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
            {weekdayLabels.map((w, i) => (
              <span key={i} className="cal-wd">
                {w}
              </span>
            ))}
          </div>
          <div className="cal-grid">
            {calCells.map(({ date, inCurrentMonth }) => {
              const k = dateKey(date)
              const isFuture = k > todayKey
              const star =
                habitIdsOnList.length > 0 &&
                !isFuture &&
                allHabitsDoneForDay(k, habitIdsOnList, completions)
              const isTodayCell = isSameDay(date, new Date())
              const isViewCell = isSameDay(date, viewDate)

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
                      ? `${date.getDate()}, all habits done, star day ⭐`
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
