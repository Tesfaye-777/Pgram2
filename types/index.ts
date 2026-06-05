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
  effects: Partial<Stats>;
  stateEffects?: Partial<LifeState>;
  requirement?: ChoiceRequirement;
  risk?: "low" | "medium" | "high";
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
  total: number;
  target: number;
  keyStat: StatKey;
  effects: Partial<Stats>;
  stateEffects?: Partial<LifeState>;
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
