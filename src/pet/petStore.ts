import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  /** Single source of truth: meters follow today’s habit completion %. */
  syncFromHabits: (total: number, pct: number) => void
}

function metersForProgress(total: number, pct: number) {
  if (total === 0) {
    return { hunger: 72, happiness: 76, health: 70 }
  }
  const t = pct / 100
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t)
  return {
    hunger: clamp(lerp(30, 92)),
    happiness: clamp(lerp(36, 96)),
    health: clamp(lerp(28, 90)),
  }
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      hunger: 82,
      happiness: 82,
      health: 86,

      syncFromHabits: (total, pct) =>
        set(() => metersForProgress(total, pct)),
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
