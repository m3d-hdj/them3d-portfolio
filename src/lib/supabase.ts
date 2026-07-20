import { createClient } from '@supabase/supabase-js'

// The publishable key is safe to ship in client code —
// all data access is enforced by Row Level Security on the server.
export const SUPABASE_URL = 'https://chqdunxchpqiulywfcnl.supabase.co'
const PUBLISHABLE_KEY = 'sb_publishable_pO0lqMjYWFy_vZhkWXtBQA_p0n56BgW'

export const sb = createClient(SUPABASE_URL, PUBLISHABLE_KEY)

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024 // Supabase free plan: 50MB per file

export interface Project {
  id: string
  title: string
  category: string | null
  year: string | null
  video_kind: 'embed' | 'file' | 'none'
  video_url: string | null
  thumb_url: string | null
  sort: number
  created_at?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string | null
  sort: number
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  body: string
  notified: boolean
  created_at: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface GeneralSettings {
  email: string
  location: string
  available: boolean
}

export type SocialsSettings = Record<string, string>

export interface SiteSettings {
  general: GeneralSettings
  socials: SocialsSettings
  stats: Stat[]
}

/** Convert a YouTube / Vimeo page URL into an embeddable player URL. */
export function toEmbedUrl(u: string): string {
  try {
    const url = new URL(u)
    if (url.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}?autoplay=1&rel=0`
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${url.pathname.split('/')[2]}?autoplay=1&rel=0`
      }
      const v = url.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`
      if (url.pathname.startsWith('/embed/')) return u
    }
    if (url.hostname.includes('vimeo.com') && !url.hostname.includes('player')) {
      const id = url.pathname.split('/').filter(Boolean)[0]
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}?autoplay=1`
    }
  } catch {
    /* fall through */
  }
  return u
}
