export type Habit = {
  id: string
  label: string
  emoji: string
}

export type PersistedState = {
  v: 1
  customHabits: Habit[]
  trackedIds: string[]
  completions: Record<string, string[]>
}
