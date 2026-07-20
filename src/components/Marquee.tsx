type IconKind = 'letters' | 'figma' | 'davinci'

interface MarqueeItem {
  label: string
  icon: IconKind
  letters?: string
  bg?: string
  fg?: string
}

/** Services paired with the tool that powers them. */
const ITEMS: MarqueeItem[] = [
  { label: 'Video Editing', icon: 'letters', letters: 'Pr', bg: '#00005B', fg: '#9999FF' },
  { label: 'Motion Graphics', icon: 'letters', letters: 'Ae', bg: '#00005B', fg: '#9999FF' },
  { label: 'Color Grading', icon: 'davinci' },
  { label: 'Brand Identity', icon: 'letters', letters: 'Ai', bg: '#330000', fg: '#FF9A00' },
  { label: 'Social Content', icon: 'figma' },
  { label: 'Poster Design', icon: 'letters', letters: 'Ps', bg: '#001E36', fg: '#31A8FF' },
]

function ToolIcon({ item }: { item: MarqueeItem }) {
  const tile =
    'mr-[0.4em] inline-flex h-[1.18em] w-[1.18em] shrink-0 items-center justify-center rounded-[22%] align-[-0.18em] font-body font-bold shadow-[0_2px_8px_rgba(0,0,0,.25)]'

  if (item.icon === 'figma') {
    return (
      <span className={tile} style={{ background: '#1E1E1E' }} aria-hidden="true">
        <svg viewBox="0 0 38 57" style={{ height: '58%' }}>
          <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
          <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
          <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
          <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
          <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
        </svg>
      </span>
    )
  }

  if (item.icon === 'davinci') {
    return (
      <span className={tile} style={{ background: '#1A1A1A' }} aria-hidden="true">
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            height: '68%',
            width: '68%',
            background: 'conic-gradient(#ff6a00,#ffd500,#7cd41f,#00c8ff,#7a5cff,#ff2fa0,#ff6a00)',
          }}
        >
          <span className="rounded-full" style={{ height: '55%', width: '55%', background: '#1A1A1A' }} />
        </span>
      </span>
    )
  }

  return (
    <span
      className={tile}
      style={{ background: item.bg, color: item.fg, fontSize: '0.52em', WebkitTextStroke: '0' }}
      aria-hidden="true"
    >
      {item.letters}
    </span>
  )
}

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="relative overflow-hidden bg-blue py-2.5" aria-hidden="true">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 14px, rgba(255,255,255,.28) 14px 26px)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 14px, rgba(255,255,255,.28) 14px 26px)' }}
      />
      <div className="flex w-max hover:[animation-play-state:paused]" style={{ animation: 'marquee 30s linear infinite' }}>
        {row.map((item, i) => (
          <span
            key={i}
            className={`flex items-center whitespace-nowrap py-4 font-disp text-[clamp(1.3rem,3vw,2.2rem)] uppercase ${
              i % 2 ? 'text-transparent' : 'text-white'
            }`}
            style={i % 2 ? { WebkitTextStroke: '1.5px rgba(255,255,255,.8)' } : undefined}
          >
            <ToolIcon item={item} />
            {item.label}
            <em className="px-6 not-italic text-white/60" style={i % 2 ? { WebkitTextStroke: '0' } : undefined}>
              ✦
            </em>
          </span>
        ))}
      </div>
    </div>
  )
}
