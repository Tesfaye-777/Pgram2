import type { ChoiceCheckRank } from "@/types";

export type OptimizedOptionCopy = {
  label: string;
  description: string;
  motive: string;
  cost: string;
  benefit: string;
  risk: string;
  problem: string;
  approach: string;
  visibleEffect: string;
};

export type OptimizedTraitCopy = {
  description: string;
  impact: string;
  problem: string;
  approach: string;
};

export const optimizedOptionCopy: Record<string, OptimizedOptionCopy> = {
  "childhood-awakening:hide-disk": {
    label: "把星盘藏进怀里",
    description: "瞒着外祖父，夜里照铜纹抄下生辰。",
    motive: "先掌握星盘线索，不让大人立刻收走。",
    cost: "要独自承担被发现的责问。",
    benefit: "可能提前记下盘背刻纹。",
    risk: "藏得不稳会惊动家中长辈。",
    problem: "原描述只有动作，缺少线索价值。",
    approach: "把偷藏目的写成抄纹与查生辰。",
    visibleEffect: "悟性、心性更容易涨，失败会增加家中戒备。"
  },
  "childhood-awakening:ask-grandpa": {
    label: "追问外祖父来历",
    description: "把铜盘递到灯下，问他为何避而不谈。",
    motive: "直接问清观星楼和铜盘的旧事。",
    cost: "可能触到长辈不愿提的旧伤。",
    benefit: "能获得最早的家族线索。",
    risk: "问得太急会被收走星盘。",
    problem: "旧文把结果写进选项，削弱选择感。",
    approach: "改成玩家主动逼近真相。",
    visibleEffect: "福缘、关系有机会提升，失败会断掉早期线索。"
  },
  "childhood-awakening:leave-it": {
    label: "把星盘放回木柜",
    description: "记住暗格位置，先不碰那件来路不明之物。",
    motive: "先保安全，等以后再查。",
    cost: "短期拿不到铜盘细节。",
    benefit: "避免惊动家中长辈。",
    risk: "错过最早接触星盘的机会。",
    problem: "原文偏感受，缺少实际策略。",
    approach: "写出记住暗格、延后调查。",
    visibleEffect: "心性更稳，收益较小。"
  },
  "school-branch:study": {
    label: "去府城读书",
    description: "带荐帖离家，靠抄书和奖银撑学费。",
    motive: "争取县学推荐，走读书入行的路。",
    cost: "离家远，开销压身。",
    benefit: "接触账算、策论和府城人脉。",
    risk: "钱不够会被迫半途做工。",
    problem: "原描述清楚，但收益差异不够明显。",
    approach: "突出荐帖、学费和府城机会。",
    visibleEffect: "悟性收益高，压力可能上升。"
  },
  "school-branch:craft": {
    label: "留木匠铺学艺",
    description: "跟师傅学估料算工，先挣稳手艺钱。",
    motive: "选择可见的饭碗和本地生计。",
    cost: "放慢读书和远行机会。",
    benefit: "积累手艺、资产和市井账目经验。",
    risk: "出师慢会被困在杂活里。",
    problem: "原文有画面，但缺少取舍。",
    approach: "强调手艺路线的稳和慢。",
    visibleEffect: "财势、魄力小涨，资产更稳。"
  },
  "school-branch:both": {
    label: "白日做工夜里读书",
    description: "白天进铺，夜里借灯补县学课本。",
    motive: "不放弃两路中的任一路。",
    cost: "睡眠和体力被挤到极限。",
    benefit: "若撑住，可同时获得手艺和学识。",
    risk: "两边失误会同时失信。",
    problem: "原文有比喻但略空。",
    approach: "改成具体作息和代价。",
    visibleEffect: "高心性适合，失败压力较重。"
  },
  "friendship-test:testify": {
    label: "当众替阿砚作证",
    description: "在讲堂说出昨夜所见，替他挡指认。",
    motive: "立刻保住同窗清白。",
    cost: "当场得罪院中强势学生。",
    benefit: "可换来阿砚信任和书院名声。",
    risk: "证词有漏会被反咬偏袒。",
    problem: "原文动作明确，需补足代价。",
    approach: "把公开站队的风险写清。",
    visibleEffect: "魄力、关系提升，失败损声望。"
  },
  "friendship-test:find-proof": {
    label: "先查偷印真凶",
    description: "查窗泥、药灰和更夫口供再翻案。",
    motive: "用证据替阿砚脱身。",
    cost: "短期不能立刻替他解围。",
    benefit: "成功可揪出真正偷印的人。",
    risk: "拖久了线索会被抹掉。",
    problem: "原文较好，补上时间压力。",
    approach: "突出调查路线的慢与准。",
    visibleEffect: "悟性收益高，成功更稳。"
  },
  "friendship-test:stay-safe": {
    label: "劝阿砚先低头",
    description: "让他认小错保名额，你暂避书院争斗。",
    motive: "避开正面冲突，先保读书资格。",
    cost: "会伤同窗情分。",
    benefit: "可能避免更大处罚。",
    risk: "低头也未必换来清白。",
    problem: "原文写了裂痕但缺少现实收益。",
    approach: "补出保名额与避争斗。",
    visibleEffect: "压力可能下降，关系风险明显。"
  },
  "family-shift:night-work": {
    label: "去码头扛夜货",
    description: "夜里替商船搬货，先凑父亲药钱。",
    motive: "用体力快速换现银。",
    cost: "白日精神和身体都会被拖垮。",
    benefit: "能立刻缓住药铺欠账。",
    risk: "钱凑不齐还会伤身。",
    problem: "原文可读，但代价不够尖锐。",
    approach: "强调夜工救急和身体账。",
    visibleEffect: "资产上涨，压力也会上升。"
  },
  "family-shift:scholarship": {
    label: "参加府试争奖银",
    description: "把药钱押在府试名次，赢了还欠账。",
    motive: "用考试换清账机会。",
    cost: "准备时间短，药钱被押上。",
    benefit: "成功可保住小院和读书名声。",
    risk: "差一名也拿不到银。",
    problem: "原文太短，取舍不够。",
    approach: "写明押注对象和结果差距。",
    visibleEffect: "悟性主导，成功给资产。"
  },
  "family-shift:patron-help": {
    label: "拜访父亲旧友",
    description: "带旧账本登门，请城中管事作保。",
    motive: "借父亲旧情换宽限或作保。",
    cost: "要放下面子求人。",
    benefit: "可能引来药商和还账缓冲。",
    risk: "旧友推脱会让家中更难看。",
    problem: "原文泛称旧情，缺少筹码。",
    approach: "加入旧账本和作保目标。",
    visibleEffect: "贵人相关，关系与压力变化明显。"
  },
  "first-choice:board": {
    label: "登船去府城",
    description: "带干粮和荐信上船，把家事托给母亲。",
    motive: "抓住商会账房名额。",
    cost: "家里短期无人照应。",
    benefit: "进入府城账房体系。",
    risk: "荐信失效会在外漂着。",
    problem: "原文可用，补足家中代价。",
    approach: "突出离家取机会。",
    visibleEffect: "魄力、悟性提高，压力上升。"
  },
  "first-choice:stay": {
    label: "退票留在家乡",
    description: "退掉船票，先替母亲理清家中旧账。",
    motive: "守住家里，不让母亲独撑。",
    cost: "错过府城窗口。",
    benefit: "能稳住亲情和本地名声。",
    risk: "家乡未必有新机会。",
    problem: "原文情绪够，利益不够清。",
    approach: "写成守家与退票的明确取舍。",
    visibleEffect: "关系上升，事业机会减少。"
  },
  "first-choice:delay": {
    label: "请船家改签",
    description: "用押钱换三日宽限，安排家账再走。",
    motive: "尝试兼顾家里与府城。",
    cost: "要多付押钱和人情。",
    benefit: "若成，可两边不断。",
    risk: "改签失败会两头落空。",
    problem: "原文只说宽限，缺少代价。",
    approach: "加押钱和三日期限。",
    visibleEffect: "心性、财势参与，资产可能减少。"
  },
  "youth-fog:record": {
    label: "抄下暗账留证",
    description: "不声张，先把改账笔迹藏进夹层。",
    motive: "保留证据，等盘账时翻出来。",
    cost: "要继续待在危险账房里。",
    benefit: "成功可保清白并换信任。",
    risk: "被掌柜发现会调离账房。",
    problem: "原文可用，补出笔迹证据。",
    approach: "让证据更具体。",
    visibleEffect: "悟性、声望收益。"
  },
  "youth-fog:take-money": {
    label: "收下封口银",
    description: "拿双倍赏钱救急，替掌柜遮一次账。",
    motive: "用钱解决眼前困境。",
    cost: "清白和把柄交给掌柜。",
    benefit: "短期资产提高。",
    risk: "暗账败露时你也脱不了身。",
    problem: "原文道德感多，具体把柄少。",
    approach: "写明遮账次数和被牵连。",
    visibleEffect: "财势收益高，心性与压力受损。"
  },
  "youth-fog:leave": {
    label: "连夜离开客栈",
    description: "带账本副页出门，宁可丢饭碗保清白。",
    motive: "切断暗账牵连。",
    cost: "失去住处和工钱。",
    benefit: "保住名声，留下一份证据。",
    risk: "盘缠不足会漂泊。",
    problem: "原文有氛围，缺少带走什么。",
    approach: "加账本副页作为后手。",
    visibleEffect: "魄力、福缘上升，资产下降。"
  },
  "career-start:map": {
    label: "留下重画路线图",
    description: "查路引问脚夫，把塌方旧道标出来。",
    motive: "用准备减少镖队风险。",
    cost: "要熬夜核图并承担判断责任。",
    benefit: "成功可被镖局记名。",
    risk: "画错会耽误整队。",
    problem: "原文略泛，补具体错漏。",
    approach: "写路引、脚夫和塌方。",
    visibleEffect: "悟性与声望收益。"
  },
  "career-start:social": {
    label: "请老镖师讲山路",
    description: "用一壶酒换老镖师三条避险规矩。",
    motive: "借经验避开新手错误。",
    cost: "要低头请教，收益不立刻显现。",
    benefit: "可能得到山路口传经验。",
    risk: "问不到要害会被当客套。",
    problem: "原文有数字但可更具体。",
    approach: "明确一壶酒和三条规矩。",
    visibleEffect: "福缘、关系提升。"
  },
  "career-start:solo-scout": {
    label: "独自去青石岭探路",
    description: "天未亮出城，亲自量水源和伏击口。",
    motive: "用冒险换第一手地图。",
    cost: "独行有迷路和受伤风险。",
    benefit: "成功可让镖局避开伏击。",
    risk: "失败会让镖局不敢再信你。",
    problem: "原文有画面，补出探什么。",
    approach: "加入水源、伏击口。",
    visibleEffect: "孤胆独行相关，高风险高声望。"
  },
  "patron-arrives:accept": {
    label: "带荐书赴京查烂账",
    description: "接下白发账师荐书，去钱庄限期查账。",
    motive: "抓住京城跃升机会。",
    cost: "期限紧，账局深。",
    benefit: "成功可获钱庄名声和作保。",
    risk: "查不清会背上无能之名。",
    problem: "原文有试炼一词，信息不足。",
    approach: "改成限期查账。",
    visibleEffect: "声望收益高，压力上升。"
  },
  "patron-arrives:ask-method": {
    label: "请前辈教破账法",
    description: "当场拆一页旧账，求他点明查账门道。",
    motive: "先学方法再入局。",
    cost: "显得资历浅，要受前辈考校。",
    benefit: "可获得破账线索和关系。",
    risk: "没听懂会更依赖前辈。",
    problem: "原文四字太玄，缺少动作。",
    approach: "改成拆旧账求教。",
    visibleEffect: "贵人相助相关，悟性与关系收益。"
  },
  "patron-arrives:refuse": {
    label: "留镖局再熬一年",
    description: "婉拒荐书，继续守本地账路和镖局人脉。",
    motive: "避免步子太急。",
    cost: "放弃京城名额。",
    benefit: "稳住本地信用和经验。",
    risk: "机会转给旁人。",
    problem: "原文有根基空词。",
    approach: "写成留守一年的实际选择。",
    visibleEffect: "压力下降，声望可能减少。"
  },
  "love-choice:promise": {
    label: "认真许下三年之约",
    description: "分一枚木牌作信物，约定每月通书。",
    motive: "用承诺维系远行后的关系。",
    cost: "要承担等待和失约风险。",
    benefit: "关系可稳定延续。",
    risk: "没有安排会慢慢断信。",
    problem: "原文偏浪漫，缺少执行方式。",
    approach: "加入信物和每月书信。",
    visibleEffect: "心性与关系收益。"
  },
  "love-choice:go-with": {
    label: "随她去边城",
    description: "放下京城差事，跟她去边城重谋生计。",
    motive: "把感情放在事业前面。",
    cost: "放弃现成职位和资产。",
    benefit: "可能开出边城新路。",
    risk: "陌生地界难立足。",
    problem: "原文可用，补事业代价。",
    approach: "突出放弃职位。",
    visibleEffect: "魄力、关系提高，资产承压。"
  },
  "love-choice:speak-clear": {
    label: "坦白害怕久别",
    description: "不许空话，只把路费、信期和担忧说清。",
    motive: "用现实安排替代漂亮承诺。",
    cost: "说得太直会伤离别气氛。",
    benefit: "成功可让等待更可执行。",
    risk: "对方可能觉得你不够坚定。",
    problem: "原文不错，但缺少谈什么。",
    approach: "写出路费、信期、担忧。",
    visibleEffect: "高心性解锁，关系更稳。"
  },
  "wealth-window:small": {
    label: "投一成积蓄试水",
    description: "只拿闲银入盐引，先看官商风向。",
    motive: "低风险试探财路。",
    cost: "收益有限。",
    benefit: "看清盘口并可能小赚。",
    risk: "仍会被抽利或拖款。",
    problem: "原文较清，补盘口信息。",
    approach: "明确一成和试探性质。",
    visibleEffect: "财势稳增，失败损失较小。"
  },
  "wealth-window:avoid": {
    label: "拒绝入局并毁信",
    description: "烧掉暗信，不碰来路不清的盐引。",
    motive: "保住清白和账房信用。",
    cost: "放弃短期利润。",
    benefit: "避开后续清查。",
    risk: "得罪介绍财路的商人。",
    problem: "原文太短。",
    approach: "加入烧信和得罪人。",
    visibleEffect: "心性提高，压力下降。"
  },
  "wealth-window:bold": {
    label: "押半数身家抢批文",
    description: "赶在官府换批文前，押银吃一波涨价。",
    motive: "用高风险换大收益。",
    cost: "半数身家被压进局里。",
    benefit: "成功可迅速扩充资产。",
    risk: "批文变动会套牢资金。",
    problem: "原文有大半身家但机制不清。",
    approach: "写明批文窗口和一波涨价。",
    visibleEffect: "高财势解锁，风险最高。"
  },
  "career-crisis:own": {
    label: "先垫赔稳住东家",
    description: "拿积蓄压住报官，换三日查账时间。",
    motive: "用钱买时间。",
    cost: "资产直接受损。",
    benefit: "可争取翻案窗口。",
    risk: "钱花了仍可能被报官。",
    problem: "原文清楚，补报官压力。",
    approach: "突出垫赔换时间。",
    visibleEffect: "心性、魄力参与，资产下降。"
  },
  "career-crisis:evidence": {
    label: "核对库票和印鉴",
    description: "连夜查私印、库票和当夜门禁。",
    motive: "找出亏空经手人。",
    cost: "耗时且会惊动账房。",
    benefit: "成功可洗清嫌疑。",
    risk: "线索被抹去就难翻案。",
    problem: "原文较好，补门禁线索。",
    approach: "把证据链写完整。",
    visibleEffect: "悟性主导，声望收益。"
  },
  "career-crisis:seek-help": {
    label: "请白发账师作保",
    description: "带账册登门，请前辈先压住官差。",
    motive: "借名望争取查案时间。",
    cost: "欠下人情。",
    benefit: "可暂缓报官并保住名声。",
    risk: "前辈压不住东家怒气。",
    problem: "原文结果感强。",
    approach: "改成登门作保。",
    visibleEffect: "贵人相助相关，压力可能下降。"
  },
  "health-signal:rest": {
    label: "推掉赴任养病三月",
    description: "交清急账，停下差事按医嘱休养。",
    motive: "先保身体。",
    cost: "名声和机会会受影响。",
    benefit: "可降低压力和病根风险。",
    risk: "休养不彻底仍会拖累。",
    problem: "原文像总结，缺少怎么停。",
    approach: "加入交清急账和医嘱。",
    visibleEffect: "减压明显，声望小降。"
  },
  "health-signal:ignore": {
    label: "带病赴任",
    description: "把药包塞袖中，照常赶雪路办差。",
    motive: "保住差事和外界信任。",
    cost: "身体继续透支。",
    benefit: "成功可换声望和钱。",
    risk: "病倒会误事又伤身。",
    problem: "原文可用，补雪路办差。",
    approach: "强化身体代价。",
    visibleEffect: "高风险，压力重。"
  },
  "health-signal:routine": {
    label: "请医师定作息药方",
    description: "按时睡起服药，把账房差事重新排班。",
    motive: "不彻底退下，但修整节奏。",
    cost: "需要长期自律。",
    benefit: "成功可缓病并保差事。",
    risk: "守不住作息会反复咳血。",
    problem: "原文较好，补排班。",
    approach: "让养病和工作并存。",
    visibleEffect: "高心性解锁，减压。"
  },
  "betrayal:fight": {
    label: "当日上门讨契",
    description: "带伙计堵门，逼旧友交出客户契书。",
    motive: "用声势迅速追回客户。",
    cost: "公开撕破脸。",
    benefit: "成功可震住票号伙计。",
    risk: "对方反咬会损名声。",
    problem: "原文有动作，缺契书目标。",
    approach: "写出堵门和契书。",
    visibleEffect: "魄力、声望收益，压力高。"
  },
  "betrayal:detach": {
    label: "重签客户契约",
    description: "先通知大客户换印，堵住票号缺口。",
    motive: "先止损，少做口舌之争。",
    cost: "要牺牲部分旧关系。",
    benefit: "保住客户和现金流。",
    risk: "重签慢会被旧友抢人。",
    problem: "原文抽象，补客户动作。",
    approach: "明确换印止损。",
    visibleEffect: "心性、悟性参与，关系小损。"
  },
  "betrayal:forgive": {
    label: "留三日回头路",
    description: "写信限他三日还契，过期便入官。",
    motive: "给旧友机会，也留法律后手。",
    cost: "会被看作软弱。",
    benefit: "成功可少一场官司。",
    risk: "对方趁宽限带走更多客户。",
    problem: "原文较好，补入官后手。",
    approach: "写明时限和后果。",
    visibleEffect: "高心性解锁，关系可能保留。"
  },
  "city-migration:move": {
    label: "亲自带队去南港",
    description: "把旧城交副手，带银票去南港租铺。",
    motive: "抢先占南港新商路。",
    cost: "旧城照应不足。",
    benefit: "可能开出新财眼。",
    risk: "水土和商规不熟会两头吃紧。",
    problem: "原文有氛围，缺租铺目标。",
    approach: "明确南港落脚动作。",
    visibleEffect: "魄力、福缘参与，压力上升。"
  },
  "city-migration:root": {
    label: "留守旧城抢空缺",
    description: "稳住老客户，接下南下同行留下的账。",
    motive: "利用别人离开后的本地空位。",
    cost: "错过南港第一波机会。",
    benefit: "能稳住关系和收入。",
    risk: "本地市场未必真空出来。",
    problem: "原文可用，补接账动作。",
    approach: "写成本地抢空位。",
    visibleEffect: "财势、心性稳增。"
  },
  "city-migration:dual": {
    label: "旧城南港双线试行",
    description: "两地各派伙计，先跑三月小额汇兑。",
    motive: "用试点同时保两边。",
    cost: "人手和银钱都被拉长。",
    benefit: "成功可拿到两地情报。",
    risk: "账期错开会压垮现金流。",
    problem: "原文双线概念清楚但不够具体。",
    approach: "加入三月小额汇兑。",
    visibleEffect: "高财势解锁，资产压力大。"
  },
  "startup-window:side": {
    label: "先接小额汇兑",
    description: "只接熟客小票，用三月验路线和信用。",
    motive: "低成本试开票号。",
    cost: "赚钱慢。",
    benefit: "可积累第一批常客。",
    risk: "延误一票就会伤信用。",
    problem: "原文较好，补熟客小票。",
    approach: "突出小额试运行。",
    visibleEffect: "财势、悟性收益。"
  },
  "startup-window:job": {
    label: "留旧东家拿分红",
    description: "先不挂牌，暗中记下开票号所需人手。",
    motive: "继续稳收分红。",
    cost: "自立窗口可能过去。",
    benefit: "可观察人手和客户。",
    risk: "旧东家收紧后分红变少。",
    problem: "原文有默认结局感。",
    approach: "写成暗中准备。",
    visibleEffect: "压力下降，收益稳定。"
  },
  "startup-window:zero": {
    label: "借桌椅开第一间票号",
    description: "租小楼挂匾，只接能兑得起的银票。",
    motive: "从零立旗，自建信用。",
    cost: "本钱薄，容错低。",
    benefit: "成功可获得自己的字号。",
    risk: "第一批票兑不出就关门。",
    problem: "原文生动但略长。",
    approach: "压缩成开店和兑票风险。",
    visibleEffect: "白手起家相关，高收益高风险。"
  },
  "midlife-turn:mentor": {
    label: "让老伙计带新人",
    description: "先由老伙计教新账法，保住体面再改制。",
    motive: "降低内部抵触。",
    cost: "推进较慢。",
    benefit: "成功可留住老伙计和新规矩。",
    risk: "老伙计阳奉阴违会拖慢改制。",
    problem: "原文有传帮带，仍可具体化。",
    approach: "突出体面和改制。",
    visibleEffect: "关系、声望收益。"
  },
  "midlife-turn:relearn": {
    label: "亲自去官署学新规",
    description: "放下面子学票据章程，回来逐条改账。",
    motive: "自己先弄懂新法。",
    cost: "要承认旧经验不够用。",
    benefit: "成功可让客户放心。",
    risk: "学不透会只改表面。",
    problem: "原文清楚，删空话。",
    approach: "写成逐条改账。",
    visibleEffect: "悟性收益，压力小升。"
  },
  "midlife-turn:wait": {
    label: "暂缓改制半年",
    description: "等同行先试错，你只维持旧账法。",
    motive: "避开新规初期混乱。",
    cost: "客户可能转投新票号。",
    benefit: "若判断准，可少踩坑。",
    risk: "拖久会被市场甩开。",
    problem: "原文已有风险，补客户流失。",
    approach: "明确观望代价。",
    visibleEffect: "压力短降，声望可能下降。"
  },
  "fate-low:endure": {
    label: "关两处分号保主号",
    description: "摘掉亏损牌匾，先把主号债期续上。",
    motive: "止血保命脉。",
    cost: "资产和伙计都会流失。",
    benefit: "可保住核心票号。",
    risk: "关得太急会伤信用。",
    problem: "原文有命脉，偏抽象。",
    approach: "改成关店续债。",
    visibleEffect: "压力下降，资产下降。"
  },
  "fate-low:gamble": {
    label: "借高利银押险镖",
    description: "借债再跑一趟险镖，赌下月翻账。",
    motive: "用最后机会快速回本。",
    cost: "背上高利债。",
    benefit: "成功可填部分亏空。",
    risk: "再败会债上滚债。",
    problem: "原文清楚，数字化更明白。",
    approach: "写一趟险镖和翻账。",
    visibleEffect: "高风险，失败压力重。"
  },
  "fate-low:turn-light": {
    label: "查沉船赔付漏洞",
    description: "翻湿账册，找船行少盖的免责印。",
    motive: "从契书漏洞里追回赔付。",
    cost: "证据易损，船行会抵赖。",
    benefit: "成功可逼船行赔银。",
    risk: "证据不足会被反咬。",
    problem: "原文有转机词。",
    approach: "改成具体免责印。",
    visibleEffect: "逢凶化吉相关，减压。"
  },
  "counterattack:return": {
    label: "签约但设三重担保",
    description: "让旧敌押客户名册、担保银和商会见证。",
    motive: "吃下合作机会但锁住退路。",
    cost: "谈判更难，旧敌会不满。",
    benefit: "成功可收回客户资源。",
    risk: "担保不严会再被拖下水。",
    problem: "原文“你不再天真”空泛。",
    approach: "改成名册、担保银、见证。",
    visibleEffect: "声望、悟性收益。"
  },
  "counterattack:new-path": {
    label: "另开海路票号",
    description: "拒绝旧敌，把银子投向新海路客户。",
    motive: "切断旧怨，开新客源。",
    cost: "放弃现成客户名册。",
    benefit: "成功可避开旧人牵制。",
    risk: "海路开拓耗资大。",
    problem: "原文有更远商路，偏泛。",
    approach: "写新海路客户。",
    visibleEffect: "福缘、财势收益，资产承压。"
  },
  "counterattack:rewrite": {
    label: "公开收编旧敌客户",
    description: "在商会大堂立契，按新价收旧敌客户。",
    motive: "把旧敌资源变成自己的盘子。",
    cost: "要公开承受质疑。",
    benefit: "成功可大涨声望和资产。",
    risk: "契约不周会当场失势。",
    problem: "原文气势有余，执行不足。",
    approach: "改成商会立契。",
    visibleEffect: "逆天改命相关，高收益。"
  },
  "elder-view:legacy": {
    label: "写三十年账法手札",
    description: "把错账、险局和用人教训逐条写下。",
    motive: "把经验留给后辈。",
    cost: "要花晚年精力整理旧事。",
    benefit: "可留下声望和传承。",
    risk: "写得太晚会散失细节。",
    problem: "原文有抽象人心规矩。",
    approach: "改成错账、险局、用人。",
    visibleEffect: "悟性、心性、声望提升。"
  },
  "elder-view:family": {
    label: "修旧院陪家人过冬",
    description: "停下账房应酬，修屋、置炭、守年饭。",
    motive: "补回被生意挤掉的亲情。",
    cost: "少管外面生意。",
    benefit: "关系回暖，压力下降。",
    risk: "疏离太久未必立刻补回。",
    problem: "原文温情但缺动作。",
    approach: "加入修屋置炭守饭。",
    visibleEffect: "关系收益明显。"
  },
  "elder-view:enjoy": {
    label: "收账本乘舟南游",
    description: "把主账交给后辈，带一叶小舟去江南。",
    motive: "从账房里退出来。",
    cost: "放手旧事业。",
    benefit: "身心缓下来，压力下降。",
    risk: "放不下旧事会游不安稳。",
    problem: "原文过诗意，缺交接。",
    approach: "加入交账给后辈。",
    visibleEffect: "福缘、心性提高，减压。"
  },
  "final-ending:accept": {
    label: "承认有得有失",
    description: "合上星盘前，把最重的三次取舍写下。",
    motive: "清点这卷命册里的关键选择。",
    cost: "要面对遗憾。",
    benefit: "让结局更平稳。",
    risk: "放不下会留下心结。",
    problem: "原文偏鸡汤。",
    approach: "改成写下三次取舍。",
    visibleEffect: "心性、福缘提升，减压。"
  },
  "final-ending:teach": {
    label: "把旧事讲给后辈",
    description: "不讲大道理，只讲哪几笔账差点毁家。",
    motive: "让后辈避开你踩过的坑。",
    cost: "要揭开旧错和旧债。",
    benefit: "可增加声望和关系。",
    risk: "讲得太传奇会没人学到方法。",
    problem: "原文已有方向，继续具体化。",
    approach: "把故事落到账和家。",
    visibleEffect: "悟性、关系收益。"
  },
  "final-ending:transcend": {
    label: "在星盘背面刻新句",
    description: "刻下二十关选择名目，留给后来人翻看。",
    motive: "把人生抉择做成可读记录。",
    cost: "要整理最难启齿的失败。",
    benefit: "成功可抬高最终评价。",
    risk: "刻错会抹掉旧线索。",
    problem: "原文包含抽象口号。",
    approach: "改成二十关名目和记录。",
    visibleEffect: "高悟性解锁，声望提升。"
  }
};

