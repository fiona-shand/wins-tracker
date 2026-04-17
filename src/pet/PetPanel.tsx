import { motion, AnimatePresence } from 'motion/react'
import { PetAvatar } from './PetAvatar'
import './pet.css'
import { moodFromStats, moodHint, usePetStore } from './petStore'

type Props = {
  doneCount: number
  total: number
  pct: number
  isToday: boolean
}

export function PetPanel({ doneCount, total, pct, isToday }: Props) {
  const hunger = usePetStore((s) => s.hunger)
  const happiness = usePetStore((s) => s.happiness)
  const health = usePetStore((s) => s.health)

  const mood = moodFromStats(hunger, happiness, health)
  const hint = moodHint[mood]

  return (
    <section className="pet-panel" aria-labelledby="pet-heading">
      <div className="pet-panel-head">
        <h2 id="pet-heading" className="pet-panel-title">
          Your win-buddy
        </h2>
        <p className="pet-panel-sub copy-prose">
          {total === 0 ? (
            <>
              Link{' '}
              <span className="inline-badge inline-badge--blue">habits</span> on Today —
              then every check-in hits my{' '}
              <span className="inline-badge inline-badge--green">meters</span>.
            </>
          ) : !isToday ? (
            <>
              I sync to{' '}
              <span className="inline-badge inline-badge--yellow">today only</span> — jump
              back to Today to feed me with{' '}
              <span className="inline-badge inline-badge--rose">wins</span>.
            </>
          ) : (
            <>
              {hint}{' '}
              <span className="inline-badge inline-badge--slate">
                {doneCount}/{total}
              </span>{' '}
              ·{' '}
              <span className="inline-badge inline-badge--yellow">{pct}%</span>
            </>
          )}
        </p>
      </div>

      <div className="pet-panel-body">
        <PetAvatar hunger={hunger} happiness={happiness} health={health} />

        <div className="pet-meters" aria-label="Buddy needs">
          <Meter label="Full" value={hunger} tone="hunger" />
          <Meter label="Joy" value={happiness} tone="happy" />
          <Meter label="Well" value={health} tone="health" />
        </div>
      </div>

      <AnimatePresence>
        {isToday && total > 0 && pct === 100 && (
          <motion.p
            className="pet-cheer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            Best day ever! Thanks for the care. ✨
          </motion.p>
        )}
      </AnimatePresence>

      <p className="pet-a11y" aria-live="polite">
        {hint}
      </p>
    </section>
  )
}

function Meter({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'hunger' | 'happy' | 'health'
}) {
  const w = Math.round(Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0)))
  return (
    <div className={`pet-meter pet-meter--${tone}`}>
      <span className="pet-meter-label">{label}</span>
      <div className="pet-meter-track">
        <div className="pet-meter-fill" style={{ width: `${w}%` }} />
      </div>
    </div>
  )
}
