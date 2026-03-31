"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MenuOverlay } from "@/components/MenuOverlay";
import { SiteHeader } from "@/components/SiteHeader";

function scrollToSection(sectionId: string) {
  requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/**
 * Menu state, scroll lock, Escape. Section scroll runs after menu close animation completes
 * when navigation started from the overlay.
 */
export function SiteNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingScrollRef = useRef<string | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleMenuExitComplete = useCallback(() => {
    const id = pendingScrollRef.current;
    pendingScrollRef.current = null;
    if (id) scrollToSection(id);
  }, []);

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (menuOpen) {
        pendingScrollRef.current = sectionId;
        setMenuOpen(false);
      } else {
        scrollToSection(sectionId);
      }
    },
    [menuOpen],
  );

  const goHome = useCallback(() => {
    if (menuOpen) {
      pendingScrollRef.current = "hero";
      setMenuOpen(false);
    } else {
      scrollToSection("hero");
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <SiteHeader
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        onBrandClick={goHome}
      />
      <MenuOverlay
        open={menuOpen}
        onClose={closeMenu}
        onNavigate={navigateToSection}
        onExitComplete={handleMenuExitComplete}
      />
    </>
  );
}
