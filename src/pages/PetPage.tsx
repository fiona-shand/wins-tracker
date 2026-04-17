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
      <div className="bg-blobs" aria-hidden />

      <div className="shell">
        <header className="brand brand-compact">
          <div className="brand-badge">Win-buddy</div>
          <h1>Your Tamagotchi</h1>
          <p>
            They eat your tiny wins. Finish today’s habits to keep them glowing.
          </p>
        </header>

        <p className="pet-page-note">
          Care stats always follow <strong>today</strong> — check habits on the
          Today tab.
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
