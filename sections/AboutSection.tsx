import { CinematicSection } from "@/components/motion/CinematicSection";
import { MagnetHeading } from "@/components/motion/MagnetHeading";
import { ToolCluster } from "@/components/motion/ToolCluster";
import {
  ABOUT_DETAIL,
  ABOUT_INTRO,
  SITE_CONFIG,
  EXPERIENCE_DATA,
  SKILLS_DATA,
  SOFTWARE_DATA,
  LEADERSHIP_DATA,
  EDUCATION_DATA
} from "@/lib/site";

/**
 * Personal introduction — copy lives in `lib/site.ts` for easy edits.
 * Scroll motion: `components/motion/CinematicSection.tsx` (variant "about").
 * Tool icons / cluster: `components/motion/ToolCluster.tsx`.
 */
export function AboutSection() {
  return (
    <CinematicSection
      variant="about"
      id="about"
      className="section-shell scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <div className="cinematic-container">
        <p data-cine="label" className="section-label">
          About
        </p>
        <div className="mt-8 grid gap-10 max-[430px]:gap-9 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-start md:gap-16 lg:gap-24">
          <div data-cine="heading">
            <MagnetHeading
              as="h2"
              id="about-heading"
              text={SITE_CONFIG.name}
              className="font-serif text-[clamp(1.7rem,5vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:text-[clamp(1.8rem,4.6vw,3rem)]"
            >
              <span className="mt-3 block text-[0.9375rem] font-sans font-normal tracking-[0.2em] text-zinc-500 uppercase sm:text-base sm:tracking-[0.24em] md:text-lg">
                {SITE_CONFIG.title}
              </span>
            </MagnetHeading>
          </div>
          <div className="space-y-6 text-[0.9375rem] leading-[1.72] text-zinc-400 max-[430px]:space-y-5 sm:space-y-7 sm:text-[0.95rem] sm:leading-[1.75] md:space-y-8 md:text-base">
            <p data-cine="line" className="max-w-[65ch]">
              {ABOUT_INTRO}
            </p>
            <p data-cine="line" className="max-w-[65ch] border-l border-white/10 pl-4 text-zinc-500 sm:pl-6">
              {ABOUT_DETAIL}
            </p>
          </div>
        </div>

        {/* Résumé Details */}
        <div className="mt-14 border-t border-white/[0.06] pt-12 max-[430px]:mt-12 max-[430px]:pt-10 md:mt-24 md:pt-16 lg:mt-28 lg:pt-20">
          <div className="grid gap-12 max-[430px]:gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-24">

            {/* Left Column: Experience */}
            <div data-cine="panel">
              <h3 className="section-label mb-8 text-white md:mb-10">Experience</h3>
              <div className="flex flex-col gap-7 md:gap-8">
                {EXPERIENCE_DATA.map((exp, idx) => (
                  <div key={idx} className="group relative border-b border-white/[0.04] pb-8 last:border-0 last:pb-0">
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
                      <div>
                        <h4 className="font-serif text-xl tracking-[0.02em] text-zinc-100 transition-colors group-hover:text-white">{exp.role}</h4>
                        <p className="mt-1.5 text-sm font-medium text-zinc-400">{exp.company}</p>
                      </div>
                      <span className="section-label mt-1 text-[0.65rem] text-zinc-600 sm:mt-0 sm:text-right">{exp.date}</span>
                    </div>
                    <p className="mt-4 max-w-[min(65ch,100%)] text-sm leading-[1.7] text-zinc-500 transition-colors group-hover:text-zinc-400 md:max-w-md">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Capabilities & Education */}
            <div className="flex flex-col gap-12 max-[430px]:gap-10 md:gap-16" data-cine="panel">

              {/* Capabilities */}
              <div>
                <h3 className="section-label mb-6 text-white md:mb-8">Capabilities</h3>
                <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-1 xl:grid-cols-2">

                  {/* Design Focus */}
                  <div>
                    <h4 className="mb-5 text-[0.65rem] font-medium tracking-[0.2em] text-zinc-600 uppercase">Design Focus</h4>
                    <ul className="flex flex-wrap gap-2">
                      {SKILLS_DATA.map((skill, idx) => (
                        <li
                          key={idx}
                          className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[0.78rem] text-zinc-300 max-[360px]:px-2.5 max-[360px]:text-[0.72rem] sm:px-3.5 sm:text-[0.8rem]"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Software Stack — text list */}
                  <div>
                    <h4 className="mb-5 text-[0.65rem] font-medium tracking-[0.2em] text-zinc-600 uppercase">Software Stack</h4>
                    <ul className="flex flex-col gap-3">
                      {SOFTWARE_DATA.map((soft, idx) => (
                        <li
                          key={idx}
                          className="flex min-w-0 items-baseline justify-between gap-3 border-b border-white/[0.04] pb-3 text-sm"
                        >
                          <span className="min-w-0 text-zinc-300">{soft.name}</span>
                          <span className="text-[0.6rem] tracking-wider text-zinc-600 uppercase">{soft.level}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Premium floating tool icon cluster */}
              <ToolCluster />

              {/* Education & Leadership Grid */}
              <div className="grid gap-10 sm:grid-cols-2 border-t border-white/[0.06] pt-12">
                <div>
                  <h3 className="section-label mb-6 text-white">Education</h3>
                  <div className="text-sm">
                    <p className="font-serif text-lg text-zinc-200">{EDUCATION_DATA.degree}</p>
                    <p className="mt-2 font-medium text-zinc-400">{EDUCATION_DATA.school}</p>
                    <p className="mt-1 text-xs text-zinc-600">{EDUCATION_DATA.date}</p>
                  </div>
                </div>

                <div>
                  <h3 className="section-label mb-6 text-white">Leadership</h3>
                  <ul className="space-y-4 text-sm text-zinc-400">
                    {LEADERSHIP_DATA.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 border-l border-white/[0.08] pl-4">
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </CinematicSection>
  );
}
