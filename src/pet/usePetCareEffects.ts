import { useEffect, useRef } from 'react'
import type { Habit } from '../types'
import { usePetStore } from './petStore'

type Params = {
  dayKey: string
  trackedHabits: Habit[]
  doneIds: string[]
  /** When false, skip syncing (historic / inactive timeline). */
  active: boolean
}

/**
 * Keeps buddy meters aligned with today’s completions per Full / Joy / Well.
 * Waits for persist rehydration so stored values don’t overwrite a fresh sync.
 */
export function usePetCareEffects({
  dayKey,
  trackedHabits,
  doneIds,
  active,
}: Params) {
  const syncFromHabits = usePetStore((s) => s.syncFromHabits)
  const latest = useRef({ trackedHabits, doneIds, active })

  useEffect(() => {
    latest.current = { trackedHabits, doneIds, active }
    if (!active) return

    const run = () => {
      const { trackedHabits: th, doneIds: ids, active: a } = latest.current
      if (!a) return
      syncFromHabits(th, ids)
    }

    if (usePetStore.persist.hasHydrated()) {
      run()
      return
    }

    return usePetStore.persist.onFinishHydration(() => {
      run()
    })
  }, [active, dayKey, trackedHabits, doneIds, syncFromHabits])
}
