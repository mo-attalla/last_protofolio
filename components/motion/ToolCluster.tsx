"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   TOOL_ICONS — add, remove, or reorder entries here.
   Each icon has:
     label   : short display name
     bg      : badge background colour
     depth   : parallax depth factor (0 = static, 0.3 = most reactive)
     floatY  : idle float amplitude in px (positive = floats up/down more)
     floatDur: idle float cycle duration in seconds
     delay   : idle float delay offset in seconds (avoids all icons syncing)
     pos     : cluster position as { left, top } in percent of container
   ───────────────────────────────────────────────────────────────────────────── */
const TOOL_ICONS = [
  {
    label: "Photoshop",
    bg: "#001E36",
    depth: 0.12,
    floatY: 5,
    floatDur: 3.4,
    delay: 0,
    pos: { left: "0%", top: "22%" },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontSize="21" fontWeight="700"
          fill="#31A8FF" letterSpacing="-1">Ps</text>
      </svg>
    ),
  },
  {
    label: "Illustrator",
    bg: "#1C0A00",
    depth: 0.22,
    floatY: 7,
    floatDur: 2.9,
    delay: 0.6,
    pos: { left: "28%", top: "0%" },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontSize="21" fontWeight="700"
          fill="#FF9A00" letterSpacing="-1">Ai</text>
      </svg>
    ),
  },
  {
    label: "Figma",
    bg: "#1A1A1A",
    depth: 0.28,
    floatY: 6,
    floatDur: 3.1,
    delay: 1.1,
    pos: { left: "55%", top: "30%" },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="14" y="7"  width="10" height="10" rx="5" fill="#F24E1E"/>
        <rect x="24" y="7"  width="10" height="10" rx="5" fill="#FF7262"/>
        <rect x="14" y="17" width="10" height="10" rx="5" fill="#A259FF"/>
        <rect x="14" y="27" width="10" height="10" rx="5" fill="#0ACF83"/>
        <rect x="24" y="17" width="10" height="10" rx="5" fill="#1ABCFE"/>
      </svg>
    ),
  },
  {
    label: "InDesign",
    bg: "#1C0018",
    depth: 0.18,
    floatY: 8,
    floatDur: 3.8,
    delay: 0.3,
    pos: { left: "18%", top: "62%" },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontSize="21" fontWeight="700"
          fill="#FF3366" letterSpacing="-1">Id</text>
      </svg>
    ),
  },
  {
    label: "Premiere",
    bg: "#00001E",
    depth: 0.08,
    floatY: 4,
    floatDur: 4.2,
    delay: 1.5,
    pos: { left: "70%", top: "5%" },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontSize="21" fontWeight="700"
          fill="#9999FF" letterSpacing="-1">Pr</text>
      </svg>
    ),
  },
] as const;

/* ─── Tuning ───────────────────────────────────────────────────────────────── */
/** Max px shift when mouse hits the container edge */
const PARALLAX_STRENGTH = 14;
/** Smoothing for mouse parallax (lower = smoother) */
const PARALLAX_EASE = "power2.out";
const PARALLAX_DURATION = 0.9;
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * ToolCluster — premium floating icon composition for the About section.
 *
 * Layout:  5 icons absolutely positioned inside a relative container
 *          with intentional offsets (see TOOL_ICONS[n].pos)
 * Motion:  Three independent layers:
 *   1. Idle float  — each icon drifts on its own subtle GSAP yoyo loop
 *   2. Hover       — CSS: scale(1.12) + translateY(-6px) + shadow
 *   3. Parallax    — mouse offset shifts each icon at its own `depth` rate
 */
export function ToolCluster() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const icons = iconsRef.current.filter(Boolean) as HTMLDivElement[];
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const ctx = gsap.context(() => {
      /* ── 1. Idle float: each icon on its own yoyo loop ── */
      icons.forEach((el, i) => {
        const cfg = TOOL_ICONS[i];
        gsap.to(el, {
          y: -cfg.floatY,
          duration: cfg.floatDur,
          delay: cfg.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      /* ── 2. Mouse parallax (fine pointer only) ── */
      if (!isFine) return;

      const onMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        // Normalise to -1 … +1 relative to container centre
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;

        icons.forEach((el, i) => {
          const depth = TOOL_ICONS[i].depth;
          gsap.to(el, {
            x: nx * PARALLAX_STRENGTH * depth,
            // parallax is additive on top of the float y; use rotationZ for a hint of tilt
            rotationZ: nx * 1.5 * depth,
            duration: PARALLAX_DURATION,
            ease: PARALLAX_EASE,
            overwrite: "auto",
          });
        });
      };

      const onLeave = () => {
        icons.forEach((el) => {
          gsap.to(el, {
            x: 0,
            rotationZ: 0,
            duration: 1.1,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      // Listen on whole section so parallax feels wider
      const section = container.closest("section") ?? container;
      section.addEventListener("mousemove", onMove as EventListener);
      section.addEventListener("mouseleave", onLeave as EventListener);

      return () => {
        section.removeEventListener("mousemove", onMove as EventListener);
        section.removeEventListener("mouseleave", onLeave as EventListener);
      };
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <h4 className="mb-6 text-[0.65rem] font-medium tracking-[0.2em] text-zinc-600 uppercase">
        Tools
      </h4>

      {/*
        Container: relative, fixed height on desktop, auto on mobile.
        Each icon is absolutely positioned via inline style (see TOOL_ICONS[n].pos).
        On mobile (< md) we switch to a simple flex row via a sibling ul.
      */}
      {/* Desktop cluster */}
      <div
        ref={containerRef}
        className="relative hidden md:block"
        style={{ height: 180 }}
        aria-label="Design tools used"
      >
        {TOOL_ICONS.map((tool, i) => (
          <div
            key={tool.label}
            ref={(el) => { iconsRef.current[i] = el; }}
            className="absolute flex flex-col items-center gap-2"
            style={{ left: tool.pos.left, top: tool.pos.top }}
          >
            {/* Badge */}
            <div
              className="
                group flex h-12 w-12 cursor-default items-center justify-center
                rounded-2xl border border-white/[0.07]
                shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                transition-[transform,box-shadow] duration-300 ease-out
                hover:scale-110 hover:-translate-y-1.5
                hover:shadow-[0_10px_32px_rgba(0,0,0,0.7)]
              "
              style={{ backgroundColor: tool.bg }}
            >
              <div className="h-7 w-7">{tool.icon}</div>
            </div>
            {/* Label */}
            <span className="text-[0.58rem] tracking-[0.18em] text-zinc-700 uppercase transition-colors duration-300 group-hover:text-zinc-400">
              {tool.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile fallback — simple wrap row, no cluster */}
      <ul className="flex flex-wrap gap-4 md:hidden" aria-label="Design tools used">
        {TOOL_ICONS.map((tool) => (
          <li key={tool.label} className="flex flex-col items-center gap-2">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
              style={{ backgroundColor: tool.bg }}
            >
              <div className="h-7 w-7">{tool.icon}</div>
            </div>
            <span className="text-[0.58rem] tracking-[0.18em] text-zinc-700 uppercase">
              {tool.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
