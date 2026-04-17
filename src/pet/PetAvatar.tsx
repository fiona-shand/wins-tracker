import { motion } from 'motion/react'
import { ExpressiveBuddy } from './ExpressiveBuddy'
import { moodFromStats } from './petStore'

type Props = {
  hunger: number
  happiness: number
  health: number
}

export function PetAvatar({ hunger, happiness, health }: Props) {
  const mood = moodFromStats(hunger, happiness, health)

  const bodyAnim =
    mood === 'bliss'
      ? { y: [0, -6, 0], rotate: [0, 1.2, -1.2, 0] }
      : mood === 'happy'
        ? { y: [0, -4, 0] }
        : mood === 'ok' || mood === 'meh'
          ? { y: [0, -2, 0], scale: [1, 1.015, 1] }
          : mood === 'sad'
            ? { y: [0, 1, 0], rotate: [-0.8, 0, -0.8] }
            : mood === 'rough'
              ? { x: [0, -2, 2, -1, 0], rotate: [-1.5, 1.5, -1, 0] }
              : { x: [0, -4, 4, -3, 3, 0], rotate: [-3, 3, -2, 0] }

  const bodyTransition =
    mood === 'critical' || mood === 'rough'
      ? { duration: 0.45, repeat: mood === 'critical' ? Infinity : 2 }
      : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const }

  const filter =
    mood === 'critical'
      ? 'saturate(0.7) brightness(0.94)'
      : mood === 'rough'
        ? 'saturate(0.88)'
        : 'none'

  return (
    <motion.div
      key={mood}
      className="pet-avatar"
      animate={bodyAnim}
      transition={bodyTransition}
      style={{ filter }}
    >
      <div className="pet-scene">
        <div className="pet-buddy-wrap">
          <ExpressiveBuddy mood={mood} />
        </div>
      </div>
    </motion.div>
  )
}
