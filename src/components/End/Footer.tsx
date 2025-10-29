'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="relative isolate overflow-hidden">
      <div className="" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1 md:col-span-2"
          >
            <h3 className="text-2xl font-semibold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-emerald-300">
                AILand
              </span>
            </h3>
            <p className="text-gray-400 dark:text-gray-500 leading-relaxed mb-6">
              Visualize your knowledge in immersive 3D & AR. Transform data into insights with AI-powered graph visualization.
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Demo', 'Our Team', ''].map((item, i) => (
                <li key={i}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 dark:text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-300 hover:to-emerald-300 transition-all"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            
            <h4 className="text-white text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-300 hover:to-emerald-300 transition-all"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 dark:text-gray-600 text-sm">
            © {currentYear} AILand. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 dark:text-gray-600 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-600 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}