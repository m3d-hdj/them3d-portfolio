import { useEffect } from 'react'
import Lenis from 'lenis'

let current: Lenis | null = null

/** Access the active Lenis instance (e.g. to pause scrolling while a modal is open). */
export const getLenis = () => current

/**
 * Cinematic inertia scrolling for the public site.
 * - Anchor links glide through Lenis instead of jumping
 * - Touch devices keep their native scroll feel
 * - Respects prefers-reduced-motion
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const hash = a.getAttribute('href')
      if (!hash || hash === '#') return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -10 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      current = null
    }
  }, [])
}
