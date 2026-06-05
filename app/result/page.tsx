"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { StatRadarChart } from "@/components/StatRadarChart";
import { TraitCard } from "@/components/TraitCard";
import { birthHourOptions } from "@/lib/constants";
import { createSimulation } from "@/lib/simulationEngine";
import { loadDestiny, saveSimulation } from "@/lib/storage";
import type { DestinyProfile, Gender } from "@/types";

export default function ResultPage() {
  const [profile, setProfile] = useState<DestinyProfile | null>(null);
  const [showBirthInfo, setShowBirthInfo] = useState(false);
  const [isBirthInfoClosing, setIsBirthInfoClosing] = useState(false);

  useEffect(() => {
    setProfile(loadDestiny());
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

  return (
    <main className="ink-wash min-h-screen bg-xian-pattern bg-[length:26px_26px] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Disclaimer />
        <section className="xian-card scroll-glow rounded-lg p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm text-cinnabar">命册初卷</p>
              <h1 className="mt-2 text-3xl font-black text-yellow-50 md:text-5xl">
                {profile.title}
              </h1>
              <p className="mt-3 text-parchment/72">
                {profile.user.name} · {profile.archetype} · Seed #{profile.seed}
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
            {profile.initialEvaluation}
          </p>
        </section>
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <section className="grid gap-4 md:grid-cols-2">
            {profile.traits.map((trait) => (
              <TraitCard key={trait.id} trait={trait} />
            ))}
          </section>
          <StatRadarChart stats={profile.baseStats} />
        </div>
      </div>
    </main>
  );
}

function BirthInfoInline({ profile, closing }: { profile: DestinyProfile; closing: boolean }) {
  const birthHour = birthHourOptions.find((option) => option.value === profile.user.birthTime);
  const items = [
    { label: "姓名", value: profile.user.name },
    { label: "出生日期", value: profile.user.birthDate },
    {
      label: "出生时辰",
      value: birthHour ? `${birthHour.label}（${birthHour.range}）` : profile.user.birthTime
    },
    { label: "性别", value: genderLabels[profile.user.gender] }
  ];

  return (
    <div className={`${closing ? "birth-info-fade-out" : "birth-info-fade"} flex flex-wrap gap-2`}>
      {items.map((item) => (
        <span
          key={item.label}
          className="rounded-full border border-gold/20 bg-parchment/7 px-3 py-1.5 text-sm text-parchment/88"
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
