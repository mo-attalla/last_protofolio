"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import { MagnetHeading } from "@/components/motion/MagnetHeading";

function ensureScrollTrigger() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

/** A single portfolio PDF page card */
function PortfolioCard({
  index,
  pdfSrc,
  onOpen,
}: {
  index: number;
  pdfSrc: string;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 3D tilt — same logic as ProjectImageCard
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    const wrapper = wrapperRef.current;
    if (!card || !wrapper) return;
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 1024) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    gsap.to(wrapper, { rotationX: rotateX, rotationY: rotateY, duration: 0.6, ease: "power3.out" });
  };

  const handleMouseEnter = () => {
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 1024) return;
    gsap.to(wrapperRef.current, { scale: 1.02, duration: 0.6, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 1024) return;
    gsap.to(wrapperRef.current, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: "power3.out" });
  };

  return (
    <li
      ref={cardRef}
      className="group relative w-[min(88vw,20.5rem)] shrink-0 snap-center min-[390px]:w-[min(88vw,22rem)] min-[430px]:w-[min(86vw,23rem)] sm:w-[55vw] md:w-[45vw] lg:w-[35vw] max-w-[550px]"
      data-portfolio-card
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className="flex h-full flex-col justify-center px-0.5 sm:px-1 lg:h-[70vh] lg:px-4">
        <div
          ref={wrapperRef}
          className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-zinc-950 ring-1 ring-inset ring-white/[0.07] transition-[box-shadow,ring-color] duration-500 ease-out active:opacity-95 max-lg:active:scale-[0.99] lg:group-hover:ring-white/[0.2] will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
          onClick={onOpen}
        >
          {/* PDF embedded preview */}
          <iframe
            src={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            title={`Portfolio Page ${index + 1}`}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 max-lg:opacity-35 lg:opacity-0 lg:group-hover:opacity-50"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }}
          />

          {/* Page number */}
          <div className="absolute bottom-5 left-6 md:bottom-8 md:left-8 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
            <span className="font-serif text-3xl tabular-nums drop-shadow-md text-white/90 md:text-4xl block">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Click to view label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-sans tracking-[0.15em] uppercase px-6 py-3 rounded-full">
              View PDF
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}

/** Full-screen PDF lightbox */
function PdfLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <p className="font-sans text-sm tracking-[0.18em] uppercase text-zinc-400">Portfolio</p>
        <div className="flex items-center gap-4">
          <a
            href={src}
            download
            className="font-sans text-sm tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors duration-200 border border-white/10 px-4 py-2 rounded-full hover:border-white/30"
          >
            Download PDF
          </a>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all duration-200"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF viewer */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={`${src}#toolbar=1&view=FitH`}
          className="w-full h-full border-0"
          title="Portfolio PDF Viewer"
        />
      </div>
    </div>
  );
}

export function PortfolioSection({ pdfPath = "/portfolio/portfolio.pdf" }: { pdfPath?: string }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Same horizontal scroll pinning as ProjectsSection
  useLayoutEffect(() => {
    ensureScrollTrigger();
    const pinContainer = pinRef.current;
    const track = trackRef.current;
    const wrapper = trackWrapperRef.current;
    if (!pinContainer || !track || !wrapper) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

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

        tl.to(track, { x: getScrollAmount, ease: "none" });

        gsap.fromTo(
          track.querySelectorAll("[data-portfolio-card]"),
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
              scrub: 1.2,
            },
          }
        );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          track.querySelectorAll("[data-portfolio-card]"),
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
          }
        );
      });
    }, pinContainer);

    return () => ctx.revert();
  }, []);

  // 3 "pages" cards — each shows a different part of the PDF
  const pages = [
    { index: 0, page: 1 },
    { index: 1, page: 5 },
    { index: 2, page: 9 },
  ];

  return (
    <>
      <section id="portfolio" className="relative block bg-[#050505] shadow-[0_-20px_50px_rgba(0,0,0,0.8)_inset]">
        {/* Intro block */}
        <div className="mx-auto w-full max-w-[100rem] px-4 pb-12 pt-[3.75rem] max-[430px]:px-3.5 max-[430px]:pb-10 max-[430px]:pt-[3.25rem] sm:px-8 md:px-12 md:pb-20 md:pt-[6rem] lg:px-16 lg:pb-12 text-zinc-100">
          <header className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-2xl">
              <p className="section-label">Full portfolio</p>
              <MagnetHeading
                as="h2"
                text="Portfolio"
                className="mt-4 font-serif text-[clamp(1.75rem,5.2vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:mt-5 md:mt-6"
              />
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.75] text-zinc-500 sm:mt-6 sm:text-[0.95rem] sm:leading-[1.8]">
                <span className="lg:hidden">Browse through my complete portfolio. Tap any card to open the full PDF.</span>
                <span className="hidden lg:inline">
                  A curated look at my complete body of work — branding, editorial, and design systems. Click any card to open the full portfolio.
                </span>
              </p>
            </div>
            <button
              onClick={() => setLightboxOpen(true)}
              className="shrink-0 self-start md:self-auto font-sans text-sm tracking-[0.18em] uppercase text-zinc-400 hover:text-white transition-colors duration-200 border border-white/10 px-6 py-3 rounded-full hover:border-white/30"
            >
              Open Full PDF
            </button>
          </header>
        </div>

        {/* Horizontal pinned track */}
        <div ref={pinRef} className="relative block lg:flex lg:h-[100vh] lg:flex-col lg:justify-center">
          <div
            ref={trackWrapperRef}
            className="touch-scroll-x relative w-full touch-pan-x overflow-x-auto overscroll-x-contain pb-12 max-[430px]:pb-10 lg:overflow-hidden lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <ul
              ref={trackRef}
              className="flex w-max snap-x snap-mandatory gap-4 px-4 max-[430px]:gap-3.5 max-[430px]:px-3.5 sm:gap-8 sm:px-8 md:gap-12 md:px-12 lg:items-center lg:snap-none lg:gap-0 lg:px-[15vw]"
            >
              {pages.map(({ index }) => (
                <PortfolioCard
                  key={index}
                  index={index}
                  pdfSrc={`${pdfPath}#page=${index * 4 + 1}`}
                  onOpen={() => setLightboxOpen(true)}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <PdfLightbox src={pdfPath} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
