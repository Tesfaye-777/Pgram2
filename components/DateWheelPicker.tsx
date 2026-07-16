"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
    <div className="rounded-lg border border-[#8c6a32]/28 bg-[#eadbb8]/30 p-3 shadow-[inset_0_0_18px_rgba(126,88,43,0.08)]">
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
      <div className="mt-3 rounded-md border border-[#8c6a32]/26 bg-[#f4e8c9]/42 py-2 text-center text-sm font-medium text-[#5a3519]">
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
  const itemHeight = 40;
  const repeatCount = cyclic ? 9 : 1;
  const middleRepeat = Math.floor(repeatCount / 2);
  const baseValues = useMemo(() => range(min, max), [min, max]);
  const values = useMemo(
    () => Array.from({ length: repeatCount }, () => baseValues).flat(),
    [baseValues, repeatCount]
  );
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollEndTimer = useRef<number | null>(null);
  const isUserScrolling = useRef(false);
  const isPointerDown = useRef(false);
  const dragStartY = useRef<number | null>(null);
  const dragLastY = useRef<number | null>(null);
  const hasDragged = useRef(false);
  const [dragging, setDragging] = useState(false);

  const selectedIndex = cyclic
    ? middleRepeat * baseValues.length + (value - min)
    : Math.max(0, Math.min(baseValues.length - 1, value - min));

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isUserScrolling.current) {
      return;
    }
    scroller.scrollTo({ top: selectedIndex * itemHeight, behavior: "auto" });
  }, [selectedIndex]);

  function settleWheel() {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const index = Math.max(0, Math.min(values.length - 1, Math.round(scroller.scrollTop / itemHeight)));
    const nextValue = values[index];
    const nextIndex = cyclic ? middleRepeat * baseValues.length + (nextValue - min) : index;
    if (nextValue !== value) {
      onChange(nextValue);
    }
    scroller.scrollTo({ top: nextIndex * itemHeight, behavior: "smooth" });
    isUserScrolling.current = false;
  }

  function chooseOption(option: number) {
    const scroller = scrollerRef.current;
    const nextIndex = cyclic ? middleRepeat * baseValues.length + (option - min) : option - min;
    isUserScrolling.current = false;
    onChange(option);
    scroller?.scrollTo({ top: nextIndex * itemHeight, behavior: "smooth" });
  }

  function chooseFromPointer(clientY: number) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const rect = scroller.getBoundingClientRect();
    const contentY = clientY - rect.top + scroller.scrollTop - 44;
    const index = Math.max(0, Math.min(values.length - 1, Math.floor(contentY / itemHeight)));
    chooseOption(values[index]);
  }

  return (
    <div>
      <p className="mb-1 text-center text-xs font-semibold tracking-[0.16em] text-[#6d4a20]">{label}</p>
      <div className="date-wheel-frame relative overflow-hidden rounded-md border border-[#8c6a32]/28 bg-[#efe1bf]/58">
        <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 h-10 -translate-y-1/2 rounded-md border border-[#a47a32]/45 bg-[#f8edcc]/62 shadow-[0_0_18px_rgba(176,128,42,0.24)]" />
        <div
          ref={scrollerRef}
          className={`date-wheel-scroll hide-scrollbar h-32 cursor-grab touch-none select-none overflow-y-auto overscroll-contain px-2 active:cursor-grabbing ${
            dragging ? "" : "snap-y snap-mandatory"
          }`}
          style={{ paddingTop: 44, paddingBottom: 44 }}
          onScroll={() => {
            isUserScrolling.current = true;
            if (isPointerDown.current) {
              if (scrollEndTimer.current) {
                window.clearTimeout(scrollEndTimer.current);
              }
              return;
            }
            if (scrollEndTimer.current) {
              window.clearTimeout(scrollEndTimer.current);
            }
            scrollEndTimer.current = window.setTimeout(() => {
              settleWheel();
            }, 90);
          }}
          onPointerDown={(event) => {
            dragStartY.current = event.clientY;
            dragLastY.current = event.clientY;
            hasDragged.current = false;
            isPointerDown.current = true;
            isUserScrolling.current = true;
            setDragging(true);
            if (scrollEndTimer.current) {
              window.clearTimeout(scrollEndTimer.current);
            }
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const scroller = scrollerRef.current;
            if (!scroller || dragLastY.current === null) {
              return;
            }
            const delta = dragLastY.current - event.clientY;
            if (Math.abs((dragStartY.current ?? event.clientY) - event.clientY) > 3) {
              hasDragged.current = true;
            }
            dragLastY.current = event.clientY;
            scroller.scrollTop += delta;
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            isPointerDown.current = false;
            dragStartY.current = null;
            dragLastY.current = null;
            setDragging(false);
            if (!hasDragged.current) {
              chooseFromPointer(event.clientY);
              return;
            }
            window.setTimeout(() => {
              settleWheel();
              hasDragged.current = false;
            }, 60);
          }}
          onPointerCancel={() => {
            isPointerDown.current = false;
            dragStartY.current = null;
            dragLastY.current = null;
            setDragging(false);
            if (!hasDragged.current) {
              return;
            }
            window.setTimeout(() => {
              settleWheel();
              hasDragged.current = false;
            }, 60);
          }}
        >
          {values.map((option, index) => {
            const active = option === value;
            return (
              <button
                key={`${option}-${index}`}
                type="button"
                onClick={(event) => {
                  if (hasDragged.current) {
                    event.preventDefault();
                    return;
                  }
                  chooseOption(option);
                }}
                className={`block h-10 w-full snap-center rounded text-center text-base transition-colors duration-100 ${
                  active ? "font-bold text-[#3b220e]" : "font-medium text-[#6b4b25]/58 hover:text-[#3b220e]/82"
                }`}
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

function range(min: number, max: number) {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

function getMaxDay(calendarType: CalendarType, year: number, month: number) {
  if (calendarType === "lunar") {
    return 30;
  }
  return new Date(year, month, 0).getDate();
}
