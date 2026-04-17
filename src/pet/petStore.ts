import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getBuddyCategory } from '../buddyCategory'
import type { BuddyCategory, Habit } from '../types'

const clamp = (n: number) => Math.max(0, Math.min(100, n))

export type PetMood =
  | 'bliss'
  | 'happy'
  | 'ok'
  | 'meh'
  | 'sad'
  | 'rough'
  | 'critical'

export function moodFromStats(
  hunger: number,
  happiness: number,
  health: number,
): PetMood {
  const avg = (hunger + happiness + health) / 3
  if (avg >= 88) return 'bliss'
  if (avg >= 72) return 'happy'
  if (avg >= 55) return 'ok'
  if (avg >= 40) return 'meh'
  if (avg >= 22) return 'sad'
  if (avg >= 10) return 'rough'
  return 'critical'
}

export const moodHint: Record<PetMood, string> = {
  bliss: 'Floating on cloud nine!',
  happy: 'So proud of you today.',
  ok: 'Keeping an eye on you~',
  meh: 'Needs a little love…',
  sad: 'Missing your wins…',
  rough: 'Hungry & worried. Check those habits!',
  critical: 'Please come back — I need you!',
}

type PetState = {
  hunger: number
  happiness: number
  health: number
  /** Meters follow habits you completed today, by buddy category (Full / Joy / Well). */
  syncFromHabits: (trackedHabits: Habit[], doneIds: string[]) => void
}

/** When you don’t track any habit in a category, that bar rests here. */
const IDLE_METER = 54

function pctForCategory(
  habits: Habit[],
  doneSet: Set<string>,
  category: BuddyCategory,
): number | null {
  const rows = habits.filter((h) => getBuddyCategory(h) === category)
  if (rows.length === 0) return null
  const done = rows.filter((h) => doneSet.has(h.id)).length
  return Math.round((done / rows.length) * 100)
}

function metersForTrackedDay(trackedHabits: Habit[], doneSet: Set<string>) {
  if (trackedHabits.length === 0) {
    return { hunger: 72, happiness: 76, health: 70 }
  }

  const fullPct = pctForCategory(trackedHabits, doneSet, 'full')
  const joyPct = pctForCategory(trackedHabits, doneSet, 'joy')
  const wellPct = pctForCategory(trackedHabits, doneSet, 'well')

  const map = (pct: number | null, lo: number, hi: number) => {
    if (pct === null) return IDLE_METER
    return clamp(Math.round(lo + (pct / 100) * (hi - lo)))
  }

  return {
    hunger: map(fullPct, 30, 92),
    happiness: map(joyPct, 36, 96),
    health: map(wellPct, 28, 90),
  }
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      hunger: 82,
      happiness: 82,
      health: 86,

      syncFromHabits: (trackedHabits, doneIds) =>
        set(() =>
          metersForTrackedDay(trackedHabits, new Set(doneIds)),
        ),
    }),
    {
      name: 'tiny-wins-pet-v1',
      partialize: (s) => ({
        hunger: s.hunger,
        happiness: s.happiness,
        health: s.health,
      }),
    },
  ),
)
