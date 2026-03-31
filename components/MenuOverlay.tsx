"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { NAV_SECTIONS, SITE_CONFIG, SITE_EMAIL, SITE_TAGLINE, SOCIAL_LINKS } from "@/lib/site";

/**
 * Menu motion tuning — slower: ↑ overlayIn/navItemDuration; smoother: power4.out / longer stagger;
 * more dramatic: ↑ nav item y start (e.g. 48), ↑ stagger gap.
 */
const MENU_TIMINGS = {
  overlayIn: 0.52,
  navItemDuration: 0.55,
  navStagger: 0.09,
  navOverlap: 0.28,
  navY: 40,
  metaDuration: 0.48,
  metaStagger: 0.06,
  metaDelayAfterNav: 0.05,
  easeMain: "power3.out",
  easeOverlay: "power2.inOut",
} as const;

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onExitComplete?: () => void;
};

export function MenuOverlay({ open, onClose, onNavigate, onExitComplete }: MenuOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const onExitCompleteRef = useRef(onExitComplete);

  useEffect(() => {
    onExitCompleteRef.current = onExitComplete;
  }, [onExitComplete]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const topRow = topRowRef.current;
    const nav = navRef.current;
    const footer = footerRef.current;
    if (!root || !topRow || !nav || !footer) return;

    const navItems = nav.querySelectorAll<HTMLElement>("[data-menu-nav-item]");

    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(navItems, { autoAlpha: 0, y: MENU_TIMINGS.navY });
      gsap.set([topRow, footer], { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: MENU_TIMINGS.easeMain },
        onStart: () => {
          gsap.set(root, { pointerEvents: "auto" });
        },
        onReverseComplete: () => {
          gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
          onExitCompleteRef.current?.();
        },
      });

      tl.to(
        root,
        {
          autoAlpha: 1,
          duration: MENU_TIMINGS.overlayIn,
          ease: MENU_TIMINGS.easeOverlay,
        },
        0,
      )
        .to(
          navItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: MENU_TIMINGS.navItemDuration,
            stagger: MENU_TIMINGS.navStagger,
          },
          MENU_TIMINGS.navOverlap,
        )
        .to(
          topRow,
          {
            autoAlpha: 1,
            y: 0,
            duration: MENU_TIMINGS.metaDuration,
          },
          `-=${MENU_TIMINGS.metaDelayAfterNav + 0.12}`,
        )
        .to(
          footer,
          {
            autoAlpha: 1,
            y: 0,
            duration: MENU_TIMINGS.metaDuration,
          },
          `<${MENU_TIMINGS.metaStagger}`,
        );

      tlRef.current = tl;
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (open) {
      tl.play(0);
    } else if (tl.progress() > 0.01) {
      tl.reverse();
    }
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col bg-[rgba(3,3,3,0.97)] pt-[env(safe-area-inset-top)] backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Site menu"
    >
      <div className="cinematic-container flex min-h-0 flex-1 flex-col pt-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:pt-8 md:pb-12">
        <div
          ref={topRowRef}
          className="flex shrink-0 items-start justify-between gap-5 border-b border-white/[0.06] pb-6 max-[400px]:gap-4 max-[400px]:pb-5 md:gap-8 md:pb-10"
        >
          <p className="section-label max-w-[min(14rem,42vw)] text-left leading-relaxed text-zinc-500 max-[360px]:text-[0.7rem] max-[360px]:tracking-[0.16em]">
            {SITE_TAGLINE}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] shrink-0 self-start pt-2 text-right text-[0.6875rem] tracking-[0.26em] text-zinc-500 uppercase transition-colors duration-300 hover:text-zinc-100 max-[400px]:tracking-[0.22em]"
          >
            Close
          </button>
        </div>

        <nav
          ref={navRef}
          className="flex min-h-0 flex-1 flex-col justify-center py-6 max-[430px]:py-5 md:py-12"
          aria-label="Primary"
        >
          <ul className="flex flex-col gap-0 max-[400px]:gap-0 sm:gap-1.5 md:gap-2">
            {NAV_SECTIONS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-menu-nav-item
                  className="group relative w-full overflow-hidden py-2.5 text-left sm:py-2 md:py-2.5"
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="inline-block font-serif text-[clamp(1.65rem,9.5vw,3.75rem)] font-normal leading-[1.04] tracking-[0.02em] text-zinc-200 transition-[color,transform] duration-300 ease-out min-[390px]:text-[clamp(1.85rem,8.5vw,3.75rem)] group-hover:text-white md:group-hover:translate-x-2 lg:group-hover:translate-x-3">
                    {item.label}
                  </span>
                  <span
                    className="absolute bottom-1 left-0 h-px w-full max-w-0 bg-gradient-to-r from-white/30 to-transparent transition-[max-width] duration-500 ease-out group-hover:max-w-full"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <footer
          ref={footerRef}
          className="mt-auto flex shrink-0 flex-col gap-8 border-t border-white/[0.06] pt-8 max-[430px]:gap-7 max-[430px]:pt-7 md:flex-row md:items-end md:justify-between md:gap-12 md:pt-12"
        >
          <div className="min-w-0">
            <p className="section-label mb-2.5 text-zinc-600">Email</p>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="break-words text-sm text-zinc-400 transition-colors duration-300 hover:text-white md:text-base"
            >
              {SITE_EMAIL}
            </a>
          </div>
          <div>
            <p className="section-label mb-3.5 text-zinc-600">Social</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 max-[360px]:gap-x-5 md:gap-x-8 md:gap-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-zinc-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[0.6875rem] tracking-[0.2em] text-zinc-700 uppercase md:max-w-[10rem] md:text-right">
            {SITE_CONFIG.name}
          </p>
        </footer>
      </div>
    </div>
  );
}
