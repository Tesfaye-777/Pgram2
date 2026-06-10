"use client";

import Image from "next/image";
import { ChoiceButton } from "@/components/ChoiceButton";
import { getAvailableScenarioChoices } from "@/lib/hiddenChoices";
import { isChoiceUnlocked } from "@/lib/simulationEngine";
import type { LifeChoice, LifeScenario, SimulationSave } from "@/types";

type Props = {
  scenario: LifeScenario;
  save: SimulationSave;
  total: number;
  onChoose: (choice: LifeChoice) => void;
};

export function LifeScenarioCard({ scenario, save, total, onChoose }: Props) {
  const choices = getAvailableScenarioChoices(scenario, save);
  const hasHiddenChoice = choices.length > 3;
  const stageLabel = getStageLabel(scenario);

  return (
    <section className="xian-card rounded-lg p-5 md:p-6">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 md:gap-4">
        <div className="min-w-0">
          <p className="text-sm text-cinnabar">第 {scenario.order.toString().padStart(2, "0")} 劫</p>
          <h1 className="mt-1 break-keep font-serif text-3xl font-black tracking-[0.06em] text-yellow-50 drop-shadow-[0_0_22px_rgba(216,179,90,.36)] sm:text-4xl md:text-6xl md:tracking-[0.08em]">
            {scenario.title}
          </h1>
          <div className="mt-3 h-px max-w-[min(24rem,100%)] bg-gradient-to-r from-gold/55 via-gold/20 to-transparent" />
        </div>
        <div className="age-progress-card w-[108px] shrink-0 rounded-lg border border-gold/35 bg-gold/10 px-2 py-2 text-center shadow-gold sm:w-[126px] sm:px-3">
          <p className="text-[11px] tracking-[0.2em] text-parchment/55">当前阶段</p>
          <p className="mt-0.5 font-serif text-lg font-black tracking-[0.08em] text-yellow-50 sm:text-xl">{stageLabel}</p>
          <p className="mt-0.5 font-serif text-xs font-black tracking-[0.08em] text-jade">{scenario.order}/{total}</p>
        </div>
      </div>

      <ScenarioScene scenario={scenario} />

      <div className="mx-auto mt-5 max-w-3xl rounded-md border border-gold/18 bg-ink/36 p-4 text-center text-base leading-8 text-parchment/88">
        {splitSentences(scenario.description).map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
      </div>

      <div
        className={`mx-auto mt-5 grid w-full gap-4 ${
          hasHiddenChoice
            ? "max-w-6xl md:grid-cols-2 xl:grid-cols-4"
            : "max-w-4xl md:grid-cols-3"
        }`}
      >
        {choices.map((choice) => {
          const unlocked = isChoiceUnlocked(choice, save.destiny, save.currentStats);
          return (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              unlocked={unlocked}
              onChoose={() => onChoose(choice)}
            />
          );
        })}
      </div>
    </section>
  );
}

function ScenarioScene({ scenario }: { scenario: LifeScenario }) {
  return (
    <div className="scene-ink-painting mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-gold/28 bg-ink/50 shadow-gold">
      <div className="relative h-64 md:h-80">
        <Image
          src={`/scenarios/${scenario.order}.png`}
          alt={scenario.title}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(7,6,3,.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/72 via-black/28 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 text-center">
          <p className="mx-auto max-w-2xl text-base font-semibold leading-7 text-parchment/88 drop-shadow-[0_0_12px_rgba(0,0,0,.65)]">
            {getSceneCaption(scenario.order)}
          </p>
        </div>
      </div>
    </div>
  );
}

function getStageLabel(scenario: LifeScenario) {
  if (scenario.order === 1) {
    return "7 岁";
  }
  return scenario.era;
}

function splitSentences(text: string) {
  return text
    .split(/(?<=。)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function getSceneCaption(order: number) {
  const captions = [
    "雨幕压檐，旧物初现，一道命线从暗处亮起。",
    "城门、书卷与匠铺分列眼前，少年第一次要亲手择业。",
    "堂中烛火摇晃，人言如潮，真假只差一句证词。",
    "药香压过夜色，债帖落案，家门忽然重如千钧。",
    "渡口雾起，船灯将远，去留之间已有风声。",
    "客栈雨声不断，暗账藏在柜底，掌柜的眼神也开始躲闪。",
    "山路未明，镖旗半卷，第一把刀先斩迷雾。",
    "茶楼一席话，前辈递来荐书，也递来限期烂账。",
    "灯河如昼，并肩一刻，情字却要问三年。",
    "盐引如棋，银光似刃，富贵与牢狱只隔一念。",
    "钱庄风急，账册翻飞，清白要从裂缝里找。",
    "雪夜咳血，灯火未灭，旧疾先来讨账。",
    "旧友抽身，契书失踪，院中众人都等你落子。",
    "南港潮声将起，旧城安稳，新路锋利。",
    "一块新匾未挂，十张欠契已在袖中发烫。",
    "新法如潮，旧账如山，变与不变皆有代价。",
    "江堤崩裂，货银沉底，低谷里仍有残光。",
    "旧敌携名册而来，报复与翻盘同坐一桌。",
    "残楼旧碧，晚风归山，旧账与家人都等你安放。",
    "星盘合卷，所有选择化成最后一行字。"
  ];
  return captions[order - 1] ?? "风起命盘，一念入局。";
}
