"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { StatRadarChart } from "@/components/StatRadarChart";
import { TraitCard, TraitDetailPanel } from "@/components/TraitCard";
import { birthHourOptions } from "@/lib/constants";
import { createSimulation } from "@/lib/simulationEngine";
import { loadDestiny, saveSimulation } from "@/lib/storage";
import type { DestinyProfile, Gender } from "@/types";

export default function ResultPage() {
  const [profile, setProfile] = useState<DestinyProfile | null>(null);
  const [showBirthInfo, setShowBirthInfo] = useState(false);
  const [isBirthInfoClosing, setIsBirthInfoClosing] = useState(false);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);

  useEffect(() => {
    const destiny = loadDestiny();
    setProfile(destiny);
    setSelectedTraitId(destiny?.traits[0]?.id ?? null);
  }, []);

  function startSimulation() {
    if (!profile) {
      return;
    }
    saveSimulation(createSimulation(profile));
  }

  function toggleBirthInfo() {
    if (showBirthInfo) {
      setIsBirthInfoClosing(true);
      window.setTimeout(() => {
        setShowBirthInfo(false);
        setIsBirthInfoClosing(false);
      }, 180);
      return;
    }

    setShowBirthInfo(true);
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="xian-card rounded-lg p-6 text-center">
          <p className="text-parchment">还没有命格档案。</p>
          <Link href="/" className="mt-4 inline-block text-jade underline">
            返回首页生成
          </Link>
        </div>
      </main>
    );
  }

  const selectedTrait = profile.traits.find((trait) => trait.id === selectedTraitId) ?? profile.traits[0];

  return (
    <main className="ink-wash min-h-screen bg-xian-pattern bg-[length:26px_26px] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Disclaimer />
        <section className="xian-card scroll-glow rounded-lg p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black tracking-[0.32em] text-cinnabar">命册初卷</p>
              <h1 className="mt-2 font-serif text-3xl font-black tracking-[0.08em] text-yellow-50 drop-shadow-[0_0_14px_rgba(216,179,90,0.22)] md:text-5xl">
                {profile.user.name}入世命局
              </h1>
              <p className="mt-3 text-parchment/72">
                主签「{profile.traits[0]?.name}」，五维已定，入世之路由你亲手落子。
              </p>
            </div>
            <Link
              href="/simulation"
              onClick={startSimulation}
              className="w-full rounded-lg border border-gold/80 bg-gradient-to-r from-gold/28 via-yellow-200/18 to-gold/28 px-8 py-4 text-center text-xl font-black text-yellow-50 shadow-gold transition hover:scale-[1.01] hover:bg-gold/28 sm:w-auto"
            >
              开始入世渡劫
            </Link>
          </div>
          <div className="mt-5 flex min-h-10 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleBirthInfo}
              className="rounded-md border border-gold/28 bg-ink/36 px-4 py-2 text-sm text-jade transition hover:border-jade/45 hover:bg-jade/8"
            >
              {showBirthInfo ? "隐藏出生信息" : "查看出生信息"}
            </button>
            {showBirthInfo ? (
              <BirthInfoInline profile={profile} closing={isBirthInfoClosing} />
            ) : null}
          </div>
          <p className="mt-6 rounded-md border border-gold/18 bg-ink/36 p-4 leading-7 text-parchment/88">
            {formatInitialEvaluation(profile)}
          </p>
        </section>
        <section className="xian-card scroll-glow rounded-lg p-5 md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black tracking-[0.32em] text-cinnabar">命盘总览</p>
              <h2 className="mt-2 font-serif text-3xl font-black tracking-[0.08em] text-yellow-50 drop-shadow-[0_0_14px_rgba(216,179,90,0.22)]">
                灵签与五维
              </h2>
            </div>
          </div>
          <div className="grid items-stretch gap-6 lg:grid-cols-[380px_1fr]">
            <StatRadarChart stats={profile.baseStats} />
            <div className="grid h-full grid-rows-6 items-stretch gap-4 md:grid-cols-2 md:grid-rows-3">
              {profile.traits.map((trait) => (
                <TraitCard
                  key={trait.id}
                  trait={trait}
                  selected={trait.id === selectedTrait.id}
                  onSelect={(nextTrait) => setSelectedTraitId(nextTrait.id)}
                />
              ))}
            </div>
          </div>
          <div className="mt-5">
            <TraitDetailPanel trait={selectedTrait} />
          </div>
        </section>
      </div>
    </main>
  );
}

function BirthInfoInline({ profile, closing }: { profile: DestinyProfile; closing: boolean }) {
  const birthHour = birthHourOptions.find((option) => option.value === profile.user.birthTime);
  const items = [
    { label: "姓名", value: profile.user.name },
    { label: "出生日期", value: formatBirthDate(profile.user.birthDate) },
    {
      label: "出生时辰",
      value: birthHour ? `${birthHour.label}（${birthHour.range}）` : profile.user.birthTime
    },
    { label: "性别", value: genderLabels[profile.user.gender] },
    { label: "命册编号", value: `#${profile.seed}` }
  ];

  return (
    <div className={`${closing ? "birth-info-fade-out" : "birth-info-fade"} flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1`}>
      {items.map((item) => (
        <span
          key={item.label}
          className="shrink-0 rounded-full border border-gold/20 bg-parchment/7 px-3 py-1.5 text-sm text-parchment/88"
        >
          <span className="text-parchment/48">{item.label}：</span>
          <span className="font-semibold text-parchment">{item.value}</span>
        </span>
      ))}
    </div>
  );
}

const genderLabels: Record<Gender, string> = {
  unspecified: "不指定",
  female: "女性",
  male: "男性",
  other: "其他"
};

function formatBirthDate(value: string) {
  const [calendar, rawDate] = value.includes(":") ? value.split(":") : ["solar", value];
  const label = calendar === "lunar" ? "农历" : "新历";
  const [year, month, day] = rawDate.split("-");

  if (!year || !month || !day) {
    return value.replace("solar:", "新历 ").replace("lunar:", "农历 ");
  }

  return `${label} ${Number(year)}年${Number(month)}月${Number(day)}日`;
}

function formatInitialEvaluation(profile: DestinyProfile) {
  if (!profile.initialEvaluation.includes("初始命盘由")) {
    return profile.initialEvaluation;
  }

  const entries = Object.entries(profile.baseStats).sort((a, b) => b[1] - a[1]) as Array<[keyof DestinyProfile["baseStats"], number]>;
  const [topKey, topValue] = entries[0];
  const [lowKey, lowValue] = entries[entries.length - 1];
  const strongest = profile.traits[0];
  const polarity =
    strongest.polarity === "ominous"
      ? "主签带劫，行事宜先避锋芒，再求进取。"
      : strongest.polarity === "mixed"
        ? "主签半吉半劫，成事快，代价也来得快。"
        : "主签偏吉，遇事多有可借之势。";

  return `${profile.user.name}此盘以「${strongest.name}」为主签，五维中${statReadingNames[topKey]}最旺，得 ${topValue} 分；${statReadingNames[lowKey]}最弱，为 ${lowValue} 分。${polarity}开局宜重视${statReadingNames[topKey]}所指之路，少在${statReadingNames[lowKey]}不足处硬碰。`;
}

const statReadingNames: Record<keyof DestinyProfile["baseStats"], string> = {
  luck: "福缘",
  wealth: "财势",
  mind: "心性",
  courage: "魄力",
  insight: "悟性"
};
