import type { Project, SiteSettings, Testimonial } from './supabase'

/**
 * Fallback content — shown until real rows exist in Supabase.
 * Everything here is replaceable from the /admin panel.
 */

const IMG = {
  musicVideo:
    'https://pub.hyperagent.com/api/published/pbf01KXYT83M0_WE02R9ZNG296D1WE/bcd54c20-3ed3-428b-a50a-33d1d877d629.png',
  workspace:
    'https://pub.hyperagent.com/api/published/pbf01KXYT843J_J9F5X2JA0NTP05HT/ca36815c-d617-4560-937e-b5fcd453fa46.png',
  brand:
    'https://pub.hyperagent.com/api/published/pbf01KXYT84KN_11SHMRVC7CB7WJT2/1b5ad2d9-ddb8-4f4c-9a14-fcb2b74e5c62.png',
  social:
    'https://pub.hyperagent.com/api/published/pbf01KXYT850T_CJN15CQDVHKREK3Y/57e26600-e51d-4efe-88cb-1569f8640aef.png',
  motion:
    'https://pub.hyperagent.com/api/published/pbf01KXYT85FK_PV74ZMB0NQNXGZA3/0ccda88a-6337-44ad-a7fe-b0ee37929b95.png',
  commercial:
    'https://pub.hyperagent.com/api/published/pbf01KXYT85Y8_RXD77QQ8Q0BP4X4T/1480e50f-3c1a-4bbd-a484-f02b0c065f4b.png',
  poster:
    'https://pub.hyperagent.com/api/published/pbf01KXYT86B6_GJNVBG9T7WM4SQVC/bf71ac48-0ec3-4e42-9184-14aa03a5050d.png',
}

export const WORKSPACE_IMG = IMG.workspace

export const FALLBACK_PROJECTS: Project[] = [
  { id: 'demo-1', title: 'Midnight Set', category: 'Music video', year: '2026', video_kind: 'none', video_url: null, thumb_url: IMG.musicVideo, sort: 0 },
  { id: 'demo-2', title: 'Onyx Rebrand', category: 'Brand identity', year: '2025', video_kind: 'none', video_url: null, thumb_url: IMG.brand, sort: 1 },
  { id: 'demo-3', title: 'Drop 04 — Launch Film', category: 'Commercial', year: '2025', video_kind: 'none', video_url: null, thumb_url: IMG.commercial, sort: 2 },
  { id: 'demo-4', title: 'Signal — Title Sequence', category: 'Motion design', year: '2025', video_kind: 'none', video_url: null, thumb_url: IMG.motion, sort: 3 },
  { id: 'demo-5', title: 'Heat Check Campaign', category: 'Social content', year: '2026', video_kind: 'none', video_url: null, thumb_url: IMG.social, sort: 4 },
  { id: 'demo-6', title: 'Basement Nights', category: 'Poster design', year: '2024', video_kind: 'none', video_url: null, thumb_url: IMG.poster, sort: 5 },
]

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 't-1', quote: 'TheM3d turned 40GB of raw footage into a launch film that tripled our engagement. The pacing is unreal.', author: 'L. Meziane', role: 'Brand Manager — Retail', sort: 0 },
  { id: 't-2', quote: "Fast, precise, and the color grade was pure cinema. He's our go-to editor for every drop now.", author: 'Y. Adams', role: 'Content Lead — Streetwear', sort: 1 },
  { id: 't-3', quote: 'The identity he designed became the face of our whole rebrand — from the logo to every single post.', author: 'S. Farid', role: 'Founder — Startup', sort: 2 },
]

export const FALLBACK_SETTINGS: SiteSettings = {
  general: { email: 'hello@them3d.com', location: 'DZ · Working worldwide', available: true },
  socials: { instagram: '', behance: '', youtube: '', tiktok: '', x: '', linkedin: '' },
  stats: [
    { value: 10, suffix: 'M+', label: 'Views on edited content' },
    { value: 120, suffix: '+', label: 'Projects delivered' },
    { value: 30, suffix: '+', label: 'Clients & collabs' },
    { value: 5, suffix: '+', label: 'Years cutting & creating' },
  ],
}

export const JOURNEY = [
  { year: '2019', title: 'First cut', desc: 'Started editing montages and discovered the rhythm of a good cut.' },
  { year: '2021', title: 'Going freelance', desc: 'First paying clients — content creators and local brands.' },
  { year: '2023', title: 'Design unlocked', desc: 'Added brand identity and poster design to the toolkit.' },
  { year: '2024', title: 'Studio mode', desc: 'Full-time freelance: campaigns, music videos, motion design.' },
  { year: 'NOW', title: 'Available worldwide', desc: 'Open for projects, collabs and long-term retainers.' },
]

export const DISCIPLINES = [
  { name: 'Video Editing', count: '120+ projects', tools: 'Premiere Pro · DaVinci Resolve', deliverables: 'Music videos, YouTube, ads, reels, event recaps' },
  { name: 'Motion Graphics', count: '40+ animations', tools: 'After Effects', deliverables: 'Title sequences, lower thirds, logo animations, kinetic type' },
  { name: 'Color Grading', count: 'Across all edits', tools: 'DaVinci Resolve', deliverables: 'Cinematic looks, custom LUTs, shot matching' },
  { name: 'Brand Identity', count: '15+ brands', tools: 'Illustrator · Photoshop', deliverables: 'Logos, brand guidelines, stationery, launch kits' },
  { name: 'Social Media Design', count: '200+ designs', tools: 'Photoshop · Figma', deliverables: 'Covers, carousels, thumbnails, story templates' },
  { name: 'Print & Posters', count: '30+ pieces', tools: 'Illustrator · InDesign', deliverables: 'Gig posters, flyers, packaging, editorial layouts' },
]

export const SKILLS = [
  { name: 'Premiere Pro', level: 95 },
  { name: 'After Effects', level: 90 },
  { name: 'Photoshop', level: 92 },
  { name: 'Illustrator', level: 88 },
  { name: 'DaVinci Resolve', level: 85 },
  { name: 'Figma', level: 75 },
]

export const LANGUAGES = [
  { name: 'Arabic', level: 'Native' },
  { name: 'French', level: 'Fluent' },
  { name: 'English', level: 'Fluent' },
]

export const MARQUEE_ITEMS = [
  'Video Editing',
  'Motion Graphics',
  'Color Grading',
  'Brand Identity',
  'Social Content',
  'Poster Design',
]
