export function allHabitsDoneForDay(
  key: string,
  trackedIds: string[],
  completions: Record<string, string[]>,
): boolean {
  if (trackedIds.length === 0) return false
  const done = new Set(completions[key] ?? [])
  return trackedIds.every((id) => done.has(id))
}
