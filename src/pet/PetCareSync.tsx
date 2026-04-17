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

  const doneIds = useMemo(
    () => completions[dayKey] ?? [],
    [completions, dayKey],
  )

  usePetCareEffects({
    dayKey,
    trackedHabits,
    doneIds,
    active: true,
  })

  return null
}
