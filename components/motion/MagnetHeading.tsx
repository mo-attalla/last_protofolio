"use client";

import gsap from "gsap";
import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

/**
 * Magnet field options — tune per call-site without touching core logic.
 *
 * | param    | Hero value | Section default | effect                        |
 * |----------|-----------|-----------------|-------------------------------|
 * | radius   | 100       | 80              | pixels around cursor that pull|
 * | strength | 12        | 6               | max pixel offset per letter   |
 * | rotate   | 6         | 3               | max degrees rotation          |
 * | duration | 0.35/0.5  | 0.4/0.65        | in / settle duration          |
 */
export interface MagnetOptions {
  /** Radius in px within which letters react. Default: 80 */
  radius?: number;
  /** Max pixel displacement per letter. Default: 6 */
  strength?: number;
  /** Max degrees rotation per letter. Default: 3 */
  rotate?: number;
  /** Duration of the "push" tween. Default: 0.4 */
  inDuration?: number;
  /** Duration when letter floats back to rest. Default: 0.65 */
  outDuration?: number;
}

const DEFAULTS: Required<MagnetOptions> = {
  radius: 80,
  strength: 6,
  rotate: 3,
  inDuration: 0.4,
  outDuration: 0.65,
};

/**
 * Hook — attaches the magnet letter effect to `targetRef`.
 * Pointer events are listened on `listenerRef` (can differ from targetRef,
 * e.g. the full section element).
 *
 * Only activates on fine-pointer devices. No-ops on touch screens.
 */
export function useCharMagnet(
  targetRef: React.RefObject<HTMLElement | null>,
  listenerRef: React.RefObject<HTMLElement | null>,
  options?: MagnetOptions,
) {
  const opts = { ...DEFAULTS, ...options };

  useEffect(() => {
    const target = targetRef.current;
    const listener = listenerRef.current;
    if (!target || !listener) return;

    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!supportsFinePointer) return;

    const letters = target.querySelectorAll<HTMLElement>("[data-char]");
    const { radius, strength, rotate, inDuration, outDuration } = opts;

    const onMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < radius) {
          const force = (radius - dist) / radius;
          const pushX = -(dx / dist) * (force * strength);
          const pushY = -(dy / dist) * (force * strength);
          const rot = (dx / radius) * (force * rotate);
          gsap.to(letter, {
            x: pushX,
            y: pushY,
            rotation: rot,
            duration: inDuration,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(letter, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: outDuration,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    const onLeave = () => {
      gsap.to(Array.from(letters), {
        x: 0,
        y: 0,
        rotation: 0,
        duration: outDuration + 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    listener.addEventListener("pointermove", onMove);
    listener.addEventListener("pointerleave", onLeave);

    return () => {
      listener.removeEventListener("pointermove", onMove);
      listener.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* -------------------------------------------------------------------------- */
/*  MagnetHeading — drop-in replacement for any section <h2> / <h3>           */
/* -------------------------------------------------------------------------- */

type HeadingTag = "h1" | "h2" | "h3";

type MagnetHeadingProps<T extends HeadingTag> = ComponentPropsWithoutRef<T> & {
  /** HTML tag to render. Default: "h2" */
  as?: T;
  /** Text to split into characters. Must be a plain string. */
  text: string;
  /**
   * Ref to the element that listens for pointer events.
   * Defaults to the heading element itself if omitted.
   * Pass the section's ref to get a wider interaction zone.
   */
  listenerRef?: React.RefObject<HTMLElement | null>;
  /** Magnet tuning — leave empty to use subtle section defaults. */
  magnetOptions?: MagnetOptions;
};

/**
 * MagnetHeading — renders `text` split into individual `[data-char]` spans
 * and applies the magnetic letter-repulsion effect on fine-pointer devices.
 *
 * Usage:
 * ```tsx
 * <MagnetHeading
 *   as="h2"
 *   text="What I focus on"
 *   className="mt-8 font-serif ..."
 *   id="services-heading"
 *   listenerRef={sectionRef}      // optional: wider interaction zone
 *   magnetOptions={{ strength: 5 }} // optional: override defaults
 * />
 * ```
 *
 * To DISABLE the effect on a specific heading, omit `<MagnetHeading>` and
 * use a plain `<h2>` instead.
 */
export function MagnetHeading<T extends HeadingTag = "h2">({
  as,
  text,
  listenerRef,
  magnetOptions,
  children,
  ...rest
}: MagnetHeadingProps<T>) {
  const Tag = (as ?? "h2") as ElementType;
  const headingRef = useRef<HTMLElement | null>(null);
  const selfRef = useRef<HTMLElement | null>(null);

  // If no external listenerRef, fall back to the heading itself.
  const effectiveListener = listenerRef ?? selfRef;

  useCharMagnet(
    headingRef as React.RefObject<HTMLElement | null>,
    effectiveListener,
    magnetOptions,
  );

  // Split `text` into words → chars, keeping word spacing via a non-breaking span.
  const words = text.split(" ");

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        headingRef.current = node;
        selfRef.current = node;
      }}
      {...rest}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              data-char
              className="relative inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
          {/* Word gap — invisible space between words */}
          {wi < words.length - 1 && (
            <span className="inline-block w-[0.28em]" aria-hidden>
              &nbsp;
            </span>
          )}
        </span>
      ))}
      {/* Slot for any extra JSX children (e.g. the Hero subtitle line) */}
      {children}
    </Tag>
  );
}
