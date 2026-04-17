import { useMemo } from 'react'
import { dateKey } from '../dates'
import { useTrackerUi } from '../useTrackerUi'
import { usePetCareEffects } from './usePetCareEffects'

/**
 * Invisible bridge: updates buddy meters when habits change on Today,
 * even if the user is not on the Buddy tab.
 */
export function PetCareSync() {
  const { trackedHabits, completions } = useTrackerUi()
  const dayKey = dateKey(new Date())

  const doneSet = useMemo(
    () => new Set(completions[dayKey] ?? []),
    [completions, dayKey],
  )

  const { total, pct } = useMemo(() => {
    const total = trackedHabits.length
    const doneCount = trackedHabits.filter((h) => doneSet.has(h.id)).length
    const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)
    return { total, pct }
  }, [trackedHabits, doneSet])

  usePetCareEffects({
    dayKey,
    total,
    pct,
    active: true,
  })

  return null
}
