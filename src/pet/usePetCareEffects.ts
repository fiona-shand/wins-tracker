import { useEffect, useRef } from 'react'
import { usePetStore } from './petStore'

type Params = {
  dayKey: string
  total: number
  pct: number
  /** When false, skip syncing (historic / inactive timeline). */
  active: boolean
}

/**
 * Keeps buddy meters aligned with today’s habit list: bars move when % changes.
 * Waits for persist rehydration so stored values don’t overwrite a fresh sync.
 */
export function usePetCareEffects({ dayKey, total, pct, active }: Params) {
  const syncFromHabits = usePetStore((s) => s.syncFromHabits)
  const latest = useRef({ total, pct, active })

  useEffect(() => {
    latest.current = { total, pct, active }
    if (!active) return

    const run = () => {
      const { total: t, pct: p, active: a } = latest.current
      if (!a) return
      syncFromHabits(t, p)
    }

    if (usePetStore.persist.hasHydrated()) {
      run()
      return
    }

    return usePetStore.persist.onFinishHydration(() => {
      run()
    })
  }, [active, dayKey, total, pct, syncFromHabits])
}
