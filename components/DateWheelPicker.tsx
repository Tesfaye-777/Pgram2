"use client";

type Props = {
  year: number;
  month: number;
  day: number;
  onChange: (value: { year: number; month: number; day: number }) => void;
};

const currentYear = new Date().getFullYear();
const minYear = currentYear - 100;

export function DateWheelPicker({ year, month, day, onChange }: Props) {
  function update(next: Partial<{ year: number; month: number; day: number }>) {
    const nextYear = clamp(next.year ?? year, minYear, currentYear);
    const nextMonth = clamp(next.month ?? month, 1, 12);
    const maxDay = new Date(nextYear, nextMonth, 0).getDate();
    const nextDay = clamp(next.day ?? day, 1, maxDay);
    onChange({ year: nextYear, month: nextMonth, day: nextDay });
  }

  const maxDay = new Date(year, month, 0).getDate();

  return (
    <div className="rounded-lg border border-gold/25 bg-ink/45 p-3">
      <div className="grid grid-cols-3 gap-2">
        <WheelColumn
          label="年"
          value={year}
          previous={year < currentYear ? year + 1 : null}
          next={year > minYear ? year - 1 : null}
          display={(value) => `${value}`}
          onPrevious={() => update({ year: year + 1 })}
          onNext={() => update({ year: year - 1 })}
        />
        <WheelColumn
          label="月"
          value={month}
          previous={month > 1 ? month - 1 : null}
          next={month < 12 ? month + 1 : null}
          display={(value) => `${value}`.padStart(2, "0")}
          onPrevious={() => update({ month: month - 1 })}
          onNext={() => update({ month: month + 1 })}
        />
        <WheelColumn
          label="日"
          value={day}
          previous={day > 1 ? day - 1 : null}
          next={day < maxDay ? day + 1 : null}
          display={(value) => `${value}`.padStart(2, "0")}
          onPrevious={() => update({ day: day - 1 })}
          onNext={() => update({ day: day + 1 })}
        />
      </div>
      <div className="mt-3 rounded-md border border-jade/20 bg-jade/8 py-2 text-center text-sm text-jade">
        {year} 年 {month} 月 {day} 日
      </div>
    </div>
  );
}

function WheelColumn({
  label,
  value,
  previous,
  next,
  display,
  onPrevious,
  onNext
}: {
  label: string;
  value: number;
  previous: number | null;
  next: number | null;
  display: (value: number) => string;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-center text-xs text-parchment/55">{label}</p>
      <div className="rounded-md border border-gold/20 bg-gradient-to-b from-ink/85 via-parchment/10 to-ink/85 p-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={previous === null}
          className="h-8 w-full rounded text-xs text-parchment/65 transition hover:bg-parchment/10 disabled:opacity-25"
          aria-label={`上一${label}`}
        >
          {previous === null ? " " : display(previous)}
        </button>
        <div className="my-1 rounded-md border border-gold/40 bg-gold/14 py-3 text-center text-xl font-bold text-yellow-50 shadow-gold">
          {display(value)}
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={next === null}
          className="h-8 w-full rounded text-xs text-parchment/65 transition hover:bg-parchment/10 disabled:opacity-25"
          aria-label={`下一${label}`}
        >
          {next === null ? " " : display(next)}
        </button>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
