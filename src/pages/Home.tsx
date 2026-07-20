import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import About from '../components/About'
import Work from '../components/Work'
import Stats from '../components/Stats'
import Disciplines from '../components/Disciplines'
import Testimonials from '../components/Testimonials'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import { sb, type SiteSettings } from '../lib/supabase'
import { FALLBACK_SETTINGS } from '../lib/content'
import { useSmoothScroll } from '../lib/smoothScroll'

export default function Home() {
  useSmoothScroll()
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS)

  useEffect(() => {
    sb.from('site_settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (error || !data) return
        setSettings((prev) => {
          const next = { ...prev }
          for (const row of data) {
            if (row.key === 'general') next.general = { ...prev.general, ...(row.value as object) } as SiteSettings['general']
            if (row.key === 'socials') next.socials = { ...prev.socials, ...(row.value as object) }
            if (row.key === 'stats' && Array.isArray(row.value)) next.stats = row.value as SiteSettings['stats']
            if (row.key === 'about') next.about = { ...prev.about, ...(row.value as object) } as SiteSettings['about']
            if (row.key === 'journey' && Array.isArray(row.value)) next.journey = row.value as SiteSettings['journey']
            if (row.key === 'skills' && Array.isArray(row.value)) next.skills = row.value as SiteSettings['skills']
            if (row.key === 'languages' && Array.isArray(row.value)) next.languages = row.value as SiteSettings['languages']
            if (row.key === 'facts' && Array.isArray(row.value)) next.facts = row.value as SiteSettings['facts']
          }
          return next
        })
      })
  }, [])

  return (
    <>
      <Nav />
      <Hero general={settings.general} />
      <Marquee />
      <About about={settings.about} journey={settings.journey} available={settings.general.available} />
      <Work />
      <Stats stats={settings.stats} />
      <Disciplines />
      <Testimonials />
      <Skills skills={settings.skills} languages={settings.languages} facts={settings.facts} />
      <Contact general={settings.general} socials={settings.socials} />
    </>
  )
}