export const optimizedHiddenStoryTexts: Record<string, Record<ChoiceCheckRank, string>> = {
  "childhood-awakening": {
    greatSuccess: "你转开铜盘边沿，取出夹层铜叶。外祖父认出旧名号，当夜告诉你观星楼曾替商队测雨避险。",
    success: "你摸到星盘榫口并抄下纹路。外祖父看见拓纸后承认铜盘出自旧观星楼。",
    partialFail: "你看出铜盘可开，却没能解锁。外祖父收走星盘，但答应日后讲半段旧事。",
    fail: "你拨错机关，铜盘卡死。外祖父把它锁回木柜，从此不再让你单独进楼。",
    criticalFail: "铜盘落地裂角，外祖父连夜带你离开观星楼。木柜被封，你失去最早的暗格线索。"
  },
  "school-branch": {
    greatSuccess: "你促成半工半读契书。先生准你旁听，师傅仍收你入铺，三年后你既会读账也会估料。",
    success: "你换来清晨洒扫书斋的差事，傍晚回铺学艺，两边都辛苦，却都保住了入口。",
    partialFail: "师傅点头，县学只准借书不准听课。你多了书本，却得夜夜自己补。",
    fail: "先生嫌你分心，师傅也怕你半途离开。你被迫择一边，还少了原先的情面。",
    criticalFail: "你私改两边约期败露，县学退名，匠铺拒收，家里还赔了一笔礼钱。"
  },
  "friendship-test": {
    greatSuccess: "你让更夫重走夜路，药灰、窗泥和脚印对上真凶时辰。阿砚洗清，病母也得书院接济。",
    success: "你找出沾药味的草绳，请更夫作证。阿砚暂免重罚，案子改由先生重查。",
    partialFail: "你只找到半截线索。阿砚免了逐出书院，却仍被记过，你们从此被人盯着。",
    fail: "你查暗线太慢，阿砚被迫低头认错。证据被收走，院中开始传你偏袒同窗。",
    criticalFail: "真凶反咬你们串供。阿砚被逐出书院，你也被停课一月。"
  },
  "family-shift": {
    greatSuccess: "你翻出父亲旧年救药铺的账据。掌柜免去利钱，又交出旧药方，药费少了一半。",
    success: "你问出药铺欠过你家人情。掌柜不免债，却把期限延到秋后，小院暂时保住。",
    partialFail: "旧情只换来半月宽限。母亲取下银簪补账，门槛保住了，体面却薄了。",
    fail: "你提旧事太急，掌柜觉得你挟恩。欠条照催，父亲旧友也不好再开口。",
    criticalFail: "你拿错旧账，当众被掌柜驳回。催债人第二日上门量院墙。"
  },
  "first-choice": {
    greatSuccess: "你查到商会还有后船名额，半日安顿家里，夜里追上小船，母亲和府城机会都没丢。",
    success: "你找船家改签，三日后从小渡口离乡。船舱更挤，但家账和托付都交代清楚。",
    partialFail: "你争到一日宽限，却丢了原船位。府城名额还在，路费多花一笔。",
    fail: "船家不等，商会不认迟到。你站在渡口，看推荐信被江风吹皱。",
    criticalFail: "你托错人传话，商会以为你弃名。赶到府城时，账房名额已给旁人。"
  },
  "youth-fog": {
    greatSuccess: "你记下笔迹、钥匙和油灯时辰，东家顺藤查出贪墨链，把你调去管内库。",
    success: "你把证据藏进旧账夹层，月末交出。掌柜被调走，你保住饭碗和清白。",
    partialFail: "你抄到关键账，却少了印记。掌柜收手，你仍只能在客栈小心当差。",
    fail: "掌柜发现你藏证，把你调去夜班。暗账还在，你却暂时碰不到账柜。",
    criticalFail: "证据被换成假账，东家误以为你参与改账。你连夜离店，名声受损。"
  },
  "career-start": {
    greatSuccess: "你合出三套备线，镖队避开塌坡。镖头把你的路线图挂进正堂。",
    success: "你问出青石岭新塌路，及时改道。镖队多绕半日，却避开险处。",
    partialFail: "你只改掉最险一段。镖队仍误半日，镖头罚你补夜图，也准你留下学。",
    fail: "你少标一处水源，镖队在山中多耗一天。正图暂时不再交到你手里。",
    criticalFail: "你误信旧路引，镖队撞进废道，伤了两人。你被罚三月不得随队。"
  },
  "patron-arrives": {
    greatSuccess: "你当场拆出旧账漏洞。白发账师另写私信，让你入京后直接查核心账房。",
    success: "你听出账师暗示，问到烂账背后的人事牵连，带走一把破账钥匙。",
    partialFail: "你听懂半句，没追到底。入京机会仍在，但烂账比荐书写得更深。",
    fail: "你问到忌讳处，账师收回批注，只留荐书让你独自碰墙。",
    criticalFail: "你当众点破账师旧案，茶楼冷场。荐书没了，旁人只记得你气盛。"
  },
  "love-choice": {
    greatSuccess: "你替她接通边城药铺和京城钱庄信路，三年之约有信、有药、有见面日。",
    success: "你把木牌分作两半，每月按驿站寄信。她在边城行医，你在京城回书。",
    partialFail: "你说出心意，却没安排将来。她带着木牌离开，眼里有信也有不安。",
    fail: "你绕着真心说漂亮话，她觉得你不敢担事，收下木牌却没应归期。",
    criticalFail: "你劝她放弃边城，她把木牌还给你。此后你们的信再没按月到过。"
  },
  "wealth-window": {
    greatSuccess: "你先查两家官商往来，涨价前卖半数、留半数，赚到银子也避开清查。",
    success: "你看出真实缺口，只投可承受的银子。三月后小赚一笔，立下第一笔本钱。",
    partialFail: "你看准涨价，却低估抽利。利润被打掉不少，本金还在。",
    fail: "中间人拖住撤退时机，银子压了很久，票号周转开始吃紧。",
    criticalFail: "你信了假批文。官府清查时中间人先跑，你只拿回一叠旧票。"
  },
  "career-crisis": {
    greatSuccess: "你从库票、私印和门禁三处落手，真凶出城前被截下，东家当面替你洗清。",
    success: "你查到外库伙计。亏空不能全追回，但官府暂缓拿人，你先保住清白。",
    partialFail: "你找到破绽，却缺证人。东家不报官，但要你先垫一部分亏空。",
    fail: "真凶带走关键账册。东家撤了你的账房职，你只能从旁继续追线。",
    criticalFail: "你追错人，真凶烧掉库票。官差上门时，最后经手名仍写着你。"
  },
  "health-signal": {
    greatSuccess: "你把急信拆成三件托付，自己按方休养。三月后气血回稳，再上路不误差事。",
    success: "你交清急账再养病。旁人先议论你退缩，后来见账房无乱才改口。",
    partialFail: "你改了作息，却仍舍不得放下差事。咳血止了些，身子没真正养回。",
    fail: "你用药方压病又熬夜办事。医师摇头，东家开始把重差绕开你。",
    criticalFail: "你隐病赶雪路，半途倒下。急信误期，身体也留下怕寒旧症。"
  },
  betrayal: {
    greatSuccess: "你先暗访被带走的客户，半数客户交出旧友私抽证据，票号反得一批铁证。",
    success: "你先重签急客户。契书虽伤你一刀，票号没有被掏空。",
    partialFail: "你堵住部分缺口，却没追回全数客户。伙计们第一次露出不安。",
    fail: "旧友抢先放出资金吃紧的消息。客户观望，伙计私下打听退路。",
    criticalFail: "你的客户名单被截走。旧友反手登门抢人，票号门前冷了大半。"
  },
  "city-migration": {
    greatSuccess: "你先用旧城客户试开南港兑票，流水对上后再带伙计入港，两边都不断账。",
    success: "你让副手先跑小额南港线。回信慢但无错，这条商路能走，只是不宜急。",
    partialFail: "你低估两地账期，第一批银子压在路上。南港盘子只能先缩小。",
    fail: "人手不够，两地都等你定夺。旧城和南港都没崩，却都觉得你顾不过来。",
    criticalFail: "你信错南港中人，银子进了空铺。副手也生疑，两边同时收紧。"
  },
  "startup-window": {
    greatSuccess: "你让三位老客各押一笔小额汇兑。第一月准时兑回，街坊开始认你的字号。",
    success: "你只接能兑得起的票。牌匾不大，却没失信，三月后有了常客。",
    partialFail: "票号开成了，但押船银拖住手脚。客能兑，伙计工钱先欠半月。",
    fail: "第一批汇兑遇路阻，银子没全丢却迟了两日，街面开始议论你底子薄。",
    criticalFail: "借来的本钱被一单远路汇兑压死。客人堵门要银，牌匾挂不到一月。"
  },
  "midlife-turn": {
    greatSuccess: "你让老伙计教新人，新人再教新票章程。两拨人都保住体面，账法也传下去。",
    success: "你把新规拆成十条旧伙计听得懂的话，第一批新银票顺利过关。",
    partialFail: "你学会新规，却没让所有人跟上。几名老伙计请辞，主号仍能开门。",
    fail: "新票据推到半截，客户被来回改章程惹烦，转去隔壁票号。",
    criticalFail: "新旧账法同时挂柜，第一批银票错兑。官署责罚，票号声望受损。"
  },
  "fate-low": {
    greatSuccess: "你翻出船行契书少盖的免责印，债主退半步，船行赔出半数货损，主号续命。",
    success: "你找到船行责任缺口。赔付不足清债，却能堵住最急的债主。",
    partialFail: "契书破绽被船行拖进争辩。债主只肯缓十日，你得先卖一处分号。",
    fail: "你翻遍湿账册，只找到落不了印的线索。伙计散去，你被迫再关铺。",
    criticalFail: "船行反咬你伪造契书。债主失去耐心，当夜有人摘走分号牌匾。"
  },
  counterattack: {
    greatSuccess: "你把旧敌客户分成可收、可换、不可碰三类。商会见你有章法，旧敌只能按契入局。",
    success: "你设担保和缓冲期接下合作。旧敌没能拖你下水，部分客户转到你手里。",
    partialFail: "你留了担保，却漏了一名账房偷换口径。合作能续，但你得亲自清尾。",
    fail: "旧敌借谈判探到海路价码。客户没全走，你却暴露不少底牌。",
    criticalFail: "你在商会放话收编，却没备好细契。旧敌当场指出漏洞，你气势被削。"
  },
  "elder-view": {
    greatSuccess: "你把三十年账法、地契和后辈名册放在同册。祠堂修成后，有人读书也有人学账。",
    success: "你修好旧院，又写下几卷手札。后辈遇事翻看，才知你标过最险的路。",
    partialFail: "手札留下了，却没能让后辈静心读完。旧院修成，书先被收进柜里。",
    fail: "你家、楼、手札都想顾，最后各做半截。族人谢你的银子，却没接住经验。",
    criticalFail: "你把旧事讲得太硬，后辈只听见训诫。祠堂落成，手札被束之高阁。"
  },
  "final-ending": {
    greatSuccess: "你在星盘背面刻下二十关选择名目。后辈摸到刻痕，能看见每步的得失。",
    success: "你把最险几次选择写成短札。后人读到的不是传说，而是取舍凭据。",
    partialFail: "你想写尽旧事，却只留下几处最不愿后人重犯的错。",
    fail: "你临终前想补刻新句，手力不稳只刻下半行。后人看见遗憾，却难读全意。",
    criticalFail: "你执意改刻星盘，磨花旧痕。许多本该传下去的选择名目从此混在暗色里。"
  }
};

