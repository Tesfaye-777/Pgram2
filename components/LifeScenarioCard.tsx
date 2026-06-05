"use client";

import { ChoiceButton } from "@/components/ChoiceButton";
import { isChoiceUnlocked } from "@/lib/simulationEngine";
import type { LifeChoice, LifeScenario, SimulationSave } from "@/types";

type Props = {
  scenario: LifeScenario;
  save: SimulationSave;
  total: number;
  onChoose: (choice: LifeChoice) => void;
};

export function LifeScenarioCard({ scenario, save, total, onChoose }: Props) {
  return (
    <section className="xian-card rounded-lg p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-cinnabar">第 {scenario.order.toString().padStart(2, "0")} 劫</p>
          <h1 className="mt-1 text-2xl font-bold text-yellow-50 md:text-3xl">{scenario.title}</h1>
        </div>
        <div className="rounded-md border border-gold/25 bg-ink/40 px-3 py-2 text-right">
          <p className="text-xs text-slate-400">{scenario.era}</p>
          <p className="font-mono text-sm text-jade">
            {scenario.order}/{total}
          </p>
        </div>
      </div>
      <p className="rounded-md border border-gold/18 bg-ink/36 p-4 leading-7 text-parchment/88">
        {scenario.description}
      </p>
      <div className="mt-5 space-y-3">
        {scenario.choices.map((choice) => {
          const unlocked = isChoiceUnlocked(choice, save.destiny, save.currentStats);
          return (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              unlocked={unlocked}
              onChoose={() => onChoose(choice)}
            />
          );
        })}
      </div>
    </section>
  );
}
