import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { BuddyCategory } from '../types'
import { useTrackerUi } from '../useTrackerUi'

const METER_PICK: { id: BuddyCategory; label: string; hint: string }[] = [
  { id: 'full', label: 'Full', hint: 'Meals, sleep, fuel' },
  { id: 'joy', label: 'Joy', hint: 'Focus, read, log' },
  { id: 'well', label: 'Well', hint: 'Train, outside, space' },
]

export function HabitBankSheet() {
  const {
    allHabits,
    trackedIds,
    toggleTracked,
    addCustomHabit,
    removeCustomHabit,
    sheetOpen,
    setSheetOpen,
    newLabel,
    setNewLabel,
  } = useTrackerUi()

  const [categoryPickFor, setCategoryPickFor] = useState<string | null>(null)

  const closeSheet = () => {
    setCategoryPickFor(null)
    setSheetOpen(false)
  }

  const customOnly = allHabits.filter((h) => h.id.startsWith('custom-'))

  const finishAddWithCategory = (cat: BuddyCategory) => {
    if (!categoryPickFor) return
    if (addCustomHabit(categoryPickFor, cat)) {
      setNewLabel('')
      setCategoryPickFor(null)
    }
  }

  if (!sheetOpen) return null

  return (
    <div
      className="overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSheet()
      }}
    >
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden />
        <div className="sheet-head">
          <h2 id="sheet-title">Habits</h2>
          <p>
            Toggle presets onto your list — same vibe as 75 Hard, but lighter.
            Add your own at the bottom if something’s missing.
          </p>
        </div>
        <div className="sheet-body">
          <div className="bank-presets">
            <p className="bank-hint" id="bank-hint">
              Presets
            </p>
            <div
              className="bank-grid"
              role="group"
              aria-describedby="bank-hint"
            >
              {allHabits
                .filter((h) => !h.id.startsWith('custom-'))
                .map((h) => {
                  const on = trackedIds.includes(h.id)
                  return (
                    <button
                      key={h.id}
                      type="button"
                      className={`bank-chip ${on ? 'on' : ''}`}
                      onClick={() => toggleTracked(h.id)}
                      aria-pressed={on}
                    >
                      <span className="t">{h.label}</span>
                    </button>
                  )
                })}
            </div>
          </div>

          {customOnly.length > 0 && (
            <div className="custom-list">
              <h3>Custom</h3>
              <div className="bank-presets bank-presets--tight">
                <div className="bank-grid">
                  {customOnly.map((h) => {
                    const on = trackedIds.includes(h.id)
                    return (
                      <div key={h.id} className="custom-chip-wrap">
                        <button
                          type="button"
                          className={`bank-chip ${on ? 'on' : ''}`}
                          onClick={() => toggleTracked(h.id)}
                          aria-pressed={on}
                        >
                          <span className="t">{h.label}</span>
                        </button>
                        <button
                          type="button"
                          className="chip-remove"
                          aria-label={`Remove ${h.label}`}
                          onClick={() => removeCustomHabit(h.id)}
                        >
                          <XMarkIcon className="chip-remove-icon" aria-hidden />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="add-row">
            <h3>Add a habit</h3>
            <input
              className="text-input"
              placeholder="e.g. Second walk, Meal prep block"
              value={newLabel}
              onChange={(e) => {
                const v = e.target.value
                setNewLabel(v)
                const t = v.trim()
                if (categoryPickFor !== null && t !== categoryPickFor) {
                  setCategoryPickFor(null)
                }
              }}
              maxLength={48}
              aria-label="Habit name"
            />
            {categoryPickFor !== null && (
              <div
                className="add-category-pick"
                role="group"
                aria-labelledby="add-category-pick-label"
              >
                <p id="add-category-pick-label" className="add-category-pick-label">
                  Can&apos;t tell from the name — which meter should it count toward?
                </p>
                <div className="add-category-pick-row">
                  {METER_PICK.map(({ id, label, hint }) => (
                    <button
                      key={id}
                      type="button"
                      className="add-category-pick-btn"
                      onClick={() => finishAddWithCategory(id)}
                    >
                      <span className="add-category-pick-btn-title">{label}</span>
                      <span className="add-category-pick-btn-hint">{hint}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="add-category-pick-cancel"
                  onClick={() => setCategoryPickFor(null)}
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="sheet-actions sheet-actions-stack">
              <button
                type="button"
                className="done-btn"
                onClick={closeSheet}
              >
                Done — see my list
              </button>
              <button
                type="button"
                className="add-btn"
                disabled={!newLabel.trim() || categoryPickFor !== null}
                onClick={() => {
                  const t = newLabel.trim()
                  if (addCustomHabit(t)) {
                    setNewLabel('')
                    setCategoryPickFor(null)
                  } else {
                    setCategoryPickFor(t)
                  }
                }}
              >
                Add custom habit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
