type IconKind = 'letters' | 'figma' | 'davinci'

interface MarqueeItem {
  label: string
  icon: IconKind
  letters?: string
  gradFrom?: string
  gradTo?: string
}

/** Services paired with the tool that powers them. */
const ITEMS: MarqueeItem[] = [
  { label: 'Video Editing', icon: 'letters', letters: 'Pr', gradFrom: '#AEB0FF', gradTo: '#5A54F0' },
  { label: 'Motion Graphics', icon: 'letters', letters: 'Ae', gradFrom: '#C39BFF', gradTo: '#7B2BEA' },
  { label: 'Color Grading', icon: 'davinci' },
  { label: 'Brand Identity', icon: 'letters', letters: 'Ai', gradFrom: '#FFC24D', gradTo: '#FF7A00' },
  { label: 'Social Content', icon: 'figma' },
  { label: 'Poster Design', icon: 'letters', letters: 'Ps', gradFrom: '#5AC8FF', gradTo: '#0B63D8' },
]

const TILE =
  'relative mr-[0.45em] inline-flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center overflow-hidden rounded-[24%] align-[-0.38em] font-body font-bold'

const TILE_SHADOW =
  '0 5px 14px rgba(0,0,0,.38), inset 0 1.5px 1.5px rgba(255,255,255,.5), inset 0 -2.5px 4px rgba(0,0,0,.28)'

/** Glossy top-half sheen for the 3D look. */
function Gloss() {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
      style={{ background: 'linear-gradient(rgba(255,255,255,.35), rgba(255,255,255,0))' }}
    />
  )
}

function ToolIcon({ item }: { item: MarqueeItem }) {
  if (item.icon === 'figma') {
    return (
      <span
        className={TILE}
        style={{ background: 'linear-gradient(145deg,#FFFFFF,#E2E5F3)', boxShadow: TILE_SHADOW }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 38 57" style={{ height: '58%', filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,.25))' }}>
          <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
          <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
          <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
          <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
          <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
        </svg>
        <Gloss />
      </span>
    )
  }

  if (item.icon === 'davinci') {
    return (
      <span
        className={TILE}
        style={{ background: 'linear-gradient(145deg,#FDFDFF,#D6DAEA)', boxShadow: TILE_SHADOW }}
        aria-hidden="true"
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            height: '66%',
            width: '66%',
            background: 'conic-gradient(#ff6a00,#ffd500,#7cd41f,#00c8ff,#7a5cff,#ff2fa0,#ff6a00)',
            boxShadow: '0 1px 3px rgba(0,0,0,.3)',
          }}
        >
          <span className="rounded-full" style={{ height: '52%', width: '52%', background: '#FDFDFF' }} />
        </span>
        <Gloss />
      </span>
    )
  }

  return (
    <span
      className={TILE}
      style={{
        background: `linear-gradient(145deg, ${item.gradFrom}, ${item.gradTo})`,
        boxShadow: TILE_SHADOW,
        WebkitTextStroke: '0',
      }}
      aria-hidden="true"
    >
      <span style={{ fontSize: '0.6em', color: '#fff', textShadow: '0 1.5px 2.5px rgba(0,0,0,.4)' }}>
        {item.letters}
      </span>
      <Gloss />
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
