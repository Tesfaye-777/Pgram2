import type { DestinyProfile, DestinyTrait, Stats, UserProfile } from "@/types";
import { optimizedTraitCopy } from "@/lib/copyOptimizations";

const traitPool: DestinyTrait[] = [
  {
    id: "natural-grace",
    name: "天生丽质",
    rarity: "rare",
    polarity: "auspicious",
    description: "你眉目清朗，举止自有光华，初入陌生场合也容易得人善意。",
    impact: "人际事件更容易建立连接，福缘与心性提升。",
    statBonus: { luck: 8, mind: 5 },
    tags: ["social", "charm"]
  },
  {
    id: "early-wisdom",
    name: "少年早慧",
    rarity: "rare",
    polarity: "auspicious",
    description: "很早就能看懂旁人没说出口的规则，也因此比同龄人更敏感。",
    impact: "学业与抉择类场景获得更高悟性。",
    statBonus: { insight: 11, mind: 4 },
    tags: ["study", "insight"]
  },
  {
    id: "patron-star",
    name: "贵人相助",
    rarity: "epic",
    polarity: "auspicious",
    description: "关键节点总有人递来一盏灯，但是否接住仍取决于你。",
    impact: "事业危机可解锁求助选项，福缘提升。",
    statBonus: { luck: 14, wealth: 4 },
    tags: ["career", "support"]
  },
  {
    id: "grand-fortune",
    name: "大富大贵",
    rarity: "legendary",
    polarity: "auspicious",
    description: "你与资源流动之间有奇妙吸引力，越大的棋盘越能显形。",
    impact: "财富机会收益更高，财势大幅提升。",
    statBonus: { wealth: 18, courage: 5 },
    tags: ["wealth"]
  },
  {
    id: "rough-love",
    name: "情路坎坷",
    rarity: "common",
    polarity: "mixed",
    description: "情感不是坦途，更像一段需要反复校准的长途通信。",
    impact: "感情抉择更考验心性，关系收益更不稳定，但会带来成长。",
    statBonus: { mind: 6, insight: 3, luck: -2 },
    tags: ["love"]
  },
  {
    id: "danger-to-light",
    name: "逢凶化吉",
    rarity: "legendary",
    polarity: "auspicious",
    description: "你未必避开风暴，却常能在风暴眼里找到出口。",
    impact: "低谷事件可解锁额外翻盘机会，福缘与魄力提升。",
    statBonus: { luck: 15, courage: 8 },
    tags: ["survival", "turnaround"]
  },
  {
    id: "wealth-star",
    name: "财星入命",
    rarity: "epic",
    polarity: "auspicious",
    description: "你对机会的价格、风险与时机有近乎本能的嗅觉。",
    impact: "投资与职业选择更容易积累资产。",
    statBonus: { wealth: 15, insight: 5 },
    tags: ["wealth", "career"]
  },
  {
    id: "lone-walker",
    name: "孤胆独行",
    rarity: "common",
    polarity: "mixed",
    description: "你能独自穿过长夜，但也容易把求助误判为软弱。",
    impact: "独立选项收益提升，但关系积累更慢。",
    statBonus: { courage: 9, mind: 4, luck: -2 },
    tags: ["solo"]
  },
  {
    id: "peach-aura",
    name: "命带桃花",
    rarity: "rare",
    polarity: "auspicious",
    description: "人群里的情绪频率总会向你靠近，热闹与误会一并到来。",
    impact: "情感与社交场景获得更多关系收益。",
    statBonus: { luck: 7, mind: 5 },
    tags: ["love", "social"]
  },
  {
    id: "self-made",
    name: "白手起家",
    rarity: "epic",
    polarity: "auspicious",
    description: "你对起点不敏感，对路径很敏感，空地也能被你搭成据点。",
    impact: "创业场景可解锁从零开始路线，魄力与财势提升。",
    statBonus: { courage: 12, wealth: 9 },
    tags: ["startup", "career"]
  },
  {
    id: "late-bloom",
    name: "大器晚成",
    rarity: "rare",
    polarity: "auspicious",
    description: "你的曲线不是直线上升，而是在沉潜后忽然陡峭。",
    impact: "中后期选择获得更稳定的成长空间。",
    statBonus: { mind: 9, insight: 7 },
    tags: ["growth"]
  },
  {
    id: "rewrite-fate",
    name: "逆天改命",
    rarity: "mythic",
    polarity: "auspicious",
    description: "系统给出的默认结局，只是你准备挑战的第一版草稿。",
    impact: "最终阶段拥有强力翻盘潜力，全属性提升。",
    statBonus: { luck: 10, wealth: 10, mind: 10, courage: 10, insight: 10 },
    tags: ["turnaround", "myth"]
  },
  {
    id: "quick-temper",
    name: "心火易燃",
    rarity: "common",
    polarity: "ominous",
    description: "你遇事反应很快，情绪也很快。刀未出鞘，火气先到。",
    impact: "冲突类选择风险变高，魄力提升但心性下降。",
    statBonus: { courage: 7, mind: -8 },
    tags: ["risk", "temper"]
  },
  {
    id: "wealth-leak",
    name: "财来财去",
    rarity: "common",
    polarity: "ominous",
    description: "你不缺遇见钱的机会，却容易在义气、冲动或误判里漏掉积蓄。",
    impact: "财富机会波动更大，财势下降但福缘略升。",
    statBonus: { wealth: -8, luck: 4 },
    tags: ["wealth", "risk"]
  },
  {
    id: "thin-kinship",
    name: "六亲缘浅",
    rarity: "rare",
    polarity: "ominous",
    description: "你很早就学会独自消化难处，亲缘庇护少，心里也更难开口求助。",
    impact: "家庭与关系场景更艰难，悟性提升但福缘下降。",
    statBonus: { insight: 8, luck: -7, mind: -3 },
    tags: ["family", "solo"]
  },
  {
    id: "too-sharp",
    name: "锋芒太露",
    rarity: "rare",
    polarity: "mixed",
    description: "你有锋利的才气，也容易让旁人觉得刺眼。",
    impact: "竞争场景表现更强，但人际背叛风险更高。",
    statBonus: { insight: 7, courage: 6, luck: -4 },
    tags: ["career", "risk"]
  },
  {
    id: "old-ailment",
    name: "旧疾缠身",
    rarity: "epic",
    polarity: "ominous",
    description: "身体像一盏需要细心护持的灯，亮时很亮，耗尽也快。",
    impact: "健康警讯更严峻，心性提升但魄力受限。",
    statBonus: { mind: 8, courage: -7, luck: -4 },
    tags: ["health", "risk"]
  }
];

