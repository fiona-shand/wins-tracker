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
  boostFromHabit: () => void
  slightLetdown: () => void
  decayMissedCare: () => void
  celebrateAllDone: () => void
  idleRecover: () => void
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      hunger: 82,
      happiness: 82,
      health: 86,

      boostFromHabit: () =>
        set((s) => ({
          hunger: clamp(s.hunger + 7),
          happiness: clamp(s.happiness + 9),
          health: clamp(s.health + 4),
        })),

      slightLetdown: () =>
        set((s) => ({
          hunger: clamp(s.hunger - 3),
          happiness: clamp(s.happiness - 4),
          health: clamp(s.health - 2),
        })),

      decayMissedCare: () =>
        set((s) => ({
          hunger: clamp(s.hunger - 4),
          happiness: clamp(s.happiness - 5),
          health: clamp(s.health - 3),
        })),

      celebrateAllDone: () =>
        set((s) => ({
          hunger: clamp(s.hunger + 12),
          happiness: clamp(s.happiness + 14),
          health: clamp(s.health + 10),
        })),

      idleRecover: () =>
        set((s) => ({
          hunger: clamp(s.hunger + 1.2),
          happiness: clamp(s.happiness + 1.2),
          health: clamp(s.health + 0.8),
        })),
    }),
    { name: 'tiny-wins-pet-v1' },
  ),
)
