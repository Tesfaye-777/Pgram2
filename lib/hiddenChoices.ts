import type { ChoiceCheckRank, LifeChoice, LifeScenario, SimulationSave, StatKey } from "@/types";
import { optimizedHiddenStoryTexts } from "@/lib/copyOptimizations";

const scenarioStatMap: Record<string, StatKey> = {
  "childhood-awakening": "insight",
  "school-branch": "mind",
  "friendship-test": "courage",
  "family-shift": "luck",
  "first-choice": "mind",
  "youth-fog": "insight",
  "career-start": "insight",
  "patron-arrives": "luck",
  "love-choice": "mind",
  "wealth-window": "wealth",
  "career-crisis": "insight",
  "health-signal": "mind",
  betrayal: "mind",
  "city-migration": "wealth",
  "startup-window": "courage",
  "midlife-turn": "insight",
  "fate-low": "luck",
  counterattack: "courage",
  "elder-view": "mind",
  "final-ending": "luck"
};

const scenarioTraitMap: Record<string, string[]> = {
  "patron-arrives": ["patron-star"],
  "career-crisis": ["patron-star"],
  "startup-window": ["self-made"],
  "fate-low": ["danger-to-light"],
  counterattack: ["rewrite-fate"],
  "final-ending": ["rewrite-fate", "late-bloom"],
  "love-choice": ["peach-aura"],
  "wealth-window": ["wealth-star", "grand-fortune"],
  "career-start": ["lone-walker"],
  "city-migration": ["late-bloom"]
};

const statNames: Record<StatKey, string> = {
  luck: "福缘",
  wealth: "财势",
  mind: "心性",
  courage: "魄力",
  insight: "悟性"
};

const hiddenChoiceCopy: Record<string, { label: string; description: string }> = {
  "childhood-awakening": {
    label: "转开星盘铜沿",
    description: "你沿盘边细槽慢慢推转，想找出木柜里那件旧物的暗格。"
  },
  "school-branch": {
    label: "改成半工半读契",
    description: "你拿县学荐帖给木匠师傅看，请两边各让半步。"
  },
  "friendship-test": {
    label: "请更夫重走夜路",
    description: "你请更夫提灯重走昨夜路线，对窗泥、药灰和脚印。"
  },
  "family-shift": {
    label: "翻父亲旧账据",
    description: "你在木箱里找出父亲替药铺救急的旧账，带去见掌柜。"
  },
  "first-choice": {
    label: "查码头后船名额",
    description: "你绕到码头账房，查商会名册里是否还有夜航空位。"
  },
  "youth-fog": {
    label: "记下改账三处证据",
    description: "你把笔迹、柜中钥匙和油灯时辰一并记进旧账夹层。"
  },
  "career-start": {
    label: "合出三套备线路",
    description: "你把旧镖路、山民口供和水源位置合成备用路线。"
  },
  "patron-arrives": {
    label: "当场拆白发账师旧账",
    description: "你摊开那页旧账，当面指出钱庄烂账的第一处漏洞。"
  },
  "love-choice": {
    label: "接通边城书信药路",
    description: "你先问清驿站、药铺和钱庄往来，让三年之约有路可走。"
  },
  "wealth-window": {
    label: "先查官商往来",
    description: "你不急着投银，先查盐引背后两家官商的旧往来。"
  },
  "career-crisis": {
    label: "三处同查亏空案",
    description: "你同时查库票、私印和当夜门禁，截住真正经手人。"
  },
  "health-signal": {
    label: "拆急信托人代办",
    description: "你把急信分成账目、回函和跑腿三件事，分别托给可信之人。"
  },
  betrayal: {
    label: "暗访被带走的客户",
    description: "你先不上门争吵，而是夜里拜访被旧友带走的几家客户。"
  },
  "city-migration": {
    label: "先跑南港小额兑票",
    description: "你用旧城熟客试开南港小票，确认两地流水能否对上。"
  },
  "startup-window": {
    label: "让老客押小额汇兑",
    description: "你请三位老客各押一笔小额汇兑，先立第一轮信用。"
  },
  "midlife-turn": {
    label: "让老伙计教新人",
    description: "你不硬推新法，先请老伙计带新人熟悉新票章程。"
  },
  "fate-low": {
    label: "查船行免责印",
    description: "你翻开湿账册和船行契书，专找少盖的免责印。"
  },
  counterattack: {
    label: "把旧敌客户分三类",
    description: "你在商会前把客户分成可收、可换、不可碰三类。"
  },
  "elder-view": {
    label: "合订账法地契名册",
    description: "你把三十年账法、旧院地契和后辈名册放在同册。"
  },
  "final-ending": {
    label: "刻下二十关选择名目",
    description: "你在星盘背面刻下每关的选择名目，留给后来人翻看。"
  }
};

