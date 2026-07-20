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
            <img
              src={ICONS[i % ICONS.length]}
              alt=""
              className="mx-[0.55em] inline-block h-[1.5em] w-auto"
              style={{ filter: 'drop-shadow(0 3px 7px rgba(0,0,0,.28))' }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
