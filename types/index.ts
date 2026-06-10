export type Gender = "male" | "female" | "other" | "unspecified";

export type BirthHour =
  | "zi"
  | "chou"
  | "yin"
  | "mao"
  | "chen"
  | "si"
  | "wu"
  | "wei"
  | "shen"
  | "you"
  | "xu"
  | "hai";

export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type StatKey = "luck" | "wealth" | "mind" | "courage" | "insight";

export type Stats = Record<StatKey, number>;

export type LifeStatusKey = "reputation" | "assets" | "bonds";

export type ChoiceRiskLevel = "safe" | "normal" | "risky" | "fate" | "heaven";

export type ChoiceCheckRank = "greatSuccess" | "success" | "partialFail" | "fail" | "criticalFail";

export type TraitEffectDisplay = {
  traitName: string;
  effectTitle: string;
  effectDescription: string;
  effectType:
    | "bonus"
    | "failure_grace"
    | "rank_shift"
    | "state_shift"
    | "hidden_route"
    | "pressure";
  value?: number;
  visible: boolean;
};

export type UserProfile = {
  name: string;
  birthDate: string;
  birthTime: BirthHour;
  gender: Gender;
};

export type DestinyTrait = {
  id: string;
  name: string;
  rarity: Rarity;
  polarity: "auspicious" | "mixed" | "ominous";
  description: string;
  impact: string;
  statBonus: Partial<Stats>;
  tags: string[];
};

export type DestinyProfile = {
  user: UserProfile;
  title: string;
  archetype: string;
  seed: number;
  traits: DestinyTrait[];
  baseStats: Stats;
  initialEvaluation: string;
  createdAt: string;
};

export type ChoiceRequirement =
  | { type: "trait"; traitId: string; label: string }
  | { type: "stat"; stat: StatKey; min: number; label: string };

export type LifeChoice = {
  id: string;
  label: string;
  description: string;
  requiredAttribute?: StatKey;
  difficulty?: number;
  riskLevel?: ChoiceRiskLevel;
  relatedStatus?: LifeStatusKey;
  effects: Partial<Stats>;
  greatSuccessEffect?: Partial<Stats>;
  successEffect?: Partial<Stats>;
  partialFailEffect?: Partial<Stats>;
  failEffect?: Partial<Stats>;
  criticalFailEffect?: Partial<Stats>;
  stateEffects?: Partial<LifeState>;
  greatSuccessStateEffect?: Partial<LifeState>;
  successStateEffect?: Partial<LifeState>;
  partialFailStateEffect?: Partial<LifeState>;
  failStateEffect?: Partial<LifeState>;
  criticalFailStateEffect?: Partial<LifeState>;
  requirement?: ChoiceRequirement;
  risk?: "low" | "medium" | "high";
  traitInteractions?: Array<{
    traitId?: string;
    tag?: string;
    checkBonus?: number;
    failureGrace?: number;
    label: string;
  }>;
  routeEffect?: string;
  resultTexts?: Partial<Record<ChoiceCheckRank, string>>;
};

export type LifeScenario = {
  id: string;
  order: number;
  title: string;
  era: string;
  description: string;
  choices: LifeChoice[];
};

export type LifeState = {
  reputation: number;
  assets: number;
  bonds: number;
  pressure: number;
  turningPoints: string[];
};

export type ChoiceRecord = {
  scenarioId: string;
  scenarioTitle: string;
  choiceId: string;
  choiceLabel: string;
  effects: Partial<Stats>;
  stateEffects?: Partial<LifeState>;
  outcome?: ChoiceOutcome;
};

export type ChoiceOutcome = {
  success: boolean;
  roll: number;
  modifier: number;
  attributeBonus: number;
  traitBonus: number;
  statusBonus: number;
  pressurePenalty: number;
  sceneModifier: number;
  situationalBonus: number;
  total: number;
  target: number;
  finalScore: number;
  targetScore: number;
  margin: number;
  difficulty: number;
  riskLevel: ChoiceRiskLevel;
  keyStat: StatKey;
  baseStat: number;
  relatedStatus?: LifeStatusKey;
  relatedStatusValue?: number;
  rollEffectText?: string;
  rank: ChoiceCheckRank;
  rankLabel: string;
  effects: Partial<Stats>;
  stateEffects?: Partial<LifeState>;
  triggeredTraitEffects: TraitEffectDisplay[];
  routeEffect?: string;
  resultText: string;
};

export type SimulationSave = {
  destiny: DestinyProfile;
  currentScenarioIndex: number;
  currentStats: Stats;
  state: LifeState;
  records: ChoiceRecord[];
  completed: boolean;
};

export type Ending = {
  title: string;
  rating: string;
  strongestTrait: DestinyTrait;
  keyChoice: ChoiceRecord | null;
  finalStats: Stats;
  statDelta: Stats;
  summary: string;
};
