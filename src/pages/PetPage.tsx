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
      <div className="shell shell--pet">
        <header className="brand brand-compact brand--pet">
          <div className="brand-badge">Win-buddy</div>
          <h1>Buddy deck</h1>
        </header>

        <div className="pet-page-panel">
          <PetPanel
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