const hiddenStoryTexts: Record<string, Record<ChoiceCheckRank, string>> = {
  "childhood-awakening": {
    greatSuccess: "你没有只看星盘正面的刻纹，而是发现盘沿能转开半寸。夹层里藏着一片旧铜叶，上面写着外祖父年轻时的名号。外祖父看见铜叶后不再避谈，只把观星楼真正的来历讲给你听。",
    success: "你在星盘背后摸到一处细小榫口，确认它不是寻常玩物。夜里你把纹路照着抄下，外祖父第二日看见纸上的图，终于承认此物与旧观星楼有关。",
    partialFail: "你看出星盘边缘有机关，却没能打开。铜盘在夜里发出一声轻响，惊醒了外祖父；他没有责骂你，只把星盘收进木匣，许你日后再问。",
    fail: "你急着拨动星盘，反把机关卡死。外祖父听见响动赶来，把铜盘从你手里取走；从那以后，他提到观星楼时总会避开你的眼睛。",
    criticalFail: "你误触机关，铜盘落地磕裂一角。外祖父沉默着拾起碎片，当夜便带你离开观星楼；那扇木柜后来被人封死，你再也没见过里面的暗格。"
  },
  "school-branch": {
    greatSuccess: "你没有在读书和学艺之间硬选一边，而是把县学先生的荐帖拿给木匠师傅看。师傅替你改出一张半工半读的契书，先生也准你旁听。三年之后，你既能读账，也懂器物成本。",
    success: "你找到县学管事，换来每日清晨洒扫书斋的差事，又在傍晚回匠铺学手艺。两边都不轻松，但你终于不用把前路押在单独一扇门上。",
    partialFail: "你说服了木匠师傅，却没能说动县学先生。先生只准你借书，不准入堂听课；你仍然多了一条路，只是每一步都要靠夜里补回来。",
    fail: "你想同时握住两边，却被先生嫌心不专，也让师傅觉得你迟早要走。最后你仍得选一边，而且比原先更少了几分情面。",
    criticalFail: "你私自改动两边约期，事情败露后，县学退了你的名额，匠铺也不肯收你。家里为你赔礼奔走，你第一次明白聪明若无分寸，也会误事。"
  },
  "friendship-test": {
    greatSuccess: "你没有急着替阿砚辩白，而是让更夫带着灯笼重走昨夜路线。窗泥、药灰和脚印正好对上另一个人的时辰。先生当堂收回指控，阿砚的母亲也因此得了书院接济。",
    success: "你从灶灰里找出一截沾药味的草绳，又请更夫作证。偷印的人没能立刻认罪，但阿砚被暂时放过，你替他争到了查清真相的时间。",
    partialFail: "你找到一点线索，却不足以当堂翻案。阿砚免了重罚，但仍被记过；他感激你，却也知道书院里从此有人盯着你们。",
    fail: "你绕开明面作证去查暗线，反被人说成拖延。阿砚被迫低头认错，你找到的线索也被收走，书院里关于你偏袒同窗的议论多了起来。",
    criticalFail: "你查线索时惊动了真正偷印的人，对方反咬你和阿砚串供。先生震怒，阿砚被逐出书院，你也被罚停课一月。"
  },
  "family-shift": {
    greatSuccess: "你没有只去求钱，而是翻出父亲旧年替药铺救急的账据。药铺掌柜看到账据后改了脸色，不仅宽限欠账，还把旧药方交给你，让父亲能少花一半药钱。",
    success: "你从父亲旧友那里问出药铺欠过你家一份人情。掌柜不肯免债，却愿意把期限延到秋后，家里的小院暂时保住。",
    partialFail: "你找到了旧情，却只换来半月宽限。药钱仍压在桌上，母亲把银簪取下来交给你；这次你保住了门槛，却没保住家里的体面。",
    fail: "你提起旧事时语气太急，掌柜反觉得你挟恩图报。欠条仍按原期催收，父亲旧友也不好再替你说话。",
    criticalFail: "你拿错了旧账，把一段早已还清的人情当成筹码。药铺掌柜当众驳回，催债的人第二日便上门量院墙。"
  },
  "first-choice": {
    greatSuccess: "你没有立刻登船，而是从码头账房那里查出商会还有一张后船名额。你用半日安顿家中，又赶上夜航小船；母亲没被匆忙抛下，你也没错过府城机会。",
    success: "你找到船家老账，换来一次改签。三日后你从小渡口离乡，虽然船舱更挤，却把家里的账目和母亲的托付都安排妥当。",
    partialFail: "你争到了一日宽限，却没能保住原来的船位。府城名额仍在，但你得多花一笔路费，这笔钱让母亲把过冬布料退了回去。",
    fail: "你想两头兼顾，结果船家不肯等，商会也不认迟到。你留在渡口看船影远去，手里的推荐信被江风吹得发皱。",
    criticalFail: "你托错了人传话，商会以为你主动弃名。等你追到府城，账房名额已经换给旁人，家中也因你奔波多添一笔债。"
  },
  "youth-fog": {
    greatSuccess: "你没有只抄暗账，而是把改账人的笔迹、油灯时辰和柜中钥匙一起记下。东家照着你留下的线索查出整条贪墨链，你从小账房被调去管内库。",
    success: "你把暗账证据藏进旧账册夹层，等月末盘账时交出。东家虽未公开嘉奖你，却把那名掌柜调走，你保住了饭碗，也保住了清白。",
    partialFail: "你抄下几页关键账，却少了能钉死人的印记。掌柜被警告后收手，你没拿封口银，却也只能继续在客栈里小心做事。",
    fail: "你藏证据时被掌柜发现。他没有当场撕破脸，只把你调去最苦的夜班；你知道暗账仍在，却暂时碰不到账柜。",
    criticalFail: "你留下的证据反被换成假账。东家查到你手里那份时，以为你参与改账，你连夜离开客栈，名声也被雨水拖进泥里。"
  },
  "career-start": {
    greatSuccess: "你没有只重画一张路图，而是把旧镖路、山民口供和水源位置合成三套备线。镖队后来避开塌坡，镖头当众把你的图挂进镖局正堂。",
    success: "你从脚夫口中问出青石岭新塌过一段路，及时改了路线。镖队多绕半日，却避开险处，你在镖局里第一次被人认真记住名字。",
    partialFail: "你发现路线有错，却只来得及改掉最险的一段。镖队仍在山里误了半日，好在没有折人；镖头罚你补夜图，也让你留下继续学。",
    fail: "你重画的图少标一处水源，镖队在山中多耗一天。老镖师替你说了情，但镖头从此不再轻易把正图交到你手里。",
    criticalFail: "你误信了旧路引，镖队撞进废弃山道。货箱虽保住，人却伤了两个；你被罚跪在镖旗前，三个月不得随队。"
  },
  "patron-arrives": {
    greatSuccess: "你没有急着接荐书，而是当场拆解白发账师给出的旧账。账师看出你能举一反三，另写一封私信给京城掌柜，让你入京后直接查核心账房。",
    success: "你顺着账师话里的暗示，问到烂账背后的人事牵连。荐书仍是那封荐书，但你带走了破账的第一把钥匙。",
    partialFail: "你听懂账师半句话，却没能追问到底。入京机会仍在，只是你到钱庄后才发现，那宗烂账比荐书上写得更深。",
    fail: "你想从账师那里多问一步，却问到了忌讳处。账师收回了原本要给你的批注，只留下荐书，让你自己去京城碰墙。",
    criticalFail: "你当众点破账师旧案，茶楼里顿时冷下来。荐书没了，前辈也拂袖而去，旁人只记得你年轻气盛不知分寸。"
  },
  "love-choice": {
    greatSuccess: "你没有只许诺等待，而是替她联络边城药铺与京城钱庄的往来路。三年之约从一句情话变成一条可传信、可寄药、可相见的路。",
    success: "你把木牌一分为二，一半给她，一半留在身边。她去边城后，每月托驿站寄来一张药方，你也按时回信，感情没有被路途磨散。",
    partialFail: "你说出了心意，却没能说清将来如何相守。她仍带着木牌离开，只是临行前多看了你一眼，那一眼里有信，也有不安。",
    fail: "你绕着真心说了太多漂亮话，反让她觉得你不敢担事。灯会散时，她收下木牌，却没有答应三年后一定回来。",
    criticalFail: "你误把试探当成挽留，说出让她放弃边城的话。她把木牌还给你，转身进了人潮；这一夜之后，你们的信再没按月到过。"
  },
  "wealth-window": {
    greatSuccess: "你没有直接押银，而是先查盐引背后的两家官商往来。你抢在批文变动前退出半数，又用剩下半数吃到涨价，既得利，也没被卷进牢狱。",
    success: "你从盐引暗盘里看出真实缺口，只投能撤出的银子。三个月后你赚了一笔，不算暴富，却足够给自己立下第一笔独立本钱。",
    partialFail: "你看准了盐引会涨，却低估了官商争斗。银子赚到一半便被迫抽身，利润被打掉许多，好在本金还在。",
    fail: "你以为自己看清局势，却被中间人拖住撤退时机。盐引没砸穿，但银子压了很久，票号周转因此吃紧。",
    criticalFail: "你误信了假批文，把银子押进最浑的那一池水。官府查盘时，中间人先跑，你只拿回一堆不能兑的旧票。"
  },
  "career-crisis": {
    greatSuccess: "你没有只查账面亏空，而是从库票、私印和当夜门禁三处同时落手。真凶被截在出城前，东家当着官差的面替你洗清嫌疑。",
    success: "你顺着错盖私印查到一名外库伙计。亏空不能立刻全追回，但你证明自己不是经手贪墨的人，官府也暂缓拿人。",
    partialFail: "你找到破绽，却缺少能定案的证人。东家暂时不报官，但要求你自垫一部分亏空；你保住清白，也背下一笔沉账。",
    fail: "你查得太慢，真凶已经把关键账册带走。东家没有把你送官，却撤了你的账房职，你只能从旁继续追线索。",
    criticalFail: "你追错了人，反让真正动手的人烧掉库票。官差上门时，最后经手名仍是你；你被押去问话，钱庄里无人敢替你作保。"
  },
  "health-signal": {
    greatSuccess: "你没有硬撑赴任，而是把急信拆成三件事分别托人。医师替你定药，旧友替你送信，东家也准你缓行。三个月后你带着养回的气血重新上路。",
    success: "你承认病势，先把要紧账目交代清楚，再去养病。旁人起初议论你退缩，后来账房无乱，才知道你不是逃事。",
    partialFail: "你改了作息，却仍舍不得放下全部差事。咳血止住一些，但夜里仍要醒来核账；身体没坏到底，也没真正养回来。",
    fail: "你想用药方压住病，却继续熬夜办事。医师摇头，东家也看出你撑不久，重要差事开始绕开你。",
    criticalFail: "你隐瞒病情赶去赴任，半路在雪夜里倒下。急信误期，差事旁落，身体也从此留下怕寒的根。"
  },
  betrayal: {
    greatSuccess: "你没有立刻讨契，而是先让伙计暗访被他带走的客户。三十家里有半数只是不知真相，你带着新契上门时，对方反把旧友的私抽证据交给你。",
    success: "你稳住伙计，先重签最要紧的客户。旧友抽走的契书伤了你，却没能掏空票号；几日后，愿意留下的人反而更清楚谁可靠。",
    partialFail: "你堵住一部分缺口，却没来得及追回全部客户。票号能继续开门，只是账面少了一截，伙计们也第一次露出不安。",
    fail: "你想从暗处收回局面，旧友却先放出你资金吃紧的消息。客户开始观望，伙计也有人私下问退路。",
    criticalFail: "你暗中联络客户的名单被旧友截走。他反手登门抢人，连你原本稳住的几家也被说动，票号门前一日之内冷了大半。"
  },
  "city-migration": {
    greatSuccess: "你没有急着南下，而是先用旧城客户试开南港兑票。两边流水对上后，你带着第一批可信伙计入港，旧城不断根，南港也有了落脚处。",
    success: "你让旧城副手先试一条小额南港线。回信慢，却没出差错；你终于知道这条商路能走，只是不能走得太急。",
    partialFail: "你探到南港机会，却低估了两地账期差。第一批银子压在路上，旧城客户催问不断，你只能先缩小南港盘子。",
    fail: "你安排双线试行时人手不足，旧城与南港都等你定夺。两边都没有彻底崩，却都觉得你顾不过来。",
    criticalFail: "你信错南港中人，把第一批骨干派进空壳铺面。旧城副手也因此生疑，南北两边同时收紧，你被迫回头补洞。"
  },
  "startup-window": {
    greatSuccess: "你没有只借银开铺，而是先让三位老客户各押一笔小额汇兑。第一月票据准时兑回，街坊看见信用落地，第二月便有人主动送银上门。",
    success: "你用最小门面开局，只接自己能兑得起的票。牌匾不大，却没有失信；三个月后，第一批常客认下了你的名号。",
    partialFail: "你开出了第一间票号，却被押舱银拖住手脚。客人能兑，伙计却只能先欠半月工钱，门面撑起来了，底气还薄。",
    fail: "你急着立旗，第一批汇兑就遇上路阻。银子没有全丢，但兑付迟了两日，街面上开始有人说你的票号根基不稳。",
    criticalFail: "你借来的本钱被一单远路汇兑压死。客人堵在门口要银，牌匾挂了不到一月便被债主指着骂。"
  },
  "midlife-turn": {
    greatSuccess: "你没有强推新法，而是让老伙计先教新人，再由新人反教票据新章。两拨人都保住体面，票号改制没有散伙，反而多出一套能传下去的账法。",
    success: "你亲自去官署学规矩，再回来拆成十条旧伙计听得懂的话。抱怨没有消失，但第一批新银票总算顺利过关。",
    partialFail: "你学会了新规，却没能让所有人跟上。几名老伙计请辞，账房空了几张桌子，好在主号没有因此停摆。",
    fail: "你低估了旧规矩的惯性。新票据推到一半，客户被来回改章程弄得烦躁，转去了隔壁票号。",
    criticalFail: "你把新旧账法同时挂上柜台，伙计各按各的规矩办。第一批银票出了错兑，官署责罚下来，票号声望大损。"
  },
  "fate-low": {
    greatSuccess: "你没有只盯着沉江的货银，而是翻出船行契书里少盖的免责印。债主在证据前退了半步，船行不得不赔出一半货损，你从绝境里夺回主号命脉。",
    success: "你从湿账册里找到船行责任的缺口。赔付不够还清全部债，却足以堵住最急的债主，票号没有当场倒下。",
    partialFail: "你找到了契书破绽，却被船行拖进漫长争辩。债主只肯缓十日，你得先卖掉一处分号换时间。",
    fail: "你翻遍沉船账册，只找到无法落印的线索。债主不认，伙计也开始散去；你只能关掉更多铺面保主号。",
    criticalFail: "你拿着不完整的契书上门，被船行反咬伪造。债主听后彻底失去耐心，当夜便有人来摘你的分号牌匾。"
  },
  counterattack: {
    greatSuccess: "你没有只报复旧敌，而是把他的客户名册拆成三类：可收、可换、不可碰。商会见你处置有章，旧敌也只能按你定的规矩入局。",
    success: "你接下合作，却设了担保和缓冲期。旧敌没能再把你拖进旧坑，那三十家客户也有一部分稳稳转到你手里。",
    partialFail: "你留了担保，却没防住旧敌手下一名账房偷换客户口径。合作能继续，但你得亲自清理尾巴，商会里也有人等着看笑话。",
    fail: "你试图把旧敌变成棋子，反被他借机探到你的新海路价码。客户没全走，却让你暴露了不少底牌。",
    criticalFail: "你在商会大堂放出收编之言，却没准备好契约细则。旧敌当场反问几处漏洞，客户席间哗然，你的气势被削去大半。"
  },
  "elder-view": {
    greatSuccess: "你没有只捐钱修楼，而是把三十年账法、旧观星楼地契和族中后辈名单放在一起。祠堂修成后，族里有人读书，有人学账，你留下的不只是银子。",
    success: "你把旧院修好，又写下几卷账法手札。后辈们起初只当故事听，后来遇事翻看，才知道你把一生最险的地方都标了出来。",
    partialFail: "你留下手札，却没能让族中后辈真正静心读完。旧院修成了，书也收进柜里，偶尔有人翻到，才知道里面藏着你的苦心。",
    fail: "你想同时顾家、修楼、写章程，最后哪一处都只做了半截。族人感激你的银子，却没人真正接过你的经验。",
    criticalFail: "你把旧事讲得太硬，后辈只听见训诫，没听见路。祠堂宴后，手札被束之高阁，你想传下去的东西没有找到接手的人。"
  },
  "final-ending": {
    greatSuccess: "你没有只合上命册，而是在星盘背面刻下所有关键选择的名目。后辈日后摸到那些刻痕，能知道你这一生不是靠一签定局，而是靠一次次落子走出来的。",
    success: "你把星盘放回旧柜前，先把几件最险的选择写成短札。后来有人打开木柜，读到的不是神怪传说，而是一生如何取舍的凭据。",
    partialFail: "你想把一生说清，却发现许多事无法写尽。星盘仍被放回旧柜，只多了一页薄纸，写着你最不愿后人重犯的几处错。",
    fail: "你临终前想重写星盘背面的句子，却手力不稳，只刻下一半。后人能看见你的遗憾，却未必读懂你真正想交代什么。",
    criticalFail: "你执意在最后一夜改写星盘，却把旧刻痕磨花。后人只看见斑驳铜面，许多本该传下去的选择名目，从此混进了暗色里。"
  }
};

