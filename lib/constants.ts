import type { BirthHour, Rarity, StatKey } from "@/types";

export const statLabels: Record<StatKey, string> = {
  luck: "福缘",
  wealth: "财势",
  mind: "心性",
  courage: "魄力",
  insight: "悟性"
};

export const rarityLabels: Record<Rarity, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
  mythic: "神话"
};

export const rarityDisplayLabels: Record<Rarity, string> = {
  common: "凡品灵签",
  rare: "稀有灵签",
  epic: "史诗灵签",
  legendary: "传说灵签",
  mythic: "神话命签"
};

export const rarityStyles: Record<Rarity, string> = {
  common: "border-parchment/30 bg-parchment/8 text-parchment",
  rare: "border-blue-300/45 bg-blue-400/10 text-blue-100",
  epic: "border-purple-300/45 bg-purple-400/12 text-purple-100",
  legendary: "border-gold/70 bg-gold/14 text-yellow-100 shadow-gold",
  mythic: "border-red-300/60 bg-cinnabar/18 text-red-100 shadow-cinnabar"
};

export const traitPolarityLabels = {
  auspicious: "吉签",
  mixed: "半吉半劫",
  ominous: "劫签"
};

export const traitPolarityStyles = {
  auspicious: "border-jade/45 bg-jade/12 text-jade",
  mixed: "border-gold/45 bg-gold/12 text-yellow-100",
  ominous: "border-cinnabar/55 bg-cinnabar/16 text-red-100"
};

export const emptyStats = {
  luck: 0,
  wealth: 0,
  mind: 0,
  courage: 0,
  insight: 0
};

export const birthHourOptions: Array<{
  value: BirthHour;
  label: string;
  range: string;
}> = [
  { value: "zi", label: "子时", range: "23:00-00:59" },
  { value: "chou", label: "丑时", range: "01:00-02:59" },
  { value: "yin", label: "寅时", range: "03:00-04:59" },
  { value: "mao", label: "卯时", range: "05:00-06:59" },
  { value: "chen", label: "辰时", range: "07:00-08:59" },
  { value: "si", label: "巳时", range: "09:00-10:59" },
  { value: "wu", label: "午时", range: "11:00-12:59" },
  { value: "wei", label: "未时", range: "13:00-14:59" },
  { value: "shen", label: "申时", range: "15:00-16:59" },
  { value: "you", label: "酉时", range: "17:00-18:59" },
  { value: "xu", label: "戌时", range: "19:00-20:59" },
  { value: "hai", label: "亥时", range: "21:00-22:59" }
];
