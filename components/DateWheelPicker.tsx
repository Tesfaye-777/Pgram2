"use client";

import { useRef } from "react";

type CalendarType = "solar" | "lunar";

type Props = {
  year: number;
  month: number;
  day: number;
  calendarType: CalendarType;
  onChange: (value: { year: number; month: number; day: number }) => void;
};

const currentYear = new Date().getFullYear();
const minYear = currentYear - 100;
const lunarMonths = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const lunarDays = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十"
];

export function DateWheelPicker({ year, month, day, calendarType, onChange }: Props) {
  const maxDay = getMaxDay(calendarType, year, month);
  const safeDay = Math.min(day, maxDay);

  function update(next: Partial<{ year: number; month: number; day: number }>) {
    const nextYear = next.year ?? year;
    const nextMonth = next.month ?? month;
    const nextMaxDay = getMaxDay(calendarType, nextYear, nextMonth);
    const nextDay = Math.min(next.day ?? safeDay, nextMaxDay);
    onChange({ year: nextYear, month: nextMonth, day: nextDay });
  }

  return (
    <div className="rounded-lg border border-gold/25 bg-ink/45 p-3">
      <div className="grid grid-cols-3 gap-2">
        <WheelColumn
          label="年"
          value={year}
          min={minYear}
          max={currentYear}
          render={(value) => `${value}`}
          onChange={(value) => update({ year: value })}
        />
        <WheelColumn
          label="月"
          value={month}
          min={1}
          max={12}
          cyclic
          render={(value) => (calendarType === "lunar" ? lunarMonths[value - 1] : `${value}`.padStart(2, "0"))}
          onChange={(value) => update({ month: value })}
        />
        <WheelColumn
          label="日"
          value={safeDay}
          min={1}
          max={maxDay}
          cyclic
          render={(value) => (calendarType === "lunar" ? lunarDays[value - 1] : `${value}`.padStart(2, "0"))}
          onChange={(value) => update({ day: value })}
        />
      </div>
      <div className="mt-3 rounded-md border border-jade/20 bg-jade/8 py-2 text-center text-sm text-jade">
        {calendarType === "lunar" ? "农历" : "新历"} {year} 年{" "}
        {calendarType === "lunar" ? lunarMonths[month - 1] : `${month} 月`}{" "}
        {calendarType === "lunar" ? lunarDays[safeDay - 1] : `${safeDay} 日`}
      </div>
    </div>
  );
}

function WheelColumn({
  label,
  value,
  min,
  max,
  cyclic = false,
  render,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  cyclic?: boolean;
  render: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const touchStart = useRef<number | null>(null);
  const visibleValues = [-1, 0, 1].map((offset) => displayValue(value, offset, min, max, cyclic));

  function shift(direction: number) {
    onChange(moveValue(value, direction, min, max, cyclic));
  }

  return (
    <div>
      <p className="mb-1 text-center text-xs text-parchment/55">{label}</p>
      <div
        className="relative overflow-hidden rounded-md border border-gold/20 bg-gradient-to-b from-ink/85 via-parchment/10 to-ink/85"
        onWheel={(event) => {
          event.preventDefault();
          if (Math.abs(event.deltaY) > 2) {
            shift(event.deltaY > 0 ? 1 : -1);
          }
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) {
            return;
          }
          const delta = touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current);
          touchStart.current = null;
          if (Math.abs(delta) > 18) {
            shift(delta > 0 ? 1 : -1);
          }
        }}
      >
        <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 h-10 -translate-y-1/2 rounded-md border border-gold/35 bg-gold/10 shadow-gold" />
        <div className="hide-scrollbar h-32 px-2 py-2">
          {visibleValues.map((option, index) => {
            const active = index === 1;
            const distance = Math.abs(index - 1);

            if (option === null) {
              return <div key={`empty-${index}`} className="mb-1 h-8" />;
            }

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                onClick={() => onChange(option)}
                className={`wheel-option relative z-20 mb-1 block h-8 w-full rounded text-center transition duration-300 ease-out ${
                  active
                    ? "wheel-option-active bg-gold/18 text-lg font-black text-yellow-50"
                    : "text-sm text-parchment/55 hover:bg-parchment/8 hover:text-parchment"
                }`}
                style={{ opacity: active ? 1 : distance === 1 ? 0.72 : 0.42, transform: `scale(${active ? 1 : distance === 1 ? 0.94 : 0.88})` }}
              >
                {render(option)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function moveValue(value: number, offset: number, min: number, max: number, cyclic: boolean) {
  const range = max - min + 1;
  if (!cyclic) {
    return Math.max(min, Math.min(max, value + offset));
  }
  return ((value - min + offset + range * 10) % range) + min;
}

function displayValue(value: number, offset: number, min: number, max: number, cyclic: boolean) {
  const next = value + offset;
  if (!cyclic && (next < min || next > max)) {
    return null;
  }
  return moveValue(value, offset, min, max, cyclic);
}

function getMaxDay(calendarType: CalendarType, year: number, month: number) {
  if (calendarType === "lunar") {
    return 30;
  }
  return new Date(year, month, 0).getDate();
}
