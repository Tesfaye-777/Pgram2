import { emptyStats } from "@/lib/constants";
import { getChoiceOutcomeNote } from "@/lib/choiceOutcomeNotes";
import { hasTrait } from "@/lib/destinySkill";
import { lifeScenarios } from "@/lib/lifeScenarios";
import type {
  ChoiceCheckRank,
  ChoiceRecord,
  ChoiceOutcome,
  ChoiceRequirement,
  ChoiceRiskLevel,
  DestinyProfile,
  DestinyTrait,
  Ending,
  LifeChoice,
  LifeState,
  LifeStatusKey,
  SimulationSave,
  StatKey,
  Stats,
  TraitEffectDisplay
} from "@/types";

const initialLifeState: LifeState = {
  reputation: 0,
  assets: 0,
  bonds: 0,
  pressure: 0,
  turningPoints: []
};

const rankLabels: Record<ChoiceCheckRank, string> = {
  greatSuccess: "大成功",
  success: "成功",
  partialFail: "不尽人意",
  fail: "失败",
  criticalFail: "大失败"
};

const riskLabels: Record<ChoiceRiskLevel, string> = {
  safe: "稳妥",
  normal: "正途",
  risky: "冒险",
  fate: "逆命",
  heaven: "天命"
};

const statNames: Record<StatKey, string> = {
  luck: "福缘",
  wealth: "财势",
  mind: "心性",
  courage: "魄力",
  insight: "悟性"
};

const statusNames: Record<LifeStatusKey, string> = {
  reputation: "声望",
  assets: "资产",
  bonds: "关系"
};

