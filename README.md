# 命格修仙人生模拟器

命格修仙人生模拟器是一个娱乐向网页游戏 MVP。用户输入姓名、出生日期、出生时辰和可选性别后，会生成武侠修仙风格的命格档案，并进入 20 个原创人生场景进行选择模拟。

> 仅供娱乐，不作为现实决策依据。

## 功能

- 首页输入表单
- 本地 mock 命格生成逻辑
- 命格词条、稀有度、描述和属性影响
- 五维属性雷达图：福缘、财势、心性、魄力、悟性
- 20 个人生场景选择流程
- 根据词条或属性解锁特殊选项
- 每次选择影响属性和人生状态
- localStorage 保存当前档案与模拟进度
- 最终人生称号、评级、关键选择和文学化总结

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- localStorage

## 运行

```bash
npm install
npm run dev
```

然后打开：

```text
http://localhost:3000
```

也可以使用 Bun：

```bash
bun install
bun run dev
```

## 项目结构

```text
app/page.tsx                 首页和输入表单入口
app/result/page.tsx          命格生成结果页
app/simulation/page.tsx      人生模拟流程与结局页
components/CharacterForm.tsx 用户资料输入
components/TraitCard.tsx     命格词条卡片
components/StatRadarChart.tsx 五维雷达图
components/LifeScenarioCard.tsx 人生场景卡片
components/ChoiceButton.tsx  选择按钮
components/ResultSummary.tsx 最终总结
lib/destinySkill.ts          mock 命格生成逻辑，后续可替换为 AI/API
lib/lifeScenarios.ts         20 个原创场景与选项数据
lib/simulationEngine.ts      选择应用、解锁判断、终局计算
lib/storage.ts               localStorage 读写
types/index.ts               TypeScript 类型定义
```

## 后续扩展建议

- 将 `lib/destinySkill.ts` 替换为后端 API 或 AI Agent Skill 调用。
- 为 `lifeScenarios` 增加分支条件、隐藏结局和事件标签。
- 增加导出人生报告图片或分享卡片功能。
