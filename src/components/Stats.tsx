import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import type { Stat } from '../lib/supabase'

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t0 = performance.now()
    const dur = 1600
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  return <span ref={ref}>{value}</span>
}

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="grad-block relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(700px 300px at 85% 0%, rgba(255,255,255,.1), transparent 60%)' }}
      />
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-10 sm:px-10 sm:py-14 ${i > 0 ? 'border-l border-white/20' : ''} ${
              i > 1 ? 'max-lg:border-t max-lg:border-white/20' : ''
            } ${i === 2 ? 'max-lg:border-l-0' : ''}`}
          >
            <div className="font-disp text-[clamp(2.4rem,5vw,4rem)] leading-none text-white">
              <Counter target={s.value} />
              <em className="not-italic text-[#A9C4FF]">{s.suffix}</em>
            </div>
            <div className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/65">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
