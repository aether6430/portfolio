import type { ComponentPropsWithoutRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { smoothEase, usePointerFine } from './motion-utils'

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: smoothEase,
    },
  },
}

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: smoothEase,
    },
  },
}

type MotionSectionProps = ComponentPropsWithoutRef<typeof motion.section>

export function MotionSection({ children, className, ...props }: MotionSectionProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.22 }}
      variants={sectionVariants}
      {...props}
    >
      {children}
    </motion.section>
  )
}

type StaggerGroupProps = ComponentPropsWithoutRef<typeof motion.div>

export function StaggerGroup({ children, className, ...props }: StaggerGroupProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.18 }}
      variants={staggerVariants}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = ComponentPropsWithoutRef<typeof motion.div>

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div className={className} variants={reduceMotion ? undefined : itemVariants} {...props}>
      {children}
    </motion.div>
  )
}

export function RevealWords({ text, className }: { text: string, className?: string }) {
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  if (reduceMotion) {
    return <p className={className}>{text}</p>
  }

  return (
    <motion.p className={className} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.7 }} variants={staggerVariants}>
      {words.map((word, index) => (
        <motion.span key={`${word}-${index}`} variants={itemVariants} className="inline-block">
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.p>
  )
}

export function AnimatedQuote({ quote, author }: { quote: string, author: string }) {
  const reduceMotion = useReducedMotion()
  const words = quote.split(' ')
  const quoteTextClass = 'text-app-text-muted'
  const quoteMarkClass = 'text-app-text-subtle'
  const authorClass = 'text-app-text-muted'

  if (reduceMotion) {
    return (
      <>
        <div className={`text-4xl ${quoteMarkClass}`}>"</div>
        <p className={`max-w-md italic text-lg leading-relaxed ${quoteTextClass}`}>{quote}</p>
        <p className={`text-sm ${authorClass}`}>-- {author} --</p>
      </>
    )
  }

  return (
    <>
      <motion.div
        className={`quote-mark text-4xl ${quoteMarkClass}`}
        initial={{ opacity: 0, scale: 0.45 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: smoothEase }}
        viewport={{ once: true, amount: 0.5 }}
      >
        "
      </motion.div>
      <motion.p
        className={`max-w-md italic text-lg leading-relaxed ${quoteTextClass}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerVariants}
      >
        {words.map((word, index) => (
          <motion.span key={`${word}-${index}`} variants={itemVariants} className="inline-block">
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </motion.p>
      <motion.p
        className={`text-sm ${authorClass}`}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: smoothEase, delay: 0.15 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        -- {author} --
      </motion.p>
    </>
  )
}

export function CursorTrail() {
  const reduceMotion = useReducedMotion()
  const isFinePointer = usePointerFine()
  const [isInteractive, setIsInteractive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 160, damping: 18, mass: 0.25 })
  const ringY = useSpring(y, { stiffness: 160, damping: 18, mass: 0.25 })
  const dotX = useSpring(x, { stiffness: 300, damping: 24, mass: 0.15 })
  const dotY = useSpring(y, { stiffness: 300, damping: 24, mass: 0.15 })

  useEffect(() => {
    if (!isFinePointer || reduceMotion) {
      return
    }

    document.documentElement.classList.add('cursor-none')
    document.body.classList.add('cursor-none')

    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, summary'

    const over = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      setIsInteractive(Boolean(target.closest(interactiveSelector)))
    }

    const out = (event: PointerEvent) => {
      const target = event.target
      const relatedTarget = event.relatedTarget

      if (!(target instanceof Element)) {
        return
      }

      const wasInteractive = Boolean(target.closest(interactiveSelector))
      const stillInteractive = relatedTarget instanceof Element && Boolean(relatedTarget.closest(interactiveSelector))
      if (wasInteractive && !stillInteractive) {
        setIsInteractive(false)
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerout', out, { passive: true })

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerout', out)
      document.documentElement.classList.remove('cursor-none')
      document.body.classList.remove('cursor-none')
    }
  }, [isFinePointer, reduceMotion, x, y])

  if (!isFinePointer || reduceMotion) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      <motion.div
        className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full backdrop-blur-[1px] ${
          isInteractive ? 'cursor-ring-interactive' : 'cursor-ring-idle'
        }`}
        animate={{ scale: isInteractive ? 1.45 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        style={{
          left: ringX,
          top: ringY,
        }}
      />
      <motion.div
        className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
          isInteractive ? 'cursor-dot-interactive' : 'cursor-dot-idle'
        }`}
        animate={{
          scale: isInteractive ? 0.7 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{
          left: dotX,
          top: dotY,
        }}
      />
    </div>
  )
}