const traitRarityBonus: Record<DestinyTrait["rarity"], number> = {
  common: 1,
  rare: 1,
  epic: 2,
  legendary: 3,
  mythic: 4
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

export function applyStats(current: Stats, effects: Partial<Stats>): Stats {
  return {
    luck: clamp(current.luck + (effects.luck ?? 0)),
    wealth: clamp(current.wealth + (effects.wealth ?? 0)),
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

export function resolveChoiceCheck(save: SimulationSave, choice: LifeChoice): ChoiceOutcome {
  const scenario = lifeScenarios[save.currentScenarioIndex];
  const keyStat = choice.requiredAttribute ?? pickKeyStat(choice);
  const baseStat = save.currentStats[keyStat];
  const riskLevel = inferRiskLevel(choice);
  const relatedStatus = choice.relatedStatus ?? inferRelatedStatus(choice);
  const relatedStatusValue = relatedStatus ? save.state[relatedStatus] : undefined;
  const attributeBonus = resolveAttributeBonus(baseStat);
  const pressurePenalty = resolvePressurePenalty(save.state.pressure);
  const statusBonus = resolveStatusBonus(relatedStatusValue);
  const sceneModifier = resolveSceneModifier(save, choice);
  const difficulty = choice.difficulty ?? inferDifficulty(scenario.order, choice);
  const target = resolveTargetScore(scenario.order, choice);
  const traitResolution = resolveTraitBonus(save.destiny.traits, choice, scenario.id, keyStat, riskLevel);
  const hiddenResolution = resolveHiddenRouteBonus(choice, save);
  const situationalBonus = sceneModifier + hiddenResolution.bonus;
  const roll = deterministicRoll(save, choice);
  const total = roll + attributeBonus + traitResolution.bonus + statusBonus + situationalBonus - pressurePenalty;
  const rawMargin = total - target;
  const baseRank = resolveRank(rawMargin);
  const rankWithRoll = resolveRankWithRoll(baseRank, roll);
  const rankResolution = applyTraitRankEffects(
    rankWithRoll.rank,
    save.destiny.traits,
    choice,
    scenario.id,
    riskLevel,
    [...traitResolution.effects, ...hiddenResolution.effects]
  );
  const rank = rankResolution.rank;
  const effects = resolveStatEffects(choice, rank, keyStat, save.state.pressure);
  const stateEffects = applyTraitStateEffects(
    resolveStateEffects(choice, rank, save.state.pressure, riskLevel),
    save.destiny.traits,
    choice,
    scenario.id,
    rank,
    riskLevel,
    rankResolution.effects
  );
  const triggeredTraitEffects = [
    ...traitResolution.effects,
    ...hiddenResolution.effects,
    ...rankWithRoll.effects,
    ...rankResolution.effects
  ];

  return {
    success: rank === "greatSuccess" || rank === "success",
    roll,
    modifier: attributeBonus + traitResolution.bonus + statusBonus - pressurePenalty + situationalBonus,
    attributeBonus,
    traitBonus: traitResolution.bonus,
    statusBonus,
    pressurePenalty,
    sceneModifier,
    situationalBonus,
    total,
    target,
    finalScore: total,
    targetScore: target,
    margin: total - target,
    difficulty,
    riskLevel,
    keyStat,
    baseStat,
    relatedStatus,
    relatedStatusValue,
    rollEffectText: rankWithRoll.rollEffectText,
    rank,
    rankLabel: rankLabels[rank],
    effects,
    stateEffects,
    triggeredTraitEffects: dedupeTraitEffects(triggeredTraitEffects),
    routeEffect: choice.routeEffect,
    resultText: buildChoiceResultText(save, choice, rank, keyStat, relatedStatus)
  };
}

export function resolveChoiceOutcome(save: SimulationSave, choice: LifeChoice): ChoiceOutcome {
  return resolveChoiceCheck(save, choice);
}

export function applyChoice(
  save: SimulationSave,
  choice: LifeChoice,
  outcome = resolveChoiceCheck(save, choice)
): SimulationSave {
  const scenario = lifeScenarios[save.currentScenarioIndex];
  const nextStats = applyStats(save.currentStats, outcome.effects);
  const nextState = applyState(save.state, choice, scenario.title, outcome.stateEffects, outcome);
  const record: ChoiceRecord = {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    choiceId: choice.id,
    choiceLabel: choice.label,
    effects: outcome.effects,
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

function applyState(
  state: LifeState,
  choice: LifeChoice,
  scenarioTitle: string,
  stateEffects: Partial<LifeState> | undefined,
  outcome: ChoiceOutcome
): LifeState {
  const effects = stateEffects ?? {};
  const pressure = clamp(state.pressure + (effects.pressure ?? 0), 0, 100);
  const shouldRecordTurn =
    choice.risk === "high" ||
    choice.requirement ||
    outcome.routeEffect ||
    outcome.rank === "greatSuccess" ||
    outcome.rank === "criticalFail";
  const turnLabel = outcome.routeEffect
    ? `${scenarioTitle}：${choice.label}（${outcome.routeEffect}）`
    : `${scenarioTitle}：${choice.label}`;
  const turningPoints = shouldRecordTurn ? [...state.turningPoints, turnLabel] : state.turningPoints;

  return {
    reputation: clamp(state.reputation + (effects.reputation ?? 0), -100, 100),
    assets: clamp(state.assets + (effects.assets ?? 0), -100, 100),
    bonds: clamp(state.bonds + (effects.bonds ?? 0), -100, 100),
    pressure,
    turningPoints
  };
}

function pickKeyStat(choice: LifeChoice): StatKey {
  const entries = Object.entries(choice.effects) as Array<[StatKey, number]>;
  return entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]?.[0] ?? "mind";
}

function inferRelatedStatus(choice: LifeChoice): LifeStatusKey | undefined {
  const stateEffects = choice.stateEffects ?? {};
  if (typeof stateEffects.reputation === "number" && Math.abs(stateEffects.reputation) >= 4) {
    return "reputation";
  }
  if (typeof stateEffects.assets === "number" && Math.abs(stateEffects.assets) >= 4) {
    return "assets";
  }
  if (typeof stateEffects.bonds === "number" && Math.abs(stateEffects.bonds) >= 4) {
    return "bonds";
  }

  const text = `${choice.id} ${choice.label} ${choice.description}`;
  if (/help|social|mentor|patron|forgive|promise|family|合作|求援|旧友|家人|同窗/.test(text)) {
    return "bonds";
  }
  if (/money|wealth|trade|invest|asset|startup|move|salt|silver|票号|账|银|商|船|药/.test(text)) {
    return "assets";
  }
  if (/testify|public|fight|rewrite|legacy|官|名|声|证|商会/.test(text)) {
    return "reputation";
  }

  return undefined;
}

function inferRiskLevel(choice: LifeChoice): ChoiceRiskLevel {
  if (choice.riskLevel) {
    return choice.riskLevel;
  }
  if (choice.requirement?.type === "trait") {
    return "fate";
  }
  if (choice.risk === "high") {
    return "risky";
  }
  if (choice.risk === "medium") {
    return "normal";
  }
  const positiveSwing = Object.values(choice.effects).reduce((sum, value) => {
    return sum + Math.max(0, value ?? 0);
  }, 0);
  if (positiveSwing >= 18) {
    return "fate";
  }
  if (positiveSwing >= 11) {
    return "risky";
  }
  if (positiveSwing <= 5) {
    return "safe";
  }
  return "normal";
}

function inferDifficulty(order: number, choice: LifeChoice) {
  const tier = order <= 5 ? 0 : order <= 10 ? 1 : order <= 15 ? 2 : 3;
  const risk = inferRiskLevel(choice);
  const matrix: Record<ChoiceRiskLevel, [number, number, number, number]> = {
    safe: [6, 6, 7, 7],
    normal: [8, 8, 9, 9],
    risky: [10, 10, 10, 10],
    fate: [11, 11, 12, 12],
    heaven: [13, 13, 13, 13]
  };
  return matrix[risk][tier];
}

function resolveAttributeBonus(baseStat: number) {
  if (baseStat >= 85) return 4;
  if (baseStat >= 70) return 3;
  if (baseStat >= 55) return 2;
  if (baseStat >= 40) return 1;
  return 0;
}

function resolveStatusBonus(value?: number) {
  if (typeof value !== "number") return 0;
  return Math.max(-2, Math.min(3, Math.floor(value / 25)));
}

function resolvePressurePenalty(pressure: number) {
  return Math.max(0, Math.min(4, Math.floor(pressure / 20)));
}

function resolveTargetScore(order: number, choice: LifeChoice) {
  const risk = inferRiskLevel(choice);
  const ranges: Record<ChoiceRiskLevel, [number, number]> = {
    safe: [6, 7],
    normal: [8, 9],
    risky: [10, 10],
    fate: [11, 12],
    heaven: [13, 13]
  };
  const stageModifier = order <= 5 ? 0 : order <= 10 ? 1 : order <= 15 ? 1 : 2;
  const [min, max] = ranges[risk];
  return Math.max(6, Math.min(13, Math.min(max, min + stageModifier)));
}

function resolveTraitBonus(
  traits: DestinyTrait[],
  choice: LifeChoice,
  scenarioId: string,
  keyStat: StatKey,
  riskLevel: ChoiceRiskLevel
) {
  const contextTags = inferContextTags(scenarioId, choice);
  let bonus = 0;
  const effects: TraitEffectDisplay[] = [];

  for (const trait of traits) {
    const effectStart = effects.length;
    const statBonus = trait.statBonus[keyStat] ?? 0;
    const tagMatch = trait.tags.some((tag) => contextTags.has(tag));
    let traitBonus = statBonus > 0 ? Math.min(1, Math.floor(statBonus / 8)) : 0;

    if (tagMatch) {
      traitBonus += traitRarityBonus[trait.rarity];
    }

    if (trait.polarity === "ominous" && tagMatch) {
      traitBonus -= trait.rarity === "epic" ? 2 : 1;
    }

    for (const interaction of choice.traitInteractions ?? []) {
      const matched =
        (interaction.traitId && interaction.traitId === trait.id) ||
        (interaction.tag && trait.tags.includes(interaction.tag));
      if (matched) {
        const interactionBonus = Math.max(1, Math.min(3, Math.ceil((interaction.checkBonus ?? 0) / 2)));
        traitBonus += interactionBonus;
        effects.push({
          traitName: trait.name,
          effectTitle: "暗线加持",
          effectDescription: `${interaction.label}，这条隐藏路多得 +${interactionBonus}。`,
          effectType: "bonus",
          value: interactionBonus,
          visible: true
        });
      }
    }

    if (trait.id === "rewrite-fate" && (riskLevel === "fate" || riskLevel === "heaven")) {
      traitBonus += 2;
      effects.push({
        traitName: trait.name,
        effectTitle: "逆命临局",
        effectDescription: "你走的是逆命之路，此签临局生效，判定额外 +2；若败，劫压也会更重。",
        effectType: "bonus",
        value: 2,
        visible: true
      });
    }

    if (trait.id === "late-bloom" && scenarioId !== "childhood-awakening" && contextTags.has("growth")) {
      traitBonus += 2;
      effects.push({
        traitName: trait.name,
        effectTitle: "后运渐开",
        effectDescription: "后半生局势渐开，此签在本关生效，判定额外 +2。",
        effectType: "bonus",
        value: 2,
        visible: true
      });
    }

    if (trait.id === "quick-temper" && inferRiskLevel(choice) === "risky") {
      traitBonus += 1;
      effects.push({
        traitName: trait.name,
        effectTitle: "心火催行",
        effectDescription: "你这一掷多了几分冲劲，冒险判定 +1；若败，后果会更烈。",
        effectType: "bonus",
        value: 1,
        visible: true
      });
    }

    if ((trait.id === "wealth-star" || trait.id === "grand-fortune") && contextTags.has("wealth")) {
      const wealthBonus = trait.id === "grand-fortune" ? 2 : 1;
      traitBonus += wealthBonus;
      effects.push({
        traitName: trait.name,
        effectTitle: "财路照盘",
        effectDescription: `财路相关关口中，此签替你多看见一分资源流向，判定额外 +${wealthBonus}。`,
        effectType: "bonus",
        value: wealthBonus,
        visible: true
      });
    }

    if (trait.id === "patron-star" && (contextTags.has("support") || choice.relatedStatus === "bonds")) {
      traitBonus += 1;
      effects.push({
        traitName: trait.name,
        effectTitle: "贵人递灯",
        effectDescription: "关系与求助相关关口中，此签替你留住一盏人情灯，判定额外 +1。",
        effectType: "bonus",
        value: 1,
        visible: true
      });
    }

    if (traitBonus !== 0) {
      bonus += traitBonus;
      const alreadyHasSpecificEffect = effects
        .slice(effectStart)
        .some((effect) => effect.traitName === trait.name && effect.visible);
      if (!alreadyHasSpecificEffect) {
        const display = buildTraitBonusDisplay(trait, traitBonus, contextTags, keyStat);
        effects.push({
          traitName: trait.name,
          effectTitle: display.title,
          effectDescription: display.description,
          effectType: "bonus",
          value: traitBonus,
          visible: true
        });
      }
    }
  }

  return { bonus, effects };
}

function buildTraitBonusDisplay(
  trait: DestinyTrait,
  traitBonus: number,
  contextTags: Set<string>,
  keyStat: StatKey
) {
  const valueText = `${traitBonus > 0 ? "+" : ""}${traitBonus}`;
  const matchedStat = statNames[keyStat];
  const fallback = {
    title: traitBonus > 0 ? "主签压阵" : "劫签牵制",
    description:
      traitBonus > 0
        ? `这支签正好压住${matchedStat}要害，本局判定 ${valueText}。`
        : `这支签在${matchedStat}上露出短处，本局判定 ${valueText}。`
  };

  const displays: Record<string, { title: string; description: string }> = {
    "natural-grace": {
      title: "眉目得缘",
      description: `这一局需要先让人愿意听你开口，清朗气度替你多争一分情面，判定 ${valueText}。`
    },
    "early-wisdom": {
      title: "早慧识隙",
      description: `你比旁人早听出话外之意，查账、问供或读书时少走一步弯路，判定 ${valueText}。`
    },
    "patron-star": {
      title: "旧缘可借",
      description: `本局牵到求助与作保时，旧人愿替你递一句话，判定 ${valueText}。`
    },
    "grand-fortune": {
      title: contextTags.has("wealth") ? "财势压盘" : "富贵作底",
      description: `你手里更容易聚起银钱、货路或人情筹码，本局判定 ${valueText}。`
    },
    "rough-love": {
      title: traitBonus > 0 ? "情债成砺" : "情路添阻",
      description:
        traitBonus > 0
          ? `感情里的迟疑让你更会斟酌说辞，本局判定 ${valueText}。`
          : `旧情与顾虑牵住手脚，本局判定 ${valueText}。`
    },
    "danger-to-light": {
      title: "险中寻缝",
      description: `坏局里你会先翻契书、旧账和证据，替自己抠出余地，判定 ${valueText}。`
    },
    "wealth-star": {
      title: "财星照账",
      description: `你对账期、押银和行情更敏感，涉及银钱时判定 ${valueText}。`
    },
    "lone-walker": {
      title: "独行探路",
      description: `无人同行时你反而下得了决心，探路、查账或远行判定 ${valueText}。`
    },
    "peach-aura": {
      title: "桃花牵线",
      description: `你容易被人记住，社交与感情局里能多换一分回应，判定 ${valueText}。`
    },
    "self-made": {
      title: "白手立局",
      description: `门面小、本钱薄时你仍敢开第一步，创业与自立局判定 ${valueText}。`
    },
    "late-bloom": {
      title: "旧经验回账",
      description: `前半生记下的错账、人情和亏损在此处派上用场，判定 ${valueText}。`
    },
    "rewrite-fate": {
      title: "逆局重排",
      description: `你会重排契约、客源和账期，不肯按旧局收场，判定 ${valueText}。`
    },
    "quick-temper": {
      title: traitBonus > 0 ? "心火催行" : "心火误事",
      description:
        traitBonus > 0
          ? `你出手够快，抢在旁人犹豫前落定，判定 ${valueText}。`
          : `火气先到，话说得太硬，本局判定 ${valueText}。`
    },
    "wealth-leak": {
      title: traitBonus > 0 ? "财来有门" : "钱从手漏",
      description:
        traitBonus > 0
          ? `你碰得到财路，也敢先伸手试探，判定 ${valueText}。`
          : `银钱容易被义气、冲动或熟人牵走，判定 ${valueText}。`
    },
    "thin-kinship": {
      title: traitBonus > 0 ? "独撑成性" : "亲缘少援",
      description:
        traitBonus > 0
          ? `少有人替你托底，反让你更会自己查证和收拾局面，判定 ${valueText}。`
          : `本局若要借家族与亲友之力，你手里可用的人情偏少，判定 ${valueText}。`
    },
    "too-sharp": {
      title: traitBonus > 0 ? "锋芒破局" : "锋芒招忌",
      description:
        traitBonus > 0
          ? `你看得快、说得准，公开对质或查证时判定 ${valueText}。`
          : `话锋太利，容易惹人戒备，本局判定 ${valueText}。`
    },
    "old-ailment": {
      title: traitBonus > 0 ? "病中知止" : "旧疾拖身",
      description:
        traitBonus > 0
          ? `久病让你更懂节制和安排，修养、取舍类判定 ${valueText}。`
          : `寒夜、远路或熬账勾起旧疾，本局判定 ${valueText}。`
    }
  };

  return displays[trait.id] ?? fallback;
}

function inferContextTags(scenarioId: string, choice: LifeChoice) {
  const text = `${scenarioId} ${choice.id} ${choice.label} ${choice.description}`.toLowerCase();
  const tags = new Set<string>();
  const rules: Array<[string, RegExp]> = [
    ["wealth", /wealth|money|trade|invest|salt|silver|asset|票号|账|银|商|财|钱/],
    ["career", /career|job|mentor|patron|镖|官|东家|商会|府城/],
    ["startup", /startup|zero|self|创业|自立|开局|票号/],
    ["support", /help|patron|mentor|ask|求|旧友|前辈|贵人/],
    ["social", /social|testify|reputation|public|声望|作证|公开|商会/],
    ["love", /love|promise|go-with|桃花|感情|灯会/],
    ["family", /family|grandpa|home|家|父|母|族/],
    ["study", /study|school|proof|book|县学|书|学|证据/],
    ["insight", /proof|record|map|method|账|图|悟|查|识/],
    ["solo", /solo|alone|独|自/],
    ["risk", /gamble|bold|fight|ignore|high|赌|押|险|硬/],
    ["survival", /health|low|storm|rest|病|低谷|沉江|危/],
    ["turnaround", /rewrite|turn|fate|翻|逆|改命|低谷/],
    ["growth", /midlife|elder|final|turn|晚|中年|终章/]
  ];

  for (const [tag, pattern] of rules) {
    if (pattern.test(text)) {
      tags.add(tag);
    }
  }

  return tags;
}

function resolveSceneModifier(save: SimulationSave, choice: LifeChoice) {
  let modifier = 0;
  if (choice.requirement && isRequirementMet(choice.requirement, save.destiny, save.currentStats)) {
    modifier += 1;
  }
  const relatedStatus = choice.relatedStatus ?? inferRelatedStatus(choice);
  if (save.records.length >= 10 && save.state.assets > 40 && relatedStatus === "assets") {
    modifier += 1;
  }
  if (save.records.length >= 10 && save.state.bonds > 40 && relatedStatus === "bonds") {
    modifier += 1;
  }
  if (save.records.length >= 10 && save.state.reputation > 40 && relatedStatus === "reputation") {
    modifier += 1;
  }
  if (inferRiskLevel(choice) === "safe") {
    modifier += 1;
  }
  if (inferRiskLevel(choice) === "heaven") {
    modifier -= 1;
  }
  return modifier;
}

function resolveRank(margin: number): ChoiceCheckRank {
  if (margin >= 4) {
    return "greatSuccess";
  }
  if (margin >= 0) {
    return "success";
  }
  if (margin >= -2) {
    return "partialFail";
  }
  if (margin >= -4) {
    return "fail";
  }
  return "criticalFail";
}

function resolveRankWithRoll(rank: ChoiceCheckRank, roll: number) {
  const effects: TraitEffectDisplay[] = [];
  if (roll === 6) {
    if (rank === "success") {
      effects.push({
        traitName: "命骰",
        effectTitle: "六点开局",
        effectDescription: "命骰落 6，原本成功之局升为大成功。",
        effectType: "rank_shift",
        visible: true
      });
      return { rank: "greatSuccess" as ChoiceCheckRank, effects };
    }
    if (rank === "partialFail") {
      effects.push({
        traitName: "命骰",
        effectTitle: "高骰扶局",
        effectDescription: "命骰落 6，原本不尽人意之局升为成功。",
        effectType: "rank_shift",
        visible: true
      });
      return { rank: "success" as ChoiceCheckRank, effects };
    }
    if (rank === "fail" || rank === "criticalFail") {
      return {
        rank,
        effects,
        rollEffectText: "命骰虽高，仍未压住此局。"
      };
    }
  }

  if (roll === 1) {
    if (rank === "fail") {
      effects.push({
        traitName: "命骰",
        effectTitle: "一点坠盘",
        effectDescription: "命骰落 1，失败之局加重为大失败。",
        effectType: "rank_shift",
        visible: true
      });
      return { rank: "criticalFail" as ChoiceCheckRank, effects };
    }
    if (rank === "success" || rank === "greatSuccess") {
      return {
        rank,
        effects,
        rollEffectText: "命骰落低，幸有底蕴托住。"
      };
    }
  }
  return { rank, effects };
}

function resolveHiddenRouteBonus(choice: LifeChoice, save: SimulationSave) {
  const isHiddenRoute = choice.id.endsWith("-hidden-route") || choice.routeEffect?.includes("隐线");
  if (!isHiddenRoute) {
    return { bonus: 0, effects: [] as TraitEffectDisplay[] };
  }

  const matchedTrait = save.destiny.traits.find((trait) => {
    return choice.traitInteractions?.some((interaction) => interaction.traitId === trait.id);
  });
  const value = matchedTrait ? 3 : 2;
  return {
    bonus: value,
    effects: [
      {
        traitName: matchedTrait?.name ?? "暗线",
        effectTitle: "暗线生效",
        effectDescription: `你看见了旁人未曾留意的缺口，此路判定额外 +${value}。`,
        effectType: "hidden_route",
        value,
        visible: true
      }
    ] as TraitEffectDisplay[]
  };
}

function applyTraitRankEffects(
  rank: ChoiceCheckRank,
  traits: DestinyTrait[],
  choice: LifeChoice,
  scenarioId: string,
  riskLevel: ChoiceRiskLevel,
  effects: TraitEffectDisplay[]
) {
  let finalRank = rank;
  const nextEffects = [...effects];

  const dangerToLight = traits.find((trait) => trait.id === "danger-to-light");
  if (dangerToLight && (finalRank === "criticalFail" || finalRank === "fail")) {
    finalRank = finalRank === "criticalFail" ? "fail" : "partialFail";
    nextEffects.push({
      traitName: dangerToLight.name,
      effectTitle: "劫中留生",
      effectDescription:
        finalRank === "fail"
          ? "此局原有大败之象，所幸命签应劫，替你留下一线余地，大失败降为失败。"
          : "此局本该败局坐实，此签替你挡下一重凶险，失败降为不尽人意。",
      effectType: "failure_grace",
      visible: true
    });
  }

  const rewriteFate = traits.find((trait) => trait.id === "rewrite-fate");
  if (rewriteFate && (riskLevel === "fate" || riskLevel === "heaven") && finalRank !== "greatSuccess") {
    nextEffects.push({
      traitName: rewriteFate.name,
      effectTitle: "逆命留痕",
      effectDescription: "你走的是逆命之路，此签会把此局结果记入后续伏笔。",
      effectType: "rank_shift",
      visible: true
    });
  }

  if (choice.id.endsWith("-hidden-route") && (finalRank === "fail" || finalRank === "criticalFail")) {
    nextEffects.push({
      traitName: "暗线",
      effectTitle: "暗线反噬",
      effectDescription:
        scenarioId === "final-ending"
          ? "终局暗线未接住命盘，旧日伏笔反成牵连。"
          : "暗线没有接上明局，原先藏住的破绽被推到台前。",
      effectType: "hidden_route",
      visible: true
    });
  }

  return { rank: finalRank, effects: nextEffects };
}

function applyTraitStateEffects(
  stateEffects: Partial<LifeState> | undefined,
  traits: DestinyTrait[],
  choice: LifeChoice,
  scenarioId: string,
  rank: ChoiceCheckRank,
  riskLevel: ChoiceRiskLevel,
  effects: TraitEffectDisplay[]
) {
  let next = stateEffects;
  const failed = rank === "fail" || rank === "criticalFail";
  const succeeded = rank === "success" || rank === "greatSuccess";
  const contextTags = inferContextTags(scenarioId, choice);

  const quickTemper = traits.find((trait) => trait.id === "quick-temper");
  if (quickTemper && failed && riskLevel === "risky") {
    next = mergeStateEffects(next, { pressure: 2 });
    effects.push({
      traitName: quickTemper.name,
      effectTitle: "心火反灼",
      effectDescription: "冒险未成，心火反灼，此局劫压额外 +2。",
      effectType: "pressure",
      value: 2,
      visible: true
    });
  }

  const rewriteFate = traits.find((trait) => trait.id === "rewrite-fate");
  if (rewriteFate && failed && (riskLevel === "fate" || riskLevel === "heaven")) {
    next = mergeStateEffects(next, { pressure: 2 });
    effects.push({
      traitName: rewriteFate.name,
      effectTitle: "逆命有价",
      effectDescription: "逆命之路未成，劫压随之加重，此局压力额外 +2。",
      effectType: "pressure",
      value: 2,
      visible: true
    });
  }

  const patronStar = traits.find((trait) => trait.id === "patron-star");
  if (patronStar && contextTags.has("support")) {
    if (succeeded) {
      next = mergeStateEffects(next, { bonds: 2, reputation: 1 });
      effects.push({
        traitName: patronStar.name,
        effectTitle: "贵人递灯",
        effectDescription: "此局得人情照应，关系 +2，声望 +1。",
        effectType: "state_shift",
        visible: true
      });
    } else if ((next?.bonds ?? 0) < 0) {
      next = mergeStateEffects(next, { bonds: 1 });
      effects.push({
        traitName: patronStar.name,
        effectTitle: "人情未断",
        effectDescription: "虽未成局，贵人之缘替你少折一点关系。",
        effectType: "state_shift",
        visible: true
      });
    }
  }

  const wealthTrait = traits.find((trait) => trait.id === "wealth-star" || trait.id === "grand-fortune");
  if (wealthTrait && succeeded && contextTags.has("wealth")) {
    next = mergeStateEffects(next, { assets: wealthTrait.id === "grand-fortune" ? 3 : 2 });
    effects.push({
      traitName: wealthTrait.name,
      effectTitle: "财路入袋",
      effectDescription: `财路关口应签而开，资产额外 +${wealthTrait.id === "grand-fortune" ? 3 : 2}。`,
      effectType: "state_shift",
      visible: true
    });
  }

  return next;
}

function resolveStatEffects(
  choice: LifeChoice,
  rank: ChoiceCheckRank,
  keyStat: StatKey,
  pressure: number
) {
  if (rank === "greatSuccess") {
    return mergeStats(amplifyPositive(choice.effects, 1.35), choice.greatSuccessEffect);
  }
  if (rank === "success") {
    return choice.successEffect ?? choice.effects;
  }
  if (rank === "partialFail") {
    return choice.partialFailEffect ?? partializeEffects(choice.effects, keyStat);
  }
  if (rank === "fail") {
    return choice.failEffect ?? buildFailureEffects(choice.effects, keyStat, pressure);
  }
  return choice.criticalFailEffect ?? buildCriticalFailureEffects(choice.effects, keyStat, pressure);
}

function resolveStateEffects(
  choice: LifeChoice,
  rank: ChoiceCheckRank,
  pressure: number,
  riskLevel: ChoiceRiskLevel
) {
  if (rank === "greatSuccess") {
    return mergeStateEffects(choice.stateEffects, choice.greatSuccessStateEffect, { pressure: -3 });
  }
  if (rank === "success") {
    return choice.successStateEffect ?? applySuccessPressureRelief(choice, pressure);
  }
  if (rank === "partialFail") {
    return choice.partialFailStateEffect ?? buildPartialFailStateEffects(choice.stateEffects, riskLevel, pressure);
  }
  if (rank === "fail") {
    return choice.failStateEffect ?? buildFailureStateEffects(choice.stateEffects, riskLevel, pressure);
  }
  return choice.criticalFailStateEffect ?? buildCriticalFailureStateEffects(choice.stateEffects, riskLevel, pressure);
}

function applySuccessPressureRelief(choice: LifeChoice, pressure: number): Partial<LifeState> | undefined {
  const stateEffects = choice.stateEffects;
  if (stateEffects?.pressure && stateEffects.pressure < 0) {
    return stateEffects;
  }

  const risk = inferRiskLevel(choice);
  const calmsPressure =
    risk === "safe" ||
    (choice.effects.mind ?? 0) >= 5 ||
    /rest|routine|avoid|endure|family|accept|stay|修养|休|稳|守|坦白|归|家/.test(
      `${choice.id} ${choice.label} ${choice.description}`
    );

  if (!calmsPressure || pressure <= 0) {
    return stateEffects;
  }

  return mergeStateEffects(stateEffects, { pressure: pressure >= 50 ? -4 : -2 });
}

function deterministicRoll(save: SimulationSave, choice: LifeChoice) {
  const input = `${save.destiny.seed}|${save.currentScenarioIndex}|${save.records.length}|${choice.id}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (Math.abs(hash >>> 0) % 6) + 1;
}

function mergeStats(...items: Array<Partial<Stats> | undefined>): Partial<Stats> {
  const merged: Partial<Stats> = {};
  for (const item of items) {
    for (const [key, value] of Object.entries(item ?? {}) as Array<[StatKey, number]>) {
      merged[key] = (merged[key] ?? 0) + value;
    }
  }
  return merged;
}

function mergeStateEffects(...items: Array<Partial<LifeState> | undefined>): Partial<LifeState> {
  const merged: Partial<LifeState> = {};
  for (const item of items) {
    for (const [key, value] of Object.entries(item ?? {}) as Array<[keyof LifeState, number]>) {
      if (key === "turningPoints") {
        continue;
      }
      merged[key] = ((merged[key] as number | undefined) ?? 0) + value;
    }
  }
  return merged;
}

function amplifyPositive(effects: Partial<Stats>, factor: number): Partial<Stats> {
  const boosted: Partial<Stats> = {};
  for (const [key, value] of Object.entries(effects) as Array<[StatKey, number]>) {
    boosted[key] = value > 0 ? Math.max(value + 1, Math.ceil(value * factor)) : value;
  }
  return boosted;
}

function partializeEffects(effects: Partial<Stats>, keyStat: StatKey): Partial<Stats> {
  const partial: Partial<Stats> = {};
  for (const [key, value] of Object.entries(effects) as Array<[StatKey, number]>) {
    partial[key] = value > 0 ? Math.max(1, Math.floor(value / 2)) : value;
  }
  partial[keyStat] = (partial[keyStat] ?? 0) - 1;
  return partial;
}

function buildFailureEffects(
  effects: Partial<Stats>,
  keyStat: StatKey,
  pressure: number
): Partial<Stats> {
  const failed: Partial<Stats> = {};
  const highPressurePenalty = pressure >= 60 ? 2 : 0;
  for (const [key, value] of Object.entries(effects) as Array<[StatKey, number]>) {
    failed[key] = value > 0 ? -Math.max(1, Math.ceil(value / 3)) : value;
  }
  failed[keyStat] = (failed[keyStat] ?? 0) - 1 - highPressurePenalty;
  return failed;
}

function buildCriticalFailureEffects(
  effects: Partial<Stats>,
  keyStat: StatKey,
  pressure: number
): Partial<Stats> {
  const failed = buildFailureEffects(effects, keyStat, pressure);
  failed[keyStat] = (failed[keyStat] ?? 0) - 4;
  return failed;
}

function buildPartialFailStateEffects(
  stateEffects: Partial<LifeState> | undefined,
  risk: ChoiceRiskLevel,
  pressure: number
): Partial<LifeState> {
  const pressureGain = risk === "heaven" || risk === "fate" ? 3 : risk === "risky" ? 2 : risk === "normal" ? 1 : 0;
  const highPressureTax = pressure >= 85 ? 1 : 0;
  return {
    reputation: stateEffects?.reputation && stateEffects.reputation > 0 ? Math.floor(stateEffects.reputation / 2) : stateEffects?.reputation,
    assets: stateEffects?.assets && stateEffects.assets > 0 ? Math.floor(stateEffects.assets / 2) : stateEffects?.assets,
    bonds: stateEffects?.bonds && stateEffects.bonds > 0 ? Math.floor(stateEffects.bonds / 2) : stateEffects?.bonds,
    pressure: (stateEffects?.pressure ?? 0) + pressureGain + highPressureTax
  };
}

function buildFailureStateEffects(
  stateEffects: Partial<LifeState> | undefined,
  risk: ChoiceRiskLevel,
  pressure: number
): Partial<LifeState> {
  const pressureGain =
    risk === "heaven" ? 6 : risk === "fate" ? 5 : risk === "risky" ? 4 : risk === "normal" ? 3 : 1;
  const highPressureTax = pressure >= 85 ? 1 : 0;
  return {
    reputation: stateEffects?.reputation && stateEffects.reputation > 0 ? -2 : stateEffects?.reputation,
    assets: stateEffects?.assets && stateEffects.assets > 0 ? -4 : stateEffects?.assets,
    bonds: stateEffects?.bonds && stateEffects.bonds > 0 ? -2 : stateEffects?.bonds,
    pressure: (stateEffects?.pressure ?? 0) + pressureGain + highPressureTax
  };
}

function buildCriticalFailureStateEffects(
  stateEffects: Partial<LifeState> | undefined,
  risk: ChoiceRiskLevel,
  pressure: number
): Partial<LifeState> {
  const failure = buildFailureStateEffects(stateEffects, risk, pressure);
  return {
    ...failure,
    reputation: (failure.reputation ?? 0) - 2,
    assets: (failure.assets ?? 0) - 3,
    bonds: (failure.bonds ?? 0) - 2,
    pressure: (failure.pressure ?? 0) + 1
  };
}

function dedupeTraitEffects(effects: TraitEffectDisplay[]) {
  const seen = new Set<string>();
  return effects.filter((effect) => {
    if (!effect.visible) {
      return false;
    }
    const key = `${effect.traitName}|${effect.effectTitle}|${effect.effectDescription}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildChoiceResultText(
  save: SimulationSave,
  choice: LifeChoice,
  rank: ChoiceCheckRank,
  keyStat: StatKey,
  relatedStatus?: LifeStatusKey
) {
  const scenario = lifeScenarios[save.currentScenarioIndex];
  const customText = choice.resultTexts?.[rank];
  if (customText) {
    return customText;
  }

  const note = getChoiceOutcomeNote(choice.id, scenario.id);
  if (note) {
    return buildNotedChoiceResult(scenario.title, choice.label, rank, note);
  }

  const statTone = statNames[keyStat];
  const statusTone = relatedStatus ? `，又牵动${statusNames[relatedStatus]}这条线` : "";
  const riskTone = riskLabels[inferRiskLevel(choice)];
  const choiceAction = normalizeSentence(choice.description);
  const opening = `【${scenario.title}】你选择「${choice.label}」。${choiceAction}`;
  const basis = `这一路偏${riskTone}，主要看${statTone}${statusTone}。`;

  if (rank === "greatSuccess") {
    return `${opening}${basis}你不只把眼前事办成，还多拿到一条可用线索或一份旁人认可。之后再遇相近局面，你手里会多一个可谈的筹码。`;
  }
  if (rank === "success") {
    return `${opening}${basis}事情按原先打算推进，花掉的银钱、情面或时间都还压得住，相关的人也愿意继续与你往来。`;
  }
  if (rank === "partialFail") {
    return `${opening}${basis}事情只做成一半：该拿的线索、银钱或情面缺了一块。你能勉强往下走，但下一步要先补这处缺口。`;
  }
  if (rank === "fail") {
    return `${opening}${basis}这一步没压住，原本要保住的差事、账面或关系出现损口。你得先赔银、解释或另找人作保。`;
  }
  return `${opening}${basis}这次不只是没办成，还牵出额外麻烦：有人失信，有账要补，或有机会当场关上。之后要付更重代价收拾。`;
}

function buildNotedChoiceResult(
  scenarioTitle: string,
  choiceLabel: string,
  rank: ChoiceCheckRank,
  note: { success: string; failure: string }
) {
  const opening = `【${scenarioTitle}】你选择「${choiceLabel}」。`;

  if (rank === "greatSuccess") {
    return `${opening}${note.success}`;
  }
  if (rank === "success") {
    return `${opening}${note.success}`;
  }
  if (rank === "partialFail") {
    return `${opening}${note.failure}`;
  }
  if (rank === "fail") {
    return `${opening}${note.failure}`;
  }
  return `${opening}${note.failure}`;
}

function normalizeSentence(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  return /[。！？.!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
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
  const traitScore = save.destiny.traits.reduce((sum, trait) => sum + traitRarityBonus[trait.rarity], 0);
  const greatSuccessCount = save.records.filter((record) => record.outcome?.rank === "greatSuccess").length;
  const criticalFailCount = save.records.filter((record) => record.outcome?.rank === "criticalFail").length;
  const total =
    Object.values(save.currentStats).reduce((sum, value) => sum + value, 0) / 5 +
    save.state.reputation * 0.16 +
    save.state.assets * 0.16 +
    save.state.bonds * 0.14 -
    save.state.pressure * 0.16 +
    traitScore * 0.9 +
    greatSuccessCount * 2 -
    criticalFailCount * 3;

  const title =
    total >= 92
      ? "上上格：财名两全"
      : total >= 80
        ? "上格：中年起势"
        : total >= 66
          ? "中上格：守成有余"
          : total >= 52
            ? "中平格：劳碌见财"
            : "下格：多阻少成";

  const rating =
    total >= 92 ? "SSS" : total >= 80 ? "S" : total >= 66 ? "A" : total >= 52 ? "B" : "C";

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
      return statSwing + stateSwing >= 15 || record.outcome?.rank === "greatSuccess" || record.outcome?.rank === "criticalFail";
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
  const greatSuccessCount = save.records.filter((record) => record.outcome?.rank === "greatSuccess").length;
  const criticalFailCount = save.records.filter((record) => record.outcome?.rank === "criticalFail").length;
  const pressureText =
    save.state.pressure >= 70
      ? "压力积重，晚局多有病耗与是非，宜减争心、少冒险。"
      : save.state.pressure >= 35
        ? "压力未尽，得失相半，后运要靠稳字收束。"
        : "压力能化，晚局较清，少有拖累之事。";
  const assetText =
    save.state.assets >= 45
      ? "资产有根，能聚财也能调财。"
      : save.state.assets >= 15
        ? "资产有进有出，财来需守。"
        : "资产根基偏薄，遇大局仍须借势。";
  const bondText =
    save.state.bonds >= 40
      ? "关系宫有助，贵人与旧识多能接力。"
      : save.state.bonds >= 10
        ? "关系不孤，但助力来得不稳。"
        : "关系宫偏冷，凡事多靠自己担。";

  return `终批 ${rating}。「${title}」。此命册五维总值 ${deltaTotal}，大成功 ${greatSuccessCount} 次，大失败 ${criticalFailCount} 次；关键选择为「${keyChoiceLabel}」。${assetText}${bondText}${pressureText}主签「${save.destiny.traits[0]?.name}」为全局定调，若后续重开此命，宜补短板、避高压、重视能留人留财的选择。`;
}

export function zeroDelta(): Stats {
  return { ...emptyStats };
}
