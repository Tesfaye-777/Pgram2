import { statLabels } from "@/lib/constants";
import type { Stats } from "@/types";

type Props = {
  stats: Stats;
  previousStats?: Stats;
};

const keys = ["luck", "wealth", "mind", "courage", "insight"] as const;
const center = 110;
const radius = 78;
const labelRadius = radius + 18;

export function StatRadarChart({ stats, previousStats }: Props) {
  const points = buildPoints(stats);
  const previousPoints = previousStats ? buildPoints(previousStats) : null;

  return (
    <div className="xian-card h-full self-start rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-3xl font-black tracking-[0.1em] text-jade drop-shadow-[0_0_10px_rgba(141,230,200,.28)]">五维灵盘</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center lg:grid-cols-1">
        <svg viewBox="0 0 220 220" className="mx-auto h-48 w-48 overflow-visible lg:h-52 lg:w-52">
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon
              key={scale}
              points={buildGuidePoints(scale)}
              fill="none"
              stroke="rgba(216,179,90,.22)"
              strokeWidth="1"
            />
          ))}
          {keys.map((key, index) => {
            const angle = getAngle(index);
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const labelX = center + Math.cos(angle) * labelRadius;
            const labelY = center + Math.sin(angle) * labelRadius + (key === "luck" ? 6 : 0);
            return (
              <g key={key}>
                <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(242,228,189,.16)" />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#8de6c8] font-serif text-[18px] font-black tracking-[0.12em]"
                >
                  {statLabels[key]}
                </text>
              </g>
            );
          })}
          {previousPoints ? (
            <polygon
              points={previousPoints}
              fill="rgba(242,228,189,.08)"
              stroke="rgba(242,228,189,.3)"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ) : null}
          <polygon
            points={points}
            fill="rgba(141,230,200,.18)"
            stroke="#8de6c8"
            strokeWidth="2"
            filter="drop-shadow(0 0 10px rgba(141,230,200,.42))"
          />
        </svg>
        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key}>
              <div className="mb-1.5 flex justify-between text-base">
                <span className="font-serif text-lg font-black tracking-[0.1em] text-parchment/90">{statLabels[key]}</span>
                <span className="font-serif text-lg font-black text-jade">{stats[key]}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-parchment/10 shadow-[inset_0_0_8px_rgba(0,0,0,.45)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-jade via-[#d8d08a] to-gold shadow-[0_0_10px_rgba(141,230,200,.24)]"
                  style={{ width: `${stats[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getAngle(index: number) {
  return -Math.PI / 2 + (index * Math.PI * 2) / keys.length;
}

function buildGuidePoints(scale: number) {
  return keys
    .map((_, index) => {
      const angle = getAngle(index);
      return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
    })
    .join(" ");
}

function buildPoints(stats: Stats) {
  return keys
    .map((key, index) => {
      const angle = getAngle(index);
      const valueRadius = radius * (stats[key] / 100);
      return `${center + Math.cos(angle) * valueRadius},${center + Math.sin(angle) * valueRadius}`;
    })
    .join(" ");
}
