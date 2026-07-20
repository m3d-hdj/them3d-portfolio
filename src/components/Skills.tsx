import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Reveal from './Reveal'
import type { LanguageItem, SkillItem } from '../lib/supabase'

interface SkillsProps {
  skills: SkillItem[]
  languages: LanguageItem[]
  facts: string[]
}

/** Map a free-text language level to a bar width. */
function langWidth(level: string): number {
  const l = level.toLowerCase()
  if (l.includes('native')) return 100
  if (l.includes('fluent')) return 85
  if (l.includes('conversational')) return 60
  if (l.includes('intermediate')) return 55
  if (l.includes('basic') || l.includes('beginner')) return 35
  return 75
}

const GLOW_BAR: React.CSSProperties = {
  background: 'linear-gradient(90deg,#0045DF,#2E6BFF)',
  boxShadow: '0 0 14px rgba(46,107,255,.75), 0 0 4px rgba(46,107,255,.9)',
}

function GlowRow({
  name,
  valueLabel,
  width,
  inView,
}: {
  name: string
  valueLabel: string
  width: number
  inView: boolean
}) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <b className="text-[0.98rem] font-medium text-white">{name}</b>
        <span className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#A9C4FF]">
          {valueLabel}
        </span>
      </div>
      <div className="relative h-[3px] rounded-full bg-white/10">
        <i
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1200ms] ease-out"
          style={{ ...GLOW_BAR, width: inView ? `${Math.min(Math.max(width, 0), 100)}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export default function Skills({ skills, languages, facts }: SkillsProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, amount: 0.2 })

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-36"
      style={{
        background:
          'radial-gradient(900px 420px at 85% 8%, rgba(0,69,223,.28), transparent 55%),' +
          'radial-gradient(700px 520px at 4% 96%, rgba(88,80,224,.2), transparent 55%),' +
          '#0B0B2A',
      }}
    >
      <div className="wrap">
        <Reveal>
          <div className="sec-label">05 / Credentials</div>
          <h2 className="sec-title text-white">
            Skills &amp; <span className="grad-text-bright">proficiency</span>
          </h2>
        </Reveal>

        <div ref={gridRef} className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <Reveal>
            <div>
              {skills.map((s) => (
                <GlowRow key={s.name} name={s.name} valueLabel={`${s.level}%`} width={s.level} inView={inView} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {languages.length > 0 && (
              <div className="mb-6 rounded-xl border border-white/10 bg-white/[.045] p-7 backdrop-blur-sm sm:p-8">
                <h3 className="mb-6 flex items-center gap-2.5 font-disp text-[0.95rem] uppercase tracking-wide text-white before:block before:h-2 before:w-2 before:bg-blue-bright before:content-['']">
                  Languages
                </h3>
                {languages.map((l, i) => (
                  <GlowRow
                    key={`${l.name}-${i}`}
                    name={l.name}
                    valueLabel={l.level}
                    width={langWidth(l.level)}
                    inView={inView}
                  />
                ))}
              </div>
            )}
            {facts.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[.045] p-7 backdrop-blur-sm sm:p-8">
                <h3 className="mb-4 flex items-center gap-2.5 font-disp text-[0.95rem] uppercase tracking-wide text-white before:block before:h-2 before:w-2 before:bg-blue-bright before:content-['']">
                  Quick facts
                </h3>
                {facts.map((f, i) => (
                  <div key={i} className="flex items-baseline gap-3 py-2 text-[0.93rem] text-[#B8C2E8]">
                    <span className="text-[0.8rem] text-blue-bright">✦</span>
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
