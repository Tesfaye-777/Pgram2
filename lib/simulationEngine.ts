import { emptyStats } from "@/lib/constants";
import { hasTrait } from "@/lib/destinySkill";
import { lifeScenarios } from "@/lib/lifeScenarios";
import type {
  ChoiceRecord,
  ChoiceOutcome,
  ChoiceRequirement,
  DestinyProfile,
  Ending,
  LifeChoice,
  LifeState,
  SimulationSave,
  Stats
} from "@/types";

const initialLifeState: LifeState = {
  reputation: 0,
  assets: 0,
  bonds: 0,
  pressure: 10,
  turningPoints: []
};

export function createSimulation(destiny: DestinyProfile): SimulationSave {
  return {
    destiny,
    currentScenarioIndex: 0,
    currentStats: { ...destiny.baseStats },
    state: { ...initialLifeState },
    records: [],
    completed: false
  };
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function applyStats(current: Stats, effects: Partial<Stats>, pressure = 0): Stats {
  const pressurePenalty = pressure > 70 ? -1 : 0;
  return {
    luck: clamp(current.luck + (effects.luck ?? 0) + pressurePenalty),
    wealth: clamp(current.wealth + (effects.wealth ?? 0) + pressurePenalty),
    mind: clamp(current.mind + (effects.mind ?? 0)),
    courage: clamp(current.courage + (effects.courage ?? 0)),
    insight: clamp(current.insight + (effects.insight ?? 0))
  };
}

export function isChoiceUnlocked(
  choice: LifeChoice,
  destiny: DestinyProfile,
  stats: Stats
): boolean {
  if (!choice.requirement) {
    return true;
  }

  return isRequirementMet(choice.requirement, destiny, stats);
}

export function isRequirementMet(
  requirement: ChoiceRequirement,
  destiny: DestinyProfile,
  stats: Stats
) {
  if (requirement.type === "trait") {
    return hasTrait(destiny, requirement.traitId);
  }

  return stats[requirement.stat] >= requirement.min;
}

export function resolveChoiceOutcome(save: SimulationSave, choice: LifeChoice): ChoiceOutcome {
  const keyStat = pickKeyStat(choice);
  const statValue = save.currentStats[keyStat];
  const modifier = Math.max(0, Math.floor((statValue - 42) / 8));
  const pressurePenalty = save.state.pressure > 75 ? 1 : 0;
  const riskPenalty = choice.risk === "high" ? 1 : 0;
  const target = 7 + pressurePenalty + riskPenalty;
  const roll = deterministicRoll(save, choice);
  const total = roll + modifier;
  const success = total >= target;
  const effects = success ? choice.effects : buildFailureEffects(choice.effects, keyStat);
  const stateEffects = success
    ? choice.stateEffects
    : buildFailureStateEffects(choice.stateEffects, choice.risk);

  return {
    success,
    roll,
    modifier,
    total,
    target,
    keyStat,
    effects,
    stateEffects,
    resultText: success
      ? "判定成功。你抓住了这次选择里的关键机会，命盘因此向有利方向推进。"
      : "判定失败。你做出了选择，但时机、压力或准备不足让结果出现偏差。"
  };
}

export function applyChoice(
  save: SimulationSave,
  choice: LifeChoice,
  outcome = resolveChoiceOutcome(save, choice)
): SimulationSave {
  const scenario = lifeScenarios[save.currentScenarioIndex];
  const currentPressure = save.state.pressure;
  const adjustedEffects = applyRiskAdjustment(choice, save.currentStats, outcome.effects);
  const nextStats = applyStats(save.currentStats, adjustedEffects, currentPressure);
  const nextState = applyState(save.state, choice, scenario.title, outcome.stateEffects);
  const record: ChoiceRecord = {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    choiceId: choice.id,
    choiceLabel: choice.label,
    effects: adjustedEffects,
    stateEffects: outcome.stateEffects,
    outcome
  };
  const nextIndex = save.currentScenarioIndex + 1;

  return {
    ...save,
    currentStats: nextStats,
    state: nextState,
    records: [...save.records, record],
    currentScenarioIndex: nextIndex,
    completed: nextIndex >= lifeScenarios.length
  };
}

function applyRiskAdjustment(
  choice: LifeChoice,
  stats: Stats,
  baseEffects: Partial<Stats>
): Partial<Stats> {
  if (choice.risk !== "high" || stats.mind >= 55) {
    return baseEffects;
  }

  return {
    ...baseEffects,
    luck: (baseEffects.luck ?? 0) - 3,
    wealth: (baseEffects.wealth ?? 0) - 5,
    mind: (baseEffects.mind ?? 0) - 2
  };
}

function applyState(
  state: LifeState,
  choice: LifeChoice,
  scenarioTitle: string,
  stateEffects?: Partial<LifeState>
): LifeState {
  const effects = stateEffects ?? {};
  const pressure = clamp(state.pressure + (effects.pressure ?? 0), 0, 100);
  const turningPoints =
    choice.risk === "high" || choice.requirement
      ? [...state.turningPoints, `${scenarioTitle}：${choice.label}`]
      : state.turningPoints;

  return {
    reputation: clamp(state.reputation + (effects.reputation ?? 0), -100, 100),
    assets: clamp(state.assets + (effects.assets ?? 0), -100, 100),
    bonds: clamp(state.bonds + (effects.bonds ?? 0), -100, 100),
    pressure,
    turningPoints
  };
}

function pickKeyStat(choice: LifeChoice): keyof Stats {
  const entries = Object.entries(choice.effects) as Array<[keyof Stats, number]>;
  return entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]?.[0] ?? "mind";
}

