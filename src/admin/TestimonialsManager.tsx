import { useEffect, useState, type FormEvent } from 'react'
import { sb, type Testimonial } from '../lib/supabase'
import type { Notify } from '../pages/Admin'

const EMPTY = { quote: '', author: '', role: '' }

export default function TestimonialsManager({ notify }: { notify: Notify }) {
  const [items, setItems] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)

  const load = () => {
    sb.from('testimonials')
      .select('*')
      .order('sort', { ascending: true })
      .then(({ data, error }) => {
        if (error) return notify(error.message, 'err')
        setItems((data as Testimonial[]) ?? [])
      })
  }
  useEffect(load, [])

  const reset = () => {
    setEditing(null)
    setForm(EMPTY)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const row = { quote: form.quote.trim(), author: form.author.trim(), role: form.role.trim() || null }
    const q = editing
      ? sb.from('testimonials').update(row).eq('id', editing.id)
      : sb.from('testimonials').insert({ ...row, sort: items.length })
    const { error } = await q
    setBusy(false)
    if (error) return notify(error.message, 'err')
    notify(editing ? 'Testimonial updated ✓' : 'Testimonial added ✓')
    reset()
    load()
  }

  const del = async (t: Testimonial) => {
    if (!window.confirm('Delete this testimonial?')) return
    const { error } = await sb.from('testimonials').delete().eq('id', t.id)
    if (error) return notify(error.message, 'err')
    notify('Testimonial deleted')
    if (editing?.id === t.id) reset()
    load()
  }

  return (
    <>
      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">{editing ? 'Edit testimonial' : 'Add testimonial'}</h2>
        <form onSubmit={save}>
          <label className="field-label">Quote *</label>
          <textarea
            className="field min-h-[90px] resize-y"
            required
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Author *</label>
              <input className="field" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Role / company</label>
              <input
                className="field"
                placeholder="Brand Manager — Retail"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button className="btn-solid" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            {editing && (
              <button type="button" className="btn-ghost" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="mb-3.5 flex items-center gap-2.5 font-disp text-lg uppercase before:block before:h-2 before:w-2 before:bg-blue before:content-['']">
          Published testimonials
        </h2>
        {items.map((t) => (
          <div key={t.id} className="mb-3 grid grid-cols-1 gap-3 rounded-lg border border-line bg-white p-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[0.92rem] italic text-ink">“{t.quote}”</p>
              <div className="mt-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-blue">
                {t.author} <span className="font-medium text-muted">{t.role ? `— ${t.role}` : ''}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <button
                className="btn-ghost btn-sm"
                onClick={() => {
                  setEditing(t)
                  setForm({ quote: t.quote, author: t.author, role: t.role ?? '' })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Edit
              </button>
              <button className="btn-danger btn-sm" onClick={() => del(t)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
