import { MARQUEE_ITEMS } from '../lib/content'

export default function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
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
            className={`whitespace-nowrap py-4 font-disp text-[clamp(1.3rem,3vw,2.2rem)] uppercase ${
              i % 2 ? 'text-transparent' : 'text-white'
            }`}
            style={i % 2 ? { WebkitTextStroke: '1.5px rgba(255,255,255,.8)' } : undefined}
          >
            {item}
            <em className="px-6 not-italic text-white/60">✦</em>
          </span>
        ))}
      </div>
    </div>
  )
}
