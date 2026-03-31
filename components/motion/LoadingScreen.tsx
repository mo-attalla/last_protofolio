"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    
    // Prevent scrolling while loading
    const initialOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = initialOverflow;
        }
      });

      const counter = { value: 0 };
      
      tl.to(counter, {
        value: 100,
        duration: 2.4, // Deliberate pacing for cinematic feel
        ease: "power2.inOut",
        onUpdate: () => {
          setProgress(Math.round(counter.value));
        }
      })
      .to(textRef.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.in"
      }, "+=0.1")
      .to(containerRef.current, {
        autoAlpha: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.3");
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#050505] text-zinc-300"
      aria-label="Loading site content"
    >
      <div className="relative overflow-hidden px-4">
        <span 
          ref={textRef}
          className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light tabular-nums tracking-[0.05em] drop-shadow-lg"
        >
          {String(progress).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
