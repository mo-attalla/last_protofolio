"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ABOUT_INTRO, SITE_CONFIG } from "@/lib/site";

export function HeroSection() {
  // Outer hero: minimal static background only.
  const heroSectionRef = useRef<HTMLElement>(null);
  const backgroundBaseRef = useRef<HTMLDivElement>(null);

  // Premium frame: holds all cinematic visuals (bg, streaks, portraits, mask).
  const frameRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  const atmosphereLayerRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const pulseOverlayRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const streakLayerRef = useRef<HTMLDivElement>(null);
  const streakPrimaryRef = useRef<HTMLDivElement>(null);
  const streakSecondaryRef = useRef<HTMLDivElement>(null);
  const streakTertiaryRef = useRef<HTMLDivElement>(null);

  // Portrait stack (mask coordinates are relative to this box).
  const imageStackRef = useRef<HTMLDivElement>(null);
  const bruceLayerRef = useRef<HTMLDivElement>(null);
  const batmanLayerRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = heroSectionRef.current;
    const imageStack = imageStackRef.current;
    const batmanLayer = batmanLayerRef.current;
    if (!section || !imageStack || !batmanLayer) return;

    const ctx = gsap.context(() => {
      const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      // Initial visual setup (keep existing cinematic entrance behavior intact)
      gsap.set(backgroundBaseRef.current, { autoAlpha: 1 });
      gsap.set(frameRef.current, { autoAlpha: 0, scale: 0.985, y: 12 });
      gsap.set(backgroundImageRef.current, { autoAlpha: 0, scale: 1.06 });
      gsap.set(atmosphereLayerRef.current, { autoAlpha: 0 });
      gsap.set(darkOverlayRef.current, { autoAlpha: 0.88 });
      gsap.set(vignetteRef.current, { autoAlpha: 0.38 });
      gsap.set(pulseOverlayRef.current, { autoAlpha: 0 });
      gsap.set(streakLayerRef.current, { autoAlpha: 0 });
      gsap.set(streakPrimaryRef.current, { xPercent: -6, yPercent: -4 });
      gsap.set(streakSecondaryRef.current, { xPercent: 8, yPercent: 3 });
      gsap.set(streakTertiaryRef.current, { xPercent: -8, yPercent: 5 });

      gsap.set(imageStackRef.current, { autoAlpha: 1, y: 22, scale: 0.97, filter: "blur(5px)" });
      gsap.set(bruceLayerRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
      // Batman lives in the DOM but is initially hidden by the mask
      gsap.set(batmanLayer, { autoAlpha: 1, scale: 1, filter: "blur(0.4px) brightness(0.93)" });

      gsap.set(headingRef.current, { autoAlpha: 0, y: 18 });
      gsap.set(subtitleRef.current, { autoAlpha: 0, y: 12 });
      gsap.set(introRef.current, { autoAlpha: 0, y: 12 });

      // Entrance timeline (concise)
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 2.6 });
      introTl
        .to(frameRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 1.35 })
        .to(backgroundImageRef.current, { autoAlpha: 0.72, scale: 1, duration: 2 }, "-=0.9")
        .to(imageStackRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }, "-=1.05")
        .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 1.1 }, "-=0.95")
        .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 1 }, "-=0.88")
        .to(introRef.current, { autoAlpha: 1, y: 0, duration: 1 }, "-=0.8");

      // Heading micro-interaction (for fine pointers)
      if (headingRef.current && supportsFinePointer) {
        const letters = headingRef.current.querySelectorAll('[data-char]');
        const radius = 100;
        const strength = 12;

        const onHeadingMove = (e: PointerEvent) => {
          const { clientX, clientY } = e;
          letters.forEach((letter) => {
            const rect = letter.getBoundingClientRect();
            const letterX = rect.left + rect.width / 2;
            const letterY = rect.top + rect.height / 2;
            const dx = clientX - letterX;
            const dy = clientY - letterY;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            if (distance < radius) {
              const force = (radius - distance) / radius;
              const pushX = -(dx / distance) * (force * strength);
              const pushY = -(dy / distance) * (force * strength);
              const rotate = (dx / radius) * (force * 6);
              gsap.to(letter, { x: pushX, y: pushY, rotation: rotate, duration: 0.35, ease: "power2.out", overwrite: "auto" });
            } else {
              gsap.to(letter, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
            }
          });
        };

        const onHeadingLeave = () => {
          gsap.to(headingRef.current!.querySelectorAll('[data-char]'), { x: 0, y: 0, rotation: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        };

        const heroWrap = heroSectionRef.current;
        if (heroWrap) {
          heroWrap.addEventListener("pointermove", onHeadingMove);
          heroWrap.addEventListener("pointerleave", onHeadingLeave);
        }
      }

      // -------------------- New Portrait Mask Implementation --------------------
      // Create an irregular organic mask by composing multiple soft radial-gradients and a sliver.
      // The mask is controlled by pixel positions and sizes for high-performance updates.
      const isInteractive = supportsFinePointer;
      if (!isInteractive) {
        // Disable the interaction on mobile/touch. Show only base portrait (Bruce).
        batmanLayer.style.display = "none";
        return;
      }

      const maskImage = [
        "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0) 65%)",
        "radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0) 75%)",
        "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 80%)",
        "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 75%)",
        "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 70%)"
      ].join(", ");

      batmanLayer.style.webkitMaskImage = maskImage;
      batmanLayer.style.maskImage = maskImage;
      batmanLayer.style.webkitMaskRepeat = "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat";
      batmanLayer.style.maskRepeat = "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat";
      batmanLayer.style.webkitMaskSize = "0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px";
      batmanLayer.style.maskSize = "0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px";

      const maskState = { x: 0, y: 0, size: 0 };
      const maskXTo = gsap.quickTo(maskState, "x", { duration: 0.45, ease: "power3.out" });
      const maskYTo = gsap.quickTo(maskState, "y", { duration: 0.45, ease: "power3.out" });
      const maskSizeTo = gsap.quickTo(maskState, "size", { duration: 0.7, ease: "power2.inOut" });

      const applyMask = () => {
        const s = Math.max(0, Math.round(maskState.size));

        // --- 1. Core layer ---
        const w1 = s;
        const h1 = s;

        // --- 2. Anamorphic stretch (wider) ---
        const w2 = Math.round(s * 1.8);
        const h2 = Math.round(s * 0.6);

        // --- 3. Offset blob top-right ---
        const w3 = Math.round(s * 1.25);
        const h3 = Math.round(s * 1.25);

        // --- 4. Offset blob bottom-left ---
        const w4 = Math.round(s * 1.4);
        const h4 = Math.round(s * 0.9);

        // --- 5. Subtle glowing feather edge ---
        const w5 = Math.round(s * 2.4);
        const h5 = Math.round(s * 2.4);

        const px = Math.round(maskState.x);
        const py = Math.round(maskState.y);

        // Center calculation with artistic offsets
        const pos1 = `${px - Math.round(w1 / 2)}px ${py - Math.round(h1 / 2)}px`;
        const pos2 = `${px - Math.round(w2 / 2)}px ${py - Math.round(h2 / 2) + Math.round(s * 0.05)}px`;
        const pos3 = `${px - Math.round(w3 / 2) + Math.round(s * 0.18)}px ${py - Math.round(h3 / 2) - Math.round(s * 0.12)}px`;
        const pos4 = `${px - Math.round(w4 / 2) - Math.round(s * 0.22)}px ${py - Math.round(h4 / 2) + Math.round(s * 0.15)}px`;
        const pos5 = `${px - Math.round(w5 / 2)}px ${py - Math.round(h5 / 2)}px`;

        const sizeStr = `${w1}px ${h1}px, ${w2}px ${h2}px, ${w3}px ${h3}px, ${w4}px ${h4}px, ${w5}px ${h5}px`;
        const posStr = `${pos1}, ${pos2}, ${pos3}, ${pos4}, ${pos5}`;

        batmanLayer.style.webkitMaskSize = sizeStr;
        batmanLayer.style.maskSize = sizeStr;

        batmanLayer.style.webkitMaskPosition = posStr;
        batmanLayer.style.maskPosition = posStr;
      };

      gsap.ticker.add(applyMask);

      gsap.set(frameRef.current, { perspective: 1200 });
      gsap.set(imageStack, { transformStyle: "preserve-3d" });
      const tiltYTo = gsap.quickTo(imageStack, "rotationX", { duration: 0.8, ease: "power3.out" });
      const tiltXTo = gsap.quickTo(imageStack, "rotationY", { duration: 0.8, ease: "power3.out" });
      const scaleTo = gsap.quickTo(imageStack, "scale", { duration: 0.8, ease: "power3.out" });

      const onPointerMove = (ev: PointerEvent) => {
        const rect = imageStack.getBoundingClientRect();
        const localX = ev.clientX - rect.left;
        const localY = ev.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((localY - centerY) / centerY) * -3.5;
        const rotateY = ((localX - centerX) / centerX) * 3.5;
        tiltXTo(rotateY);
        tiltYTo(rotateX);

        maskXTo(localX);
        maskYTo(localY);
      };

      const onPointerEnter = (ev: PointerEvent) => {
        scaleTo(1.02);
        const rect = imageStack.getBoundingClientRect();
        const localX = ev.clientX - rect.left;
        const localY = ev.clientY - rect.top;
        maskState.x = localX;
        maskState.y = localY;
        applyMask();
        maskSizeTo(420);
      };

      const onPointerLeave = () => {
        tiltXTo(0);
        tiltYTo(0);
        scaleTo(1.006);
        maskSizeTo(0);
      };

      imageStack.addEventListener("pointermove", onPointerMove);
      imageStack.addEventListener("pointerenter", onPointerEnter);
      imageStack.addEventListener("pointerleave", onPointerLeave);

      return () => {
        gsap.ticker.remove(applyMask);
        imageStack.removeEventListener("pointermove", onPointerMove);
        imageStack.removeEventListener("pointerenter", onPointerEnter);
        imageStack.removeEventListener("pointerleave", onPointerLeave);
      };
    }, heroSectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!heroSectionRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowAmbientMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches &&
      !prefersReduced;

    if (!allowAmbientMotion) return;

    const ctx = gsap.context(() => {
      const motionTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      motionTl
        .to(
          [streakPrimaryRef.current, streakSecondaryRef.current, streakTertiaryRef.current],
          {
            x: (index: number) => (index === 1 ? -10 : 8),
            y: (index: number) => (index === 2 ? -8 : 6),
            duration: 11.5,
            stagger: 0.2,
          },
          0,
        )
        .to(
          backgroundImageRef.current,
          {
            x: 5,
            y: -4,
            duration: 12,
          },
          0,
        )
        .to(
          atmosphereLayerRef.current,
          {
            opacity: 0.54,
            duration: 12,
          },
          0,
        );
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroSectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Outer: clean dark base only — no motion, no hero PNG here */}
      <div
        ref={backgroundBaseRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,#141414_0%,#0a0a0a_45%,#050505_100%)]"
        aria-hidden
      />

      <div className="cinematic-container relative z-10 mx-auto flex min-h-screen flex-col gap-10 py-12 max-[430px]:gap-9 max-[430px]:py-10 md:flex-row md:items-center md:justify-between md:gap-10 md:py-20 lg:gap-16">
        {/* Mobile: frame first (order-1). Desktop: text left (order-1). */}
        <div className="order-2 flex w-full flex-col justify-center text-center md:order-1 md:max-w-lg md:pr-4 md:text-left lg:pr-8">
          <h1
            ref={headingRef}
            className="flex flex-wrap justify-center text-[clamp(1.85rem,8vw,2.65rem)] leading-[1.08] font-semibold tracking-[0.05em] text-white min-[390px]:text-[clamp(1.95rem,7.2vw,2.85rem)] min-[430px]:tracking-[0.055em] sm:text-[clamp(2.05rem,6vw,3.15rem)] md:justify-start md:text-[2.75rem] md:tracking-[0.06em] lg:text-6xl"
          >
            {SITE_CONFIG.name.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="inline-flex whitespace-nowrap">
                {word.split("").map((char, charIndex) => (
                  <span
                    key={charIndex}
                    data-char
                    className="relative inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
                {wordIndex !== SITE_CONFIG.name.split(" ").length - 1 && (
                  <span className="w-[0.3em] inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </h1>
          <p
            ref={subtitleRef}
            className="mt-5 text-xs tracking-[0.22em] text-zinc-300 uppercase min-[390px]:tracking-[0.24em] sm:mt-6 sm:text-sm sm:tracking-[0.26em] md:mt-7 md:text-base"
          >
            {SITE_CONFIG.title}
          </p>
          <p
            ref={introRef}
            className="mx-auto mt-6 max-w-[min(36ch,100%)] text-[0.9375rem] leading-[1.72] text-zinc-400 sm:leading-[1.75] md:mx-0 md:max-w-sm md:text-[0.95rem]"
          >
            {ABOUT_INTRO}
          </p>
        </div>

        {/* Framed visual: all cinematic content clipped inside */}
        <div className="order-1 flex w-full justify-center px-0 md:order-2 md:flex-1 md:justify-end">
          <div
            ref={frameRef}
            className="relative aspect-[3/4] w-full max-w-[min(100%,min(20.5rem,calc(100vw-1.75rem)))] overflow-hidden rounded-[1.15rem] border border-white/[0.09] bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_44px_-14px_rgba(0,0,0,0.72)] min-[390px]:max-w-[min(100%,min(22.5rem,calc(100vw-2rem)))] min-[430px]:max-w-[min(100%,min(24rem,calc(100vw-2rem)))] sm:rounded-2xl sm:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_48px_-12px_rgba(0,0,0,0.65)] sm:max-w-[min(100%,380px)] md:max-w-[min(100%,420px)] lg:max-w-[min(100%,460px)]"
          >
            {/* Background + atmosphere — scoped to frame */}
            <div ref={backgroundImageRef} className="absolute inset-0">
              <Image
                src="/images/backgrounds/hero-bg.png"
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 360px) 280px, (max-width: 430px) 320px, (max-width: 768px) 360px, 420px"
              />
            </div>
            <div
              ref={atmosphereLayerRef}
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.55)_100%)]"
              aria-hidden
            />
            <div ref={darkOverlayRef} className="absolute inset-0 bg-black/78" aria-hidden />
            <div ref={streakLayerRef} className="absolute inset-0 overflow-hidden" aria-hidden>
              <div
                ref={streakPrimaryRef}
                className="absolute -left-[18%] top-[18%] h-px w-[145%] rotate-[-8deg] bg-gradient-to-r from-transparent via-white/8 to-transparent"
              />
              <div
                ref={streakSecondaryRef}
                className="absolute -left-[12%] top-[44%] h-px w-[140%] rotate-[6deg] bg-gradient-to-r from-transparent via-white/6 to-transparent"
              />
              <div
                ref={streakTertiaryRef}
                className="absolute -left-[10%] top-[68%] h-px w-[138%] rotate-[-4deg] bg-gradient-to-r from-transparent via-white/5 to-transparent"
              />
            </div>
            <div
              ref={vignetteRef}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,transparent_35%,rgba(0,0,0,0.55)_100%)]"
              aria-hidden
            />
            <div ref={pulseOverlayRef} className="absolute inset-0 bg-black/55" aria-hidden />

            <div className="pointer-events-none absolute inset-0 z-10">
              <div
                ref={imageStackRef}
                className="pointer-events-auto absolute inset-0 overflow-hidden rounded-xl will-change-transform"
              >
                <div
                  ref={bruceLayerRef}
                  className="absolute inset-0 will-change-transform will-change-opacity"
                >
                  <Image
                    src="/images/hero/bruce.png"
                    alt={SITE_CONFIG.name}
                    fill
                    priority
                    draggable={false}
                    className="scale-[1.07] object-cover object-[center_15%] max-[400px]:object-[center_12%] sm:scale-[1.05] sm:object-[center_20%] md:object-[center_22%]"
                    sizes="(max-width: 430px) 90vw, (max-width: 640px) 100vw, (max-width: 1024px) 380px, 460px"
                  />
                </div>

                {/* Layer B: Interactive Pointer Flashlight Mask Mode */}
                <div
                  ref={batmanLayerRef}
                  className="absolute inset-0 will-change-transform"
                >
                  <Image
                    src="/images/hero/batman.png"
                    alt=""
                    fill
                    priority
                    draggable={false}
                    className="scale-[1.07] object-cover object-[center_15%] max-[400px]:object-[center_12%] sm:scale-[1.05] sm:object-[center_20%] md:object-[center_22%]"
                    sizes="(max-width: 430px) 90vw, (max-width: 640px) 100vw, (max-width: 1024px) 380px, 460px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
