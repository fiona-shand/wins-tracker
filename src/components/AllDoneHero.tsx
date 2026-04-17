import { motion } from 'motion/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

/** Shown when every tracked habit is complete for the day — calm, celebratory, brief motion. */
export function AllDoneHero() {
  return (
    <motion.div
      className="all-done-hero"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.85 }}
    >
      <motion.div
        className="all-done-hero-icon-wrap"
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 22,
          delay: 0.06,
        }}
      >
        <CheckCircleIcon className="all-done-hero-icon" aria-hidden />
      </motion.div>
      <p className="all-done-hero-title">You&apos;re all caught up</p>
      <p className="all-done-hero-sub">Every habit is checked off for today.</p>
      <div className="all-done-hero-sparkles" aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </motion.div>
  )
}
