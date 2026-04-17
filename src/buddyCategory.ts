import { HABIT_BANK } from './constants'
import type { BuddyCategory, Habit } from './types'

/** Resolve category for any habit (saved customs, presets, or legacy data). */
export function getBuddyCategory(h: Habit): BuddyCategory {
  if (h.buddyCategory === 'full' || h.buddyCategory === 'joy' || h.buddyCategory === 'well') {
    return h.buddyCategory
  }
  const preset = HABIT_BANK.find((b) => b.id === h.id)
  if (preset?.buddyCategory) return preset.buddyCategory
  return 'joy'
}