export const optimizedTraitCopy: Record<string, OptimizedTraitCopy> = {
  "natural-grace": {
    description: "你进陌生门庭时不怯场，懂得看席面、递话头，也容易让长辈先给一分好感。",
    impact: "拜访、说合、求情类事件更容易开口；关系收益提高，但过分依赖好感会忽略真价码。",
    problem: "旧文偏抽象的外貌光环。",
    approach: "改成人际场合里的具体表现和限制。"
  },
  "early-wisdom": {
    description: "你比同龄人更早听懂话外话，能看出先生、掌柜或长辈真正担心的事。",
    impact: "读书、查账、识人类判定更占便宜；但想得太多时，压力也更容易累在心里。",
    problem: "旧文使用规则、敏感等空词。",
    approach: "改成听话外话和看担心。"
  },
  "patron-star": {
    description: "你未必处处顺，但在急处常有人愿意替你递一句话、作一次保或介绍一条路。",
    impact: "求助、作保、贵人线更容易出现；成功时关系和声望多涨，失败时仍欠人情。",
    problem: "旧文递灯意象太泛。",
    approach: "写成作保、介绍和欠人情。"
  },
  "grand-fortune": {
    description: "你总能比旁人更早看见货价、路引和人情里的差价，大买卖当前敢下重注。",
    impact: "投资、汇兑、商路类事件收益提高；高风险财路更常出现，失败时损失也更重。",
    problem: "旧文奇妙吸引力、大幅提升太空。",
    approach: "落到货价、路引、人情差价。"
  },
  "rough-love": {
    description: "你动情不浅，却常把承诺说得慢，把现实安排说得迟，容易让对方等得心冷。",
    impact: "感情线更考验心性和沟通；成功可得深关系，失败更容易损关系并加压。",
    problem: "旧文像现代通信比喻。",
    approach: "改成承诺、安排和等待。"
  },
  "danger-to-light": {
    description: "你遇险时不先慌逃，常会翻契书、查旧账、找漏印，从坏局里抠出余地。",
    impact: "低谷、危机、赔付类事件可触发挡劫；大失败可能降档，但每局触发有限。",
    problem: "旧文风暴出口太套路。",
    approach: "写成契书、旧账、漏印。"
  },
  "wealth-star": {
    description: "你对银钱流向敏感，能从账期、押银和行情里看出哪笔买卖能碰。",
    impact: "投资、经商、票号类判定获得财路加值；若贪快，资产波动会更大。",
    problem: "旧文机会嗅觉仍偏泛。",
    approach: "改成账期、押银、行情。"
  },
  "lone-walker": {
    description: "你敢独自探路、查账或远行，不爱把难处摊给旁人。",
    impact: "独行、探路、冒险准备类选项更强；但关系增长较慢，求助线更难吃满。",
    problem: "旧文长夜意象偏空。",
    approach: "写成独自探路和不求助。"
  },
  "peach-aura": {
    description: "你容易被人记住，也容易被人误会；好意、试探和闲话常同时围上来。",
    impact: "社交、感情、说合类事件关系收益提高；选择含糊时更容易引来误会。",
    problem: "旧文情绪频率太现代。",
    approach: "改成好意、试探、闲话。"
  },
  "self-made": {
    description: "你不怕门面小、本钱薄，敢从一张桌、一块匾、几名熟客开始攒信用。",
    impact: "创业、开铺、票号自立类隐藏路线更容易出现；初期压力高，失败损资产。",
    problem: "旧文空地据点仍抽象。",
    approach: "写成桌、匾、熟客。"
  },
  "late-bloom": {
    description: "你前期未必显眼，但肯记错账、记人情、记亏损，年纪越长越能用上旧经验。",
    impact: "十二关后经营、传承、归山类事件加值；前期收益普通，需要撑过低潮。",
    problem: "旧文曲线、成长空间太 AI。",
    approach: "改成旧经验在后期生效。"
  },
  "rewrite-fate": {
    description: "你遇到定局时不急着认输，会重新排契约、客源和账期，把死路拆成几段。",
    impact: "逆命、天命类选择额外加值；若仍失败，压力和代价会比寻常路线更重。",
    problem: "旧文出现系统、默认结局、草稿。",
    approach: "改成契约、客源、账期重排。"
  },
  "quick-temper": {
    description: "你反应快，也容易先拍桌后想后路，嘴上一句硬话常让局面更难收。",
    impact: "冒险、对抗类判定可加冲劲；失败时更容易增加压力或损关系。",
    problem: "旧文尚可，但可更机制化。",
    approach: "写成拍桌、硬话和失败代价。"
  },
  "wealth-leak": {
    description: "你碰钱机会不少，却常因义气垫账、临时加码或听信熟人，把银子漏出去。",
    impact: "财路更容易出现，但资产留存较难；高风险财富失败时损失更明显。",
    problem: "旧文仍有机会波动空词。",
    approach: "改成垫账、加码、熟人误导。"
  },
  "thin-kinship": {
    description: "你早早习惯自己扛事，家族能给的托举少，求人时也常慢半拍。",
    impact: "家庭、求助、亲族线更吃力；独立调查和悟性有优势，但关系起步更难。",
    problem: "旧文抽象但方向可保留。",
    approach: "写出求人慢半拍和关系起步。"
  },
  "too-sharp": {
    description: "你看账、识人、拆局都快，话也直，容易让同辈佩服，也让上位者戒备。",
    impact: "竞争、查证、公开对质类选项更强；失败时声望和关系损失更重。",
    problem: "旧文才气刺眼不够具体。",
    approach: "落到查账、说话、上位者戒备。"
  },
  "old-ailment": {
    description: "你能熬事，但身子不许你长期硬撑；寒夜、远路和熬账最容易把旧疾勾起。",
    impact: "健康、远行、熬夜类事件压力更敏感；按医嘱修养成功时减压更多。",
    problem: "旧文灯的比喻偏空。",
    approach: "改成寒夜、远路、熬账。"
  }
};
