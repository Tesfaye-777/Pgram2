"use client";

import { useState } from "react";
import Image from "next/image";
import heroBackground from "../图片素材/人设/背景1.png";
import { CharacterForm } from "@/components/CharacterForm";
import { Disclaimer } from "@/components/Disclaimer";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AwardIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM9 14l-1 7 4-2 4 2-1-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroBackdrop({ hasStarted }: { hasStarted: boolean }) {
  return (
    <>
      <Image
        aria-hidden="true"
        src={heroBackground}
        alt=""
        priority
        unoptimized
        sizes="140vw"
        className={`hero-pan-image ${hasStarted ? "is-started" : ""}`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          hasStarted
            ? "bg-[linear-gradient(90deg,rgba(7,6,3,0.42)_0%,rgba(7,6,3,0.18)_38%,rgba(7,6,3,0.72)_100%)]"
            : "bg-[linear-gradient(90deg,rgba(7,6,3,0.78)_0%,rgba(7,6,3,0.46)_42%,rgba(7,6,3,0.22)_100%)]"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void/82 via-void/35 to-transparent" />
    </>
  );
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-yellow-50">
      <HeroBackdrop hasStarted={hasStarted} />

      <nav className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        <button
          type="button"
          onClick={() => setHasStarted(false)}
          className="font-podium text-2xl font-black uppercase tracking-[0.18em] text-yellow-50 transition hover:text-gold sm:text-3xl"
        >
          DESTINY <span className="font-serif text-xl tracking-[0.16em] sm:text-2xl">命书</span>
        </button>

      </nav>

      <section className="relative z-10 min-h-screen px-6 pb-28 pt-28 sm:px-10 lg:px-16">
        <div className="relative mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-7xl items-center">
          <div
            className={`w-full max-w-2xl transition-all duration-700 ease-out ${
              hasStarted ? "pointer-events-none -translate-x-10 opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
              <div className="animate-fade-up mb-6 flex items-center gap-3 font-inter text-xs uppercase tracking-[0.3em] text-yellow-50/62 sm:text-sm lg:mb-8">
                <CrownIcon className="h-4 w-4 text-gold/80" />
                江湖命书 · 一生推演
              </div>

              <h1 className="font-podium text-[clamp(3.1rem,8.4vw,8rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-yellow-50 drop-shadow-[0_0_24px_rgba(216,179,90,0.26)] animate-fade-up-delay-1">
                一签入世
                <br />
                命起江湖
              </h1>

              <p className="mt-6 max-w-xl font-inter text-sm leading-7 text-yellow-50/72 animate-fade-up-delay-2 sm:text-base lg:mt-8">
                留名入册，掷骰定运。系统将为你生成五维命格、天赋与劫数，并带你踏入二十段江湖关局。
                <span className="font-semibold text-yellow-50">每一次选择，都会改写这段命书的走向。</span>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up-delay-3 sm:gap-6 lg:mt-10">
                <button
                  type="button"
                  onClick={() => setHasStarted(true)}
                  className="group inline-flex items-center gap-3 rounded-full bg-yellow-50 px-6 py-4 font-inter text-[11px] font-black uppercase tracking-[0.24em] text-ink transition hover:bg-gold sm:px-8 sm:text-xs"
                >
                  开始入世
                  <ArrowIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
                <div className="hidden items-center gap-3 sm:flex">
                  <AwardIcon className="h-8 w-8 text-gold/62" />
                  <div className="font-serif text-xs leading-5 tracking-[0.18em] text-yellow-50/54">
                    二十段关局
                    <br />
                    灵骰判定命途
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap gap-6 animate-fade-up-delay-4 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
                {[
                  ["20", "江湖关局"],
                  ["5", "命格维度"],
                  ["1-6", "灵骰判定"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-inter text-3xl font-black tracking-tight text-yellow-50 sm:text-4xl lg:text-5xl">{value}</p>
                    <p className="mt-1 font-inter text-[10px] uppercase tracking-[0.24em] text-yellow-50/45 sm:text-xs">{label}</p>
                  </div>
                ))}
              </div>
          </div>

          <div
            className={`absolute right-0 top-1/2 w-full max-w-[640px] transition-all duration-700 ease-out ${
              hasStarted
                ? "pointer-events-auto -translate-y-1/2 opacity-100 delay-500"
                : "pointer-events-none translate-x-8 -translate-y-[46%] opacity-0"
            }`}
          >
            <CharacterForm active={hasStarted} />
          </div>
        </div>
      </section>

      <div className="relative z-20 px-4 pb-4 sm:px-8">
        <Disclaimer />
      </div>
    </main>
  );
}