export function getAvailableScenarioChoices(scenario: LifeScenario, save: SimulationSave) {
  const hidden = buildHiddenChoice(scenario, save);
  return hidden ? [...scenario.choices, hidden] : scenario.choices;
}

function buildHiddenChoice(scenario: LifeScenario, save: SimulationSave): LifeChoice | null {
  const keyStat = scenarioStatMap[scenario.id] ?? "insight";
  const statValue = save.currentStats[keyStat];
  const traitIds = scenarioTraitMap[scenario.id] ?? [];
  const matchedTrait = save.destiny.traits.find((trait) => traitIds.includes(trait.id));
  const statUnlocked = statValue >= getStatThreshold(scenario.order);

  if (!matchedTrait && !statUnlocked) {
    return null;
  }

  const copy = hiddenChoiceCopy[scenario.id] ?? {
    label: `${scenario.title}另查一线`,
    description: `你避开眼前争执，先查与${scenario.title}有关的账册、证人和旧物。`
  };
  const unlockText = matchedTrait ? `凭「${matchedTrait.name}」解锁` : `${statNames[keyStat]}达标解锁`;
  const label = copy.label;
  const description = copy.description;

  return {
    id: `${scenario.id}-hidden-route`,
    label,
    description,
    requiredAttribute: keyStat,
    riskLevel: matchedTrait ? "fate" : "risky",
    relatedStatus: inferHiddenStatus(scenario.id),
    effects: buildHiddenEffects(keyStat, scenario.order),
    stateEffects: buildHiddenStateEffects(scenario.order),
    traitInteractions: matchedTrait
      ? [{ traitId: matchedTrait.id, checkBonus: 5, failureGrace: 4, label: unlockText }]
      : [{ tag: getStatTag(keyStat), checkBonus: 3, failureGrace: 2, label: unlockText }],
    routeEffect: unlockText,
    resultTexts: buildHiddenResultTexts(scenario, label)
  };
}

