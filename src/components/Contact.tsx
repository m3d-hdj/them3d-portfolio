import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import Reveal from './Reveal'
import { sb, type GeneralSettings, type SocialsSettings } from '../lib/supabase'

const PROJECT_TYPES = ['Video Editing', 'Branding', 'Social Media', 'UI/UX', 'Other']
const BUDGETS = ['< $500', '$500 – $1.5k', '$1.5k – $5k', '$5k+', "Let's discuss"]

const FIELD =
  'w-full rounded-md border border-white/15 bg-[#0A0A24] px-3.5 py-3 font-body text-[0.95rem] text-white placeholder-[#565B85] transition-colors focus:border-blue-bright focus:outline-none'
const LABEL = 'mb-2 mt-5 block text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-peri'

/** Live REC timecode (HH:MM:SS:FF @ 24fps) for the availability card. */
function RecTimecode() {
  const [tc, setTc] = useState('00:00:00:00')
  useEffect(() => {
    const t0 = Date.now()
    const id = window.setInterval(() => {
      const ms = Date.now() - t0
      const f = Math.floor((ms % 1000) / (1000 / 24))
      const s = Math.floor(ms / 1000)
      const pad = (n: number) => String(n).padStart(2, '0')
      setTc(`${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`)
    }, 1000 / 24)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap rounded border border-white/15 bg-black/30 px-2.5 py-1 text-[0.66rem] font-semibold tracking-[0.14em] text-white/80">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B3B]" style={{ animation: 'dotpulse 1.2s infinite' }} />
      REC {tc}
    </span>
  )
}

function InfoCard({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-white/10 bg-white/[.045] p-6 backdrop-blur-sm sm:p-7">{children}</div>
}

const SOCIAL_ICONS: Record<string, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  behance: <span className="text-[0.82rem] font-bold">Bē</span>,
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.2 9.3v5.4L15 12l-4.8-2.7Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: <span className="text-[0.95rem] font-bold">♪</span>,
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M5 4l14 16M19 4L5 20" />
    </svg>
  ),
  linkedin: <span className="text-[0.8rem] font-bold">in</span>,
}

