import { HABIT_BANK } from './constants'
import type { BuddyCategory, Habit } from './types'

function scoreBuddyLabel(label: string): {
  full: number
  well: number
  joy: number
} {
  const t = label.trim()
  const count = (re: RegExp) => (t.match(re) ?? []).length

  return {
    full: count(
      /\b(meals?|breakfast|brunch|lunch|dinner|snack|protein|vegetables?|veggies?|veggie|fiber|sleep|bedtime|hydrat|hydration|gallon|litres?|liters?|supplements?|vitamins?|nutrition|fuel|fasting|intermittent|cooking|groceries|grocery|macros?|calories?|sober|hydrate)\b|\b(eat|eating|ate)\b|\bfoods?\b/gi,
    ),
    well: count(
      /\b(workouts?|work\s+outs?|train|training|gym|run|running|jog|walk|walks?|bike|bicycl|swim|swimming|hike|hiking|outdoors?|outside|nature|trail|stretch|mobility|yoga|lift|lifting|cardio|push-?ups?|pull-?ups?|squats?|deadlifts?|\bsteps\b|tid(y|ying)|clean(ing)?|laundry|dishes?|chores?|organiz(e|ing)|declutter(ing)?|room\s+reset|kitchen\s+reset)\b/gi,
    ),
    joy: count(
      /\b(read|reading|books?|journal|journaling|logs?|focus|deep\s+work|stud(y|ies|ying)|learn(ing)?|courses?|meditat|meditation|breathwork|breathe|breathing|quiet\s+time|inbox|writ(e|ing)|notes?|plan(s|ning)?|debrief|podcasts?|\bpages?\b|letters?|reflect(ion)?|gratitude)\b|\bphone\s+(away|down|off)|\bno\s+scroll/gi,
    ),
  }
}

/**
 * Guess Full / Joy / Well from a custom habit name.
 * Returns null when there are no keyword hits — caller should ask the user.
 */
export function suggestBuddyCategory(label: string): BuddyCategory | null {
  const t = label.trim()
  if (!t) return null

  if (/water\s+(the\s+)?plants?|plants?\s+water/i.test(t)) return 'well'

  const { full, well, joy } = scoreBuddyLabel(t)
  const max = Math.max(full, well, joy)
  if (max === 0) return null

  for (const cat of ['full', 'well', 'joy'] as const) {
    const v = cat === 'full' ? full : cat === 'well' ? well : joy
    if (v === max) return cat
  }
  return 'joy'
}

/** Resolve category for any habit (saved customs, presets, or legacy data). */
export function getBuddyCategory(h: Habit): BuddyCategory {
  if (h.buddyCategory === 'full' || h.buddyCategory === 'joy' || h.buddyCategory === 'well') {
    return h.buddyCategory
  }
  const preset = HABIT_BANK.find((b) => b.id === h.id)
  if (preset?.buddyCategory) return preset.buddyCategory
  return 'joy'
}
