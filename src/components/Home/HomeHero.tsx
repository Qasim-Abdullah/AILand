'use client'
import dynamic from 'next/dynamic'
import NodeStyles from './NodeStyle'
import FeatureBoxes from './FeatureBoxes'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ThreeGraphBG = dynamic(() => import('./ThreeGraphBG'), { ssr: false })

export default function HomeHero() {
  const t1 = 'Visualize your knowledge.'
  const t2 = 'Understand your world.'
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setS1(t1.slice(0, i))
      setS2(t2.slice(0, i))
      if (i >= Math.max(t1.length, t2.length)) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(id)
  }, [])

  const done = s1.length === t1.length && s2.length === t2.length

  return (
    <section className="relative isolate overflow-hidden pt-10">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute inset-0 -z-10"
      >
        <ThreeGraphBG />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-7xl px-6 py-28 sm:py-36 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-800 dark:text-white sm:text-6xl">
            <span>{s1}</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-emerald-300">
              {s2}
            </span>
            <span className={`${blink && !done ? 'opacity-100' : 'opacity-0'}`}>│</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-white/70"
          >
            Upload RDF, JSON-LD, or CSV and watch it come alive in immersive 3D & AR. Let AI reveal patterns, connections, and hidden insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-medium text-white dark:text-black bg-gradient-to-r from-emerald-300 to-violet-300 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_18px_40px_-12px_rgba(16,185,129,0.7)] transition-all"
            >
              Try the Demo
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.293 5.293a1 1 0 0 1 1.414 0l4 4a1.001 1.001 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L14.586 11H4a1 1 0 1 1 0-2h10.586l-2.293-2.293a1 1 0 0 1 0-1.414Z" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <FeatureBoxes />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <NodeStyles />
      </motion.div>
    </section>
  )
}
