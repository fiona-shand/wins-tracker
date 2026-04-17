export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b)
}

export function formatNice(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

export type CalendarCell = {
  date: Date
  inCurrentMonth: boolean
}

/** Full weeks for `monthStart` (first day of month), including padded days. */
export function getMonthGrid(monthStart: Date): CalendarCell[] {
  const y = monthStart.getFullYear()
  const m = monthStart.getMonth()
  const first = new Date(y, m, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells: CalendarCell[] = []

  for (let i = 0; i < startPad; i++) {
    cells.push({ date: addDays(first, -startPad + i), inCurrentMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(y, m, day), inCurrentMonth: true })
  }
  let tail = addDays(new Date(y, m, daysInMonth), 1)
  while (cells.length % 7 !== 0) {
    cells.push({ date: tail, inCurrentMonth: false })
    tail = addDays(tail, 1)
  }
  return cells
}

/** Narrow weekday letters for the local locale, Sun–Sat. */
export function weekdayNarrowLabels(): string[] {
  const labels: string[] = []
  const d = new Date(2023, 0, 1)
  for (let i = 0; i < 7; i++) {
    labels.push(d.toLocaleDateString(undefined, { weekday: 'narrow' }))
    d.setDate(d.getDate() + 1)
  }
  return labels
}

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
