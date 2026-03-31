import { CinematicSection } from "@/components/motion/CinematicSection";
import { MagnetHeading } from "@/components/motion/MagnetHeading";
import { SERVICE_DETAILS, SITE_CONFIG } from "@/lib/site";

/**
 * Service rows — list order follows `SITE_CONFIG.services`.
 * Scroll motion: `CinematicSection` variant "services" (heads → rows).
 */
export function ServicesSection() {
  return (
    <CinematicSection
      variant="services"
      id="services"
      className="section-shell scroll-mt-24"
      aria-labelledby="services-heading"
    >
      <div className="cinematic-container">
        <p data-cine="head" className="section-label">
          Services
        </p>
        <MagnetHeading
          as="h2"
          data-cine="head"
          id="services-heading"
          text="What I focus on"
          className="mt-6 max-w-xl font-serif text-[clamp(1.7rem,5vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:text-[clamp(1.8rem,4.6vw,3rem)] md:mt-12"
        />
        <p data-cine="head" className="mt-3 max-w-[min(36ch,100%)] text-[0.9375rem] leading-relaxed text-zinc-500 sm:mt-4 sm:max-w-lg sm:text-sm">
          Three lanes, one voice — each engagement is scoped for clarity and craft.
        </p>

        <ul className="mt-10 space-y-0 border-t border-white/[0.08] max-[430px]:mt-9 md:mt-20">
          {SITE_CONFIG.services.map((name, index) => (
            <li
              key={name}
              data-cine="row"
              className="grid gap-5 border-b border-white/[0.08] py-8 max-[430px]:gap-4 max-[430px]:py-7 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-10 md:py-12 lg:gap-16"
            >
              <span className="font-serif text-2xl text-zinc-600 tabular-nums md:pt-1 md:text-3xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-xl tracking-[0.04em] text-zinc-100 md:text-2xl">
                {name}
              </h3>
              <p className="max-w-[min(65ch,100%)] text-sm leading-[1.75] text-zinc-500 md:max-w-md md:text-[0.95rem]">
                {SERVICE_DETAILS[name]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </CinematicSection>
  );
}
