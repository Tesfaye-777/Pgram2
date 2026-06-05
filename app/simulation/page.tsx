"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { LifeScenarioCard } from "@/components/LifeScenarioCard";
import { ResultSummary } from "@/components/ResultSummary";
import { StatRadarChart } from "@/components/StatRadarChart";
import { statLabels } from "@/lib/constants";
import { lifeScenarios } from "@/lib/lifeScenarios";
import { applyChoice, calculateEnding, resolveChoiceOutcome } from "@/lib/simulationEngine";
import { clearSimulation, loadSimulation, saveSimulation } from "@/lib/storage";
import type { ChoiceOutcome, LifeChoice, SimulationSave, StatKey } from "@/types";

type PendingOutcome = {
  choice: LifeChoice;
  outcome: ChoiceOutcome;
};

export default function SimulationPage() {
  const [save, setSave] = useState<SimulationSave | null>(null);
  const [pendingOutcome, setPendingOutcome] = useState<PendingOutcome | null>(null);

  useEffect(() => {
    setSave(loadSimulation());
  }, []);

  const ending = useMemo(() => (save?.completed ? calculateEnding(save) : null), [save]);
  const scenario = save && !save.completed ? lifeScenarios[save.currentScenarioIndex] : null;

  function handleChoose(choice: LifeChoice) {
    if (!save) {
      return;
    }
    setPendingOutcome({
      choice,
      outcome: resolveChoiceOutcome(save, choice)
    });
  }

  function confirmOutcome() {
    if (!save || !pendingOutcome) {
      return;
    }

    const next = applyChoice(save, pendingOutcome.choice, pendingOutcome.outcome);
    saveSimulation(next);
    setSave(next);
    setPendingOutcome(null);
  }

  function restart() {
    clearSimulation();
  }

  if (!save) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="xian-card rounded-lg p-6 text-center">
          <p className="text-parchment">还没有可运行的人生模拟。</p>
          <Link href="/result" className="mt-4 inline-block text-jade underline">
            返回命格档案
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ink-wash min-h-screen bg-xian-pattern bg-[length:26px_26px] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Disclaimer />
        {ending ? (
          <>
            <ResultSummary ending={ending} />
            <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
              <StatRadarChart stats={ending.finalStats} previousStats={save.destiny.baseStats} />
              <section className="xian-card rounded-lg p-5">
                <h2 className="text-lg font-semibold text-jade">渡劫记录</h2>
                <div className="mt-4 max-h-[520px] space-y-3 overflow-auto pr-1">
                  {save.records.map((record, index) => (
                    <div key={`${record.scenarioId}-${record.choiceId}`} className="rounded-md border border-gold/16 bg-ink/34 p-3">
                      <p className="text-xs text-parchment/45">
                        #{index + 1} {record.scenarioTitle}
                      </p>
                      <p className="mt-1 text-sm text-parchment">{record.choiceLabel}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/"
                  onClick={restart}
                  className="mt-5 inline-block rounded-md border border-gold/35 px-4 py-2 text-jade transition hover:bg-jade/10"
                >
                  重新开局
                </Link>
              </section>
            </div>
          </>
        ) : scenario ? (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            <LifeScenarioCard
              scenario={scenario}
              save={save}
              total={lifeScenarios.length}
              onChoose={handleChoose}
            />
            {pendingOutcome ? (
              <OutcomeDialog pending={pendingOutcome} onContinue={confirmOutcome} />
            ) : null}
            <aside className="space-y-6">
              <StatRadarChart stats={save.currentStats} previousStats={save.destiny.baseStats} />
              <section className="xian-card rounded-lg p-5">
                <h2 className="text-lg font-semibold text-jade">入世状态</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <StatePill label="声望" value={save.state.reputation} />
                  <StatePill label="资产" value={save.state.assets} />
                  <StatePill label="关系" value={save.state.bonds} />
                  <StatePill label="压力" value={save.state.pressure} />
                </div>
              </section>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function OutcomeDialog({
  pending,
  onContinue
}: {
  pending: PendingOutcome;
  onContinue: () => void;
}) {
  const { choice, outcome } = pending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <section className="xian-card w-full max-w-xl rounded-xl border-gold/45 p-5 shadow-gold md:p-6">
        <p className="text-sm text-cinnabar">命格判定</p>
        <h2 className="mt-2 text-2xl font-black text-yellow-50">{choice.label}</h2>
        <p className="mt-3 leading-7 text-parchment/78">{choice.description}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <JudgeBlock label="骰点" value={outcome.roll} />
          <JudgeBlock label={statLabels[outcome.keyStat]} value={signed(outcome.modifier)} />
          <JudgeBlock label="合计" value={outcome.total} />
          <JudgeBlock label="目标" value={outcome.target} />
        </div>

        <div
          className={`mt-5 rounded-lg border p-4 ${
            outcome.success
              ? "border-jade/45 bg-jade/10 text-jade"
              : "border-cinnabar/55 bg-cinnabar/12 text-red-100"
          }`}
        >
          <p className="text-lg font-bold">{outcome.success ? "判定成功" : "判定失败"}</p>
          <p className="mt-2 text-sm leading-6 text-parchment/82">{outcome.resultText}</p>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm text-parchment/58">本次后果</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(outcome.effects).map(([key, value]) => (
              <span key={key} className="rounded border border-gold/20 bg-ink/45 px-3 py-1 text-sm text-parchment">
                {statLabels[key as StatKey]} {signed(value ?? 0)}
              </span>
            ))}
            {outcome.stateEffects?.pressure ? (
              <span className="rounded border border-cinnabar/25 bg-cinnabar/10 px-3 py-1 text-sm text-red-100">
                压力 {signed(outcome.stateEffects.pressure)}
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-lg border border-gold/70 bg-gold/18 px-5 py-3 text-lg font-bold text-yellow-50 shadow-gold transition hover:bg-gold/26"
        >
          记入命册，继续前行
        </button>
      </section>
    </div>
  );
}

function JudgeBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-gold/18 bg-ink/42 p-3 text-center">
      <p className="text-xs text-parchment/52">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-yellow-50">{value}</p>
    </div>
  );
}

function signed(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function StatePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/6 p-3">
      <p className="text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-xl text-jade">{value}</p>
    </div>
  );
}