function deterministicRoll(save: SimulationSave, choice: LifeChoice) {
  const input = `${save.destiny.seed}|${save.currentScenarioIndex}|${save.records.length}|${choice.id}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (Math.abs(hash >>> 0) % 20) + 1;
}

function buildFailureEffects(effects: Partial<Stats>, keyStat: keyof Stats): Partial<Stats> {
  const failed: Partial<Stats> = {};
  for (const [key, value] of Object.entries(effects) as Array<[keyof Stats, number]>) {
    failed[key] = value > 0 ? -Math.max(1, Math.ceil(value / 3)) : value;
  }
  failed[keyStat] = (failed[keyStat] ?? 0) - 1;
  return failed;
}

function buildFailureStateEffects(
  stateEffects: Partial<LifeState> | undefined,
  risk: LifeChoice["risk"]
): Partial<LifeState> {
  const pressureGain = risk === "high" ? 8 : risk === "medium" ? 5 : 3;
  return {
    reputation: stateEffects?.reputation && stateEffects.reputation > 0 ? -2 : stateEffects?.reputation,
    assets: stateEffects?.assets && stateEffects.assets > 0 ? -3 : stateEffects?.assets,
    bonds: stateEffects?.bonds && stateEffects.bonds > 0 ? -2 : stateEffects?.bonds,
    pressure: (stateEffects?.pressure ?? 0) + pressureGain
  };
}

export function calculateEnding(save: SimulationSave): Ending {
  const statDelta: Stats = {
    luck: save.currentStats.luck - save.destiny.baseStats.luck,
    wealth: save.currentStats.wealth - save.destiny.baseStats.wealth,
    mind: save.currentStats.mind - save.destiny.baseStats.mind,
    courage: save.currentStats.courage - save.destiny.baseStats.courage,
    insight: save.currentStats.insight - save.destiny.baseStats.insight
  };
  const strongestTrait = save.destiny.traits[0];
  const keyChoice = pickKeyChoice(save.records);
  const total =
    Object.values(save.currentStats).reduce((sum, value) => sum + value, 0) / 5 +
    save.state.reputation * 0.18 +
    save.state.assets * 0.16 +
    save.state.bonds * 0.12 -
    save.state.pressure * 0.08;

  const title =
    total >= 88
      ? "问道天命改写者"
      : total >= 76
        ? "星轨胜局经营者"
        : total >= 64
          ? "逆风稳定通关者"
          : total >= 52
            ? "长夜缓行修补师"
            : "未竟副本漂流者";

  const rating =
    total >= 88 ? "SSS" : total >= 76 ? "S" : total >= 64 ? "A" : total >= 52 ? "B" : "C";

  return {
    title,
    rating,
    strongestTrait,
    keyChoice,
    finalStats: save.currentStats,
    statDelta,
    summary: buildEndingSummary(save, title, rating, keyChoice?.choiceLabel ?? "接受完整人生")
  };
}

function pickKeyChoice(records: ChoiceRecord[]) {
  return (
    [...records].reverse().find((record) => {
      const statSwing = Object.values(record.effects).reduce(
        (sum, value) => sum + Math.abs(value ?? 0),
        0
      );
      const stateSwing = Object.values(record.stateEffects ?? {}).reduce<number>((sum, value) => {
        return typeof value === "number" ? sum + Math.abs(value) : sum;
      }, 0);
      return statSwing + stateSwing >= 15;
    }) ?? records[records.length - 1] ?? null
  );
}

function buildEndingSummary(
  save: SimulationSave,
  title: string,
  rating: string,
  keyChoiceLabel: string
) {
  const deltaTotal = Object.values(save.currentStats).reduce((sum, value) => sum + value, 0);
  const tone =
    save.state.pressure > 70
      ? "你一路带着高压前行，许多胜利都带有灼烧后的边缘。"
      : save.state.bonds > 35
        ? "你没有把人生玩成单人副本，关系网络成为你最亮的隐藏装备。"
        : save.state.assets > 35
          ? "你把机会、风险与资源编织成自己的城市地图。"
          : "你走得不算喧哗，却在一次次选择里校准了自己的核心。";

  return `评级 ${rating}。「${title}」是系统为你生成的娱乐向人生称号。关键选择「${keyChoiceLabel}」改变了你的轨迹，五维总值抵达 ${deltaTotal}。${tone}最终你明白，命格不是锁链，而是开局参数；真正的剧情，始终写在每次按下选择键之后。`;
}

export function zeroDelta(): Stats {
  return { ...emptyStats };
}
