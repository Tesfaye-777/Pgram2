"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateWheelPicker } from "@/components/DateWheelPicker";
import { birthHourOptions } from "@/lib/constants";
import { generateDestinyProfile } from "@/lib/destinySkill";
import { clearSimulation, saveDestiny } from "@/lib/storage";
import type { BirthHour, Gender } from "@/types";

type Step = "name" | "date" | "hour" | "gender";
type CalendarType = "solar" | "lunar";

const steps: Array<{ id: Step; label: string }> = [
  { id: "name", label: "留名" },
  { id: "date", label: "择日" },
  { id: "hour", label: "定时" },
  { id: "gender", label: "定造" }
];

export function CharacterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [birthDate, setBirthDate] = useState({ year: 1995, month: 1, day: 1 });
  const [birthTime, setBirthTime] = useState<BirthHour>("chen");
  const [gender, setGender] = useState<Gender | "">("");
  const [error, setError] = useState("");

  const stepIndex = steps.findIndex((item) => item.id === step);
  const panelHeightClass = step === "name" || step === "gender" ? "min-h-[330px]" : "min-h-[430px]";

  function goNext() {
    if (step === "name" && !name.trim()) {
      setError("请先留下姓名，命册才能开卷。");
      return;
    }

    if (step === "gender" && !gender) {
      setError("请选择乾造或坤造。");
      return;
    }

    setError("");

    if (step === "gender") {
      submitProfile();
      return;
    }

    setStep(steps[stepIndex + 1].id);
  }

  function goBack() {
    if (stepIndex === 0) {
      return;
    }
    setError("");
    setStep(steps[stepIndex - 1].id);
  }

  function submitProfile() {
    const normalizedBirthDate = `${calendarType}:${birthDate.year}-${String(birthDate.month).padStart(2, "0")}-${String(
      birthDate.day
    ).padStart(2, "0")}`;
    const profile = generateDestinyProfile({
      name: name.trim(),
      birthDate: normalizedBirthDate,
      birthTime,
      gender: gender || "unspecified"
    });
    saveDestiny(profile);
    clearSimulation();
    router.push("/result");
  }

  return (
    <section className="xian-card scroll-glow rounded-lg p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-2">
        {steps.map((item, index) => (
          <div key={item.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                index <= stepIndex
                  ? "border-gold/70 bg-gold/18 text-yellow-50 shadow-gold"
                  : "border-parchment/18 bg-ink/35 text-parchment/45"
              }`}
            >
              {index + 1}
            </div>
            <span className={index <= stepIndex ? "text-xs text-jade" : "text-xs text-parchment/40"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className={`${panelHeightClass} rounded-lg border border-gold/18 bg-ink/24 p-4 transition-[min-height] duration-300`}>
        {step === "name" ? (
          <NamePanel name={name} setName={setName} clearError={() => setError("")} hasError={Boolean(error)} />
        ) : null}
        {step === "date" ? (
          <DatePanel
            calendarType={calendarType}
            setCalendarType={setCalendarType}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
          />
        ) : null}
        {step === "hour" ? <HourPanel birthTime={birthTime} setBirthTime={setBirthTime} /> : null}
        {step === "gender" ? <GenderPanel gender={gender} setGender={setGender} /> : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-cinnabar/45 bg-cinnabar/12 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="rounded-md border border-gold/25 px-4 py-3 text-sm text-parchment/70 transition hover:bg-parchment/8 disabled:cursor-not-allowed disabled:opacity-35"
        >
          上一步
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex-1 rounded-md border border-gold/70 bg-gold/16 px-5 py-3 font-semibold text-yellow-50 shadow-gold transition hover:bg-gold/24"
        >
          {step === "gender" ? "开启命册" : "下一步"}
        </button>
      </div>
    </section>
  );
}

function NamePanel({
  name,
  setName,
  clearError,
  hasError
}: {
  name: string;
  setName: (value: string) => void;
  clearError: () => void;
  hasError: boolean;
}) {
  return (
    <div className="space-y-5">
      <PanelTitle title="第一步：留名入册" description="一名落纸，便入命卷；此后江湖万劫，皆以此名留痕。" />
      <div className="name-scroll-panel relative overflow-hidden rounded-xl border border-gold/22 bg-ink/38 px-5 py-6">
        <div className="name-seal pointer-events-none absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-full text-center text-[10px] font-black leading-4 text-red-100">
          <span className="block">命</span>
          <span className="block">册</span>
        </div>
        <label className="relative block pr-16">
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError();
            }}
            placeholder="请题真名"
            className={`w-full border-0 border-b bg-transparent px-1 py-3 font-serif text-3xl font-black tracking-[0.16em] text-yellow-50 outline-none transition placeholder:text-parchment/26 focus:border-jade md:text-[2rem] ${
              hasError ? "border-cinnabar/70" : "border-gold/30"
            }`}
          />
        </label>
        <div className="mt-6 grid gap-3 font-serif text-[15px] leading-7 tracking-[0.03em] text-parchment/78">
          <div className="name-oath-line">
            <p className="whitespace-nowrap">落笔之后，灵签有归处，劫数有来路。</p>
          </div>
          <div className="name-oath-line">
            <p className="whitespace-nowrap">此名将随你入世、破局、回望一生。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatePanel({
  calendarType,
  setCalendarType,
  birthDate,
  setBirthDate
}: {
  calendarType: CalendarType;
  setCalendarType: (value: CalendarType) => void;
  birthDate: { year: number; month: number; day: number };
  setBirthDate: (value: { year: number; month: number; day: number }) => void;
}) {
  function changeCalendarType(value: CalendarType) {
    setCalendarType(value);
    if (value === "lunar" && birthDate.day > 30) {
      setBirthDate({ ...birthDate, day: 30 });
    }
  }

  return (
    <div className="space-y-4">
      <PanelTitle title="第二步：择定生辰" description="新历照人间，农历承月令；择定生辰，命盘方可起局。" />
      <div className="grid grid-cols-2 gap-3">
        <CalendarButton active={calendarType === "solar"} label="新历" description="公历日期" onClick={() => changeCalendarType("solar")} />
        <CalendarButton active={calendarType === "lunar"} label="农历" description="阴历日期" onClick={() => changeCalendarType("lunar")} />
      </div>
      <DateWheelPicker
        year={birthDate.year}
        month={birthDate.month}
        day={birthDate.day}
        calendarType={calendarType}
        onChange={setBirthDate}
      />
    </div>
  );
}

function HourPanel({
  birthTime,
  setBirthTime
}: {
  birthTime: BirthHour;
  setBirthTime: (value: BirthHour) => void;
}) {
  const selected = birthHourOptions.find((item) => item.value === birthTime) ?? birthHourOptions[0];
  const selectedIndex = birthHourOptions.findIndex((item) => item.value === birthTime);

  return (
    <div className="space-y-4">
      <PanelTitle title="第三步：点钟定时" />
      <div className="mx-auto max-w-sm space-y-4">
        <div className="relative mx-auto h-64 w-64 rounded-full border border-gold/45 bg-radial-clock shadow-gold">
          <div className="clock-celestial-ring pointer-events-none absolute inset-2 rounded-full" />
          <div className="clock-branch-ring pointer-events-none absolute inset-9 rounded-full" />
          <div className="absolute inset-5 z-0 rounded-full border border-parchment/12" />
          <div className="absolute inset-12 z-0 rounded-full border border-jade/12" />
          <div className="absolute left-1/2 top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
          <div
            className="absolute left-1/2 top-1/2 z-10 h-24 w-0.5 origin-bottom rounded-full bg-gold shadow-gold"
            style={{ transform: `translate(-50%, -100%) rotate(${selectedIndex * 30}deg)` }}
          />
          {birthHourOptions.map((option, index) => {
            const angle = -90 + index * 30;
            const x = 50 + Math.cos((angle * Math.PI) / 180) * 39;
            const y = 50 + Math.sin((angle * Math.PI) / 180) * 39;
            const active = option.value === birthTime;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setBirthTime(option.value)}
                className={`absolute z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-bold transition ${
                  active
                    ? "border-gold bg-[#3a2810] text-yellow-50 shadow-gold"
                    : "border-parchment/70 bg-[#1b130a] text-parchment hover:border-jade hover:bg-[#1f2016] hover:text-jade"
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {option.label.replace("时", "")}
              </button>
            );
          })}
        </div>
        <div className="rounded-lg border border-gold/22 bg-ink/38 p-4 text-center">
          <p className="text-sm text-parchment/55">当前点定</p>
          <div key={birthTime} className="hour-text-fade">
            <p className="mt-2 font-serif text-4xl font-black tracking-[0.18em] text-yellow-50">{selected.label}</p>
            <p className="mt-2 font-mono text-lg font-semibold tracking-[0.08em] text-gold">{selected.range}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenderPanel({
  gender,
  setGender
}: {
  gender: Gender | "";
  setGender: (value: Gender) => void;
}) {
  return (
    <div className="space-y-4">
      <PanelTitle title="第四步：定乾坤" />
      <div className="grid gap-4 sm:grid-cols-2">
        <GenderCard
          active={gender === "male"}
          label="乾造"
          description="男性"
          type="male"
          onClick={() => setGender("male")}
        />
        <GenderCard
          active={gender === "female"}
          label="坤造"
          description="女性"
          type="female"
          onClick={() => setGender("female")}
        />
      </div>
    </div>
  );
}

function PanelTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <p className="text-sm text-cinnabar">开卷问命</p>
      <h2 className="mt-1 text-2xl font-black text-yellow-50">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-parchment/62">{description}</p> : null}
    </div>
  );
}