const rarityWeight = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythic: 5
};

const activeTraitPool: DestinyTrait[] = traitPool.map((trait) => {
  const optimized = optimizedTraitCopy[trait.id];
  return optimized
    ? {
        ...trait,
        description: optimized.description,
        impact: optimized.impact
      }
    : trait;
});

function hashInput(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function seededPick(seed: number, index: number, modulo: number) {
  const value = Math.sin(seed + index * 97.13) * 10000;
  return Math.abs(Math.floor(value)) % modulo;
}

function clampStat(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function generateDestinyProfile(user: UserProfile): DestinyProfile {
  const seed = hashInput(`${user.name}|${user.birthDate}|${user.birthTime}|${user.gender}`);
  const baseStats: Stats = {
    luck: 38 + seededPick(seed, 1, 27),
    wealth: 34 + seededPick(seed, 2, 29),
    mind: 40 + seededPick(seed, 3, 25),
    courage: 36 + seededPick(seed, 4, 31),
    insight: 37 + seededPick(seed, 5, 28)
  };

  const selected = new Map<string, DestinyTrait>();
  const targetCount = 5 + (seededPick(seed, 6, 3) === 0 ? 1 : 0);
  const ominousCount = seededPick(seed, 7, 100) < 42 ? 1 : 0;
  const ominousPool = activeTraitPool.filter((trait) => trait.polarity === "ominous");
  const mainPool = activeTraitPool.filter((trait) => trait.polarity !== "ominous");
  let cursor = 0;
  while (selected.size < ominousCount) {
    const trait = ominousPool[seededPick(seed, cursor + 80, ominousPool.length)];
    selected.set(trait.id, trait);
    cursor += 1;
  }

  while (selected.size < targetCount) {
    const trait = mainPool[seededPick(seed, cursor + 10, mainPool.length)];
    selected.set(trait.id, trait);
    cursor += 1;
  }

  const traits = Array.from(selected.values()).sort(
    (a, b) => rarityWeight[b.rarity] - rarityWeight[a.rarity]
  );

  for (const trait of traits) {
    for (const [key, value] of Object.entries(trait.statBonus)) {
      const statKey = key as keyof Stats;
      baseStats[statKey] = clampStat(baseStats[statKey] + (value ?? 0));
    }
  }

  const strongest = traits[0];
  const archetypes = ["行路客", "持账人", "观局者", "藏锋人", "问命者"];
  const archetype = archetypes[seededPick(seed, 20, archetypes.length)];

  return {
    user,
    seed,
    traits,
    baseStats,
    archetype,
    title: `${user.name}入世命局`,
    initialEvaluation: buildEvaluation(user.name, baseStats, strongest),
    createdAt: new Date().toISOString()
  };
}

function buildEvaluation(name: string, stats: Stats, strongest: DestinyTrait) {
  const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]) as Array<[keyof Stats, number]>;
  const [topKey, topValue] = sortedStats[0];
  const [lowKey, lowValue] = sortedStats[sortedStats.length - 1];
  const topName = statReadingNames[topKey];
  const lowName = statReadingNames[lowKey];
  const polarity =
    strongest.polarity === "ominous"
      ? "主签带劫，早年容易因一处短板反复受阻，宜先守后攻。"
      : strongest.polarity === "mixed"
        ? "主签半吉半劫，得势时进得快，失衡时也容易付出代价。"
        : "主签偏吉，遇事多有可借之势，但仍需靠抉择把局面坐实。";

  return `${name}此盘以「${strongest.name}」为主签，五维中${topName}最旺，得 ${topValue} 分；${lowName}最弱，为 ${lowValue} 分。${polarity}开局宜重视${topName}所指之路，少在${lowName}不足处硬碰。`;
}

const statReadingNames: Record<keyof Stats, string> = {
  luck: "福缘",
  wealth: "财势",
  mind: "心性",
  courage: "魄力",
  insight: "悟性"
};

export function hasTrait(profile: DestinyProfile, traitId: string) {
  return profile.traits.some((trait) => trait.id === traitId);
}
