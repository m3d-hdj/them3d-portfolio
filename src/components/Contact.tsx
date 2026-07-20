import { useState, type FormEvent } from 'react'
import Reveal from './Reveal'
import { sb, type GeneralSettings, type SocialsSettings } from '../lib/supabase'

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  behance: 'Behance',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X / Twitter',
  linkedin: 'LinkedIn',
}

interface ContactProps {
  general: GeneralSettings
  socials: SocialsSettings
}

export default function Contact({ general, socials }: ContactProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', body: '', company: '' })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.company) {
      setStatus('sent') // honeypot — quietly swallow bots
      return
    }
    setStatus('sending')
    const { error } = await sb.from('messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      body: form.body.trim(),
    })
    setStatus(error ? 'error' : 'sent')
  }

  const socialEntries = Object.entries(SOCIAL_LABELS)

  return (
    <footer
      id="contact"
      className="relative overflow-hidden pb-10 pt-24 text-white lg:pt-36"
      style={{ background: 'linear-gradient(160deg,#18189C 0%,#1E2BC4 45%,#0045DF 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(900px 400px at 50% 120%, rgba(255,255,255,.14), transparent 60%)' }}
      />
      <div className="wrap relative z-10">
        <Reveal>
          <p className="mb-5 text-center text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-white/65">
            ✦ Got a project in mind? ✦
          </p>
          <h2 className="text-center font-disp text-[clamp(2.3rem,7.5vw,6.2rem)] uppercase leading-[0.98] tracking-tight">
            Let's make
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,.85)' }}>
              something loud
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-11 max-w-[640px] rounded-xl bg-white p-6 text-left shadow-lift sm:p-10">
            {status === 'sent' ? (
              <div className="py-8 text-center">
                <div className="text-4xl">🎬</div>
                <h4 className="mb-1 mt-3 font-disp text-lg uppercase text-ink">Message sent</h4>
                <p className="text-[0.9rem] text-muted">Thanks — I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="font-disp text-lg uppercase text-ink">Start a project</h3>
                <p className="text-[0.88rem] text-muted">Tell me what you're making — I usually reply within 24h.</p>
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
                <label className="field-label" htmlFor="cf-name">
                  Your name
                </label>
                <input
                  id="cf-name"
                  className="field"
                  required
                  placeholder="e.g. Sarah from Nova Studio"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <label className="field-label" htmlFor="cf-email">
                  Your email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  className="field"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <label className="field-label" htmlFor="cf-body">
                  Project details
                </label>
                <textarea
                  id="cf-body"
                  className="field min-h-[120px] resize-y"
                  required
                  placeholder="What do you need? Video edit, brand identity, motion design... deadlines, links, anything useful."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
                {status === 'error' && (
                  <p className="mt-3 text-[0.85rem] font-medium text-[#E02D2D]">
                    Could not send — please email me directly at {general.email}.
                  </p>
                )}
                <button className="btn-solid mt-6 w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message ✦'}
                </button>
              </form>
            )}
          </div>
          <p className="mt-4 text-center text-[0.78rem] text-white/75">
            or email me directly —{' '}
            <a href={`mailto:${general.email}`} className="text-white underline">
              {general.email}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-wrap justify-center gap-3 sm:gap-4">
            {socialEntries.map(([key, label]) => {
              const url = socials[key]
              return url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/30 px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80 transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-blue"
                >
                  {label}
                </a>
              ) : (
                <span
                  key={key}
                  className="cursor-default rounded-full border border-white/15 px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/35"
                  title="Add this link from the admin panel"
                >
                  {label}
                </span>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/60">
          <span>© {new Date().getFullYear()} TheM3d — All rights reserved</span>
          <span className="flex gap-1.5" title="Print never dies">
            <i className="h-2.5 w-2.5 rounded-full bg-[#00B7EB]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#EC008C]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#FFEF00]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#10102E]" />
          </span>
          <span>Video Editor ✦ Graphic Designer</span>
        </div>
      </div>
    </footer>
  )
}
