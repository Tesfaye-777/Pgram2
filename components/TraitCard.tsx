import {
  rarityDisplayLabels,
  rarityStyles,
  statLabels,
  traitPolarityLabels,
  traitPolarityStyles
} from "@/lib/constants";
import type { DestinyTrait, StatKey } from "@/types";

type Props = {
  trait: DestinyTrait;
};

export function TraitCard({ trait }: Props) {
  const isHighRarity = trait.rarity === "legendary" || trait.rarity === "mythic";
  const cardTone = getRarityTone(trait.rarity);

  return (
    <article
      className={`trait-card group overflow-hidden rounded-lg border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-gold ${rarityStyles[trait.rarity]} ${cardTone} ${
        isHighRarity ? "ring-1 ring-gold/45" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-base font-semibold ${isHighRarity ? "text-lg" : ""}`}>
            {trait.name}
          </h3>
          {isHighRarity ? (
            <p className="mt-1 text-xs text-yellow-100/78">稀世命格，极少现世</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={`rarity-stamp rounded-full border border-current/45 px-2.5 py-1 text-xs font-black ${getBadgeTone(trait.rarity)}`}>
            {rarityDisplayLabels[trait.rarity]}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-xs ${traitPolarityStyles[trait.polarity]}`}>
            {traitPolarityLabels[trait.polarity]}
          </span>
        </div>
      </div>
      <p className="text-sm leading-6 text-parchment/88">{buildSummary(trait)}</p>
      <p className="mt-3 text-xs text-parchment/45">悬停展开完整命册批注</p>

      <div className="mt-0 max-h-0 overflow-hidden rounded-md border border-gold/0 bg-ink/0 text-sm leading-6 text-parchment opacity-0 transition-all duration-200 group-hover:mt-4 group-hover:max-h-96 group-hover:border-gold/30 group-hover:bg-ink/36 group-hover:p-4 group-hover:opacity-100">
        <p className="font-semibold text-yellow-50">命册详批</p>
        <p className="mt-2 text-parchment/82">{buildExpandedReading(trait)}</p>
        <p className="mt-3 text-parchment/72">入世影响：{trait.impact}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(trait.statBonus).map(([key, value]) => (
            <span
              key={key}
              className="rounded border border-gold/18 bg-ink/40 px-2 py-1 text-xs text-parchment"
            >
              {statLabels[key as StatKey]} {Number(value) >= 0 ? "+" : ""}
              {value}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function buildSummary(trait: DestinyTrait) {
  if (trait.polarity === "ominous") {
    return "此命格藏有劫数，开局会带来压力，也可能成为后期转折的伏笔。";
  }

  if (trait.polarity === "mixed") {
    return "此命格有利有弊，能给角色带来优势，也会留下需要付出代价的隐患。";
  }

  if (trait.rarity === "legendary" || trait.rarity === "mythic") {
    return "此命格极为罕见，通常会在关键人生节点提供强力助推。";
  }

  return "此命格能为开局提供稳定助力，并影响后续部分剧情选择。";
}

function buildExpandedReading(trait: DestinyTrait) {
  const polarityReading =
    trait.polarity === "ominous"
      ? "此命格不是单纯的坏运，而是一道需要避其锋芒的劫数。若顺着性情硬闯，容易先失分寸；若能提前识局，反而会把伤处炼成经验。"
      : trait.polarity === "mixed"
        ? "此命格像一柄双刃剑，给你胆气、才情或机缘，也会同步放大代价。它适合主动经营，不适合放任惯性。"
        : "此命格属于顺势而起的助力，会在对应人生节点提供额外把握。它不是保送通关，而是让你在关键处多一分可用之势。";

  return `${trait.description}${polarityReading}`;
}

function getRarityTone(rarity: DestinyTrait["rarity"]) {
  if (rarity === "epic") return "trait-epic";
  if (rarity === "legendary") return "trait-legendary";
  if (rarity === "mythic") return "trait-mythic";
  return "";
}

function getBadgeTone(rarity: DestinyTrait["rarity"]) {
  if (rarity === "epic") return "bg-purple-300/22 text-purple-50 shadow-[0_0_18px_rgba(168,85,247,.35)]";
  if (rarity === "legendary") return "bg-yellow-200/24 text-yellow-50 shadow-[0_0_22px_rgba(255,214,102,.55)]";
  if (rarity === "mythic") return "bg-red-300/22 text-red-50 shadow-[0_0_26px_rgba(255,80,80,.55)]";
  return "";
}
