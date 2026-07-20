import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { sb } from '../lib/supabase'
import { LOGO_DATA_URI } from '../lib/logo'
import Login from '../admin/Login'
import ProjectsManager from '../admin/ProjectsManager'
import MessagesInbox from '../admin/MessagesInbox'
import SettingsEditor from '../admin/SettingsEditor'
import TestimonialsManager from '../admin/TestimonialsManager'
import AboutEditor from '../admin/AboutEditor'
import SkillsEditor from '../admin/SkillsEditor'

const TABS = ['Projects', 'About', 'Skills', 'Messages', 'Settings', 'Testimonials'] as const
type Tab = (typeof TABS)[number]

export interface Notify {
  (msg: string, type?: 'ok' | 'err'): void
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('Projects')
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const notify: Notify = (msg, type = 'ok') => {
    setToast({ msg, type })
    window.setTimeout(() => setToast(null), 3800)
  }

  return (
    <div className="min-h-svh bg-canvas">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-white px-6 py-3.5">
        <div className="flex items-center gap-3">
          <img src={LOGO_DATA_URI} alt="TheM3d" className="h-6 w-auto" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-peri">Admin Panel</span>
        </div>
        <div className="flex gap-2.5">
          <Link to="/" className="btn-ghost btn-sm">
            View site ↗
          </Link>
          {session && (
            <button className="btn-ghost btn-sm" onClick={() => sb.auth.signOut()}>
              Sign out
            </button>
          )}
        </div>
      </header>

      {!ready ? null : !session ? (
        <Login notify={notify} />
      ) : (
        <div className="mx-auto max-w-[980px] px-5 pb-20 pt-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full border px-5 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] transition-all ${
                  tab === t ? 'border-blue bg-blue text-white' : 'border-line bg-white text-muted hover:border-blue hover:text-blue'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Projects' && <ProjectsManager notify={notify} />}
          {tab === 'About' && <AboutEditor notify={notify} />}
          {tab === 'Skills' && <SkillsEditor notify={notify} />}
          {tab === 'Messages' && <MessagesInbox notify={notify} />}
          {tab === 'Settings' && <SettingsEditor notify={notify} />}
          {tab === 'Testimonials' && <TestimonialsManager notify={notify} />}
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[999] max-w-[92vw] -translate-x-1/2 rounded-full px-6 py-3 text-center text-[0.85rem] font-medium text-white ${
            toast.type === 'err' ? 'bg-[#E02D2D]' : 'bg-[#0E9F6E]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
