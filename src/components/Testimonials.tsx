import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { sb, type Testimonial } from '../lib/supabase'
import { FALLBACK_TESTIMONIALS } from '../lib/content'

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS)

  useEffect(() => {
    sb.from('testimonials')
      .select('*')
      .order('sort', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length) setItems(data as Testimonial[])
      })
  }, [])

  return (
    <section className="border-t border-line bg-canvas py-24 lg:py-36">
      <div className="wrap">
        <Reveal>
          <div className="sec-label">04 / Feedback</div>
          <h2 className="sec-title">
            What clients <span className="grad-text-bright">say</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-5 rounded-md border border-line bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-blue hover:shadow-card sm:p-9">
                <span className="grad-text-bright font-disp text-5xl leading-[0.6]">“</span>
                <p className="text-[1.06rem] font-medium italic leading-relaxed text-ink">{t.quote}</p>
                <div className="mt-auto text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted">
                  <b className="mb-0.5 block font-bold text-blue">{t.author}</b>
                  {t.role}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
