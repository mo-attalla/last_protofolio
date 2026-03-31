"use client";

import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type ProjectLightboxProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

/**
 * Fullscreen gallery: contain-fit image, prev/next, arrows + Escape.
 * Fixed overlay above page content.
 */
export function ProjectLightbox({ images, initialIndex, onClose }: ProjectLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const firstPaint = useRef(true);
  const [index, setIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, Math.max(0, images.length - 1))),
  );

  const safeIndex = Math.max(0, Math.min(index, images.length - 1));
  const src = images[safeIndex];

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    if (stage) {
      gsap.to(stage, { scale: 0.99, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
    }
    if (overlay) {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  }, [onClose]);

  const go = useCallback(
    (delta: number) => {
      if (images.length <= 1) return;
      setIndex((i) => {
        const next = i + delta;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, handleClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    if (!overlay || !stage) return;

    if (firstPaint.current) {
      firstPaint.current = false;
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(
        stage,
        { autoAlpha: 0, scale: 0.98, y: 12 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.04 },
      );
      return;
    }

    gsap.fromTo(
      stage,
      { autoAlpha: 0.4, scale: 0.992 },
      { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.out" },
    );
  }, [safeIndex]);

  const showNav = images.length > 1;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[280] flex flex-col items-center justify-center bg-[#030303]/96 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={handleClose}
    >
      <div className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[281] flex items-center gap-3 md:right-8 md:top-8 md:gap-4">
        {showNav ? (
          <span className="text-[0.65rem] tracking-[0.2em] text-zinc-600 uppercase">
            {safeIndex + 1} / {images.length}
          </span>
        ) : null}
        <button
          type="button"
          className="min-h-[44px] min-w-[44px] px-2 text-xs tracking-[0.2em] text-zinc-500 uppercase transition-colors hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          Close
        </button>
      </div>

      {showNav ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-1 top-1/2 z-[281] flex min-h-[48px] min-w-[48px] -translate-y-1/2 items-center justify-center rounded-sm border border-white/10 bg-black/40 px-2 text-[0.65rem] tracking-[0.12em] text-zinc-400 uppercase backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white sm:left-2 sm:px-3 md:left-6 md:min-h-0 md:min-w-0 md:px-4 md:py-6 md:text-xs md:tracking-[0.15em]"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            Prev
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-1 top-1/2 z-[281] flex min-h-[48px] min-w-[48px] -translate-y-1/2 items-center justify-center rounded-sm border border-white/10 bg-black/40 px-2 text-[0.65rem] tracking-[0.12em] text-zinc-400 uppercase backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white sm:right-2 sm:px-3 md:right-6 md:min-h-0 md:min-w-0 md:px-4 md:py-6 md:text-xs md:tracking-[0.15em]"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            Next
          </button>
        </>
      ) : null}

      <div
        ref={stageRef}
        className="relative flex h-[min(78dvh,920px)] w-full max-w-[min(96vw,1440px)] items-center justify-center sm:h-[min(84dvh,920px)] md:h-[min(88dvh,920px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {src ? (
          <div className="relative h-full w-full min-h-[200px]">
            <Image
              key={src}
              src={src}
              alt=""
              fill
              className="object-contain object-center"
              sizes="100vw"
              quality={95}
              priority
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
