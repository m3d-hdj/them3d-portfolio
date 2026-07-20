import { useEffect, useState } from 'react'
import { sb, type GeneralSettings, type SocialsSettings, type Stat } from '../lib/supabase'
import { FALLBACK_SETTINGS } from '../lib/content'
import type { Notify } from '../pages/Admin'

const SOCIAL_KEYS = ['instagram', 'behance', 'youtube', 'tiktok', 'x', 'linkedin'] as const

export default function SettingsEditor({ notify }: { notify: Notify }) {
  const [general, setGeneral] = useState<GeneralSettings>(FALLBACK_SETTINGS.general)
  const [socials, setSocials] = useState<SocialsSettings>(FALLBACK_SETTINGS.socials)
  const [stats, setStats] = useState<Stat[]>(FALLBACK_SETTINGS.stats)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    sb.from('site_settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (error || !data) return
        for (const row of data) {
          if (row.key === 'general') setGeneral((p) => ({ ...p, ...(row.value as object) }) as GeneralSettings)
          if (row.key === 'socials') setSocials((p) => ({ ...p, ...(row.value as object) }))
          if (row.key === 'stats' && Array.isArray(row.value)) setStats(row.value as Stat[])
        }
      })
  }, [])

  const save = async () => {
    setBusy(true)
    const rows = [
      { key: 'general', value: general },
      { key: 'socials', value: socials },
      { key: 'stats', value: stats },
    ]
    const results = await Promise.all(
      rows.map((r) => sb.from('site_settings').upsert({ ...r, updated_at: new Date().toISOString() })),
    )
    setBusy(false)
    const failed = results.find((r) => r.error)
    if (failed?.error) return notify(failed.error.message, 'err')
    notify('Settings saved ✓ — refresh the site to see them')
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">General</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Contact email</label>
            <input className="field" type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Location line</label>
            <input className="field" value={general.location} onChange={(e) => setGeneral({ ...general, location: e.target.value })} />
          </div>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-[0.9rem] font-medium">
          <input
            type="checkbox"
            checked={general.available}
            onChange={(e) => setGeneral({ ...general, available: e.target.checked })}
            className="h-4.5 w-4.5 accent-blue"
            style={{ width: 18, height: 18 }}
          />
          Show "Available for freelance" badge
        </label>
      </div>

      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">Social links</h2>
        <p className="text-[0.85rem] text-muted">Empty links show as greyed-out chips on the site.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_KEYS.map((key) => (
            <div key={key}>
              <label className="field-label">{key === 'x' ? 'X / Twitter' : key}</label>
              <input
                className="field"
                type="url"
                placeholder={`https://${key === 'x' ? 'x.com' : key + '.com'}/yourhandle`}
                value={socials[key] ?? ''}
                onChange={(e) => setSocials({ ...socials, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">Stats strip</h2>
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-[90px_90px_1fr] gap-3">
            <div>
              <label className="field-label">Value</label>
              <input
                className="field"
                type="number"
                value={s.value}
                onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)))}
              />
            </div>
            <div>
              <label className="field-label">Suffix</label>
              <input
                className="field"
                value={s.suffix}
                onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)))}
              />
            </div>
            <div>
              <label className="field-label">Label</label>
              <input
                className="field"
                value={s.label}
                onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="btn-solid" onClick={save} disabled={busy}>
        {busy ? 'Saving…' : 'Save all settings'}
      </button>
    </div>
  )
}
