import { AE, AU, PR, PS } from '../lib/toolIcons'

const WORDS = [
  'Video Editing',
  'Motion Graphics',
  'Color Grading',
  'Brand Identity',
  'Social Content',
  'Poster Design',
]

// Icons rotate independently of the words — pure decoration between them.
const ICONS = [PR, AU, PS, AE]

/** Gradient 4-point sparkle, flanking each tool icon. */
function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mx-[0.42em] inline-block h-[0.55em] w-[0.55em] shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4F7FF" />
          <stop offset="100%" stopColor="#A6B8FF" />
        </linearGradient>
      </defs>
      <path
        d="M12 0C13.1 7.6 16.4 10.9 24 12 16.4 13.1 13.1 16.4 12 24 10.9 16.4 7.6 13.1 0 12 7.6 10.9 10.9 7.6 12 0Z"
        fill="url(#spark-grad)"
      />
    </svg>
  )
}

export default function Marquee() {
  const row = [...WORDS, ...WORDS]
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
      <div
        className="flex w-max items-center hover:[animation-play-state:paused]"
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        {row.map((word, i) => (
          <span
            key={i}
            className={`flex items-center whitespace-nowrap py-3.5 font-disp text-[clamp(1.3rem,3vw,2.2rem)] uppercase ${
              i % 2 ? 'text-transparent' : 'text-white'
            }`}
            style={i % 2 ? { WebkitTextStroke: '1.5px rgba(255,255,255,.8)' } : undefined}
          >
            {word}
            <Sparkle />
            <img
              src={ICONS[i % ICONS.length]}
              alt=""
              className="mx-[0.1em] inline-block h-[1.5em] w-auto"
              style={{ filter: 'drop-shadow(0 3px 7px rgba(0,0,0,.28))' }}
            />
            <Sparkle />
          </span>
        ))}
      </div>
    </div>
  )
}
