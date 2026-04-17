import type { Habit } from './types'

/** Preset IDs removed from the bank — stripped from saved lists on load. */
export const RETIRED_BANK_HABIT_IDS = new Set([
  'bank-water',
  'bank-connect',
  'bank-gratitude',
])

/** Emoji field kept for older saves; UI does not show habit emojis. */
export const HABIT_BANK: Habit[] = [
  {
    id: 'bank-fuel',
    label: 'Real meal before noon',
    emoji: '',
    buddyCategory: 'full',
  },
  { id: 'bank-move', label: '30+ min workout', emoji: '', buddyCategory: 'well' },
  { id: 'bank-read', label: '10 pages reading', emoji: '', buddyCategory: 'joy' },
  {
    id: 'bank-breathe',
    label: '10 min walk or breath practice',
    emoji: '',
    buddyCategory: 'joy',
  },
  { id: 'bank-journal', label: 'One-page daily log', emoji: '', buddyCategory: 'joy' },
  {
    id: 'bank-sleep',
    label: 'In bed on time (±30 min)',
    emoji: '',
    buddyCategory: 'full',
  },
  { id: 'bank-veg', label: 'Protein + veg meal', emoji: '', buddyCategory: 'full' },
  { id: 'bank-tidy', label: '5 min room reset', emoji: '', buddyCategory: 'well' },
  { id: 'bank-outside', label: '20+ min outside', emoji: '', buddyCategory: 'well' },
  { id: 'bank-stretch', label: '10 min mobility', emoji: '', buddyCategory: 'well' },
  {
    id: 'bank-focus',
    label: '25 min focus, phone elsewhere',
    emoji: '',
    buddyCategory: 'joy',
  },
  {
    id: 'bank-kitchen',
    label: 'Kitchen reset before bed',
    emoji: '',
    buddyCategory: 'well',
  },
]
