import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toEmbedUrl, type Project } from '../lib/supabase'
import { getLenis } from '../lib/smoothScroll'

interface LightboxProps {
  project: Project | null
  onClose: () => void
}

export default function Lightbox({ project, onClose }: LightboxProps) {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      getLenis()?.start()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-[#090926]/75 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            className="relative w-[min(1000px,96vw)] overflow-hidden rounded-[10px] bg-[#0B0B26] shadow-lift"
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            <button
              className="absolute right-2.5 top-2.5 z-10 grid h-[38px] w-[38px] place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-blue"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="aspect-video bg-black">
              {project.video_kind === 'file' && project.video_url ? (
                <video src={project.video_url} controls autoPlay playsInline className="h-full w-full" />
              ) : project.video_url ? (
                <iframe
                  src={toEmbedUrl(project.video_url)}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                  className="h-full w-full border-0"
                />
              ) : project.thumb_url ? (
                <img src={project.thumb_url} alt={project.title} className="h-full w-full object-contain" />
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-3 px-4.5 py-3.5 text-white" style={{ padding: '14px 18px' }}>
              <span className="font-disp text-[0.95rem] uppercase">{project.title}</span>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#A9C4FF]">
                {[project.category, project.year].filter(Boolean).join(' ✦ ')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
