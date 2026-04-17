import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { HabitBankSheet } from './components/HabitBankSheet'
import { TabBar } from './components/TabBar'
import { PetCareSync } from './pet/PetCareSync'
import { CalendarPage } from './pages/CalendarPage'
import { HomePage } from './pages/HomePage'
import { TrackerUiProvider } from './TrackerUiProvider'
import { useTrackerUi } from './useTrackerUi'
import './App.css'

const PetPage = lazy(async () => {
  const m = await import('./pages/PetPage')
  return { default: m.PetPage }
})

function PhoneShell() {
  const { pathname } = useLocation()
  const { sheetOpen, setSheetOpen } = useTrackerUi()
  const showHabitFab = pathname === '/' || pathname === '/buddy'

  return (
    <div className="phone-screen" id="phone-stage">
      <PetCareSync />
      <div className="phone-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/buddy"
            element={
              <Suspense
                fallback={
                  <div className="app app-pet-page">
                    <div className="shell">
                      <p className="pet-page-note" style={{ marginTop: '2rem' }}>
                        Loading buddy…
                      </p>
                    </div>
                  </div>
                }
              >
                <PetPage />
              </Suspense>
            }
          />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showHabitFab && (
        <div className={`fab${sheetOpen ? ' fab-behind-sheet' : ''}`}>
          <button type="button" onClick={() => setSheetOpen(true)}>
            <Squares2X2Icon className="fab-glyph" aria-hidden />
            Habit bank &amp; extras
          </button>
        </div>
      )}
      <TabBar />
      <HabitBankSheet />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TrackerUiProvider>
        <div className="viewport">
          <div className="phone-bezel">
            <div className="phone-notch" aria-hidden>
              <span className="phone-speaker" />
            </div>
            <PhoneShell />
          </div>
        </div>
      </TrackerUiProvider>
    </BrowserRouter>
  )
}
