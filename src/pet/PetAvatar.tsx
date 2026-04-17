import { motion } from 'motion/react'
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
      ? { y: [0, -7, 0], rotate: [0, 1.5, -1.5, 0] }
      : mood === 'happy'
        ? { y: [0, -5, 0] }
        : mood === 'ok' || mood === 'meh'
          ? { y: [0, -2, 0], scale: [1, 1.02, 1] }
          : mood === 'sad'
            ? { y: [0, 1, 0], rotate: [-1, 0, -1] }
            : mood === 'rough'
              ? { x: [0, -3, 3, -2, 0], rotate: [-2, 2, -1, 0] }
              : { x: [0, -5, 5, -4, 4, 0], rotate: [-4, 4, -3, 0] }

  const bodyTransition =
    mood === 'critical' || mood === 'rough'
      ? { duration: 0.45, repeat: mood === 'critical' ? Infinity : 2 }
      : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const }

  const eyeScaleY =
    mood === 'bliss' || mood === 'happy'
      ? 1
      : mood === 'ok'
        ? 0.92
        : mood === 'meh'
          ? 0.75
          : mood === 'sad'
            ? 0.55
            : 0.4

  const mouthPath =
    mood === 'bliss' || mood === 'happy'
      ? 'M 28 52 Q 50 68 72 52'
      : mood === 'ok' || mood === 'meh'
        ? 'M 32 58 L 68 58'
        : 'M 35 62 Q 50 48 65 62'

  const filter =
    mood === 'critical'
      ? 'saturate(0.65) brightness(0.92)'
      : mood === 'rough'
        ? 'saturate(0.85)'
        : 'none'

  return (
    <motion.div
      className="pet-avatar"
      animate={bodyAnim}
      transition={bodyTransition}
      style={{ filter }}
    >
      <div className="pet-shell">
        <div className="pet-screen">
          <svg
            className="pet-svg"
            viewBox="0 0 100 100"
            aria-hidden
            focusable="false"
          >
            <defs>
              <linearGradient id="petBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe8f0" />
                <stop offset="55%" stopColor="#ffd0e0" />
                <stop offset="100%" stopColor="#ffb8d4" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="56" rx="38" ry="34" fill="url(#petBody)" />
            <ellipse cx="50" cy="56" rx="38" ry="34" fill="none" stroke="#ff9ec4" strokeWidth="2" opacity="0.5" />

            <motion.g
              animate={{ scaleY: eyeScaleY }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <ellipse cx="36" cy="46" rx="7" ry="9" fill="#3d3550" />
              <ellipse cx="64" cy="46" rx="7" ry="9" fill="#3d3550" />
              {(mood === 'bliss' || mood === 'happy') && (
                <>
                  <ellipse cx="33" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.9" />
                  <ellipse cx="61" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.9" />
                </>
              )}
            </motion.g>

            <motion.path
              d={mouthPath}
              fill="none"
              stroke="#3d3550"
              strokeWidth="3"
              strokeLinecap="round"
              initial={false}
              animate={{ d: mouthPath }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />

            {health < 38 && (
              <g className="pet-injury">
                <rect x="58" y="28" width="22" height="10" rx="3" fill="#fff5f5" stroke="#ffb4b4" strokeWidth="1.2" />
                <line x1="62" y1="33" x2="76" y2="33" stroke="#ff8fab" strokeWidth="1.2" />
              </g>
            )}

            {hunger < 35 && (
              <text x="78" y="24" fontSize="14" className="pet-hunger-emoji">
                💧
              </text>
            )}
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
