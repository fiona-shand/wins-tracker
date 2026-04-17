import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { BUDDY_CATEGORY_LABELS } from '../constants'
import type { BuddyCategory } from '../types'
import { useTrackerUi } from '../useTrackerUi'

const BUDDY_CATS: BuddyCategory[] = ['full', 'joy', 'well']

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

  const [newBuddyCategory, setNewBuddyCategory] = useState<BuddyCategory>('joy')

  const customOnly = allHabits.filter((h) => h.id.startsWith('custom-'))

  if (!sheetOpen) return null

  return (
    <div
      className="overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSheetOpen(false)
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
          <h2 id="sheet-title">Habit bank</h2>
          <p>
            Tap a habit to put it on your list (or take it off). That saves
            right away — the form below is only for brand-new ideas.
          </p>
        </div>
        <div className="sheet-body">
          <div className="bank-presets">
            <p className="bank-hint" id="bank-hint">
              Presets — tap to track
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
              <h3>Your customs</h3>
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
            <h3>Add a tiny win</h3>
            <input
              className="text-input"
              placeholder="e.g. Water the plants"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              maxLength={48}
              aria-label="Habit name"
            />
            <div className="habit-category-row">
              <span className="habit-category-label">Buddy meter</span>
              <div className="habit-category-picks" role="group" aria-label="Category for this habit">
                {BUDDY_CATS.map((cat) => {
                  const { title, blurb } = BUDDY_CATEGORY_LABELS[cat]
                  const on = newBuddyCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`habit-category-pick${on ? ' on' : ''}`}
                      aria-pressed={on}
                      onClick={() => setNewBuddyCategory(cat)}
                    >
                      <span className="habit-category-pick-title">{title}</span>
                      <span className="habit-category-pick-blurb">{blurb}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="sheet-actions sheet-actions-stack">
              <button
                type="button"
                className="done-btn"
                onClick={() => setSheetOpen(false)}
              >
                Done — see my list
              </button>
              <button
                type="button"
                className="add-btn"
                disabled={!newLabel.trim()}
                onClick={() => {
                  addCustomHabit(newLabel.trim(), newBuddyCategory)
                  setNewLabel('')
                  setNewBuddyCategory('joy')
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
