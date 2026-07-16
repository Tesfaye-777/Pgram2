"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";

type ScrollRevealProps = {
  active?: boolean;
  children: ReactNode;
};

const SCROLL_ASSETS = {
  top: "/assets/scroll/scroll-top.png",
  paper: "/assets/scroll/scroll-paper.png",
  bottom: "/assets/scroll/scroll-bottom.png",
} as const;

type ScrollMotion = {
  progress: number;
  content: number;
};

export function ScrollReveal({ active = true, children }: ScrollRevealProps) {
  const root = useRef<HTMLElement>(null);
  const topRod = useRef<HTMLDivElement>(null);
  const bottomRod = useRef<HTMLDivElement>(null);
  const paperMask = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const motion = useRef<ScrollMotion>({ progress: 0, content: 0 });
  const initialized = useRef(false);

  useLayoutEffect(() => {
    const rootElement = root.current;
    const topRodElement = topRod.current;
    const bottomRodElement = bottomRod.current;
    const paperMaskElement = paperMask.current;
    const paperElement = paper.current;
    const contentElement = content.current;

    if (!rootElement || !topRodElement || !bottomRodElement || !paperMaskElement || !paperElement || !contentElement) {
      return;
    }

    const motionState = motion.current;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const openHeight = Math.round(
      Math.min(
        Math.max(window.innerHeight * (compactViewport ? 0.78 : 0.72), compactViewport ? 620 : 590),
        compactViewport ? 710 : 720,
      ),
    );

    rootElement.style.setProperty("--scroll-open-height", `${openHeight}px`);

    const render = () => {
      const current = motionState;
      const progress = Math.min(1, Math.max(0, current.progress));
      const contentProgress = Math.min(1, Math.max(0, current.content));
      const topHeight = topRodElement.offsetHeight;
      const bottomHeight = bottomRodElement.offsetHeight;
      // Tuck the sheet beneath both rods so the paper edge reads as a continuous scroll,
      // rather than two exposed strips hanging from the rod artwork.
      const rodOverlap = Number.parseFloat(getComputedStyle(rootElement).getPropertyValue("--rod-paper-overlap")) || 14;
      const paperTop = topHeight - rodOverlap;
      const openBottom = paperTop + openHeight - rodOverlap;
      const totalHeight = openBottom + bottomHeight;
      const closedCenter = totalHeight / 2;

      // Top and bottom rods share this exact progress with the paper viewport.
      const topY = (closedCenter - topHeight) * (1 - progress);
      const bottomY = closedCenter + (openBottom - closedCenter) * progress;
      const visibleTop = topY + topHeight - rodOverlap;
      const visibleHeight = Math.max(0, bottomY + rodOverlap - visibleTop);

      topRodElement.style.transform = `translate3d(-50%, ${topY}px, 0)`;
      bottomRodElement.style.transform = `translate3d(-50%, ${bottomY}px, 0)`;
      paperMaskElement.style.top = `${visibleTop}px`;
      paperMaskElement.style.height = `${visibleHeight}px`;

      // Keep the sheet at its native display size. The mask reveals its middle first;
      // no scaleY is used, so the paper never looks like stretched rubber.
      paperElement.style.transform = `translate3d(0, ${(-openHeight * (1 - progress)) / 2}px, 0)`;
      contentElement.style.opacity = String(contentProgress);
      contentElement.style.transform = `translate3d(0, ${(1 - contentProgress) * 12}px, 0)`;
      contentElement.style.filter = `blur(${(1 - contentProgress) * 2}px)`;
      contentElement.style.pointerEvents = contentProgress > 0.98 ? "auto" : "none";
    };

    const setState = (progress: number, contentProgress: number) => {
      motionState.progress = progress;
      motionState.content = contentProgress;
      render();
    };

    if (!initialized.current) {
      initialized.current = true;
      setState(active && reduceMotion ? 1 : 0, active && reduceMotion ? 1 : 0);
    }

    gsap.killTweensOf(motionState);

    if (reduceMotion) {
      setState(active ? 1 : 0, active ? 1 : 0);
      return;
    }

    if (active) {
      // The form container fades in after the hero camera pan. Hold the scroll closed
      // for that same beat so the player can actually see its closed state first.
      const revealDelay = 0.5;
      gsap.to(motionState, {
        progress: 1,
        duration: 1.34,
        delay: revealDelay,
        ease: "power3.inOut",
        onUpdate: render,
      });
      gsap.to(motionState, {
        content: 1,
        duration: 0.52,
        delay: revealDelay + 0.82,
        ease: "power2.out",
        onUpdate: render,
      });
    } else {
      gsap.to(motionState, {
        content: 0,
        duration: 0.16,
        ease: "power1.out",
        onUpdate: render,
      });
      gsap.to(motionState, {
        progress: 0,
        duration: 1.02,
        delay: 0.08,
        ease: "power3.inOut",
        onUpdate: render,
      });
    }

    window.addEventListener("resize", render);
    return () => {
      gsap.killTweensOf(motionState);
      window.removeEventListener("resize", render);
    };
  }, [active]);

  return (
    <section ref={root} className="vertical-scroll" aria-label="命书信息填写">
      <div className="vertical-scroll__shadow" aria-hidden="true" />

      <div ref={topRod} className="vertical-scroll__rod vertical-scroll__rod--top" aria-hidden="true">
        <Image src={SCROLL_ASSETS.top} alt="" width={3072} height={260} unoptimized className="vertical-scroll__rod-image" />
      </div>

      <div ref={paperMask} className="vertical-scroll__paper-mask">
        <div ref={paper} className="vertical-scroll__paper">
          <Image src={SCROLL_ASSETS.paper} alt="" width={804} height={1536} unoptimized className="vertical-scroll__paper-image" />
          <div ref={content} className="vertical-scroll__content">
            {children}
          </div>
        </div>
      </div>

      <div ref={bottomRod} className="vertical-scroll__rod vertical-scroll__rod--bottom" aria-hidden="true">
        <Image src={SCROLL_ASSETS.bottom} alt="" width={3072} height={260} unoptimized className="vertical-scroll__rod-image" />
      </div>
    </section>
  );
}
