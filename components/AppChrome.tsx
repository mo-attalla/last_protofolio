"use client";

import { useEffect } from "react";
import { FilmGrain } from "@/components/FilmGrain";

/** Global polish: subtle film grain overlay + scroll-to-top on load. */
export function AppChrome() {
  useEffect(() => {
    // Prevent browser from restoring scroll position after reload
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return <FilmGrain />;
}
