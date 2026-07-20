import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Reveal from './Reveal'
import type { LanguageItem, SkillItem } from '../lib/supabase'

interface SkillsProps {
  skills: SkillItem[]
  languages: LanguageItem[]
  facts: string[]
}

export default function Skills({ skills, languages, facts }: SkillsProps) {
  const barsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(barsRef, { once: true, amount: 0.3 })

  return (
    <section className="py-24 lg:py-36">
      <div className="wrap">
        <Reveal>
          <div className="sec-label">05 / Credentials</div>
          <h2 className="sec-title">
            Skills &amp; <span className="grad-text-bright">proficiency</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <Reveal>
            <div ref={barsRef}>
              {skills.map((s) => (
                <div key={s.name} className="mb-6">
                  <div className="mb-2.5 flex justify-between text-[0.78rem] font-semibold uppercase tracking-[0.14em]">
                    <b className="font-medium">{s.name}</b>
                    <span className="text-blue">{s.level}%</span>
                  </div>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-[#E6EAF9]">
                    <i
                      className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1200ms] ease-out"
                      style={{
                        width: inView ? `${Math.min(Math.max(s.level, 0), 100)}%` : '0%',
                        background: 'linear-gradient(90deg,#0030CC,#2E6BFF)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {languages.length > 0 && (
              <div className="mb-5 admin-card">
                <h3 className="mb-4 flex items-center gap-2.5 font-disp text-[0.95rem] uppercase tracking-wide before:block before:h-2 before:w-2 before:bg-blue before:content-['']">
                  Languages
                </h3>
                {languages.map((l, i) => (
                  <div
                    key={`${l.name}-${i}`}
                    className={`flex justify-between py-2.5 text-[0.92rem] font-medium ${
                      i < languages.length - 1 ? 'border-b border-dashed border-line' : ''
                    }`}
                  >
                    {l.name}
                    <span className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-peri">{l.level}</span>
                  </div>
                ))}
              </div>
            )}
            {facts.length > 0 && (
              <div className="admin-card">
                <h3 className="mb-4 flex items-center gap-2.5 font-disp text-[0.95rem] uppercase tracking-wide before:block before:h-2 before:w-2 before:bg-blue before:content-['']">
                  Quick facts
                </h3>
                {facts.map((f, i) => (
                  <div key={i} className="flex items-baseline gap-3 py-2 text-[0.93rem] text-muted">
                    <span className="text-[0.8rem] text-blue">✦</span>
                    {f}
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
