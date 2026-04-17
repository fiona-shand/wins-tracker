import { useState, type ReactNode } from 'react'
import { EMOJI_PICKS } from './constants'
import { TrackerUiContext, type TrackerUi } from './trackerContext'
import { useWinsTracker } from './useWinsTracker'

export function TrackerUiProvider({ children }: { children: ReactNode }) {
  const tracker = useWinsTracker()
  const [viewDate, setViewDate] = useState(() => new Date())
  const [calMonthOverride, setCalMonthOverride] = useState<Date | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState(EMOJI_PICKS[0])

  const value: TrackerUi = {
    ...tracker,
    viewDate,
    setViewDate,
    calMonthOverride,
    setCalMonthOverride,
    sheetOpen,
    setSheetOpen,
    newLabel,
    setNewLabel,
    newEmoji,
    setNewEmoji,
  }

  return (
    <TrackerUiContext.Provider value={value}>
      {children}
    </TrackerUiContext.Provider>
  )
}
