import { useCallback, useEffect, useMemo, useState } from 'react'
import { suggestBuddyCategory } from './buddyCategory'
import { HABIT_BANK } from './constants'
import { loadPersisted, savePersisted } from './storage'
import type { BuddyCategory, Habit } from './types'

function habitById(all: Habit[], id: string): Habit | undefined {
  return all.find((h) => h.id === id)
}

export function useWinsTracker() {
  const persisted = useMemo(() => loadPersisted(), [])

  const [customHabits, setCustomHabits] = useState<Habit[]>(
    () => persisted.customHabits,
  )
  const [trackedIds, setTrackedIds] = useState<string[]>(
    () => persisted.trackedIds,
  )
  const [completions, setCompletions] = useState<Record<string, string[]>>(
    () => persisted.completions,
  )

  useEffect(() => {
    savePersisted({ customHabits, trackedIds, completions })
  }, [customHabits, trackedIds, completions])

  const allHabits = useMemo(
    () => [...HABIT_BANK, ...customHabits],
    [customHabits],
  )

  const trackedHabits = useMemo(() => {
    return trackedIds
      .map((id) => habitById(allHabits, id))
      .filter((h): h is Habit => Boolean(h))
  }, [trackedIds, allHabits])

  const toggleTracked = useCallback((id: string) => {
    setTrackedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const addCustomHabit = useCallback((label: string, buddyCategory?: BuddyCategory) => {
    const trimmed = label.trim()
    if (!trimmed) return false
    const cat = buddyCategory ?? suggestBuddyCategory(trimmed)
    if (cat === null) return false
    const id = `custom-${crypto.randomUUID().slice(0, 10)}`
    const habit: Habit = {
      id,
      label: trimmed,
      emoji: '',
      buddyCategory: cat,
    }
    setCustomHabits((prev) => [...prev, habit])
    setTrackedIds((prev) => [...prev, id])
    return true
  }, [])

  const removeCustomHabit = useCallback((id: string) => {
    setCustomHabits((prev) => prev.filter((h) => h.id !== id))
    setTrackedIds((prev) => prev.filter((x) => x !== id))
    setCompletions((prev) => {
      const next = { ...prev }
      for (const day of Object.keys(next)) {
        next[day] = next[day].filter((hid) => hid !== id)
      }
      return next
    })
  }, [])

  const toggleCompleted = useCallback((day: string, habitId: string) => {
    setCompletions((prev) => {
      const list = prev[day] ?? []
      const has = list.includes(habitId)
      const nextList = has
        ? list.filter((id) => id !== habitId)
        : [...list, habitId]
      return { ...prev, [day]: nextList }
    })
  }, [])

  return {
    allHabits,
    trackedHabits,
    trackedIds,
    completions,
    toggleTracked,
    addCustomHabit,
    removeCustomHabit,
    toggleCompleted,
  }
}
