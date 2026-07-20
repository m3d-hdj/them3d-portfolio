import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOGO_DATA_URI } from '../lib/logo'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[1000] flex items-center justify-between border-b px-5 transition-all duration-300 sm:px-10 ${
          scrolled
            ? 'border-line bg-white/90 py-2.5 shadow-[0_6px_24px_-18px_rgba(24,24,156,.25)] backdrop-blur-xl'
            : 'border-transparent bg-white/60 py-4 backdrop-blur-sm'
        }`}
        aria-label="Main navigation"
      >
        <a href="#top" className="shrink-0">
          <img src={LOGO_DATA_URI} alt="TheM3d logo" className="h-[30px] w-auto" />
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-blue"
            >
              {l.label}
              <span className="absolute -bottom-[5px] left-0 h-0.5 w-0 bg-blue transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a href="#contact" className="btn-solid px-5 py-2.5">
            Hire Me
          </a>
        </div>
        <button
          className="grid h-[42px] w-[42px] place-items-center rounded border border-line text-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[1500] flex flex-col items-center justify-center gap-[7vh] bg-white/95 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute right-7 top-5 text-3xl text-ink"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-disp text-4xl uppercase text-ink hover:text-blue"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
