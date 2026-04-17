import type { BuddyCategory, Habit } from './types'

/** Emoji field kept for older saves; UI does not show habit emojis. */
export const HABIT_BANK: Habit[] = [
  { id: 'bank-water', label: 'Hydrate', emoji: '', buddyCategory: 'full' },
  { id: 'bank-move', label: 'Move my body', emoji: '', buddyCategory: 'well' },
  { id: 'bank-read', label: 'Read a little', emoji: '', buddyCategory: 'joy' },
  { id: 'bank-breathe', label: 'Breathe / meditate', emoji: '', buddyCategory: 'joy' },
  { id: 'bank-journal', label: 'Journal', emoji: '', buddyCategory: 'joy' },
  { id: 'bank-sleep', label: 'Wind down early', emoji: '', buddyCategory: 'full' },
  { id: 'bank-veg', label: 'Eat something green', emoji: '', buddyCategory: 'full' },
  { id: 'bank-connect', label: 'Reach out to someone', emoji: '', buddyCategory: 'joy' },
  { id: 'bank-tidy', label: '5-min tidy', emoji: '', buddyCategory: 'well' },
  { id: 'bank-outside', label: 'Step outside', emoji: '', buddyCategory: 'well' },
  { id: 'bank-stretch', label: 'Stretch', emoji: '', buddyCategory: 'well' },
  { id: 'bank-gratitude', label: 'Name 3 good things', emoji: '', buddyCategory: 'joy' },
]

export const BUDDY_CATEGORY_LABELS: Record<
  BuddyCategory,
  { title: string; blurb: string }
> = {
  full: { title: 'Full', blurb: 'Fuel, hydration, food, sleep' },
  joy: { title: 'Joy', blurb: 'Learn, connect, reflect, calm' },
  well: { title: 'Well', blurb: 'Move, stretch, space, outdoors' },
}
