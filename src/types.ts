/** Buddy meters: Full (fuel/rest), Joy (mind/connect), Well (move/space). */
export type BuddyCategory = 'full' | 'joy' | 'well'

export type Habit = {
  id: string
  label: string
  emoji: string
  buddyCategory?: BuddyCategory
}

export type PersistedState = {
  v: 1
  customHabits: Habit[]
  trackedIds: string[]
  completions: Record<string, string[]>
}
