import { statLabels } from "@/lib/constants";
import type { Ending, StatKey } from "@/types";

const statKeys = ["luck", "wealth", "mind", "courage", "insight"] as const;

type Props = {
  ending: Ending;
};

export function ResultSummary({ ending }: Props) {
  return (
    <section className="xian-card scroll-glow rounded-lg p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cinnabar">终局命册</p>
          <h1 className="mt-2 text-3xl font-bold text-yellow-50 md:text-4xl">{ending.title}</h1>
          <p className="mt-2 text-slate-300">最终命格评价：{ending.rating}</p>
        </div>
        <div className="rounded-lg border border-yellow-300/40 bg-yellow-300/10 px-5 py-3 text-center shadow-gold">
          <p className="text-xs text-yellow-100/80">RATING</p>
          <p className="text-3xl font-black text-yellow-100">{ending.rating}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoBlock title="最强词条" value={ending.strongestTrait.name} />
        <InfoBlock title="关键选择" value={ending.keyChoice?.choiceLabel ?? "无记录"} />
        <InfoBlock title="触发场景" value={ending.keyChoice?.scenarioTitle ?? "终章"} />
      </div>
      <p className="mt-6 rounded-md border border-gold/18 bg-ink/36 p-4 leading-7 text-parchment/88">
        {ending.summary}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
        {statKeys.map((key) => (
          <StatResultCard
            key={key}
            statKey={key}
            label={statLabels[key]}
            value={ending.finalStats[key]}
            delta={ending.statDelta[key as StatKey]}
          />
        ))}
      </div>
    </section>
  );
}

const statCardTone: Record<StatKey, { aura: string; bar: string; value: string }> = {
  luck: {
    aura: "from-emerald-300/12",
    bar: "from-jade via-emerald-200 to-gold",
    value: "text-jade"
  },
  wealth: {
    aura: "from-yellow-300/14",
    bar: "from-gold via-yellow-200 to-amber-500",
    value: "text-yellow-100"
  },
  mind: {
    aura: "from-sky-300/12",
    bar: "from-sky-200 via-jade to-cyan-400",
    value: "text-cyan-100"
  },
  courage: {
    aura: "from-red-400/12",
    bar: "from-cinnabar via-orange-300 to-gold",
    value: "text-orange-100"
  },
  insight: {
    aura: "from-violet-300/12",
    bar: "from-violet-200 via-fuchsia-200 to-jade",
    value: "text-violet-100"
  }
};

function StatResultCard({
  statKey,
  label,
  value,
  delta
}: {
  statKey: StatKey;
  label: string;
  value: number;
  delta: number;
}) {
  const deltaTone = delta >= 0 ? "text-jade" : "text-red-200";
  const tone = statCardTone[statKey];

  return (
    <div className={`rounded-lg border border-gold/16 bg-gradient-to-br ${tone.aura} to-ink/45 px-3 py-2.5 shadow-[inset_0_0_18px_rgba(216,179,90,0.04)]`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-parchment/72">{label}</p>
        <p className={`font-mono text-xs font-bold ${deltaTone}`}>
          {delta >= 0 ? "+" : ""}
          {delta}
        </p>
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-3">
        <p className={`font-mono text-2xl font-black leading-none ${tone.value}`}>{value}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-parchment/8">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tone.bar} shadow-[0_0_12px_rgba(141,230,200,0.18)]`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/6 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 font-semibold text-slate-50">{value}</p>
    </div>
  );
}
