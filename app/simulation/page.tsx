"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AncientDice } from "@/components/AncientDice";
import { Disclaimer } from "@/components/Disclaimer";
import { LifeScenarioCard } from "@/components/LifeScenarioCard";
import { ResultSummary } from "@/components/ResultSummary";
import { StatRadarChart } from "@/components/StatRadarChart";
import { statLabels } from "@/lib/constants";
import { lifeScenarios } from "@/lib/lifeScenarios";
import { applyChoice, calculateEnding, resolveChoiceOutcome } from "@/lib/simulationEngine";
import { clearSimulation, loadSimulation, saveSimulation } from "@/lib/storage";
import type {
  ChoiceCheckRank,
  ChoiceOutcome,
  ChoiceRecord,
  ChoiceRiskLevel,
  LifeChoice,
  SimulationSave,
  StatKey,
  TraitEffectDisplay
} from "@/types";

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
                    <TribulationRecordCard key={`${record.scenarioId}-${record.choiceId}`} record={record} index={index} />
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
  const [rolling, setRolling] = useState(true);
  const [shownRoll, setShownRoll] = useState(1);
  const [activeJudge, setActiveJudge] = useState<string | null>(null);
  const rankTone = getRankTone(outcome.rank);
  const visibleEffects = outcome.triggeredTraitEffects.filter((effect) => effect.visible);
  const judgeDetails: Record<string, { title: string; description: string; rows: Array<[string, string | number]> }> = {
    target: {
      title: "此关所需",
      description: `此路为${riskLabels[outcome.riskLevel]}，所需落在 ${getRiskRange(outcome.riskLevel)}。点数越高，越需要命盘、处境与骰运同时接住。`,
      rows: [
        ["风险层级", riskLabels[outcome.riskLevel]],
        ["此关所需", outcome.targetScore],
        ["胜负差", rolling ? "未落盘" : signed(outcome.margin)]
      ]
    },
    final: {
      title: "最终命数",
      description: "最终命数由命骰、属性底蕴、灵签应势、人事助力与临场变数组成，再扣除劫压牵制。",
      rows: [
        ["命骰", rolling ? "未定" : outcome.roll],
        ["属性底蕴", signed(outcome.attributeBonus)],
        ["灵签应势", signed(outcome.traitBonus)],
        ["人事助力", signed(outcome.statusBonus)],
        ["临场变数", signed(outcome.situationalBonus)],
        ["劫压牵制", outcome.pressurePenalty ? `-${outcome.pressurePenalty}` : "0"]
      ]
    },
    roll: {
      title: "命骰",
      description: "命骰只落 1-6。6 可推高顺局，1 可能加重败局；但命骰不会把败局强行改成胜局。",
      rows: [
        ["当前骰面", rolling ? "未定" : outcome.roll],
        ["特殊回响", outcome.rollEffectText ?? "暂无"]
      ]
    },
    trait: {
      title: "灵签应势",
      description: "灵签会提供少量偏命加值；更重要的是触发可见的特殊效果，例如挡劫、暗线、贵人或财路。",
      rows: [
        ["灵签应势", signed(outcome.traitBonus)],
        ["触发数量", visibleEffects.length],
        ["触发摘要", getTraitDetail(outcome)]
      ]
    }
  };

  useEffect(() => {
    setRolling(true);
    setShownRoll(1);
    setActiveJudge(null);
    let tick = 0;
    const timer = window.setInterval(() => {
      tick += 1;
      setShownRoll(((tick * 5 + outcome.roll) % 6) + 1);
    }, 70);
    const reveal = window.setTimeout(() => {
      window.clearInterval(timer);
      setShownRoll(outcome.roll);
      setRolling(false);
    }, 1500);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(reveal);
    };
  }, [choice.id, outcome.roll]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <section className="judgement-scroll xian-card max-h-[92vh] w-full max-w-3xl overflow-y-auto overflow-x-visible rounded-xl border-gold/45 p-4 shadow-gold md:p-5">
        <p className="text-sm text-cinnabar">命格判定</p>
        <h2 className="mt-1 font-serif text-2xl font-black text-yellow-50 md:text-3xl">{choice.label}</h2>
        <p className="mt-3 rounded-lg border border-gold/18 bg-gold/8 px-3 py-2 font-serif text-sm leading-6 text-parchment/72">
          命骰定无常，属性定底气，词条定偏命，状态定处境，压力定劫数，风险定代价。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <JudgeBlock
            label="此关所需"
            value={outcome.targetScore}
            active={activeJudge === "target"}
            onClick={() => setActiveJudge(activeJudge === "target" ? null : "target")}
          />
          <JudgeBlock
            label="最终命数"
            value={rolling ? "未落盘" : outcome.finalScore}
            active={activeJudge === "final"}
            onClick={() => setActiveJudge(activeJudge === "final" ? null : "final")}
          />
          <JudgeBlock
            label="命骰"
            value={rolling ? "未定" : outcome.roll}
            active={activeJudge === "roll"}
            onClick={() => setActiveJudge(activeJudge === "roll" ? null : "roll")}
          />
          <JudgeBlock
            label="灵签应势"
            value={signed(outcome.traitBonus)}
            active={activeJudge === "trait"}
            onClick={() => setActiveJudge(activeJudge === "trait" ? null : "trait")}
          />
        </div>

        {activeJudge ? (
          activeJudge === "trait" ? (
            <TraitEffectDetailPanel detail={judgeDetails.trait} effects={visibleEffects} />
          ) : (
            <JudgeDetailPanel detail={judgeDetails[activeJudge]} />
          )
        ) : null}

        <div className="mt-4 rounded-xl border border-gold/25 bg-ink/52 p-4 text-center">
          <p className="text-xs tracking-[0.32em] text-parchment/48">命骰落盘</p>
          <AncientDice rolling={rolling} rollValue={shownRoll} size={132} />
          <p className="mt-3 text-sm leading-6 text-parchment/66">
            命骰 {rolling ? "未定" : outcome.roll} + 属性 {outcome.attributeBonus} + 灵签 {outcome.traitBonus} + 人事 {outcome.statusBonus} + 临场 {outcome.situationalBonus} - 劫压 {outcome.pressurePenalty}
          </p>
          <p className="font-serif text-lg font-black text-yellow-50">
            最终命数：{rolling ? "未落盘" : outcome.finalScore}；此关所需：{outcome.targetScore}
          </p>
          {outcome.rollEffectText && !rolling ? (
            <p className="mt-2 text-sm text-gold">{outcome.rollEffectText}</p>
          ) : null}
        </div>

        {!rolling ? (
          <>
            <div
              className={`mt-4 rounded-lg border p-4 ${rankTone.panel}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className={`font-serif text-2xl font-black ${rankTone.text}`}>{outcome.rankLabel}</p>
                <p className={`rounded-full border px-3 py-1 text-sm text-parchment/82 ${rankTone.badge}`}>
                  {outcome.finalScore} / {outcome.targetScore}
                </p>
              </div>
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
                    劫压变化 {signed(outcome.stateEffects.pressure)}
                  </span>
                ) : null}
                {outcome.stateEffects?.reputation ? (
                  <StateEffectPill label="声望" value={outcome.stateEffects.reputation} />
                ) : null}
                {outcome.stateEffects?.assets ? (
                  <StateEffectPill label="资产" value={outcome.stateEffects.assets} />
                ) : null}
                {outcome.stateEffects?.bonds ? (
                  <StateEffectPill label="关系" value={outcome.stateEffects.bonds} />
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
          </>
        ) : (
          <div className="mt-5 rounded-lg border border-gold/18 bg-ink/36 p-4 text-sm leading-7 text-parchment/72">
            命骰尚在盘中旋转，成败未落。风声、心跳与旧日伏笔，此刻一并压在这一掷上。
          </div>
        )}
      </section>
    </div>
  );
}

function JudgeBlock({
  label,
  value,
  active,
  onClick
}: {
  label: string;
  value: number | string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-3 text-center transition ${
        active
          ? "border-gold/55 bg-gold/14 shadow-[0_0_22px_rgba(202,157,75,0.18)]"
          : "border-gold/18 bg-ink/42 hover:border-gold/35 hover:bg-gold/8"
      }`}
    >
      <p className="flex items-center justify-center gap-1.5 text-xs text-parchment/52">
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`grid size-4 place-items-center rounded-full border text-[10px] leading-none transition ${
            active ? "border-gold/70 text-gold" : "border-gold/35 text-gold/70"
          }`}
        >
          ?
        </span>
      </p>
      <p className="mt-1 font-mono text-xl font-bold text-yellow-50">{value}</p>
    </button>
  );
}