function CalendarButton({
  active,
  label,
  description,
  onClick
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        active ? "border-gold/70 bg-gold/16 text-yellow-50 shadow-gold" : "border-gold/20 bg-ink/38 text-parchment hover:border-jade/45"
      }`}
    >
      <p className="text-lg font-bold">{label}</p>
      <p className="mt-1 text-sm text-parchment/58">{description}</p>
    </button>
  );
}

function GenderCard({
  active,
  label,
  description,
  type,
  onClick
}: {
  active: boolean;
  label: string;
  description: string;
  type: "male" | "female";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gender-card relative overflow-hidden rounded-xl border p-5 text-center transition duration-300 ${
        active
          ? "gender-card-active border-gold/75 bg-gold/16 shadow-gold"
          : "border-gold/22 bg-ink/38 hover:border-jade/45 hover:bg-parchment/5"
      }`}
    >
      <div className="mx-auto mb-4 flex h-32 w-24 items-end justify-center">
        <GenderFigure type={type} active={active} />
      </div>
      <p className="text-2xl font-black text-yellow-50">{label}</p>
      <p className="mt-1 text-sm text-parchment/58">{description}</p>
    </button>
  );
}

function GenderFigure({ type, active }: { type: "male" | "female"; active: boolean }) {
  const isMale = type === "male";
  const main = isMale ? "#d8b35a" : "#8de6c8";
  const robe = isMale ? "#5b3715" : "#1f4f48";
  const glow = isMale ? "rgba(216, 179, 90, 0.45)" : "rgba(141, 230, 200, 0.38)";

  return (
    <svg
      viewBox="0 0 160 190"
      aria-hidden="true"
      className={`h-32 w-28 transition duration-300 ${active ? "opacity-100" : "opacity-80"}`}
      style={{ filter: `drop-shadow(0 0 ${active ? 24 : 14}px ${glow})` }}
    >
      <path d="M80 14 C70 18 63 27 63 40 C63 54 69 63 80 63 C91 63 98 54 98 40 C98 27 90 18 80 14Z" fill="#f2dfbd" />
      <path
        d={
          isMale
            ? "M59 41 C59 20 72 9 80 9 C88 9 101 20 101 41 C92 32 68 32 59 41Z"
            : "M54 44 C56 20 69 8 80 8 C91 8 104 20 106 44 C98 35 62 35 54 44Z"
        }
        fill="#191008"
        stroke={main}
        strokeWidth="2"
      />
      <path d="M73 13 H87 L84 5 H76 Z" fill={main} opacity="0.88" />
      {!isMale ? <path d="M55 46 C46 70 50 94 62 111 M105 46 C114 70 110 94 98 111" stroke={main} strokeWidth="4" strokeLinecap="round" /> : null}
      <path d="M80 67 C58 75 41 104 33 164 H127 C119 104 102 75 80 67Z" fill={robe} stroke={main} strokeWidth="2.5" />
      <path d="M65 78 C55 101 50 122 47 160 M95 78 C105 101 110 122 113 160" stroke="#fff7df" strokeOpacity="0.22" strokeWidth="2" />
      <path
        d={isMale ? "M42 105 C25 119 19 139 23 153 C40 146 52 132 61 112" : "M43 104 C25 114 17 132 20 150 C39 146 53 130 62 112"}
        fill={robe}
        stroke={main}
        strokeWidth="2"
      />
      <path
        d={isMale ? "M118 105 C135 119 141 139 137 153 C120 146 108 132 99 112" : "M117 104 C135 114 143 132 140 150 C121 146 107 130 98 112"}
        fill={robe}
        stroke={main}
        strokeWidth="2"
      />
      <path d="M66 76 L80 94 L94 76" fill="none" stroke="#fff7df" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M62 164 H98 M51 178 H109" stroke={main} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <circle cx="64" cy="43" r="2" fill="#24160e" />
      <circle cx="96" cy="43" r="2" fill="#24160e" />
      <path d="M72 53 C77 57 83 57 88 53" stroke="#8b5a32" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
