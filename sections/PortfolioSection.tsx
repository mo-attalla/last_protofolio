"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagnetHeading } from "@/components/motion/MagnetHeading";

function ensureScrollTrigger() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

/** Full-screen PDF lightbox */
function PdfLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <p className="font-sans text-sm tracking-[0.18em] uppercase text-zinc-400">Portfolio PDF</p>
        <div className="flex items-center gap-4">
          <a
            href={src}
            download
            className="font-sans text-sm tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors duration-200 border border-white/10 px-4 py-2 rounded-full hover:border-white/30"
          >
            Download
          </a>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all duration-200"
            aria-label="Close — or press Escape"
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

      {/* ESC hint */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-[0.65rem] tracking-[0.2em] uppercase text-zinc-700 pointer-events-none">
        Press Esc to close
      </p>
    </div>
  );
}

export function PortfolioSection({ pdfPath = "/portfolio/Attalla.pdf" }: { pdfPath?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Entrance animation — same cinematic fade-up as other sections
  useEffect(() => {
    ensureScrollTrigger();
    const el = contentRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  }, []);

  return (
    <>
      <section
        id="portfolio"
        ref={sectionRef}
        className="relative block bg-[#050505] shadow-[0_-20px_50px_rgba(0,0,0,0.8)_inset]"
      >
        <div
          ref={contentRef}
          className="mx-auto w-full max-w-[100rem] px-4 py-[5rem] max-[430px]:px-3.5 sm:px-8 md:px-12 md:py-[7rem] lg:px-16 lg:py-[8rem] text-zinc-100"
        >
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">

            {/* Left — label + heading + description */}
            <div className="max-w-2xl">
              <p className="section-label">Full portfolio</p>
              <MagnetHeading
                as="h2"
                text="Portfolio"
                className="mt-4 font-serif text-[clamp(1.75rem,5.2vw,3rem)] font-normal leading-[1.08] tracking-[0.02em] text-zinc-100 min-[390px]:mt-5 md:mt-6"
              />
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.75] text-zinc-500 sm:mt-6 sm:text-[0.95rem] sm:leading-[1.8]">
                A curated look at my complete body of work — branding, editorial, print, and social design. Open the PDF to explore every project in full detail.
              </p>
            </div>

            {/* Right — CTA button */}
            <div className="shrink-0">
              <button
                onClick={() => setLightboxOpen(true)}
                className="group relative inline-flex items-center gap-3 font-sans text-sm tracking-[0.18em] uppercase text-zinc-100 border border-white/20 px-8 py-4 rounded-full hover:border-white/50 transition-all duration-300 hover:bg-white/5"
              >
                <span>View Portfolio PDF</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent md:mt-20" />
        </div>
      </section>

      {lightboxOpen && (
        <PdfLightbox src={pdfPath} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
