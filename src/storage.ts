import type { Habit, PersistedState } from './types'

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

function normalizeHabit(raw: unknown): Habit | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.label !== 'string') return null

  if (typeof o.emoji === 'string' && o.emoji.length > 0) {
    return { id: o.id, label: o.label, emoji: o.emoji }
  }

  if (typeof o.iconId === 'string') {
    const emoji = LEGACY_ICON_TO_EMOJI[o.iconId] ?? '🌟'
    return { id: o.id, label: o.label, emoji }
  }

  return { id: o.id, label: o.label, emoji: '🌟' }
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
    return {
      v: 1,
      customHabits: customs,
      trackedIds: Array.isArray(data.trackedIds) ? data.trackedIds : [],
      completions:
        data.completions && typeof data.completions === 'object'
          ? data.completions
          : {},
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