function JudgeDetailPanel({
  detail
}: {
  detail: { title: string; description: string; rows: Array<[string, string | number]> };
}) {
  return (
    <div className="mt-3 rounded-lg border border-gold/18 bg-ink/38 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-serif text-base font-black text-yellow-50">{detail.title}</p>
        <p className="text-xs text-jade">点击上方格子切换详批</p>
      </div>
      <p className="mt-1 text-sm leading-6 text-parchment/66">{detail.description}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {detail.rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded border border-gold/12 bg-parchment/5 px-3 py-2 text-sm">
            <span className="text-parchment/52">{label}</span>
            <span className="font-mono font-bold text-yellow-50">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TraitEffectDetailPanel({
  detail,
  effects
}: {
  detail: { title: string; description: string; rows: Array<[string, string | number]> };
  effects: TraitEffectDisplay[];
}) {
  return (
    <div className="mt-3 rounded-lg border border-gold/18 bg-ink/38 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-serif text-base font-black text-yellow-50">{detail.title}</p>
        <p className="text-xs text-jade">点击上方格子切换详批</p>
      </div>
      <p className="mt-1 text-sm leading-6 text-parchment/66">{detail.description}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {detail.rows.slice(0, 2).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded border border-gold/12 bg-parchment/5 px-3 py-2 text-sm">
            <span className="text-parchment/52">{label}</span>
            <span className="font-mono font-bold text-yellow-50">{value}</span>
          </div>
        ))}
      </div>
      {effects.length ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {effects.map((effect) => (
            <div
              key={`${effect.traitName}-${effect.effectTitle}-${effect.effectDescription}`}
              className="rounded-lg border border-gold/35 bg-gold/10 p-3 shadow-[0_0_22px_rgba(202,157,75,0.14)]"
            >
              <p className="text-xs text-cinnabar">【灵签触发：{effect.traitName}】</p>
              <p className="mt-1 font-serif text-lg font-black text-yellow-50">{effect.effectTitle}</p>
              <p className="mt-1 text-sm leading-6 text-parchment/78">{effect.effectDescription}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded border border-gold/12 bg-parchment/5 px-3 py-2 text-sm text-parchment/62">
          本次没有额外灵签触发。
        </p>
      )}
    </div>
  );
}

function getTraitDetail(outcome: ChoiceOutcome) {
  if (!outcome.triggeredTraitEffects.length) {
    return "本次没有触发额外词条偏差。";
  }

  return outcome.triggeredTraitEffects
    .filter((effect) => effect.visible)
    .map((effect) => `${effect.traitName}：${effect.effectTitle}`)
    .join("；");
}

const riskLabels: Record<ChoiceRiskLevel, string> = {
  safe: "稳妥",
  normal: "正途",
  risky: "冒险",
  fate: "逆命",
  heaven: "天命"
};

function getRiskRange(risk: ChoiceRiskLevel) {
  const ranges: Record<ChoiceRiskLevel, string> = {
    safe: "6-7",
    normal: "8-9",
    risky: "10",
    fate: "11-12",
    heaven: "13"
  };
  return ranges[risk];
}

function getRankTone(rank: ChoiceCheckRank) {
  if (rank === "greatSuccess") {
    return {
      panel:
        "border-gold/75 bg-[radial-gradient(circle_at_18%_12%,rgba(255,222,120,0.28),transparent_36%),linear-gradient(135deg,rgba(110,72,18,0.82),rgba(31,18,8,0.92)_58%,rgba(78,48,10,0.72))] shadow-[0_0_26px_rgba(216,179,90,0.28),inset_0_0_26px_rgba(255,226,137,0.10)]",
      text: "text-yellow-50",
      badge: "border-gold/70 bg-gold/18 shadow-[0_0_18px_rgba(216,179,90,0.28)]"
    };
  }
  if (rank === "success") {
    return { panel: "border-jade/45 bg-jade/10", text: "text-jade", badge: "border-white/35" };
  }
  if (rank === "partialFail") {
    return { panel: "border-gold/40 bg-gold/10", text: "text-yellow-100", badge: "border-white/35" };
  }
  if (rank === "fail") {
    return { panel: "border-cinnabar/55 bg-cinnabar/12", text: "text-red-100", badge: "border-white/35" };
  }
  return { panel: "border-red-400/70 bg-red-950/30", text: "text-red-100", badge: "border-white/35" };
}

function StateEffectPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded border border-gold/20 bg-ink/45 px-3 py-1 text-sm text-parchment">
      {label} {signed(value)}
    </span>
  );
}

function TribulationRecordCard({ record, index }: { record: ChoiceRecord; index: number }) {
  const outcome = record.outcome;
  const tone = outcome
    ? getRankTone(outcome.rank)
    : { panel: "border-gold/16 bg-ink/34", text: "text-parchment/70", badge: "border-white/35" };
  const statChanges = formatStatEffects(record.effects);
  const stateChanges = formatStateEffects(record.stateEffects);
  const story = outcome ? stripResultPrefix(outcome.resultText, record) : "";

  return (
    <div className={`rounded-lg border p-4 ${tone.panel}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-cinnabar">第 {index + 1} 劫</p>
          <h3 className="mt-1 font-serif text-xl font-black text-yellow-50">{record.scenarioTitle}</h3>
        </div>
        {outcome ? (
          <span className={`rounded-full border px-3 py-1 text-sm font-bold ${tone.badge} ${tone.text}`}>
            {outcome.rankLabel} {outcome.finalScore}/{outcome.targetScore}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-parchment/82">
        <span className="text-parchment/55">所选：</span>
        {record.choiceLabel}
      </p>
      {story ? <p className="mt-2 text-sm leading-7 text-parchment">{story}</p> : null}
      {statChanges.length || stateChanges.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {statChanges.map((item) => (
            <span key={item} className="rounded border border-jade/20 bg-jade/8 px-2.5 py-1 text-xs text-jade">
              {item}
            </span>
          ))}
          {stateChanges.map((item) => (
            <span key={item} className="rounded border border-gold/25 bg-gold/8 px-2.5 py-1 text-xs text-yellow-100">
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function signed(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function formatStatEffects(effects: ChoiceRecord["effects"]) {
  return (Object.entries(effects) as Array<[StatKey, number]>)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${statLabels[key]} ${signed(value)}`);
}

function formatStateEffects(effects?: ChoiceRecord["stateEffects"]) {
  if (!effects) {
    return [];
  }

  const labels = {
    reputation: "声望",
    assets: "资产",
    bonds: "关系",
    pressure: "压力"
  } as const;

  return Object.entries(effects)
    .filter((entry): entry is [keyof typeof labels, number] => {
      const [key, value] = entry;
      return key in labels && typeof value === "number" && value !== 0;
    })
    .map(([key, value]) => `${labels[key]} ${signed(value)}`);
}

function stripResultPrefix(text: string, record: ChoiceRecord) {
  return text
    .replace(new RegExp(`^【${escapeRegExp(record.scenarioTitle)}】你选择「${escapeRegExp(record.choiceLabel)}」。`), "")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function StatePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/6 p-3">
      <p className="text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-xl text-jade">{value}</p>
    </div>
  );
}
