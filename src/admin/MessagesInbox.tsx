import { useEffect, useState } from 'react'
import { sb, type ContactMessage } from '../lib/supabase'
import type { Notify } from '../pages/Admin'

export default function MessagesInbox({ notify }: { notify: Notify }) {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null)

  const load = () => {
    sb.from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) return notify(error.message, 'err')
        setMessages((data as ContactMessage[]) ?? [])
      })
  }
  useEffect(load, [])

  const del = async (m: ContactMessage) => {
    if (!window.confirm('Delete this message?')) return
    const { error } = await sb.from('messages').delete().eq('id', m.id)
    if (error) return notify(error.message, 'err')
    notify('Message deleted')
    load()
  }

  if (!messages) return <p className="text-[0.85rem] text-muted">Loading…</p>

  return (
    <div>
      <h2 className="mb-3.5 flex items-center gap-2.5 font-disp text-lg uppercase before:block before:h-2 before:w-2 before:bg-blue before:content-['']">
        Messages inbox
      </h2>
      {messages.length === 0 ? (
        <p className="text-[0.85rem] text-muted">
          No messages yet — when someone uses the contact form on your site, it lands here.
        </p>
      ) : (
        messages.map((m) => (
          <div key={m.id} className="mb-3 grid grid-cols-1 gap-3 rounded-lg border border-line bg-white p-4 sm:grid-cols-[1fr_auto]">
            <div>
              <b className="text-[0.95rem]">
                {m.name} <span className="font-normal text-muted">&lt;{m.email}&gt;</span>
              </b>
              <div className="text-[0.74rem] font-medium uppercase tracking-[0.1em] text-muted">
                {new Date(m.created_at).toLocaleString()}
              </div>
              {(m.project_type || m.budget) && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.project_type && (
                    <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-[0.66rem] font-bold tracking-[0.1em] text-blue">
                      {m.project_type.toUpperCase()}
                    </span>
                  )}
                  {m.budget && (
                    <span className="rounded-full bg-[#0E9F6E]/10 px-2.5 py-0.5 text-[0.66rem] font-bold tracking-[0.1em] text-[#0E9F6E]">
                      {m.budget.toUpperCase()}
                    </span>
                  )}
                </div>
              )}
              <p className="mt-2 whitespace-pre-wrap text-[0.9rem] text-ink">{m.body}</p>
            </div>
            <div className="flex items-start gap-2">
              <a className="btn-ghost btn-sm" href={`mailto:${m.email}?subject=Re: your project inquiry`}>
                Reply
              </a>
              <button className="btn-danger btn-sm" onClick={() => del(m)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