function whatsappHref(v: string): string {
  const t = v.trim()
  if (/^https?:\/\//i.test(t)) return t
  const digits = t.replace(/[^\d]/g, '')
  return `https://wa.me/${digits}`
}

interface ContactProps {
  general: GeneralSettings
  socials: SocialsSettings
}

export default function Contact({ general, socials }: ContactProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    body: '',
    company: '',
    projectType: PROJECT_TYPES[0],
    budget: BUDGETS[1],
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.company) {
      setStatus('sent') // honeypot
      return
    }
    setStatus('sending')
    const { error } = await sb.from('messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      body: form.body.trim(),
      project_type: form.projectType,
      budget: form.budget,
    })
    setStatus(error ? 'error' : 'sent')
  }

  const socialEntries = Object.entries(SOCIAL_ICONS).filter(([key]) => socials[key]?.trim())

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/10 pb-10 pt-24 text-white lg:pt-32"
      style={{
        background:
          'radial-gradient(1000px 500px at 15% 0%, rgba(0,69,223,.16), transparent 55%),' +
          'radial-gradient(800px 500px at 95% 90%, rgba(88,80,224,.14), transparent 55%),' +
          '#08081F',
      }}
    >
      <div className="wrap relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          {/* ---------- left: slate form ---------- */}
          <div>
            <Reveal>
              <div className="sec-label">06 / Get in touch · Roll camera</div>
              <h2 className="sec-title text-white">
                Let's <span className="grad-text-bright">roll</span>
              </h2>
              <p className="mb-9 max-w-[560px] text-[0.98rem] text-[#9AA3CE]">
                Every great edit starts with a brief. Fill out the slate and I'll get back with a custom plan
                {socials.whatsapp?.trim() ? ' — or jump straight to WhatsApp.' : '.'}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div
                className="overflow-hidden rounded-xl border border-white/12 bg-[#0D0D2B] shadow-[0_30px_70px_-30px_rgba(0,0,0,.7)]"
                style={{ colorScheme: 'dark' }}
              >
                {/* clapperboard stripes */}
                <div
                  className="h-[26px]"
                  style={{ background: 'repeating-linear-gradient(-55deg, #ECEFF8 0 24px, #0A0A1E 24px 48px)' }}
                />
                {/* slate header */}
                <div className="grid grid-cols-3 border-b border-white/10 bg-black/25">
                  {[
                    ['Production', 'THEM3D'],
                    ['Scene', 'NEW PROJECT'],
                    ['Roll', 'A001'],
                  ].map(([k, v], i) => (
                    <div key={k} className={`px-4 py-3 ${i > 0 ? 'border-l border-white/10' : ''}`}>
                      <div className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-[#565B85]">{k}</div>
                      <div className="mt-0.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-blue-bright">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 sm:p-8">
                  {status === 'sent' ? (
                    <div className="py-10 text-center">
                      <div className="text-4xl">🎬</div>
                      <h4 className="mb-1 mt-4 font-disp text-lg uppercase text-white">That's a wrap</h4>
                      <p className="text-[0.9rem] text-[#9AA3CE]">Your brief is in — I'll get back to you within 24h.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      {/* honeypot */}
                      <input
                        type="text"
                        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                      <div className="grid gap-x-5 sm:grid-cols-2">
                        <div>
                          <label className={LABEL} htmlFor="cf-name">
                            Name
                          </label>
                          <input
                            id="cf-name"
                            className={FIELD}
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={LABEL} htmlFor="cf-email">
                            Email
                          </label>
                          <input
                            id="cf-email"
                            type="email"
                            className={FIELD}
                            required
                            placeholder="you@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={LABEL} htmlFor="cf-type">
                            Project type
                          </label>
                          <select
                            id="cf-type"
                            className={FIELD}
                            value={form.projectType}
                            onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                          >
                            {PROJECT_TYPES.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={LABEL} htmlFor="cf-budget">
                            Budget range
                          </label>
                          <select
                            id="cf-budget"
                            className={FIELD}
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          >
                            {BUDGETS.map((b) => (
                              <option key={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <label className={LABEL} htmlFor="cf-body">
                        Message
                      </label>
                      <textarea
                        id="cf-body"
                        className={`${FIELD} min-h-[130px] resize-y`}
                        required
                        placeholder="Tell me about your project..."
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                      />
                      {status === 'error' && (
                        <p className="mt-3 text-[0.85rem] font-medium text-[#FF6B6B]">
                          Could not send — please email me directly at {general.email}.
                        </p>
                      )}
                      <button
                        className="mt-7 w-full rounded-lg py-4 text-[0.8rem] font-bold uppercase tracking-[0.3em] text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                        style={{
                          background: 'linear-gradient(90deg,#0045DF,#2E6BFF)',
                          boxShadow: '0 12px 30px -10px rgba(0,69,223,.6)',
                        }}
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? 'Sending…' : 'Send message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---------- right: info cards ---------- */}
          <div className="space-y-5 lg:pt-24">
            <Reveal delay={0.12}>
              <InfoCard>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white">
                    <span
                      className={`h-2 w-2 rounded-full ${general.available ? 'bg-[#4AE884]' : 'bg-[#FF6B6B]'}`}
                      style={{ animation: 'dotpulse 1.8s infinite' }}
                    />
                    {general.available ? 'Available for work' : 'Currently booked'}
                  </span>
                  <RecTimecode />
                </div>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-[#9AA3CE]">
                  Currently booking new video, brand and social projects worldwide. Typical reply time: under 24h.
                </p>
              </InfoCard>
            </Reveal>

            {socials.whatsapp?.trim() && (
              <Reveal delay={0.16}>
                <a
                  href={whatsappHref(socials.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-xl border border-[#25D366]/50 bg-[#0C2916] py-4 text-[0.78rem] font-bold uppercase tracking-[0.26em] text-[#4AE884] transition-all hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-[#062B12]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[18px] w-[18px]">
                    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <InfoCard>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-peri">Direct line</div>
                <a
                  href={`mailto:${general.email}`}
                  className="mt-3 block text-[1.02rem] font-semibold text-white transition-colors hover:text-blue-bright"
                >
                  {general.email}
                </a>
                <div className="mt-1 text-[0.85rem] text-[#9AA3CE]">{general.location}</div>
              </InfoCard>
            </Reveal>

            <Reveal delay={0.24}>
              <InfoCard>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-peri">
                  On set elsewhere
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialEntries.map(([key]) => (
                    <a
                      key={key}
                      href={key === 'whatsapp' ? whatsappHref(socials[key]) : socials[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={key}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:-translate-y-0.5 hover:border-blue-bright hover:text-blue-bright"
                    >
                      {SOCIAL_ICONS[key]}
                    </a>
                  ))}
                  <a
                    href={`mailto:${general.email}`}
                    title="Email"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:-translate-y-0.5 hover:border-blue-bright hover:text-blue-bright"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </a>
                </div>
              </InfoCard>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/50">
          <span>© {new Date().getFullYear()} TheM3d — All rights reserved</span>
          <span className="flex gap-1.5" title="Print never dies">
            <i className="h-2.5 w-2.5 rounded-full bg-[#00B7EB]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#EC008C]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#FFEF00]" />
            <i className="h-2.5 w-2.5 rounded-full bg-white/25" />
          </span>
          <span>Video Editor ✦ Graphic Designer</span>
        </div>
      </div>
    </footer>
  )
}
