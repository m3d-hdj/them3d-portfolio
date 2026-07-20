import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import { DISCIPLINES } from '../lib/content'

export default function Disciplines() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 lg:py-36" id="skills">
      <div className="wrap">
        <Reveal>
          <div className="sec-label">03 / Toolkit</div>
          <h2 className="sec-title">
            Creative <span className="grad-text-bright">disciplines</span>
          </h2>
          <p className="mb-12 max-w-[560px] text-muted">Click any discipline to see tools and deliverables.</p>
        </Reveal>

        <div className="border-t border-line">
          {DISCIPLINES.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.04}>
              <div className="border-b border-line">
                <button
                  className="grid w-full grid-cols-[44px_1fr_auto_32px] items-center gap-3 px-2 py-6 text-left transition-all hover:pl-5 sm:grid-cols-[56px_1fr_auto_32px] sm:gap-8"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-[0.76rem] font-semibold tracking-[0.14em] text-[#9AA3C8]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-disp text-[clamp(1.1rem,2.8vw,1.8rem)] uppercase text-ink">{d.name}</span>
                  <span className="whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-blue">
                    {d.count}
                  </span>
                  <span
                    className={`text-center text-2xl leading-none transition-transform duration-300 ${
                      open === i ? 'rotate-45 text-blue' : 'text-[#9AA3C8]'
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-8 px-2 pb-8 text-[0.93rem] text-muted sm:pl-[88px] lg:gap-20">
                        <div>
                          <h4 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink">
                            Tools
                          </h4>
                          {d.tools}
                        </div>
                        <div>
                          <h4 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink">
                            Deliverables
                          </h4>
                          {d.deliverables}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
