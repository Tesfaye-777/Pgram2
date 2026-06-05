import { statLabels } from "@/lib/constants";
import type { Stats } from "@/types";

type Props = {
  stats: Stats;
  previousStats?: Stats;
};

const keys = ["luck", "wealth", "mind", "courage", "insight"] as const;
const center = 110;
const radius = 78;

export function StatRadarChart({ stats, previousStats }: Props) {
  const points = buildPoints(stats);
  const previousPoints = previousStats ? buildPoints(previousStats) : null;

  return (
    <div className="xian-card self-start rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-jade">五维灵盘</h2>
        <span className="text-xs text-parchment/60">0-100</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[150px_1fr] sm:items-center lg:grid-cols-1">
        <svg viewBox="0 0 220 220" className="mx-auto h-40 w-40 overflow-visible lg:h-44 lg:w-44">
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
            const labelX = center + Math.cos(angle) * (radius + 24);
            const labelY = center + Math.sin(angle) * (radius + 24);
            return (
              <g key={key}>
                <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(242,228,189,.16)" />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#8de6c8] text-[10px]"
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
        <div className="space-y-2">
          {keys.map((key) => (
            <div key={key}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-200">{statLabels[key]}</span>
                <span className="font-mono text-jade">{stats[key]}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-jade via-gold to-cinnabar"
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
