import { createContext, type Dispatch, type SetStateAction } from 'react'
import { useWinsTracker } from './useWinsTracker'

export type TrackerUi = ReturnType<typeof useWinsTracker> & {
  viewDate: Date
  setViewDate: Dispatch<SetStateAction<Date>>
  calMonthOverride: Date | null
  setCalMonthOverride: Dispatch<SetStateAction<Date | null>>
  sheetOpen: boolean
  setSheetOpen: Dispatch<SetStateAction<boolean>>
  newLabel: string
  setNewLabel: Dispatch<SetStateAction<string>>
}

export const TrackerUiContext = createContext<TrackerUi | null>(null)
