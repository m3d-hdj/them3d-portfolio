import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from './Reveal'
import Lightbox from './Lightbox'
import { sb, type Project } from '../lib/supabase'
import { FALLBACK_PROJECTS } from '../lib/content'

export default function Work() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS)
  const [isDemo, setIsDemo] = useState(true)
  const [filter, setFilter] = useState<string>('All')
  const [active, setActive] = useState<Project | null>(null)

  useEffect(() => {
    sb.from('projects')
      .select('*')
      .order('sort', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length) {
          setProjects(data as Project[])
          setIsDemo(false)
        }
      })
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[]
    return ['All', ...cats]
  }, [projects])

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section className="border-t border-line bg-canvas py-24 lg:py-36" id="work">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="sec-label">02 / Portfolio</div>
              <h2 className="sec-title">
                Selected <span className="grad-text-bright">work</span>
              </h2>
              {isDemo && (
                <p className="max-w-[560px] text-muted">
                  Demo projects — add your real work from the admin panel and these disappear.
                </p>
              )}
            </Reveal>
          </div>
          <Reveal>
            <a href="#contact" className="btn-ghost">
              Full portfolio on request ↗
            </a>
          </Reveal>
        </div>

        {categories.length > 2 && (
          <Reveal className="mt-9 flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-all ${
                  filter === c
                    ? 'border-blue bg-blue text-white'
                    : 'border-line bg-white text-muted hover:border-blue hover:text-blue'
                }`}
                style={{ padding: '8px 18px' }}
              >
                {c}
              </button>
            ))}
          </Reveal>
        )}

        <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-9">
          {visible.map((p, i) => {
            const clickable = Boolean(p.video_url || p.thumb_url)
            return (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
                className={`group relative overflow-hidden rounded-md border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-blue hover:shadow-card ${
                  clickable ? 'cursor-pointer' : ''
                }`}
                onClick={() => clickable && setActive(p)}
              >
                <span className="absolute left-3.5 top-3.5 z-10 rounded border border-line bg-white/90 px-2.5 py-1 text-[0.66rem] font-semibold tracking-[0.18em] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative aspect-video overflow-hidden">
                  {p.thumb_url ? (
                    <img
                      src={p.thumb_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="grad-block flex h-full w-full items-center justify-center font-disp text-3xl uppercase text-white/85">
                      {(p.category || 'M3D').slice(0, 12)}
                    </div>
                  )}
                  {clickable && (
                    <span className="absolute bottom-3.5 right-3.5 translate-y-2 rounded bg-blue px-3.5 py-2 text-[0.68rem] font-semibold tracking-[0.18em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {p.video_url ? 'PLAY ▶' : 'VIEW ↗'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
                  <span className="font-disp text-[0.98rem] uppercase">{p.title}</span>
                  <span className="whitespace-nowrap text-[0.66rem] font-medium uppercase tracking-[0.14em] text-muted">
                    {p.category}
                    {p.year && (
                      <>
                        {' '}
                        <i className="not-italic text-blue">✦</i> {p.year}
                      </>
                    )}
                  </span>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
      <Lightbox project={active} onClose={() => setActive(null)} />
    </section>
  )
}
