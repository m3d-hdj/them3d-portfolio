import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Reorder } from 'framer-motion'
import { MAX_UPLOAD_BYTES, sb, type Project } from '../lib/supabase'
import type { Notify } from '../pages/Admin'

const CATEGORIES = ['Music video', 'Commercial', 'Motion design', 'Brand identity', 'Social content', 'Poster design']
type VideoKind = 'embed' | 'file' | 'none'

function safeName(n: string) {
  return n.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
}

async function uploadToStorage(folder: string, file: File): Promise<string> {
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`
  const { error } = await sb.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl
}

function pathFromUrl(url: string | null): string | null {
  if (!url) return null
  const parts = url.split('/storage/v1/object/public/media/')
  return parts.length > 1 ? decodeURIComponent(parts[1]) : null
}

const EMPTY = { title: '', category: '', year: '', videoUrl: '', kind: 'embed' as VideoKind }

export default function ProjectsManager({ notify }: { notify: Notify }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [orderDirty, setOrderDirty] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const thumbFileRef = useRef<HTMLInputElement>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)

  const load = () => {
    sb.from('projects')
      .select('*')
      .order('sort', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) return notify(error.message, 'err')
        setProjects((data as Project[]) ?? [])
        setOrderDirty(false)
      })
  }
  useEffect(load, [])

  const startEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title,
      category: p.category ?? '',
      year: p.year ?? '',
      videoUrl: p.video_kind === 'embed' ? (p.video_url ?? '') : '',
      kind: p.video_kind,
    })
    setThumbPreview(p.thumb_url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setEditing(null)
    setForm(EMPTY)
    setThumbPreview(null)
    if (videoFileRef.current) videoFileRef.current.value = ''
    if (thumbFileRef.current) thumbFileRef.current.value = ''
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const row: Partial<Project> = {
        title: form.title.trim(),
        category: form.category.trim() || null,
        year: form.year.trim() || null,
        video_kind: form.kind,
      }

      if (form.kind === 'embed') {
        row.video_url = form.videoUrl.trim() || null
      } else if (form.kind === 'file') {
        const vf = videoFileRef.current?.files?.[0]
        if (vf) {
          if (vf.size > MAX_UPLOAD_BYTES) {
            notify(`Clip is ${(vf.size / 1048576).toFixed(0)}MB — over the 50MB free-plan limit. Upload it to YouTube (Unlisted) and paste the link instead.`, 'err')
            setBusy(false)
            return
          }
          row.video_url = await uploadToStorage('clips', vf)
        } else if (!editing || editing.video_kind !== 'file') {
          notify('Choose a clip file (or switch to a video link).', 'err')
          setBusy(false)
          return
        }
      } else {
        row.video_url = null
      }

      const tf = thumbFileRef.current?.files?.[0]
      if (tf) {
        if (tf.size > MAX_UPLOAD_BYTES) {
          notify('Thumbnail is too large.', 'err')
          setBusy(false)
          return
        }
        row.thumb_url = await uploadToStorage('thumbs', tf)
      }

      if (!editing) row.sort = projects.length

      const q = editing
        ? sb.from('projects').update(row).eq('id', editing.id)
        : sb.from('projects').insert(row)
      const { error } = await q
      if (error) throw error
      notify(editing ? 'Project updated ✓' : 'Project added ✓')
      reset()
      load()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Something went wrong', 'err')
    } finally {
      setBusy(false)
    }
  }

  const del = async (p: Project) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await sb.from('projects').delete().eq('id', p.id)
    if (error) return notify(error.message, 'err')
    const paths = [pathFromUrl(p.thumb_url), p.video_kind === 'file' ? pathFromUrl(p.video_url) : null].filter(
      Boolean,
    ) as string[]
    if (paths.length) void sb.storage.from('media').remove(paths)
    notify('Project deleted')
    if (editing?.id === p.id) reset()
    load()
  }

  const saveOrder = async () => {
    setBusy(true)
    const results = await Promise.all(
      projects.map((p, i) => sb.from('projects').update({ sort: i }).eq('id', p.id)),
    )
    setBusy(false)
    const failed = results.find((r) => r.error)
    if (failed?.error) return notify(failed.error.message, 'err')
    notify('Order saved ✓')
    setOrderDirty(false)
  }

  return (
    <>
      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">{editing ? `Edit: ${editing.title}` : 'Add project'}</h2>
        <p className="text-[0.88rem] text-muted">
          Long videos → paste a YouTube/Vimeo link. Short clips → upload directly (max <b>50MB</b> on the free plan).
        </p>
        <form onSubmit={save}>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
            <div>
              <label className="field-label">Title *</label>
              <input
                className="field"
                required
                placeholder="e.g. Midnight Set"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Category</label>
              <input
                className="field"
                list="admin-cats"
                placeholder="Music video"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <datalist id="admin-cats">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </datalist>
            </div>
            <div>
              <label className="field-label">Year</label>
              <input
                className="field"
                placeholder="2026"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
          </div>

          <label className="field-label">Video source</label>
          <div className="flex flex-wrap gap-2.5">
            {(
              [
                ['embed', 'YouTube / Vimeo link'],
                ['file', 'Upload clip (≤50MB)'],
                ['none', 'No video'],
              ] as [VideoKind, string][]
            ).map(([kind, label]) => (
              <button
                type="button"
                key={kind}
                onClick={() => setForm({ ...form, kind })}
                className={`rounded-full border px-4.5 py-2 text-[0.78rem] font-semibold transition-all ${
                  form.kind === kind
                    ? 'border-blue bg-blue/5 text-blue'
                    : 'border-line text-muted hover:border-blue/50'
                }`}
                style={{ padding: '9px 18px' }}
              >
                {label}
              </button>
            ))}
          </div>

          {form.kind === 'embed' && (
            <div>
              <label className="field-label">Video link</label>
              <input
                type="url"
                className="field"
                placeholder="https://youtu.be/... or https://vimeo.com/..."
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
              <p className="mt-1.5 text-[0.78rem] text-muted">
                Tip: upload full-quality videos to YouTube as <b className="text-blue">Unlisted</b> — free, streams in
                4K, only people with the link can see them.
              </p>
            </div>
          )}
          {form.kind === 'file' && (
            <div>
              <label className="field-label">Clip file</label>
              <input
                ref={videoFileRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="w-full rounded-md border-[1.5px] border-dashed border-[#C9D2F2] bg-[#FAFBFF] p-2.5 text-[0.85rem] text-muted"
              />
              {editing?.video_kind === 'file' && editing.video_url && (
                <p className="mt-1.5 text-[0.78rem] text-muted">
                  Clip uploaded ✓ — choose a new file to replace it.
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Thumbnail image</label>
              <input
                ref={thumbFileRef}
                type="file"
                accept="image/*"
                className="w-full rounded-md border-[1.5px] border-dashed border-[#C9D2F2] bg-[#FAFBFF] p-2.5 text-[0.85rem] text-muted"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setThumbPreview(f ? URL.createObjectURL(f) : editing?.thumb_url ?? null)
                }}
              />
              {thumbPreview && (
                <img src={thumbPreview} alt="Thumbnail preview" className="mt-2 max-w-[220px] rounded-md border border-line" />
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="btn-solid" disabled={busy}>
              {busy ? 'Saving…' : 'Save project'}
            </button>
            {editing && (
              <button type="button" className="btn-ghost" onClick={reset}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 font-disp text-lg uppercase before:block before:h-2 before:w-2 before:bg-blue before:content-['']">
            Your projects
          </h2>
          {orderDirty && (
            <button className="btn-solid btn-sm" onClick={saveOrder} disabled={busy}>
              Save order
            </button>
          )}
        </div>
        {projects.length === 0 ? (
          <p className="text-[0.85rem] text-muted">
            No projects yet — the live site shows the built-in demo projects until you add your first one.
          </p>
        ) : (
          <>
            <p className="mb-3 text-[0.78rem] text-muted">Drag to reorder, then hit "Save order".</p>
            <Reorder.Group
              axis="y"
              values={projects}
              onReorder={(v) => {
                setProjects(v)
                setOrderDirty(true)
              }}
            >
              {projects.map((p) => (
                <Reorder.Item
                  key={p.id}
                  value={p}
                  className="mb-3 grid cursor-grab grid-cols-[80px_1fr_auto] items-center gap-4 rounded-lg border border-line bg-white p-3 transition-colors hover:border-[#B9C4EC] active:cursor-grabbing sm:grid-cols-[110px_1fr_auto]"
                >
                  {p.thumb_url ? (
                    <img src={p.thumb_url} alt="" className="grad-block aspect-video w-full rounded object-cover" />
                  ) : (
                    <div className="grad-block aspect-video w-full rounded" />
                  )}
                  <div>
                    <b className="block text-[0.95rem]">
                      {p.title}
                      <span
                        className={`ml-2 inline-block rounded-full px-2.5 py-0.5 align-[1px] text-[0.6rem] font-bold tracking-[0.14em] ${
                          p.video_kind === 'file'
                            ? 'bg-[#0E9F6E]/10 text-[#0E9F6E]'
                            : p.video_url
                              ? 'bg-blue/10 text-blue'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {p.video_kind === 'file' ? 'CLIP' : p.video_url ? 'EMBED' : 'NO VIDEO'}
                      </span>
                    </b>
                    <span className="text-[0.74rem] font-medium uppercase tracking-[0.1em] text-muted">
                      {p.category || '—'}
                      {p.year ? ` · ${p.year}` : ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-ghost btn-sm" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => del(p)}>
                      Delete
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </>
        )}
      </div>
    </>
  )
}
