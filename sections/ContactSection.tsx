import { CinematicSection } from "@/components/motion/CinematicSection";
import { MagnetHeading } from "@/components/motion/MagnetHeading";
import { SITE_CONFIG, SITE_EMAIL, SITE_PHONE, SOCIAL_LINKS } from "@/lib/site";

/**
 * Closing beat for the page — copy and links centralized in `lib/site.ts`.
 * Scroll motion: variant "contact" (label → headline → tagline → panels → foot).
 */
export function ContactSection() {
  return (
    <CinematicSection
      variant="contact"
      id="contact"
      className="section-shell scroll-mt-24 pb-20 max-[430px]:pb-16 md:pb-32"
      aria-labelledby="contact-heading"
    >
      <div className="cinematic-container">
        <p data-cine="label" className="section-label">
          Contact
        </p>
        <div className="mt-8 grid gap-10 max-[430px]:gap-9 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-end md:gap-20 lg:gap-28">
          <div>
            <MagnetHeading
              as="h2"
              data-cine="heading"
              id="contact-heading"
              text={"Let\u2019s build something that holds its ground."}
              className="font-serif text-[clamp(1.7rem,5.2vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:text-[clamp(1.8rem,4.8vw,3rem)]"
            />
            <p data-cine="tagline" className="mt-5 max-w-[min(36ch,100%)] text-[0.9375rem] leading-[1.72] text-zinc-500 sm:mt-6 sm:max-w-md sm:text-[0.95rem] sm:leading-[1.75]">
              Currently open for select brand identities, editorial systems, and high-impact
              visual design projects. Let\u2019s talk.
            </p>
          </div>
          <div className="flex flex-col gap-8 border-t border-white/[0.08] pt-8 max-[430px]:gap-7 max-[430px]:pt-7 md:gap-10 md:border-t-0 md:border-l md:pl-12 md:pt-0 lg:pl-16">
            <div data-cine="panel" className="min-w-0">
              <p className="section-label mb-3 md:mb-4">Email</p>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="group flex w-full max-w-full flex-col gap-3 text-base leading-snug text-zinc-200 transition-colors hover:text-white sm:w-fit sm:flex-row sm:items-center sm:gap-4 sm:text-lg md:text-xl"
              >
                <span className="break-words">{SITE_EMAIL}</span>
                <span className="hidden h-[1px] w-6 shrink-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-12 group-hover:bg-white/60 sm:block" aria-hidden />
              </a>
            </div>
            <div data-cine="panel" className="min-w-0">
              <p className="section-label mb-3">Phone</p>
              <a
                href={`tel:${SITE_PHONE.replace(/\s+/g, "")}`}
                className="break-words text-base text-zinc-200 transition-colors hover:text-white sm:text-lg md:text-xl"
              >
                {SITE_PHONE}
              </a>
            </div>
            <div data-cine="panel">
              <p className="section-label mb-4">Social</p>
              <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p
          data-cine="foot"
          className="mt-14 text-center text-[0.65rem] tracking-[0.18em] text-zinc-700 uppercase max-[360px]:px-1 sm:text-xs sm:tracking-[0.2em] md:mt-24 lg:mt-28"
        >
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </p>
      </div>
    </CinematicSection>
  );
}
