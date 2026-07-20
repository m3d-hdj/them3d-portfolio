import Reveal from './Reveal'
import { JOURNEY, WORKSPACE_IMG } from '../lib/content'

const PILLS = ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'Illustrator']

export default function About() {
  return (
    <section className="py-24 lg:py-36" id="about">
      <div className="wrap">
        <Reveal>
          <div className="sec-label">01 / About</div>
          <h2 className="sec-title">
            Behind <span className="grad-text-bright">the cut</span>
          </h2>
        </Reveal>

        <div className="mt-11 grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <Reveal className="relative shadow-card">
            <img
              src={WORKSPACE_IMG}
              alt="TheM3d's video editing workspace with blue-lit timeline on screen"
              loading="lazy"
              className="border border-line"
            />
            <span className="pointer-events-none absolute inset-3.5 z-10 border-[1.5px] border-blue/40" />
            <span className="absolute bottom-4 left-4 z-20 border border-line bg-white/90 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted">
              The studio — where it happens
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4 text-muted">
              <p>
                <b className="font-semibold text-ink">I'm TheM3d — a video editor and graphic designer</b> obsessed
                with rhythm, contrast and detail. Whether it's a music video, a brand launch or a 15-second reel, I
                treat every frame like it has a job to do.
              </p>
              <p>
                My edge is working <b className="font-semibold text-ink">both sides of the craft</b>: the motion side
                (editing, grading, motion graphics) and the still side (identity, posters, social design). One brain,
                one consistent visual voice across everything a brand puts out.
              </p>
              <p>Clients come to me for cuts that hold attention — and stay for design that makes them recognizable.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-blue bg-blue/5 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-blue">
                ✦ Open for projects
              </span>
              {PILLS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-line px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-20 lg:mt-24">
          <Reveal>
            <div className="sec-label">The journey</div>
          </Reveal>
          {JOURNEY.map((j, i) => (
            <Reveal key={j.year} delay={i * 0.05}>
              <div className="group grid grid-cols-[80px_1fr] items-baseline gap-4 border-t border-line px-2.5 py-6 transition-all last:border-b hover:bg-[#F0F4FF] hover:pl-5 sm:grid-cols-[110px_1fr_auto] sm:gap-10">
                <span className="font-disp text-base text-blue">{j.year}</span>
                <span className="font-disp text-[clamp(1.05rem,2.2vw,1.5rem)] uppercase">{j.title}</span>
                <span className="col-start-2 max-w-[420px] text-[0.93rem] text-muted sm:col-start-3 sm:text-right">
                  {j.desc}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
