"use client";

import { useState } from "react";
import type { LifeChoice } from "@/types";

type Props = {
  choice: LifeChoice;
  unlocked: boolean;
  onChoose: () => void;
};

export function ChoiceButton({ choice, unlocked, onChoose }: Props) {
  const isHiddenRoute = choice.id.endsWith("-hidden-route");
  const [blocked, setBlocked] = useState(false);

  function handleClick() {
    if (unlocked) {
      onChoose();
      return;
    }

    setBlocked(false);
    window.setTimeout(() => setBlocked(true), 0);
    window.setTimeout(() => setBlocked(false), 360);
  }

  return (
    <button
      type="button"
      aria-disabled={!unlocked}
      onClick={handleClick}
      className={`group min-h-[168px] w-full rounded-lg border p-4 text-left transition ${
        unlocked
          ? isHiddenRoute
            ? "border-jade/55 bg-jade/10 shadow-[0_0_24px_rgba(141,230,200,.14)] hover:-translate-y-0.5 hover:border-gold hover:bg-gold/12 hover:shadow-gold"
            : "border-gold/30 bg-parchment/7 hover:-translate-y-0.5 hover:border-jade hover:bg-jade/10 hover:shadow-jade"
          : "cursor-not-allowed border-parchment/14 bg-ink/42 opacity-55"
      } ${blocked ? "choice-denied-shake" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-serif text-xl font-black text-yellow-50">{choice.label}</span>
        {isHiddenRoute ? (
          <span className="rounded-full border border-jade/45 bg-jade/12 px-2 py-0.5 text-xs text-jade">
            隐线
          </span>
        ) : choice.requirement ? (
          <span className="rounded-full border border-cinnabar/45 bg-cinnabar/14 px-2 py-0.5 text-xs text-red-100 shadow-[0_0_14px_rgba(201,75,58,.16)]">
            {unlocked ? "命钥已现" : `缺 ${choice.requirement.label}`}
          </span>
        ) : (
          <span className="rounded-full border border-gold/24 bg-gold/10 px-2 py-0.5 text-xs text-parchment/78">
            常路
          </span>
        )}
      </div>
      <p className="mt-5 text-sm leading-7 text-parchment/76">{choice.description}</p>
    </button>
  );
}
