"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { ProjectLightbox } from "@/components/ProjectLightbox";
import { MagnetHeading } from "@/components/motion/MagnetHeading";

function ensureScrollTrigger() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

const PLACEHOLDER_SLOTS = 3;

/**
 * Editorial Image Card Item (Direct Visual Rendering)
 */
function ProjectImageCard({
  src,
  index,
  onHoverEnter,
  onHoverLeave,
  onClick,
}: {
  src: string;
  index: number;
  onHoverEnter: (src: string) => void;
  onHoverLeave: () => void;
  onClick: (src: string) => void;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices and strictly mobile viewports
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 1024) {
      // Fallback: manually trigger hover functions if 3D is bypassed via standard listeners
      return; 
    }

    const card = cardRef.current;
    const wrapper = imageWrapperRef.current;
    if (!card || !wrapper) return;

    // quickTo for high-performance 3D rotation interpolation
    const xTo = gsap.quickTo(wrapper, "rotationY", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(wrapper, "rotationX", { duration: 0.8, ease: "power3.out" });
    const scaleTo = gsap.quickTo(wrapper, "scale", { duration: 0.6, ease: "power3.out" });

    // Set 3D perspective context on the parent boundary
    gsap.set(card, { perspective: 1200 }); 
    gsap.set(wrapper, { transformStyle: "preserve-3d" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation: centers at 0, edges push towards +/- 5 degrees maximum
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      xTo(rotateY);
      yTo(rotateX);
    };

    const handleMouseEnter = () => {
      scaleTo(1.02); // Entire frame slight depth pop
      onHoverEnter(src);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      scaleTo(1);
      onHoverLeave();
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [src, onHoverEnter, onHoverLeave]);

  return (
    <li
      ref={cardRef}
      className="group relative w-[min(88vw,20.5rem)] shrink-0 snap-center min-[390px]:w-[min(88vw,22rem)] min-[430px]:w-[min(86vw,23rem)] sm:w-[55vw] md:w-[45vw] lg:w-[35vw] max-w-[550px]"
      data-project-card
    >
      <article className="flex h-full flex-col justify-center px-0.5 sm:px-1 lg:h-[70vh] lg:px-4">
        <div
          ref={imageWrapperRef}
          className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-zinc-950 ring-1 ring-inset ring-white/[0.07] transition-[box-shadow,ring-color] duration-500 ease-out active:opacity-95 max-lg:active:scale-[0.99] lg:group-hover:ring-white/[0.15] sm:aspect-square md:aspect-[4/3] lg:aspect-[3/4] will-change-transform"
          onClick={() => onClick(src)}
        >
          <Image
            src={src}
            alt={`Project ${index + 1}`}
            fill
            className="object-cover object-center transition-opacity duration-700 ease-out max-lg:active:opacity-90 lg:group-hover:opacity-[0.92]"
            sizes="(max-width: 430px) 88vw, (max-width: 1023px) 85vw, 35vw"
          />
          <div 
            className="absolute inset-0 pointer-events-none transition-[opacity,transform] duration-500 max-lg:opacity-35 lg:opacity-0 lg:group-hover:opacity-40" 
            style={{ 
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)",
              transform: "translateZ(8px)" 
            }} 
          />
          
          <div className="absolute bottom-5 left-6 md:bottom-8 md:left-8 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
            <span className="font-serif text-3xl tabular-nums drop-shadow-md text-white/90 md:text-4xl block">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}

/**
 * Placeholder variant
 */
function ImagePlaceholderCard({ index }: { index: number }) {
  return (
    <li
      className="group relative w-[min(88vw,20.5rem)] shrink-0 snap-center min-[390px]:w-[min(88vw,22rem)] min-[430px]:w-[min(86vw,23rem)] sm:w-[55vw] md:w-[45vw] lg:w-[35vw] max-w-[550px]"
      data-project-card
    >
      <article className="flex h-full flex-col justify-center px-0.5 sm:px-1 lg:h-[70vh] lg:px-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950 ring-1 ring-inset ring-white/[0.04] lg:aspect-[3/4] sm:aspect-square md:aspect-[4/3]">
          <div className="absolute inset-0 opacity-[0.35] bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="font-serif text-3xl tabular-nums text-zinc-800 md:text-4xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-serif text-xl tracking-[0.02em] text-zinc-700">
              Awaiting visual
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}

export function ProjectsSection({ images = [] }: { images?: string[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const count = images.length;

  // 1) Floating Preview Logic
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || typeof window === "undefined" || window.innerWidth < 1024) return;

    gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.95 });

    // GSAP quickTo tracks mouse coordinates incredibly smoothly and rapidly
    const xTo = gsap.quickTo(preview, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleHoverEnter = (src: string) => {
    if (window.innerWidth < 1024) return;
    setHoveredImage(src);
    gsap.to(previewRef.current, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
  };

  const handleHoverLeave = () => {
    if (window.innerWidth < 1024) return;
    gsap.to(previewRef.current, { autoAlpha: 0, scale: 0.95, duration: 0.35, ease: "power2.inOut", overwrite: "auto" });
  };

  // ScrollTrigger Horizontal Track Logic
  useLayoutEffect(() => {
    ensureScrollTrigger();
    const pinContainer = pinRef.current;
    const track = trackRef.current;
    const wrapper = trackWrapperRef.current;
    if (!pinContainer || !track || !wrapper) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: Pin tracking area only
      mm.add("(min-width: 1024px)", () => {
        const getScrollAmount = () => -(track.scrollWidth - wrapper.offsetWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinContainer,
            start: "top top", 
            end: () => `+=${Math.abs(getScrollAmount())}`, 
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, {
          x: getScrollAmount,
          ease: "none", 
        });

        // Entrance fade for cards using standard scroll
        gsap.fromTo(
          track.querySelectorAll("[data-project-card]"),
          { autoAlpha: 0, x: 20 },
          { 
            autoAlpha: 1, 
            x: 0, 
            stagger: 0.1, 
            ease: "power2.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: pinContainer,
              start: "top 80%", 
              end: "top 40%",
              scrub: 1.2
            }
          }
        );
      });

      // Mobile/Tablet: native horizontal scroll — one-shot reveal (no scrub) for smoother scroll
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          track.querySelectorAll("[data-project-card]"),
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pinContainer,
              start: "top 82%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

    }, pinContainer);

    return () => ctx.revert();
  }, [images]); // Rebind logic if images prop updates

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="relative block bg-[#050505] shadow-[0_-20px_50px_rgba(0,0,0,0.8)_inset]">
        {/* 1) Vertical Intro Block */}
        <div className="mx-auto w-full max-w-[100rem] px-4 pb-12 pt-[3.75rem] max-[430px]:px-3.5 max-[430px]:pb-10 max-[430px]:pt-[3.25rem] sm:px-8 md:px-12 md:pb-20 md:pt-[6rem] lg:px-16 lg:pb-12 text-zinc-100">
          <header className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-2xl">
              <p className="section-label">Selected work</p>
              <MagnetHeading
                as="h2"
                text="Latest"
                className="mt-4 font-serif text-[clamp(1.75rem,5.2vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:mt-5 md:mt-6"
              />
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.75] text-zinc-500 sm:mt-6 sm:text-[0.95rem] sm:leading-[1.8]">
                <span className="lg:hidden">A visual showcase of recent work. Swipe horizontally to explore the sequence.</span>
                <span className="hidden lg:inline">
                  A visual showcase of recent campaigns, interfaces, and editorial design. Scroll horizontally to explore the sequence.
                </span>
              </p>
            </div>
            <p className="shrink-0 font-serif text-[clamp(1.75rem,6vw,2.25rem)] tabular-nums text-zinc-700 md:text-4xl">
              {String(count).padStart(2, "0")}
              <span className="ml-2 text-sm font-sans tracking-[0.2em] text-zinc-600 uppercase">
                in catalogue
              </span>
            </p>
          </header>
        </div>

        {/* 2) Horizontal Pinned Track Area */}
        <div ref={pinRef} className="relative block lg:flex lg:h-[100vh] lg:flex-col lg:justify-center">
          <div 
            ref={trackWrapperRef} 
            className="touch-scroll-x relative w-full touch-pan-x overflow-x-auto overscroll-x-contain pb-12 max-[430px]:pb-10 lg:overflow-hidden lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <ul 
              ref={trackRef} 
              className="flex w-max snap-x snap-mandatory gap-4 px-4 max-[430px]:gap-3.5 max-[430px]:px-3.5 sm:gap-8 sm:px-8 md:gap-12 md:px-12 lg:items-center lg:snap-none lg:gap-0 lg:px-[15vw]" 
            >
              {count === 0 ? (
                Array.from({ length: PLACEHOLDER_SLOTS }, (_, i) => (
                  <ImagePlaceholderCard key={i} index={i} />
                ))
              ) : (
                images.map((src, index) => (
                  <ProjectImageCard 
                    key={src} 
                    src={src} 
                    index={index} 
                    onHoverEnter={handleHoverEnter}
                    onHoverLeave={handleHoverLeave}
                    onClick={(src) => {
                      const i = images.indexOf(src);
                      if (i >= 0) setLightboxIndex(i);
                    }}
                  />
                ))
              )}
            </ul>
          </div>
        </div>

      {/* 3) Floating Premium Preview Panel (Desktop Only) */}
      <div 
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden aspect-[4/5] w-[260px] overflow-hidden bg-zinc-950 shadow-[0_24px_54px_rgba(0,0,0,0.9)] ring-1 ring-white/10 rounded-lg lg:block lg:w-[320px] xl:w-[380px]"
        aria-hidden
      >
        {hoveredImage && (
          <Image
            src={hoveredImage}
            alt="Preview"
            fill
            className="object-contain object-center p-3"
            sizes="(max-width: 1280px) 320px, 380px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
      </div>

      {lightboxIndex !== null && images.length > 0 && (
        <ProjectLightbox
          key={lightboxIndex}
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
