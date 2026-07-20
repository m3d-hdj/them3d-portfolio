import { useEffect, useRef, useState } from 'react'
import { MAX_UPLOAD_BYTES, sb, type AboutSettings, type JourneyItem } from '../lib/supabase'
import { uploadToStorage } from '../lib/storage'
import { FALLBACK_ABOUT, FALLBACK_JOURNEY } from '../lib/content'
import type { Notify } from '../pages/Admin'

export default function AboutEditor({ notify }: { notify: Notify }) {
  const [about, setAbout] = useState<AboutSettings>(FALLBACK_ABOUT)
  const [journey, setJourney] = useState<JourneyItem[]>(FALLBACK_JOURNEY)
  const [busy, setBusy] = useState(false)
  const imgRef = useRef<HTMLInputElement>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)

  useEffect(() => {
    sb.from('site_settings')
      .select('key, value')
      .in('key', ['about', 'journey'])
      .then(({ data, error }) => {
        if (error || !data) return
        for (const row of data) {
          if (row.key === 'about') setAbout((p) => ({ ...p, ...(row.value as object) }) as AboutSettings)
          if (row.key === 'journey' && Array.isArray(row.value)) setJourney(row.value as JourneyItem[])
        }
      })
  }, [])

  const setPara = (i: number, v: string) => setAbout({ ...about, paragraphs: about.paragraphs.map((p, j) => (j === i ? v : p)) })
  const setRow = (i: number, patch: Partial<JourneyItem>) =>
    setJourney(journey.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const moveRow = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= journey.length) return
    const next = [...journey]
    ;[next[i], next[j]] = [next[j], next[i]]
    setJourney(next)
  }

  const save = async () => {
    setBusy(true)
    try {
      const next = { ...about }
      const f = imgRef.current?.files?.[0]
      if (f) {
        if (f.size > MAX_UPLOAD_BYTES) throw new Error('Image is too large (max 50MB).')
        next.image_url = await uploadToStorage('about', f)
      }
      const cleanedJourney = journey.filter((r) => r.year.trim() || r.title.trim() || r.desc.trim())
      const results = await Promise.all([
        sb.from('site_settings').upsert({ key: 'about', value: { ...next, paragraphs: next.paragraphs.filter((p) => p.trim()) }, updated_at: new Date().toISOString() }),
        sb.from('site_settings').upsert({ key: 'journey', value: cleanedJourney, updated_at: new Date().toISOString() }),
      ])
      const failed = results.find((r) => r.error)
      if (failed?.error) throw failed.error
      setAbout(next)
      if (imgRef.current) imgRef.current.value = ''
      notify('About & journey saved ✓ — refresh the site to see them')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Something went wrong', 'err')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">About section</h2>
        <p className="text-[0.88rem] text-muted">
          Wrap words in <b>**double stars**</b> to make them bold on the site.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label">Studio photo</label>
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="w-full rounded-md border-[1.5px] border-dashed border-[#C9D2F2] bg-[#FAFBFF] p-2.5 text-[0.85rem] text-muted"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setImgPreview(f ? URL.createObjectURL(f) : null)
              }}
            />
            <img
              src={imgPreview ?? about.image_url}
              alt="About section preview"
              className="mt-2 w-full max-w-[280px] rounded-md border border-line"
            />
          </div>
          <div>
            <label className="field-label">Photo caption</label>
            <input
              className="field"
              value={about.image_caption}
              onChange={(e) => setAbout({ ...about, image_caption: e.target.value })}
            />
            <label className="field-label">Skill pills (comma-separated)</label>
            <input
              className="field"
              placeholder="Premiere Pro, After Effects, ..."
              value={about.pills.join(', ')}
              onChange={(e) =>
                setAbout({ ...about, pills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
              }
            />
            <p className="mt-1.5 text-[0.78rem] text-muted">
              The "✦ Open for projects" pill follows the availability toggle in Settings.
            </p>
          </div>
        </div>

        <label className="field-label">Bio paragraphs</label>
        {about.paragraphs.map((p, i) => (
          <div key={i} className="mb-2.5 flex gap-2">
            <textarea className="field min-h-[76px] resize-y" value={p} onChange={(e) => setPara(i, e.target.value)} />
            <button
              type="button"
              className="btn-danger btn-sm self-start"
              onClick={() => setAbout({ ...about, paragraphs: about.paragraphs.filter((_, j) => j !== i) })}
              aria-label={`Remove paragraph ${i + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => setAbout({ ...about, paragraphs: [...about.paragraphs, ''] })}
        >
          + Add paragraph
        </button>
      </div>

      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">Journey timeline</h2>
        <p className="text-[0.88rem] text-muted">Your career milestones, top to bottom.</p>
        {journey.map((r, i) => (
          <div key={i} className="mb-3 grid grid-cols-[70px_1fr] gap-2.5 rounded-lg border border-line bg-[#FAFBFF] p-3 sm:grid-cols-[80px_1fr_1.4fr_auto]">
            <input className="field" placeholder="Year" value={r.year} onChange={(e) => setRow(i, { year: e.target.value })} />
            <input className="field" placeholder="Title" value={r.title} onChange={(e) => setRow(i, { title: e.target.value })} />
            <input
              className="field max-sm:col-span-2"
              placeholder="Description"
              value={r.desc}
              onChange={(e) => setRow(i, { desc: e.target.value })}
            />
            <div className="flex gap-1.5 max-sm:col-span-2 max-sm:justify-end">
              <button type="button" className="btn-ghost btn-sm" onClick={() => moveRow(i, -1)} aria-label="Move up">
                ↑
              </button>
              <button type="button" className="btn-ghost btn-sm" onClick={() => moveRow(i, 1)} aria-label="Move down">
                ↓
              </button>
              <button
                type="button"
                className="btn-danger btn-sm"
                onClick={() => setJourney(journey.filter((_, j) => j !== i))}
                aria-label="Remove row"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => setJourney([...journey, { year: '', title: '', desc: '' }])}
        >
          + Add milestone
        </button>
      </div>

      <button className="btn-solid" onClick={save} disabled={busy}>
        {busy ? 'Saving…' : 'Save about & journey'}
      </button>
    </div>
  )
}
