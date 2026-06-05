"use client";

import type { LifeChoice } from "@/types";

type Props = {
  choice: LifeChoice;
  unlocked: boolean;
  onChoose: () => void;
};

export function ChoiceButton({ choice, unlocked, onChoose }: Props) {
  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onChoose}
      className={`w-full rounded-lg border p-4 text-left transition ${
        unlocked
          ? "border-gold/30 bg-parchment/7 hover:border-jade hover:bg-jade/10 hover:shadow-jade"
          : "cursor-not-allowed border-slate-500/20 bg-slate-800/40 opacity-55"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-slate-50">{choice.label}</span>
        {choice.requirement ? (
          <span className="rounded-full border border-cinnabar/45 bg-cinnabar/14 px-2 py-0.5 text-xs text-red-100">
            {unlocked ? "已解锁" : `需 ${choice.requirement.label}`}
          </span>
        ) : (
          <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-slate-200">
            普通
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{choice.description}</p>
      <p className="mt-3 text-xs text-parchment/48">选择后将进行一次命格判定，再揭示后果。</p>
    </button>
  );
}
