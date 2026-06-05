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
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {statKeys.map((key) => (
          <div key={key} className="rounded-md border border-white/10 bg-white/6 p-3">
            <p className="text-xs text-slate-400">{statLabels[key]}</p>
            <p className="mt-1 font-mono text-xl text-jade">{ending.finalStats[key]}</p>
            <p
              className={`text-xs ${
                ending.statDelta[key] >= 0 ? "text-emerald-200" : "text-red-200"
              }`}
            >
              {ending.statDelta[key] >= 0 ? "+" : ""}
              {ending.statDelta[key as StatKey]}
            </p>
          </div>
        ))}
      </div>
    </section>
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
