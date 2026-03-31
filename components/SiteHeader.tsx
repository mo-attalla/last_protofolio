"use client";

import { SITE_CONFIG } from "@/lib/site";

type SiteHeaderProps = {
  onOpenMenu: () => void;
  menuOpen: boolean;
  onBrandClick: () => void;
};

/**
 * Fixed bar: subtle glass over the hero, slightly stronger when the menu is open (still under overlay z-index).
 */
export function SiteHeader({ onOpenMenu, menuOpen, onBrandClick }: SiteHeaderProps) {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50">
      <div
        className={`border-b transition-[background-color,backdrop-filter,border-color] duration-500 ease-out ${
          menuOpen
            ? "border-white/[0.06] bg-black/45 backdrop-blur-md"
            : "border-transparent bg-black/25 backdrop-blur-[10px] supports-[backdrop-filter]:bg-black/20"
        }`}
      >
        <div className="cinematic-container flex items-center justify-between pb-4 pt-[max(1rem,calc(0.75rem+env(safe-area-inset-top)))] md:py-5">
          <button
            type="button"
            onClick={onBrandClick}
            className="pointer-events-auto text-left text-[0.8125rem] tracking-[0.16em] text-zinc-100 uppercase transition-[opacity,letter-spacing] duration-300 hover:tracking-[0.18em] hover:opacity-90"
          >
            {SITE_CONFIG.name}
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            className="pointer-events-auto group flex items-center gap-3 text-[0.6875rem] tracking-[0.26em] text-zinc-400 uppercase transition-colors duration-300 hover:text-zinc-100"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
          >
            <span
              className="h-px w-7 origin-left bg-current transition-transform duration-300 ease-out group-hover:scale-x-110"
              aria-hidden
            />
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
