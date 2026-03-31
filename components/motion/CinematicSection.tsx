"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";

let scrollTriggerRegistered = false;

function ensureScrollTrigger() {
  if (typeof window === "undefined" || scrollTriggerRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
}

export type CinematicSectionVariant = "about" | "services" | "projects" | "contact" | "experience";

export type CinematicSectionProps = ComponentPropsWithoutRef<"section"> & {
  variant: CinematicSectionVariant;
};

export const CinematicSection = forwardRef<HTMLElement, CinematicSectionProps>(
  function CinematicSection({ variant, children, ...rest }, forwardedRef) {
    const internalRef = useRef<HTMLElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    useLayoutEffect(() => {
      ensureScrollTrigger();
      const root = internalRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const animated = q("[data-cine]");

      const ctx = gsap.context(() => {
        // Set initial state for all elements to be revealed
        // Cinematic entry: opacity 0, shifted down, slightly blurred
        gsap.set(animated, { autoAlpha: 0, y: 80, filter: "blur(6px)" });

        const mm = gsap.matchMedia();

        // 1. Entry Construction
        // We use .to() inside the scrub timeline. Easing controls the curve over the scrub distance.
        const buildEntry = (tl: gsap.core.Timeline) => {
          switch (variant) {
            case "about":
              tl.to(q('[data-cine="label"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" })
                .to(q('[data-cine="heading"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }, "-=0.6")
                .to(q('[data-cine="line"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.15, ease: "power3.out" }, "-=1")
                .to(q('[data-cine="panel"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.6, stagger: 0.25, ease: "power3.out" }, "-=1.2");
              break;
              
            case "services":
              tl.to(q('[data-cine="head"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power3.out" })
                .to(q('[data-cine="row"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.8, stagger: 0.35, ease: "power4.out" }, "-=0.8");
              break;

            case "projects":
              tl.to(q('[data-cine="head"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power3.out" })
                .to(q('[data-cine="catalogue"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "-=0.8")
                .to(q('[data-cine="row"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.8, stagger: 0.4, ease: "power4.out" }, "-=0.8");
              break;

            case "experience":
              tl.to(q('[data-cine="label"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" })
                .to(q('[data-cine="heading"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power4.out" }, "-=0.6")
                .to(q('[data-cine="job"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.6, stagger: 0.22, ease: "power4.out" }, "-=0.9");
              break;

            case "contact":
              tl.to(q('[data-cine="label"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" })
                .to(q('[data-cine="heading"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "power4.out" }, "-=0.6")
                .to(q('[data-cine="tagline"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "-=1.0")
                .to(q('[data-cine="panel"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.3, ease: "power3.out" }, "-=0.8")
                .to(q('[data-cine="foot"]'), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" }, "-=0.6");
              break;
          }
        };

        // 2. Exit Construction
        // As the section leaves the viewport, fade/shift content up naturally.
        const buildExit = (isMobile: boolean) => {
          if (variant === "contact") {
            // Calm and minimal exit for footer
            gsap.to(animated, {
              y: -15,
              autoAlpha: 0.4,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: root,
                start: "bottom 20%",
                end: "bottom top",
                scrub: 1.5,
              },
            });
            return;
          }

          gsap.to(animated, {
            y: -50,
            autoAlpha: 0,
            filter: "blur(6px)",
            stagger: 0.05,
            ease: "power3.in",
            scrollTrigger: {
              trigger: root,
              start: isMobile ? "bottom 85%" : "bottom 75%", // Starts fading as bottom clears lower portion of screen
              end: "bottom top",
              scrub: 1.5,
            },
          });
        };

        // --- DESKTOP ---
        // Premium behavior: Pin briefly, slowly unfold content tied directly to scroll.
        mm.add("(min-width: 1024px)", () => {
          const entryTl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 25%", // Pin starts when section hits upper quarter of screen
              end: "+=90%", // Holds scroll briefly (90vh) to let the scene fully play
              pin: true,
              scrub: 1.5, // Premium smoothing
              pinSpacing: true, // Allocates space seamlessly
            },
          });
          buildEntry(entryTl);
          buildExit(false);
        });

        // --- MOBILE / TABLET ---
        // Native scroll (no pin); lighter scrub than desktop for smoother scrolling on phones.
        mm.add("(max-width: 1023px)", () => {
          const entryTl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              end: "top 32%",
              scrub: 0.65,
            },
          });
          buildEntry(entryTl);
          buildExit(true);
        });

      }, root);

      // Refresh ScrollTrigger cleanly on resize to avoid stuck pins
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        ctx.revert();
      };
    }, [variant]);

    return (
      <section ref={setRefs} {...rest}>
        {children}
      </section>
    );
  },
);

CinematicSection.displayName = "CinematicSection";
