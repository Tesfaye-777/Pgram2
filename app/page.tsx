import { CharacterForm } from "@/components/CharacterForm";
import { Disclaimer } from "@/components/Disclaimer";

export default function Home() {
  return (
    <main className="ink-wash min-h-screen bg-xian-pattern bg-[length:26px_26px] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="space-y-6">
          <div className="inline-flex rounded-full border border-gold/35 bg-gold/12 px-3 py-1 text-sm text-yellow-100">
            Immortal Destiny Life Simulator
          </div>
          <div>
            <h1 className="max-w-4xl text-4xl font-black tracking-normal text-yellow-50 md:text-6xl">
              命格修仙人生模拟器
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-parchment/78">
              输入基础资料，开启一卷命册，抽取天赋词条与五维灵盘，再踏入 20
              重人生劫数，用每一次抉择写出你的江湖修行路。
            </p>
          </div>
          <Disclaimer />
          <div className="grid gap-3 sm:grid-cols-3">
            {["命格灵签", "五维灵盘", "人生劫数"].map((item) => (
              <div key={item} className="rounded-md border border-gold/20 bg-parchment/6 p-4">
                <p className="font-semibold text-jade">{item}</p>
                <p className="mt-2 text-sm text-parchment/55">本地规则生成，后续可替换 AI API。</p>
              </div>
            ))}
          </div>
        </section>
        <CharacterForm />
      </div>
    </main>
  );
}
