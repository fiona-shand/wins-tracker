import { useContext } from 'react'
import { TrackerUiContext, type TrackerUi } from './trackerContext'

export type { TrackerUi }

export function useTrackerUi(): TrackerUi {
  const ctx = useContext(TrackerUiContext)
  if (!ctx) {
    throw new Error('useTrackerUi must be used within TrackerUiProvider')
  }
  return ctx
}
