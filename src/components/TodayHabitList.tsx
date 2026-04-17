import { CheckIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { AllDoneHero } from './AllDoneHero'
import type { Habit } from '../types'

const STRIKE_MS = 280

type Props = {
  dayKey: string
  trackedHabits: Habit[]
  doneSet: Set<string>
  toggleCompleted: (day: string, habitId: string) => void
}

export function TodayHabitList({
  dayKey,
  trackedHabits,
  doneSet,
  toggleCompleted,
}: Props) {
  const [exitingIds, setExitingIds] = useState(() => new Set<string>())

  const displayList = useMemo(
    () =>
      trackedHabits.filter((h) => !doneSet.has(h.id) || exitingIds.has(h.id)),
    [trackedHabits, doneSet, exitingIds],
  )

  const settledDone = useMemo(
    () =>
      trackedHabits.filter((h) => doneSet.has(h.id) && !exitingIds.has(h.id)),
    [trackedHabits, doneSet, exitingIds],
  )

  const scheduleExit = (habitId: string) => {
    window.setTimeout(() => {
      setExitingIds((prev) => {
        const next = new Set(prev)
        next.delete(habitId)
        return next
      })
    }, STRIKE_MS)
  }

  const total = trackedHabits.length

  return (
    <div className="habit-bento bento-tile bento-tile--blush habit-bento--stack">
      {displayList.length > 0 ? (
        <div className="habit-list habit-list--animated" role="list">
          <AnimatePresence initial={false} mode="popLayout">
            {displayList.map((h) => {
              const done = doneSet.has(h.id)
              const striking = done && exitingIds.has(h.id)
              return (
                <motion.div
                  key={h.id}
                  layout
                  className="habit-row-shell"
                  initial={false}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.97,
                    transition: {
                      duration: 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                >
                  <button
                    type="button"
                    role="listitem"
                    className={`habit-row habit-row--no-emoji ${done ? 'done' : ''} ${striking ? 'habit-row--striking' : ''}`}
                    disabled={striking}
                    onClick={() => {
                      if (done) return
                      toggleCompleted(dayKey, h.id)
                      setExitingIds((prev) => new Set([...prev, h.id]))
                      scheduleExit(h.id)
                    }}
                    aria-pressed={done}
                  >
                    <span className="check" aria-hidden>
                      <CheckIcon className="check-glyph" strokeWidth={2.75} />
                    </span>
                    <span className="habit-text">
                      <strong>{h.label}</strong>
                      <span>
                        {done ? 'Nice! Logged for this day.' : 'Tap when done'}
                      </span>
                    </span>
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        total > 0 && (
          <AnimatePresence mode="wait">
            <AllDoneHero key="all-done-hero" />
          </AnimatePresence>
        )
      )}

      {settledDone.length > 0 && (
        <section className="habit-completed-section" aria-labelledby="completed-heading">
          <h3 id="completed-heading" className="habit-completed-heading">
            Completed today
          </h3>
          <p className="habit-completed-hint">
            {settledDone.length} goal{settledDone.length === 1 ? '' : 's'} — tap a row
            to uncheck.
          </p>
          <ul className="habit-completed-list" role="list">
            {settledDone.map((h) => (
              <li key={h.id} role="listitem">
                <button
                  type="button"
                  className="habit-completed-row"
                  onClick={() => toggleCompleted(dayKey, h.id)}
                >
                  <span className="habit-completed-check" aria-hidden>
                    <CheckIcon className="habit-completed-check-glyph" strokeWidth={2.5} />
                  </span>
                  <span className="habit-completed-label">{h.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
