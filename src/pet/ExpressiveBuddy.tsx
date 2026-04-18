import { motion } from 'motion/react'
import { useId } from 'react'
import type { PetMood } from './petStore'

type Props = {
  mood: PetMood
  /** No habits on the list — buddy is asleep until you add some. */
  asleep?: boolean
}

const mouthD: Record<PetMood, string> = {
  bliss: 'M 28 56 Q 50 74 72 56',
  happy: 'M 30 55 Q 50 68 70 55',
  ok: 'M 34 57 Q 50 63 66 57',
  meh: 'M 36 59 H 64',
  sad: 'M 32 61 Q 50 50 68 61',
  rough: 'M 30 60 Q 38 54 50 60 T 70 57',
  critical: 'M 26 58 L 36 66 L 50 56 L 64 66 L 74 58',
}

export function ExpressiveBuddy({ mood, asleep }: Props) {
  const raw = useId().replace(/:/g, '')
  const gBody = `buddy-body-${raw}`
  const gBlush = `buddy-blush-${raw}`

  const mouthStroke = mood === 'meh' ? 2.4 : mood === 'critical' ? 2.6 : 2.2

  if (asleep) {
    return (
      <svg className="pet-buddy-svg" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id={gBody} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#ffe8f3" />
            <stop offset="45%" stopColor="#f8b8d8" />
            <stop offset="100%" stopColor="#e895be" />
          </linearGradient>
        </defs>
        <motion.ellipse
          cx={50}
          cy={57}
          fill={`url(#${gBody})`}
          stroke="rgba(10,10,10,0.11)"
          strokeWidth={1}
          initial={false}
          animate={{
            rx: [37, 38.5, 37],
            ry: [33, 34.2, 33],
            cy: [57, 57.5, 57],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <g stroke="#141414" strokeWidth={2} strokeLinecap="round" fill="none">
          <path d="M 33 46 Q 40 44 47 46" opacity={0.85} />
          <path d="M 53 46 Q 60 44 67 46" opacity={0.85} />
        </g>
        <ellipse
          cx={50}
          cy={58.5}
          rx={3.2}
          ry={2.6}
          fill="none"
          stroke="#141414"
          strokeWidth={1.85}
          opacity={0.75}
        />
        <motion.g
          initial={{ opacity: 0.25 }}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <text
            x={72}
            y={30}
            fill="#141414"
            fontSize={11}
            fontWeight={700}
            fontFamily="system-ui, sans-serif"
            style={{ userSelect: 'none' }}
          >
            z
          </text>
          <text
            x={79}
            y={23}
            fill="#141414"
            fontSize={9}
            fontWeight={700}
            fontFamily="system-ui, sans-serif"
            opacity={0.85}
            style={{ userSelect: 'none' }}
          >
            z
          </text>
          <text
            x={85}
            y={17}
            fill="#141414"
            fontSize={7}
            fontWeight={700}
            fontFamily="system-ui, sans-serif"
            opacity={0.7}
            style={{ userSelect: 'none' }}
          >
            z
          </text>
        </motion.g>
      </svg>
    )
  }

  return (
    <svg className="pet-buddy-svg" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={gBody} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ffe8f3" />
          <stop offset="45%" stopColor="#f8b8d8" />
          <stop offset="100%" stopColor="#e895be" />
        </linearGradient>
        <radialGradient id={gBlush} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6ba8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff6ba8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Body */}
      <motion.ellipse
        cx={50}
        cy={56}
        fill={`url(#${gBody})`}
        stroke="rgba(10,10,10,0.11)"
        strokeWidth={1}
        initial={false}
        animate={{
          rx: mood === 'bliss' ? 40 : mood === 'critical' ? 35 : 38,
          ry: mood === 'bliss' ? 36 : mood === 'critical' ? 31 : 34,
          cy: mood === 'bliss' ? 55 : 56,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      />

      {/* Cheeks — bliss / happy */}
      {(mood === 'bliss' || mood === 'happy') && (
        <>
          <circle cx="30" cy="60" r="9" fill={`url(#${gBlush})`} />
          <circle cx="70" cy="60" r="9" fill={`url(#${gBlush})`} />
        </>
      )}

      {/* Brows */}
      {(mood === 'sad' || mood === 'rough' || mood === 'critical') && (
        <g
          stroke="#1f1f1f"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        >
          <motion.path
            initial={false}
            animate={{
              d:
                mood === 'rough' || mood === 'critical'
                  ? 'M 32 34 L 46 38'
                  : 'M 32 36 Q 40 32 48 36',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          />
          <motion.path
            initial={false}
            animate={{
              d:
                mood === 'rough' || mood === 'critical'
                  ? 'M 54 38 L 68 34'
                  : 'M 52 36 Q 60 32 68 36',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          />
        </g>
      )}

      {/* Eyes */}
      <Eyes mood={mood} />

      {/* Mouth */}
      <motion.path
        d={mouthD[mood]}
        fill="none"
        stroke="#141414"
        strokeWidth={mouthStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ d: mouthD[mood] }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </svg>
  )
}

function Eyes({ mood }: { mood: PetMood }) {
  if (mood === 'bliss') {
    /* Soft ^_^ arcs — control *above* the line so the curve smiles up (cuter than the old downward bulge). */
    return (
      <g stroke="#141414" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 33.5 48 Q 40 40 46.5 48" />
        <path d="M 53.5 48 Q 60 40 66.5 48" />
      </g>
    )
  }

  if (mood === 'critical') {
    return (
      <g stroke="#141414" strokeWidth={2.2} strokeLinecap="round">
        <path d="M 36 42 L 44 50 M 44 42 L 36 50" />
        <path d="M 56 42 L 64 50 M 64 42 L 56 50" />
      </g>
    )
  }

  const cy = mood === 'sad' ? 47 : mood === 'rough' ? 45.5 : 44
  const rx = mood === 'rough' ? 5.5 : 6.2
  const ry =
    mood === 'meh'
      ? 3.2
      : mood === 'sad'
        ? 5
        : mood === 'rough'
          ? 6.5
          : 8

  return (
    <g fill="#141414">
      <motion.ellipse
        cx={39}
        cy={cy}
        rx={rx}
        ry={ry}
        initial={false}
        animate={{ cx: 39, cy, rx, ry }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
      <motion.ellipse
        cx={61}
        cy={mood === 'rough' ? cy + 1.2 : cy}
        rx={mood === 'rough' ? rx - 0.8 : rx}
        ry={mood === 'rough' ? ry - 1 : ry}
        initial={false}
        animate={{
          cx: 61,
          cy: mood === 'rough' ? cy + 1.2 : cy,
          rx: mood === 'rough' ? rx - 0.8 : rx,
          ry: mood === 'rough' ? ry - 1 : ry,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
      {/* Highlights */}
      {(mood === 'happy' || mood === 'ok' || mood === 'meh') && (
        <>
          <ellipse cx="40.5" cy={cy - 2.2} rx="2" ry="2.2" fill="#ffffff" opacity={0.92} />
          <ellipse cx="62.5" cy={cy - 2.2} rx="2" ry="2.2" fill="#ffffff" opacity={0.92} />
        </>
      )}
    </g>
  )
}
