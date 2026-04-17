import { RETIRED_BANK_HABIT_IDS } from './constants'
import type { BuddyCategory, Habit, PersistedState } from './types'

const KEY = 'tiny-wins-tracker-v1'

/** Migrate habits saved with `iconId` (Heroicons era) back to emoji. */
const LEGACY_ICON_TO_EMOJI: Record<string, string> = {
  beaker: '💧',
  bolt: '🚶',
  'book-open': '📚',
  'pause-circle': '🧘',
  'pencil-square': '✍️',
  moon: '🌙',
  sun: '🥦',
  envelope: '💌',
  sparkles: '✨',
  'globe-americas': '🌿',
  'arrow-path': '🤸',
  star: '🌟',
  heart: '❤️',
  'musical-note': '🎵',
  'face-smile': '😊',
  gift: '🎁',
}

const empty: PersistedState = {
  v: 1,
  customHabits: [],
  trackedIds: [],
  completions: {},
}

function isBuddyCategory(x: unknown): x is BuddyCategory {
  return x === 'full' || x === 'joy' || x === 'well'
}

function normalizeHabit(raw: unknown): Habit | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.label !== 'string') return null

  const buddyCategory = isBuddyCategory(o.buddyCategory) ? o.buddyCategory : undefined

  if (typeof o.emoji === 'string' && o.emoji.length > 0) {
    return { id: o.id, label: o.label, emoji: o.emoji, buddyCategory }
  }

  if (typeof o.iconId === 'string') {
    const emoji = LEGACY_ICON_TO_EMOJI[o.iconId] ?? ''
    return { id: o.id, label: o.label, emoji, buddyCategory }
  }

  return {
    id: o.id,
    label: o.label,
    emoji: typeof o.emoji === 'string' ? o.emoji : '',
    buddyCategory,
  }
}

function pruneRetiredHabitIds(ids: string[]): string[] {
  return ids.filter((id) => !RETIRED_BANK_HABIT_IDS.has(id))
}

function pruneRetiredFromCompletions(
  completions: Record<string, string[]>,
): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const [day, done] of Object.entries(completions)) {
    const next = pruneRetiredHabitIds(done)
    if (next.length > 0) out[day] = next
  }
  return out
}

export function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...empty, completions: {} }
    const data = JSON.parse(raw) as PersistedState & {
      customHabits?: unknown[]
    }
    if (data?.v !== 1) return { ...empty, completions: {} }
    const customs = Array.isArray(data.customHabits)
      ? data.customHabits
          .map(normalizeHabit)
          .filter((h): h is Habit => h !== null)
      : []
    const trackedIds = Array.isArray(data.trackedIds)
      ? data.trackedIds.filter((id): id is string => typeof id === 'string')
      : []
    const completionsRaw =
      data.completions && typeof data.completions === 'object'
        ? (data.completions as Record<string, string[]>)
        : {}
    const completions: Record<string, string[]> = {}
    for (const [day, done] of Object.entries(completionsRaw)) {
      if (!Array.isArray(done)) continue
      const ids = done.filter((id): id is string => typeof id === 'string')
      completions[day] = ids
    }

    return {
      v: 1,
      customHabits: customs,
      trackedIds: pruneRetiredHabitIds(trackedIds),
      completions: pruneRetiredFromCompletions(completions),
    }
  } catch {
    return { ...empty, completions: {} }
  }
}

export function savePersisted(state: {
  customHabits: Habit[]
  trackedIds: string[]
  completions: Record<string, string[]>
}): void {
  const payload: PersistedState = {
    v: 1,
    customHabits: state.customHabits,
    trackedIds: state.trackedIds,
    completions: state.completions,
  }
  localStorage.setItem(KEY, JSON.stringify(payload))
}
