"use client";

import { useEffect, useState } from "react";

/**
 * Very subtle full-viewport film grain. Tweak opacity and animation in CSS variables below.
 */
export function FilmGrain() {
  const [lightweightGrain, setLightweightGrain] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)");
    const sync = () => setLightweightGrain(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className="film-grain pointer-events-none fixed inset-0 z-[2] overflow-hidden"
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] max-[1023px]:opacity-[0.028]">
        <defs>
          <filter id="cinematic-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={lightweightGrain ? 3 : 4}
              stitchTiles="stitch"
              result="noise"
            >
              {!lightweightGrain ? (
                <animate
                  attributeName="baseFrequency"
                  dur="12s"
                  values="0.75;0.85;0.78;0.75"
                  repeatCount="indefinite"
                />
              ) : null}
            </feTurbulence>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
              in="noise"
              result="mono"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#cinematic-grain)" />
      </svg>
      <div className="film-grain-drift absolute inset-[-50%] opacity-[0.02]" />
    </div>
  );
}
