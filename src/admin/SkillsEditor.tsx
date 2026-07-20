import { useEffect, useState } from 'react'
import { sb, type LanguageItem, type SkillItem } from '../lib/supabase'
import { FALLBACK_FACTS, FALLBACK_LANGUAGES, FALLBACK_SKILLS } from '../lib/content'
import type { Notify } from '../pages/Admin'

export default function SkillsEditor({ notify }: { notify: Notify }) {
  const [skills, setSkills] = useState<SkillItem[]>(FALLBACK_SKILLS)
  const [languages, setLanguages] = useState<LanguageItem[]>(FALLBACK_LANGUAGES)
  const [facts, setFacts] = useState<string[]>(FALLBACK_FACTS)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    sb.from('site_settings')
      .select('key, value')
      .in('key', ['skills', 'languages', 'facts'])
      .then(({ data, error }) => {
        if (error || !data) return
        for (const row of data) {
          if (row.key === 'skills' && Array.isArray(row.value)) setSkills(row.value as SkillItem[])
          if (row.key === 'languages' && Array.isArray(row.value)) setLanguages(row.value as LanguageItem[])
          if (row.key === 'facts' && Array.isArray(row.value)) setFacts(row.value as string[])
        }
      })
  }, [])

  const move = <T,>(arr: T[], i: number, dir: -1 | 1): T[] => {
    const j = i + dir
    if (j < 0 || j >= arr.length) return arr
    const next = [...arr]
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
  }

  const save = async () => {
    setBusy(true)
    const rows = [
      { key: 'skills', value: skills.filter((s) => s.name.trim()) },
      { key: 'languages', value: languages.filter((l) => l.name.trim()) },
      { key: 'facts', value: facts.filter((f) => f.trim()) },
    ]
    const results = await Promise.all(
      rows.map((r) => sb.from('site_settings').upsert({ ...r, updated_at: new Date().toISOString() })),
    )
    setBusy(false)
    const failed = results.find((r) => r.error)
    if (failed?.error) return notify(failed.error.message, 'err')
    notify('Skills & credentials saved ✓ — refresh the site to see them')
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">Software proficiency</h2>
        <p className="text-[0.88rem] text-muted">Name + level from 0 to 100 — shown as animated bars.</p>
        {skills.map((s, i) => (
          <div key={i} className="mb-2.5 grid grid-cols-[1fr_90px_auto] gap-2.5">
            <input
              className="field"
              placeholder="e.g. CapCut"
              value={s.name}
              onChange={(e) => setSkills(skills.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
            />
            <input
              className="field"
              type="number"
              min={0}
              max={100}
              value={s.level}
              onChange={(e) => setSkills(skills.map((x, j) => (j === i ? { ...x, level: Number(e.target.value) } : x)))}
            />
            <div className="flex gap-1.5">
              <button type="button" className="btn-ghost btn-sm" onClick={() => setSkills(move(skills, i, -1))} aria-label="Move up">↑</button>
              <button type="button" className="btn-ghost btn-sm" onClick={() => setSkills(move(skills, i, 1))} aria-label="Move down">↓</button>
              <button type="button" className="btn-danger btn-sm" onClick={() => setSkills(skills.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn-ghost btn-sm" onClick={() => setSkills([...skills, { name: '', level: 80 }])}>
          + Add software
        </button>
      </div>

      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">Languages</h2>
        {languages.map((l, i) => (
          <div key={i} className="mb-2.5 grid grid-cols-[1fr_1fr_auto] gap-2.5">
            <input
              className="field"
              placeholder="Language"
              value={l.name}
              onChange={(e) => setLanguages(languages.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
            />
            <input
              className="field"
              placeholder="Native / Fluent / Basic..."
              value={l.level}
              onChange={(e) => setLanguages(languages.map((x, j) => (j === i ? { ...x, level: e.target.value } : x)))}
            />
            <button type="button" className="btn-danger btn-sm self-center" onClick={() => setLanguages(languages.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
          </div>
        ))}
        <button type="button" className="btn-ghost btn-sm" onClick={() => setLanguages([...languages, { name: '', level: '' }])}>
          + Add language
        </button>
      </div>

      <div className="admin-card">
        <h2 className="font-disp text-xl uppercase">Quick facts</h2>
        {facts.map((f, i) => (
          <div key={i} className="mb-2.5 flex gap-2.5">
            <input className="field" value={f} onChange={(e) => setFacts(facts.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" className="btn-danger btn-sm self-center" onClick={() => setFacts(facts.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
          </div>
        ))}
        <button type="button" className="btn-ghost btn-sm" onClick={() => setFacts([...facts, ''])}>
          + Add fact
        </button>
      </div>

      <button className="btn-solid" onClick={save} disabled={busy}>
        {busy ? 'Saving…' : 'Save skills & credentials'}
      </button>
    </div>
  )
}
