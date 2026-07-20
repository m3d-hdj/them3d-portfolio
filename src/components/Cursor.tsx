import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a,button,[role="button"],input,textarea,select,label,summary,.cursor-pointer'

/**
 * Brand cursor: solid blue dot + trailing ring.
 * The ring stretches with velocity (squash & stretch) and expands over interactive elements.
 * Only active on fine-pointer devices; touch users keep the native experience.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('custom-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let hovering = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }
    const onOver = (e: MouseEvent) => {
      hovering = Boolean((e.target as Element | null)?.closest?.(INTERACTIVE))
    }
    const onDown = () => {
      dot.style.scale = '0.55'
    }
    const onUp = () => {
      dot.style.scale = '1'
    }
    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const tick = () => {
      const dx = mx - rx
      const dy = my - ry
      rx += dx * 0.16
      ry += dy * 0.16
      const speed = Math.hypot(dx, dy)
      const stretch = Math.min(speed / 110, 0.45)
      const angle = Math.atan2(dy, dx)
      ring.style.transform =
        `translate(${rx}px, ${ry}px) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.45})`
      ring.classList.toggle('is-hover', hovering)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
