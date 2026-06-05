import type { LifeScenario } from "@/types";

export const lifeScenarios: LifeScenario[] = [
  {
    id: "childhood-awakening",
    order: 1,
    title: "旧观星楼",
    era: "0-7 岁",
    description:
      "七岁那年，外祖父带你去镇外废弃的观星楼避雨。你在裂开的木柜里发现一枚铜制星盘，盘背刻着你的生辰，却没有署名。",
    choices: [
      { id: "hide-disk", label: "把星盘藏进怀里", description: "你不告诉大人，夜里偷偷研究刻痕。", effects: { insight: 5, mind: 2 } },
      { id: "ask-grandpa", label: "追问外祖父来历", description: "外祖父沉默很久，只说此物不可轻示于人。", effects: { luck: 4, insight: 3 }, stateEffects: { bonds: 3 } },
      { id: "leave-it", label: "把星盘放回木柜", description: "你选择不碰未知之物，但那道图案从此记在梦里。", effects: { mind: 4, luck: 2 } }
    ]
  },
  {
    id: "school-branch",
    order: 2,
    title: "县学放榜",
    era: "8-15 岁",
    description:
      "县学先生把你列入府城试读名单。同一天，木匠铺的师傅也愿收你学艺，承诺三年后给你一间小作坊。家里只够供你选一条路。",
    choices: [
      { id: "study", label: "去府城读书", description: "离家三百里，靠奖银和抄书钱生活。", effects: { insight: 6, mind: 2 }, stateEffects: { pressure: 4 } },
      { id: "craft", label: "留在木匠铺学艺", description: "你每天磨刨刀，也学会算木料和人情账。", effects: { wealth: 4, courage: 3 }, stateEffects: { assets: 4 } },
      { id: "both", label: "白日做工，夜里读书", description: "你把睡眠削成薄纸，硬撑两条路。", effects: { insight: 5, courage: 4 }, stateEffects: { pressure: 9 }, requirement: { type: "stat", stat: "mind", min: 58, label: "心性 58+" } }
    ]
  },
  {
    id: "friendship-test",
    order: 3,
    title: "同窗失窃案",
    era: "16 岁",
    description:
      "书院丢了一枚先生的玉印，你的同窗阿砚被人指认。你知道他昨夜在河边替病母煎药，但作证会得罪院中最有势力的学生。",
    choices: [
      { id: "testify", label: "当众替阿砚作证", description: "你站到讲堂中央，说出昨夜所见。", effects: { courage: 5, luck: 2 }, stateEffects: { bonds: 8, pressure: 4 } },
      { id: "find-proof", label: "先找真正偷印的人", description: "你查灶灰、窗泥和更夫口供，拼出另一条线索。", effects: { insight: 6, mind: 2 }, stateEffects: { reputation: 4 } },
      { id: "stay-safe", label: "劝阿砚低头认错", description: "你想保住他继续读书的机会，但你们之间生出裂痕。", effects: { mind: 2 }, stateEffects: { bonds: -8, pressure: -2 } }
    ]
  },
  {
    id: "family-shift",
    order: 4,
    title: "药铺欠账",
    era: "18 岁",
    description:
      "父亲旧疾复发，药铺掌柜把三张欠条拍在桌上。月底若还不上，家里那间小院就要抵出去。",
    choices: [
      { id: "night-work", label: "去码头扛夜货", description: "你白天读书做事，夜里替商船搬货。", effects: { wealth: 4, courage: 3 }, stateEffects: { assets: 6, pressure: 7 } },
      { id: "scholarship", label: "参加府试争奖银", description: "你把药钱押在一场考试上。", effects: { insight: 6, mind: 3 }, stateEffects: { assets: 5, pressure: 3 } },
      { id: "patron-help", label: "拜访父亲旧友求援", description: "那位旧友已成城中管事，愿不愿出手全看旧情。", effects: { luck: 6, mind: 2 }, stateEffects: { bonds: 6, pressure: -4 }, requirement: { type: "trait", traitId: "patron-star", label: "贵人相助" } }
    ]
  },
  {
    id: "first-choice",
    order: 5,
    title: "渡口船票",
    era: "19 岁",
    description:
      "府城商会招账房学徒，只收今日渡江的人。母亲把缝了银钱的布包塞给你，码头雾很大，船只正要离岸。",
    choices: [
      { id: "board", label: "登船去府城", description: "你带着一包干粮和半张推荐信离家。", effects: { courage: 6, insight: 2 }, stateEffects: { pressure: 5 } },
      { id: "stay", label: "退票留在家乡", description: "你决定先守住家里，不让母亲独自撑着。", effects: { mind: 5, luck: 2 }, stateEffects: { bonds: 5 } },
      { id: "delay", label: "请船家宽限三日", description: "你想把家中账目安排妥当，再追下一班船。", effects: { mind: 4, wealth: 3 }, stateEffects: { assets: -2 } }
    ]
  },
  {
    id: "youth-fog",
    order: 6,
    title: "雨夜客栈",
    era: "20-22 岁",
    description:
      "你在府城做了两年小账房。某个雨夜，你发现掌柜暗中改账，若装作不知，月底能拿双倍赏钱；若揭穿，饭碗难保。",
    choices: [
      { id: "record", label: "抄下暗账留证", description: "你不立刻声张，先把证据藏进账册夹层。", effects: { insight: 6, mind: 3 }, stateEffects: { reputation: 3 } },
      { id: "take-money", label: "收下封口银", description: "银子能救急，但你心里从此多一笔债。", effects: { wealth: 7, mind: -4 }, stateEffects: { assets: 8, pressure: 6 }, risk: "high" },
      { id: "leave", label: "连夜离开客栈", description: "你背起包袱走进雨里，保住清白也丢了安稳。", effects: { courage: 5, luck: 3 }, stateEffects: { assets: -3, pressure: -3 } }
    ]
  },
  {
    id: "career-start",
    order: 7,
    title: "镖局试刀",
    era: "23 岁",
    description:
      "你进了城南镖局做文书。第一次押镖前，镖头发现路线图有误，问谁敢随队去青石岭重新探路。",
    choices: [
      { id: "map", label: "留下重画路线图", description: "你查旧路引、问脚夫，把错漏一处处补上。", effects: { insight: 6, wealth: 3 }, stateEffects: { reputation: 4 } },
      { id: "social", label: "请老镖师讲山路规矩", description: "你用一壶酒换来三条保命经验。", effects: { luck: 5, mind: 2 }, stateEffects: { bonds: 5 } },
      { id: "solo-scout", label: "独自去青石岭探路", description: "你天未亮出城，黄昏才带着泥水和新地图回来。", effects: { courage: 7, insight: 2 }, stateEffects: { reputation: 6, pressure: 5 }, requirement: { type: "trait", traitId: "lone-walker", label: "孤胆独行" } }
    ]
  },
  {
    id: "patron-arrives",
    order: 8,
    title: "茶楼遇前辈",
    era: "25 岁",
    description:
      "你在茶楼替镖局谈赔偿时，一位白发账师听完你的说辞，递来一封荐书：去京城钱庄做副手，但三个月内必须独立清掉一宗烂账。",
    choices: [
      { id: "accept", label: "接下荐书赴京", description: "你知道这是跳级，也是试炼。", effects: { courage: 5, wealth: 4 }, stateEffects: { reputation: 7, pressure: 6 } },
      { id: "ask-method", label: "请前辈教你破账法", description: "前辈在纸上写下四个字：先看人心。", effects: { insight: 6, luck: 3 }, stateEffects: { bonds: 6 }, requirement: { type: "trait", traitId: "patron-star", label: "贵人相助" } },
      { id: "refuse", label: "婉拒京城机会", description: "你担心步子太大，先留在镖局稳住根基。", effects: { mind: 4 }, stateEffects: { reputation: -3, pressure: -3 } }
    ]
  },
  {
    id: "love-choice",
    order: 9,
    title: "灯会并肩",
    era: "27 岁",
    description:
      "上元灯会，你与常来钱庄兑换碎银的医女并肩走过长街。她说想去边城义诊三年，问你是否愿意等她。",
    choices: [
      { id: "promise", label: "认真许下三年之约", description: "你把一枚木牌交给她，约定归期再见。", effects: { mind: 5, luck: 2 }, stateEffects: { bonds: 7 } },
      { id: "go-with", label: "提出一起去边城", description: "你愿意放下京城职位，去陌生地方重新开始。", effects: { courage: 6, luck: 3 }, stateEffects: { assets: -5, bonds: 6 } },
      { id: "speak-clear", label: "坦白自己害怕等待", description: "你没有说漂亮话，而是把不安摊开。", effects: { mind: 5, insight: 4 }, requirement: { type: "stat", stat: "mind", min: 62, label: "心性 62+" } }
    ]
  },
  {
    id: "wealth-window",
    order: 10,
    title: "盐引暗盘",
    era: "29 岁",
    description:
      "一位商人邀你合购盐引，声称三个月能翻倍。你查到文书是真的，但背后牵着两家官商争斗，赢了暴富，输了入狱。",
    choices: [
      { id: "small", label: "只投一成积蓄试水", description: "你把风险锁在能承受的范围内。", effects: { wealth: 4, insight: 3 }, stateEffects: { assets: 5 } },
      { id: "avoid", label: "拒绝入局并销毁信件", description: "你不赚看不清的钱。", effects: { mind: 5 }, stateEffects: { pressure: -3 } },
      { id: "bold", label: "押上大半身家入局", description: "你看准时机，在官府换批文前抢先进场。", effects: { wealth: 11, courage: 4 }, stateEffects: { assets: 15, pressure: 9 }, requirement: { type: "stat", stat: "wealth", min: 75, label: "财势 75+" }, risk: "high" }
    ]
  },
  {
    id: "career-crisis",
    order: 11,
    title: "钱庄亏空",
    era: "31 岁",
    description:
      "钱庄忽然爆出三千两亏空，账册最后经手人是你。真正动手的人已经逃走，东家要在明早给官府一个交代。",
    choices: [
      { id: "own", label: "先垫赔一部分稳住东家", description: "你用积蓄换来三日查账时间。", effects: { mind: 5, courage: 4 }, stateEffects: { reputation: 4, assets: -8, pressure: 6 } },
      { id: "evidence", label: "连夜核对库票和印鉴", description: "你从一枚错盖的私印里找出破绽。", effects: { insight: 7 }, stateEffects: { reputation: 7, pressure: 3 } },
      { id: "seek-help", label: "请那位白发账师出面作保", description: "前辈一句话，让东家暂缓报官。", effects: { luck: 7, wealth: 3 }, stateEffects: { reputation: 8, pressure: -5 }, requirement: { type: "trait", traitId: "patron-star", label: "贵人相助" } }
    ]
  },
  {
    id: "health-signal",
    order: 12,
    title: "雪夜咳血",
    era: "33 岁",
    description:
      "连查七日旧账后，你在雪夜咳出血丝。医师说再这样熬下去，三年内必伤根本。桌上还有一封催你赴任的急信。",
    choices: [
      { id: "rest", label: "推掉赴任养病三月", description: "你第一次承认身体不是能无限透支的账本。", effects: { mind: 6 }, stateEffects: { pressure: -10, reputation: -2 } },
      { id: "ignore", label: "带病赴任", description: "你把药包塞进袖中，天亮照常上路。", effects: { wealth: 4, courage: 2 }, stateEffects: { pressure: 13 }, risk: "high" },
      { id: "routine", label: "请医师定下作息药方", description: "你每日卯时起、亥时睡，硬把生活改成规矩。", effects: { mind: 5, courage: 3 }, stateEffects: { pressure: -7 }, requirement: { type: "stat", stat: "mind", min: 66, label: "心性 66+" } }
    ]
  },
  {
    id: "betrayal",
    order: 13,
    title: "合伙人抽契",
    era: "35 岁",
    description:
      "你与好友合开的票号刚有起色，他却私下抽走契书投靠竞争对手。伙计们站在院里等你发话。",
    choices: [
      { id: "fight", label: "当日上门讨契", description: "你带着伙计登门，把话摆在众人面前。", effects: { courage: 6 }, stateEffects: { reputation: 4, pressure: 8 } },
      { id: "detach", label: "立刻重签所有客户契约", description: "你不急着骂人，先堵住票号的缺口。", effects: { mind: 5, insight: 4 }, stateEffects: { pressure: -2, bonds: -3 } },
      { id: "forgive", label: "留一条回头路给他", description: "你让人送去一封信：三日内归还契书，此事不入官。", effects: { mind: 6, luck: 3 }, stateEffects: { bonds: 5 }, requirement: { type: "stat", stat: "mind", min: 72, label: "心性 72+" } }
    ]
  },
  {
    id: "city-migration",
    order: 14,
    title: "南下开埠",
    era: "37 岁",
    description:
      "朝廷开放南港，商路将改。旧城客户稳定，南港却可能成为未来十年的财眼。你只有一批骨干，不能两边都满员。",
    choices: [
      { id: "move", label: "亲自带队去南港", description: "你把旧城交给副手，自己去湿热海风里开局。", effects: { courage: 5, luck: 4 }, stateEffects: { pressure: 6 } },
      { id: "root", label: "留守旧城吃下空缺市场", description: "别人南下时，你稳住本地客户。", effects: { wealth: 4, mind: 3 }, stateEffects: { bonds: 5 } },
      { id: "dual", label: "旧城南港双线试行", description: "你用高成本换取两边情报，日夜收信决策。", effects: { wealth: 4, insight: 4 }, stateEffects: { assets: -6, pressure: 7 }, requirement: { type: "stat", stat: "wealth", min: 70, label: "财势 70+" } }
    ]
  },
  {
    id: "startup-window",
    order: 15,
    title: "自立票号",
    era: "39 岁",
    description:
      "南港商人希望你离开旧东家，自立一家专做远途汇兑的票号。你手上有客户、人脉和经验，但缺一笔压舱银。",
    choices: [
      { id: "side", label: "先接小额汇兑试运行", description: "你用三个月验证路线和信用。", effects: { wealth: 5, insight: 4 }, stateEffects: { assets: 5, pressure: 4 } },
      { id: "job", label: "继续留在旧东家分红", description: "你不急着立旗，先吃稳眼前收益。", effects: { mind: 4, wealth: 3 }, stateEffects: { pressure: -2 } },
      { id: "zero", label: "借十张桌子开第一间票号", description: "你租下临街小楼，牌匾挂上那天，手里只剩三十两。", effects: { courage: 9, wealth: 8, insight: 3 }, stateEffects: { assets: 10, pressure: 10, reputation: 6 }, requirement: { type: "trait", traitId: "self-made", label: "白手起家" }, risk: "high" }
    ]
  },
  {
    id: "midlife-turn",
    order: 16,
    title: "新法换银",
    era: "42 岁",
    description:
      "朝廷推行新银票法，旧票号若不改制，半年内就会失去大客户。老伙计怕变，新伙计嫌慢，你夹在中间。",
    choices: [
      { id: "mentor", label: "让老伙计带新人试新账法", description: "你把抵触变成传帮带。", effects: { mind: 4, luck: 4 }, stateEffects: { reputation: 7, bonds: 6 } },
      { id: "relearn", label: "亲自去官署学新规", description: "你放下面子，从最基础的票据章程学起。", effects: { insight: 8, courage: 3 }, stateEffects: { pressure: 4 } },
      { id: "wait", label: "暂缓改制观望半年", description: "你想等同行先踩坑，但客户已经开始动摇。", effects: { mind: 2 }, stateEffects: { pressure: -3, reputation: -4 } }
    ]
  },
  {
    id: "fate-low",
    order: 17,
    title: "三船沉江",
    era: "45 岁",
    description:
      "一场暴雨冲毁江堤，你押运的三船货银尽数沉江。债主堵门，伙计散去一半，你的名字一夜之间成了笑柄。",
    choices: [
      { id: "endure", label: "关掉两处分号保主号", description: "你亲手摘下牌匾，先让命脉不断。", effects: { mind: 6 }, stateEffects: { pressure: -6, assets: -8 } },
      { id: "gamble", label: "借高利银再押一趟险镖", description: "你想一把翻身，输赢都在下个月。", effects: { courage: 8, wealth: 4 }, stateEffects: { pressure: 13 }, risk: "high" },
      { id: "turn-light", label: "从沉船账册里找赔付漏洞", description: "你发现船行契书少盖一枚免责印，仍有转机。", effects: { luck: 10, insight: 6, courage: 4 }, stateEffects: { pressure: -8, reputation: 5 }, requirement: { type: "trait", traitId: "danger-to-light", label: "逢凶化吉" } }
    ]
  },
  {
    id: "counterattack",
    order: 18,
    title: "旧敌求和",
    era: "49 岁",
    description:
      "当年抽走你契书的旧友，如今被新商帮逼到绝路，带着三十家客户名单来求你合作。众人都劝你趁机报复。",
    choices: [
      { id: "return", label: "签合作契约但设三重担保", description: "你不再天真，也不浪费机会。", effects: { courage: 6, insight: 5 }, stateEffects: { reputation: 8 } },
      { id: "new-path", label: "拒绝旧人，另开海路票号", description: "你把精力投向更远的商路。", effects: { luck: 5, wealth: 5 }, stateEffects: { assets: 7 } },
      { id: "rewrite", label: "公开收编旧敌客户", description: "你在商会大堂立下新规：旧怨归旧怨，生意归生意。", effects: { luck: 8, wealth: 8, mind: 8, courage: 8, insight: 8 }, stateEffects: { reputation: 10, pressure: -8 }, requirement: { type: "trait", traitId: "rewrite-fate", label: "逆天改命" } }
    ]
  },
  {
    id: "elder-view",
    order: 19,
    title: "归山立碑",
    era: "60 岁",
    description:
      "你回到故乡，旧观星楼只剩半截石基。族中后辈想让你捐钱修祠，商会想请你写票号章程，家人只希望你留下过年。",
    choices: [
      { id: "legacy", label: "写下三十年账法手札", description: "你把见过的人心、风险和规矩都写进去。", effects: { insight: 5, mind: 5 }, stateEffects: { reputation: 8 } },
      { id: "family", label: "修旧院陪家人过冬", description: "你把一生忙碌换成几盏夜灯和热饭。", effects: { luck: 4, mind: 5 }, stateEffects: { bonds: 9 } },
      { id: "enjoy", label: "带一叶小舟游江南", description: "你不再每日看账，只看山水和云影。", effects: { luck: 5, mind: 3 }, stateEffects: { pressure: -10 } }
    ]
  },
  {
    id: "final-ending",
    order: 20,
    title: "命册合卷",
    era: "终章",
    description:
      "暮年某夜，你又梦见那枚铜星盘。盘上不再显示吉凶，只浮现出你每次选择的名字：船票、玉印、盐引、沉船、旧敌。",
    choices: [
      { id: "accept", label: "承认一生有得有失", description: "你把星盘放回旧柜，向所有遗憾点头。", effects: { mind: 6, luck: 3 }, stateEffects: { pressure: -8 } },
      { id: "teach", label: "把故事讲给后辈", description: "你没有讲大道理，只讲自己哪几次差点走错。", effects: { insight: 6, luck: 2 }, stateEffects: { reputation: 7, bonds: 4 } },
      { id: "transcend", label: "在星盘背面刻下新句", description: "你写下：命非天定，亦非人全胜，惟选择可证此生。", effects: { insight: 8, courage: 3 }, stateEffects: { reputation: 5 }, requirement: { type: "stat", stat: "insight", min: 78, label: "悟性 78+" } }
    ]
  }
];
