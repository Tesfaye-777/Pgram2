import {
  rarityDisplayLabels,
  rarityStyles,
  statLabels,
  traitPolarityLabels
} from "@/lib/constants";
import type { DestinyTrait, StatKey } from "@/types";

type Props = {
  trait: DestinyTrait;
  selected?: boolean;
  onSelect?: (trait: DestinyTrait) => void;
};

const traitVerdicts: Record<string, string> = {
  "natural-grace": "玉骨天成，行处自生春风，逢人多留三分善意。",
  "early-wisdom": "少年眼明，未入江湖，已先识得人间暗线。",
  "patron-star": "命中有灯，夜行不独；危处常有人递来半寸光。",
  "grand-fortune": "金潮入袖，富贵临门；大局越开，越见其势。",
  "rough-love": "情字多岔，花开带雨；越近真心，越需定力。",
  "danger-to-light": "身入风雷而不折，劫尽处自有一线生门。",
  "wealth-star": "财星照命，识价知机；一念得当，满盘皆活。",
  "lone-walker": "孤灯照长夜，独步亦成路，只是归处需自寻。",
  "peach-aura": "桃花随身，笑语生波；有缘来得快，定心更要稳。",
  "self-made": "白地起楼台，空手开山河；越无凭依，越见骨气。",
  "late-bloom": "器晚不为迟，沉潜如藏锋；一朝出鞘，万象皆惊。",
  "rewrite-fate": "天书有缺，偏由你补；旧局未定，新命可开。",
  "quick-temper": "心火上行，锋芒先至；若不收刃，易伤己身。",
  "wealth-leak": "财来如潮，财去如沙；守得一分，方聚一城。",
  "thin-kinship": "亲缘如雾，早岁自撑；冷处生骨，静处生明。",
  "too-sharp": "锋露三分，人皆侧目；藏锋得法，方成利器。",
  "old-ailment": "灯明易耗，身需细护；慢行不误，久守成光。"
};

export function TraitCard({ trait, selected = false, onSelect }: Props) {
  const isHighRarity = trait.rarity === "epic" || trait.rarity === "legendary" || trait.rarity === "mythic";
  const cardTone = getRarityTone(trait.rarity);
  const summary = buildSummary(trait);
  const summarySize = getSummarySize(summary.length);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(trait)}
      className={`trait-card flex h-full min-h-[150px] w-full flex-col overflow-hidden rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-gold ${
        selected ? "ring-2 ring-jade/60" : isHighRarity ? "ring-1 ring-gold/45" : ""
      } ${rarityStyles[trait.rarity]} ${cardTone} ${getAnimatedTone(trait.rarity)}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 pr-2">
          <h3 className={`font-serif text-xl font-black tracking-[0.04em] text-yellow-50 drop-shadow-[0_0_10px_rgba(242,228,189,0.16)] ${isHighRarity ? "text-2xl" : ""}`}>
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
          <span className="rounded-full border border-parchment/35 bg-parchment/8 px-2 py-0.5 font-serif text-xs font-black text-parchment/90">
            {traitPolarityLabels[trait.polarity]}
          </span>
        </div>
      </div>
      <p className={`mt-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-serif font-black leading-6 text-parchment/90 ${summarySize}`}>
        {summary}
      </p>
    </button>
  );
}

export function TraitDetailPanel({ trait }: { trait: DestinyTrait }) {
  return (
    <aside key={trait.id} className="trait-detail-fade rounded-lg border border-gold/30 bg-ink/58 p-5 text-sm leading-7 text-parchment shadow-gold">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black tracking-[0.32em] text-cinnabar">命册详批</p>
          <h3 className="mt-2 font-serif text-3xl font-black tracking-[0.08em] text-yellow-50 drop-shadow-[0_0_14px_rgba(216,179,90,0.22)]">
            {trait.name}
          </h3>
        </div>
        <span className={`rarity-stamp rounded-full border border-current/45 px-3 py-1 text-xs font-black ${getBadgeTone(trait.rarity)}`}>
          {rarityDisplayLabels[trait.rarity]}
        </span>
      </div>
      <p className="mt-4 text-parchment/84">{buildExpandedReading(trait)}</p>
      <p className="mt-3 text-parchment/72">入世影响：{trait.impact}</p>
      <div className="mt-4 flex flex-wrap gap-2">
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
    </aside>
  );
}

function buildSummary(trait: DestinyTrait) {
  return traitVerdicts[trait.id] ?? "云路半开，祸福藏锋；一念落处，便见山河。";
}

function getSummarySize(length: number) {
  if (length >= 29) {
    return "text-[11px] tracking-[0]";
  }
  if (length >= 25) {
    return "text-[12px] tracking-[0]";
  }
  if (length >= 21) {
    return "text-[13px] tracking-[0.01em]";
  }
  return "text-[14px] tracking-[0.02em]";
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

function getAnimatedTone(rarity: DestinyTrait["rarity"]) {
  if (rarity === "epic") return "trait-animated-epic";
  if (rarity === "legendary") return "trait-animated-legendary";
  if (rarity === "mythic") return "trait-animated-mythic";
  return "";
}

function getBadgeTone(rarity: DestinyTrait["rarity"]) {
  if (rarity === "rare") return "bg-blue-300/16 text-blue-50 shadow-[0_0_14px_rgba(96,165,250,.28)]";
  if (rarity === "epic") return "bg-purple-300/24 text-purple-50 shadow-[0_0_22px_rgba(168,85,247,.55)]";
  if (rarity === "legendary") return "bg-yellow-200/28 text-yellow-50 shadow-[0_0_28px_rgba(255,214,102,.72)]";
  if (rarity === "mythic") return "bg-red-300/24 text-red-50 shadow-[0_0_34px_rgba(255,80,80,.78)]";
  return "bg-parchment/8 text-parchment/90";
}
