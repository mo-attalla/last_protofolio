/**
 * Shared scroll-scene motion flags + timings.
 * Tune globally: higher `y` / `blur` / `duration` = more dramatic; lower = calmer.
 */
export type SceneMotionParams = {
  reduced: boolean;
  mobile: boolean;
  y: number;
  blur: number;
  duration: number;
  ease: string;
  /** Intro / heading stagger */
  staggerTight: number;
  /** List rows, project rows */
  staggerRows: number;
  /** ScrollTrigger start string */
  start: string;
};

export function getSceneMotionParams(): SceneMotionParams {
  if (typeof window === "undefined") {
    return {
      reduced: false,
      mobile: false,
      y: 56,
      blur: 8,
      duration: 1.08,
      ease: "power3.out",
      staggerTight: 0.09,
      staggerRows: 0.14,
      start: "top 82%",
    };
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 767px)").matches;

  if (reduced) {
    return {
      reduced: true,
      mobile: mobile,
      y: 0,
      blur: 0,
      duration: 0.01,
      ease: "none",
      staggerTight: 0,
      staggerRows: 0,
      start: "top 90%",
    };
  }

  return {
    reduced: false,
    mobile,
    y: mobile ? 40 : 58,
    blur: mobile ? 0 : 7,
    duration: mobile ? 0.92 : 1.1,
    ease: "power3.out",
    staggerTight: mobile ? 0.07 : 0.1,
    staggerRows: mobile ? 0.11 : 0.15,
    start: mobile ? "top 88%" : "top 80%",
  };
}
