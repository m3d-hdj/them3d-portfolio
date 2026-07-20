import { motion } from 'framer-motion'
import { LOGO_DATA_URI } from '../lib/logo'
import type { GeneralSettings } from '../lib/supabase'

function CropMark({ pos }: { pos: string }) {
  return <span className={`absolute hidden h-[26px] w-[26px] border-[#B9C4EC] md:block ${pos}`} />
}

export default function Hero({ general }: { general: GeneralSettings }) {
  return (
    <header
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-24"
      style={{
        background:
          'radial-gradient(1000px 500px at 82% 16%, rgba(0,69,223,.07), transparent 60%),' +
          'radial-gradient(800px 520px at 8% 90%, rgba(88,80,224,.06), transparent 55%),' +
          'radial-gradient(#E4E8F8 1px, transparent 1.5px)',
        backgroundSize: 'auto, auto, 26px 26px',
        backgroundColor: '#fff',
      }}
    >
      <CropMark pos="left-6 top-24 border-l border-t" />
      <CropMark pos="right-6 top-24 border-r border-t" />
      <CropMark pos="bottom-6 left-6 border-b border-l" />
      <CropMark pos="bottom-6 right-6 border-b border-r" />

      {/* registration mark */}
      <svg
        className="absolute left-[clamp(30px,6vw,90px)] top-[20%] opacity-50"
        style={{ animation: 'spinslow 24s linear infinite' }}
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="36" cy="36" r="24" stroke="#9AA3C8" strokeWidth="1.5" />
        <circle cx="36" cy="36" r="10" stroke="#0045DF" strokeWidth="1.5" />
        <path d="M36 0v72M0 36h72" stroke="#9AA3C8" strokeWidth="1.5" />
      </svg>

      {/* floating logo badge — echo of the brand banner */}
      <div
        className="absolute right-[clamp(24px,9vw,150px)] top-[22%] z-0 hidden aspect-square w-[clamp(150px,17vw,250px)] items-center justify-center rounded-full border-[3px] border-blue bg-white shadow-[0_0_0_12px_rgba(0,69,223,.06),0_24px_50px_-20px_rgba(24,24,156,.35)] md:flex"
        style={{ animation: 'floaty 5.5s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <img src={LOGO_DATA_URI} alt="" className="w-2/3" />
      </div>

      <div className="wrap relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-[5vh] flex flex-wrap items-center justify-between gap-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/80 px-4 py-2">
            <span
              className={`h-[7px] w-[7px] rounded-full ${general.available ? 'bg-blue' : 'bg-muted'}`}
              style={general.available ? { animation: 'dotpulse 1.8s infinite' } : undefined}
            />
            {general.available ? 'Available for freelance' : 'Currently booked'}
          </span>
          <span>{general.location}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-disp text-[clamp(3.6rem,15vw,13.5rem)] uppercase leading-[0.88] tracking-tight"
        >
          <span className="grad-text-bright text-[0.36em]">THE</span>
          <span className="grad-text-deep">M3D</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 text-[clamp(0.9rem,2vw,1.25rem)] font-semibold uppercase tracking-[0.3em] text-peri"
        >
          Video Editor <span className="text-blue">✦</span> Graphic Designer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-5 max-w-[640px] text-[clamp(1.05rem,2.2vw,1.45rem)] font-medium italic text-muted"
        >
          “I cut <b className="font-semibold not-italic text-ink">stories</b>, not clips — and design{' '}
          <b className="font-semibold not-italic text-ink">identities</b>, not logos.”
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#work" className="btn-solid">
            See my work ↓
          </a>
          <a href="#contact" className="btn-ghost">
            Hire me
          </a>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#9AA3C8] sm:px-12 lg:px-24">
        <span>Portfolio — Vol. 02</span>
        <span className="flex items-center gap-2.5">
          Scroll
          <i
            className="block h-[38px] w-0.5 bg-gradient-to-b from-blue to-transparent"
            style={{ animation: 'dropline 1.6s ease-in-out infinite' }}
          />
        </span>
        <span>EST. 2021</span>
      </div>
    </header>
  )
}
