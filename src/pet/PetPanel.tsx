import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef } from 'react'
import { PetAvatar } from './PetAvatar'
import './pet.css'
import { moodFromStats, moodHint, usePetStore } from './petStore'

type Props = {
  dayKey: string
  doneCount: number
  total: number
  pct: number
  isToday: boolean
}

export function PetPanel({ dayKey, doneCount, total, pct, isToday }: Props) {
  const hunger = usePetStore((s) => s.hunger)
  const happiness = usePetStore((s) => s.happiness)
  const health = usePetStore((s) => s.health)
  const boostFromHabit = usePetStore((s) => s.boostFromHabit)
  const slightLetdown = usePetStore((s) => s.slightLetdown)
  const decayMissedCare = usePetStore((s) => s.decayMissedCare)
  const celebrateAllDone = usePetStore((s) => s.celebrateAllDone)
  const idleRecover = usePetStore((s) => s.idleRecover)

  const prevDone = useRef(doneCount)
  const prevPct = useRef(pct)
  const lastDayKey = useRef(dayKey)

  useEffect(() => {
    if (lastDayKey.current !== dayKey) {
      lastDayKey.current = dayKey
      prevDone.current = doneCount
      prevPct.current = pct
    }
  }, [dayKey, doneCount, pct])

  useEffect(() => {
    if (!isToday) {
      prevDone.current = doneCount
      return
    }
    if (doneCount > prevDone.current) {
      boostFromHabit()
    } else if (doneCount < prevDone.current) {
      slightLetdown()
    }
    prevDone.current = doneCount
  }, [doneCount, isToday, boostFromHabit, slightLetdown])

  useEffect(() => {
    if (!isToday) {
      prevPct.current = pct
      return
    }
    if (
      total > 0 &&
      doneCount === total &&
      prevPct.current < 100 &&
      pct === 100
    ) {
      celebrateAllDone()
    }
    prevPct.current = pct
  }, [doneCount, total, pct, isToday, celebrateAllDone])

  useEffect(() => {
    if (!isToday || total === 0 || doneCount >= total) return
    const id = window.setInterval(() => {
      decayMissedCare()
    }, 40_000)
    return () => window.clearInterval(id)
  }, [isToday, total, doneCount, decayMissedCare])

  useEffect(() => {
    if (total !== 0) return
    const id = window.setInterval(() => {
      idleRecover()
    }, 22_000)
    return () => window.clearInterval(id)
  }, [total, idleRecover])

  const mood = moodFromStats(hunger, happiness, health)
  const hint = moodHint[mood]

  return (
    <section className="pet-panel" aria-labelledby="pet-heading">
      <div className="pet-panel-head">
        <h2 id="pet-heading" className="pet-panel-title">
          Your win-buddy
        </h2>
        <p className="pet-panel-sub">
          {total === 0
            ? 'Add habits — then keeping them happy keeps me happy.'
            : !isToday
              ? 'I live on today’s list. Jump back to feed me with wins!'
              : hint}
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
  const w = Math.round(Math.max(0, Math.min(100, value)))
  return (
    <div className={`pet-meter pet-meter--${tone}`}>
      <span className="pet-meter-label">{label}</span>
      <div className="pet-meter-track">
        <motion.div
          className="pet-meter-fill"
          initial={false}
          animate={{ width: `${w}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        />
      </div>
    </div>
  )
}
