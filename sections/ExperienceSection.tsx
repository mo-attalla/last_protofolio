import { CinematicSection } from "@/components/motion/CinematicSection";
import { MagnetHeading } from "@/components/motion/MagnetHeading";
import { EXPERIENCE_DATA } from "@/lib/site";

/**
 * Standalone Experience section — mirrors the design language of ServicesSection.
 * Scroll motion: CinematicSection variant "experience".
 *   - data-cine="label"   → section label fades in first
 *   - data-cine="heading" → h2 follows with power4.out
 *   - data-cine="job"     → each job card staggers in (0.22s gap, power4.out)
 *
 * Timing lives in CinematicSection.tsx > buildEntry > case "experience".
 * To adjust stagger timing, edit the stagger value on the "[data-cine=job]" tween.
 */
export function ExperienceSection() {
  return (
    <CinematicSection
      variant="experience"
      id="experience"
      className="section-shell scroll-mt-24"
      aria-labelledby="experience-heading"
    >
      <div className="cinematic-container">
        <p data-cine="label" className="section-label">
          Experience
        </p>
        <MagnetHeading
          as="h2"
          data-cine="heading"
          id="experience-heading"
          text="Where I've worked"
          className="mt-6 max-w-xl font-serif text-[clamp(1.7rem,5vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:text-[clamp(1.8rem,4.6vw,3rem)] md:mt-12"
        />

        <ul className="mt-10 space-y-0 border-t border-white/[0.08] max-[430px]:mt-9 md:mt-20">
          {EXPERIENCE_DATA.map((exp, index) => (
            <li
              key={index}
              data-cine="job"
              className="group grid gap-5 border-b border-white/[0.08] py-8 max-[430px]:gap-4 max-[430px]:py-7 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-10 md:py-12 lg:gap-16"
            >
              {/* Index number */}
              <span className="font-serif text-2xl text-zinc-600 tabular-nums md:pt-1 md:text-3xl">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Role + Company */}
              <div>
                <h3 className="font-serif text-xl tracking-[0.04em] text-zinc-100 transition-colors group-hover:text-white md:text-2xl">
                  {exp.role}
                </h3>
                <p className="mt-2 text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-300">
                  {exp.company}
                </p>
                <span className="mt-3 inline-block text-[0.65rem] tracking-[0.2em] text-zinc-600 uppercase">
                  {exp.date}
                </span>
              </div>

              {/* Description */}
              <p className="max-w-[min(65ch,100%)] text-sm leading-[1.75] text-zinc-500 transition-colors group-hover:text-zinc-400 md:max-w-md md:text-[0.95rem]">
                {exp.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </CinematicSection>
  );
}