function getStatThreshold(order: number) {
  if (order <= 5) return 68;
  if (order <= 10) return 72;
  if (order <= 15) return 76;
  return 80;
}

function buildHiddenEffects(keyStat: StatKey, order: number) {
  const gain = order <= 10 ? 7 : order <= 15 ? 8 : 9;
  return {
    [keyStat]: gain,
    luck: keyStat === "luck" ? gain : 2
  };
}

function buildHiddenStateEffects(order: number) {
  if (order <= 8) {
    return { reputation: 4, bonds: 3, pressure: 2 };
  }
  if (order <= 15) {
    return { reputation: 6, assets: 5, pressure: 4 };
  }
  return { reputation: 8, assets: 6, bonds: 4, pressure: -2 };
}

function inferHiddenStatus(scenarioId: string) {
  if (/wealth|startup|city|career|fate|final/.test(scenarioId)) return "assets";
  if (/love|patron|friend|family|counter/.test(scenarioId)) return "bonds";
  return "reputation";
}

function getStatTag(keyStat: StatKey) {
  if (keyStat === "wealth") return "wealth";
  if (keyStat === "luck") return "turnaround";
  if (keyStat === "courage") return "risk";
  if (keyStat === "mind") return "growth";
  return "insight";
}

function buildHiddenResultTexts(
  scenario: LifeScenario,
  label: string
) {
  const story = optimizedHiddenStoryTexts[scenario.id] ?? hiddenStoryTexts[scenario.id];
  const prefix = `【${scenario.title}】你选择「${label}」。`;

  if (story) {
    return {
      greatSuccess: `${prefix}${story.greatSuccess}`,
      success: `${prefix}${story.success}`,
      partialFail: `${prefix}${story.partialFail}`,
      fail: `${prefix}${story.fail}`,
      criticalFail: `${prefix}${story.criticalFail}`
    };
  }

  return {
    greatSuccess: `${prefix}你补齐证据、账目和证人，当前难题被当场压住，还额外留下一份可用凭据。`,
    success: `${prefix}你抓住关键证据，把当前难题处理干净，相关的人暂时愿意继续信你。`,
    partialFail: `${prefix}你只拿到半截证据，事情能往下走，但还要补一份账册、担保或证人。`,
    fail: `${prefix}你没拿到能定局的凭据，相关的人开始催促，你必须另找银钱或人情补救。`,
    criticalFail: `${prefix}你查错了人或账，反让对方抢先封口，当前机会关闭，还多添一笔损失。`
  };
}
