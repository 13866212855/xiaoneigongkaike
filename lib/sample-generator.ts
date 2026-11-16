import {
  GeneratedSamples,
  LessonObservationSample,
  OpenClassConfig,
  SeminarRecordSample,
} from '@/types/open-class';
import { parseDateString, parseObserverNames } from './date-utils';

interface SubjectBlueprint {
  key: string;
  warmups: string[];
  coreConcepts: string[];
  activities: string[];
  extensions: string[];
  literacies: string[];
}

const SUBJECT_BLUEPRINTS: Record<string, SubjectBlueprint> = {
  信息技术: {
    key: '信息技术',
    warmups: [
      '通过校园运动会成绩批量统计的生活情境导入，引导学生思考“重复操作如何用代码自动完成”。',
      '展示两组对比代码片段（顺序重复书写 vs 循环自动执行），引发学生认知冲突并揭示课题。',
      '利用趣味图形绘制倒计时动画切入课堂，让学生在直观视觉体验中感受程序循环的效率优势。',
    ],
    coreConcepts: [
      '剖析 for 循环与 while 循环的语法结构、循环变量初值、终止条件及缩进规范',
      '围绕循环控制三要素（初始状态、循环条件、循环体更新）结合流程图进行可视化拆解',
      '对比计数循环与条件循环的适用边界，梳理常见缩进错误与死循环排查思路',
    ],
    activities: [
      '布置三级梯度上机任务：基础累加求和 -> 偶数筛选统计 -> 综合密码验证小项目',
      '组织同桌结对编程调试，教师巡视捕捉典型报错（冒号遗漏、变量未自增）并投屏讲评',
      '开展“代码优化挑战赛”，引导学生在自主编写与互评修改中体会算法简洁性',
    ],
    extensions: [
      '结合生活实际中的智能设备控制案例，引导学生用循环思维设计简易自动化小脚本。',
      '引入嵌套循环的初步思考，为后续多维数据处理与图形阵列绘制做好思维铺垫。',
      '总结循环结构与顺序、分支结构的综合协同，鼓励学生课后完成个性化创意编程练习。',
    ],
    literacies: ['计算思维', '数字化学习与创新', '信息意识', '算法拆解能力'],
  },
  语文: {
    key: '语文',
    warmups: [
      '以与文本时代背景紧密相连的历史影像及名家评述导入，迅速营造沉浸式阅读氛围。',
      '从文章关键细节或题眼切入设疑，激发学生带着问题初读文本、梳理脉络的兴趣。',
      '诵读经典片段并对比不同语气的表达效果，引导学生快速进入作者的情感世界。',
    ],
    coreConcepts: [
      '紧扣核心语段进行精读批注，品味关键字词的炼字精妙与修辞张力',
      '理清叙事/论证逻辑线，剖析人物形象塑造方法与作者深层情感寄托',
      '结合时代语境与写作背景，引导学生由表及里挖掘文本的审美价值与人文底蕴',
    ],
    activities: [
      '开展小组合作品读与角色朗读展示，围绕核心赏析问题进行思维碰撞与观点陈述',
      '采用“圈点勾画+旁批交流”方式，鼓励学生自主发现语言亮点并规范组织赏析语言',
      '通过对比阅读与句式仿写微练笔，将文本理解有效转化为书面表达能力',
    ],
    extensions: [
      '联系当下生活体验，引导学生在反思与共鸣中深化对主题内涵的理解。',
      '推荐同类主题经典篇目进行课外群文延伸阅读，拓宽学生文学视野。',
      '布置分层读写作业，兼顾基础积累巩固与个性化深度感悟写作。',
    ],
    literacies: ['语言建构与运用', '思维发展与提升', '审美鉴赏与创造', '文化传承与理解'],
  },
  数学: {
    key: '数学',
    warmups: [
      '从生活中的测量与建模实例出发，抽象出本节课要研究的核心数量关系与几何特征。',
      '通过旧知回顾与变式设问架设知识桥梁，自然引出新课题的探究必要性。',
      '借助动态几何/函数图像演示变化规律，让学生直观感知“变与不变”中的数学本质。',
    ],
    coreConcepts: [
      '推导核心定理/公式的来龙去脉，强调条件限制与分类讨论思想的严谨性',
      '以“数形结合”为主线，引导学生从代数表达与图形特征两个维度互相印证',
      '拆解典型例题的审题路径与破题切入点，提炼通性通法而非机械套用模板',
    ],
    activities: [
      '组织学生独立画图演算并上台板演，教师针对易错步骤进行精准追问与规范示范',
      '设计一题多解与变式训练小组讨论，激发学生发散思维与逻辑严密性',
      '借助课堂限时达标检测实时反馈学情，针对薄弱环节当堂点拨纠偏',
    ],
    extensions: [
      '梳理本节知识在知识树中的坐标位置，构建系统化的单元解题策略模型。',
      '设置开放性拓展思考题，引导学有余力的同学探究规律背后的一般性结论。',
      '引导学生用思维导图自主归纳方法要点，养成反思错因的良好学习习惯。',
    ],
    literacies: ['数学抽象', '逻辑推理', '数学建模', '直观想象与运算能力'],
  },
  英语: {
    key: '英语',
    warmups: [
      '通过真实生活短视频及日常交际对话热身，自然激活学生相关主题的词汇图式。',
      '利用头脑风暴与看图预测活动营造全英互动语境，快速调动学生课堂参与积极性。',
      '结合学生熟悉的校园话题进行自由问答，在轻松交流中顺畅过渡到本课核心话题。',
    ],
    coreConcepts: [
      '在语境中呈现并操练重点句型与语法结构，避免孤立讲解规则',
      '围绕语篇结构开展略读抓大意、寻读找细节的分层阅读/听力训练',
      '注重语音语调示范与地道表达辨析，培养学生在真实交际中的得体性',
    ],
    activities: [
      '组织 Pair Work 与小组情景角色扮演，给足学生开口输出与互相评价的时间',
      '设计信息差任务（Information Gap）与思维导图复述，提升综合语言运用能力',
      '开展当堂微写作或口头汇报展示，结合多元评价量表即时给予鼓励与修正',
    ],
    extensions: [
      '融入跨文化交际视角对比中西表达差异，培养学生的文化意识与包容态度。',
      '将课堂话题延伸至课后真实生活实践任务，落实“学用一体”的教学理念。',
      '分层布置巩固与拓展作业，既夯实基础词汇句型又鼓励创意表达。',
    ],
    literacies: ['语言能力', '文化意识', '思维品质', '学习能力'],
  },
  通用: {
    key: '通用',
    warmups: [
      '立足学生生活经验与认知起点创设问题情境，迅速激发求知欲与探索兴趣。',
      '通过新旧知识对比悬念导入，精准定位本节课的核心问题与学习目标。',
      '以直观演示或典型案例激活课堂氛围，引导学生在观察中主动提出研究问题。',
    ],
    coreConcepts: [
      '围绕教学重难点层层递进剖析原理，概念界定清晰准确，逻辑环环相扣',
      '借助板书结构化呈现与多媒体辅助，把抽象规律转化为可视化的认知阶梯',
      '注重知识形成过程的推导与归纳，引导学生知其然更知其所以然',
    ],
    activities: [
      '设计梯度合理的课堂探究与实践任务，兼顾不同层次学生的最近发展区',
      '组织小组合作交流与代表展示汇报，教师适时点拨追问并精准评价反馈',
      '关注课堂生成性资源，对学生出现的典型偏差及时捕捉并转化为教学契机',
    ],
    extensions: [
      '引导学生自主构建本课知识框架，体会知识迁移与实际问题解决的价值。',
      '结合学科育人目标进行适当价值引领，提升课堂教学的厚度与温度。',
      '布置分层弹性课后任务，促使课堂所学向课外实践有效延伸。',
    ],
    literacies: ['学科核心素养', '探究实践能力', '合作交流意识', '迁移应用思维'],
  },
};

function resolveBlueprint(subject: string): SubjectBlueprint {
  const s = subject.trim();
  if (s.includes('信息') || s.includes('计算机') || s.includes('编程') || s.includes('微机')) {
    return SUBJECT_BLUEPRINTS['信息技术'];
  }
  if (s.includes('语文')) return SUBJECT_BLUEPRINTS['语文'];
  if (s.includes('数学')) return SUBJECT_BLUEPRINTS['数学'];
  if (s.includes('英语')) return SUBJECT_BLUEPRINTS['英语'];
  return SUBJECT_BLUEPRINTS['通用'];
}

function cleanTopicName(topic: string): string {
  return topic.trim() || '本课核心内容';
}

interface PerspectiveSpec {
  label: string;
  processBuilder: (
    cfg: OpenClassConfig,
    bp: SubjectBlueprint,
    variantOffset: number
  ) => string;
  opinionBuilder: (
    cfg: OpenClassConfig,
    bp: SubjectBlueprint,
    variantOffset: number
  ) => string;
}

const PERSPECTIVES: PerspectiveSpec[] = [
  {
    label: '教学设计与重难点突破视角',
    processBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const t = cfg.teacher || '授课教师';
      const w = bp.warmups[v % bp.warmups.length];
      const c = bp.coreConcepts[v % bp.coreConcepts.length];
      const a = bp.activities[v % bp.activities.length];
      const e = bp.extensions[v % bp.extensions.length];
      return [
        `一、情境导入，明确目标（约5分钟）`,
        `${t}围绕${topic}展开教学，${w}随后顺势出示本课学习目标，主线清晰。`,
        `【简评】导入切口小而精准，能在短时间内聚焦核心问题，避免冗余铺垫。`,
        ``,
        `二、精讲点拨，突破难点（约15分钟）`,
        `在新授环节，教师${c}。讲解过程中善于用具体实例化解抽象概念，板书条理分明，重点词句标注醒目。`,
        `【简评】教学坡度设置合理，重难点拆解透彻，符合学生循序渐进的认知规律。`,
        ``,
        `三、梯度任务，实践巩固（约15分钟）`,
        `教师${a}学生动手操作与思考时间充裕，课堂巡视指导具有针对性。`,
        `【简评】任务设计有层次感，能有效兼顾基础薄弱学生与学优生的不同需求。`,
        ``,
        `四、归纳小结，拓展延伸（约5分钟）`,
        `${t}引导学生自主梳理知识脉络，并${e}`,
        `【简评】课堂收束有力，结构完整，首尾呼应，达成预设教学目标。`,
      ].join('\n');
    },
    opinionBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const lit = bp.literacies[v % bp.literacies.length];
      return `优点：本节${cfg.subject}公开课围绕${topic}展开，教学目标定位准确，重难点突出，教学环节过渡自然紧凑，体现出扎实教学设计功底与对教材的深度把握，有效培养了学生的${lit}。板书工整有逻辑，时间分配科学。\n建议：在第三环节高阶任务拓展时，可适当预留更多学生跨组互评与深度反思的时间，进一步放大优秀生成性成果的示范效应。综合评价：优秀。`;
    },
  },
  {
    label: '学生主体与课堂互动视角',
    processBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const t = cfg.teacher || '授课教师';
      const w = bp.warmups[(v + 1) % bp.warmups.length];
      const c = bp.coreConcepts[(v + 1) % bp.coreConcepts.length];
      const a = bp.activities[(v + 1) % bp.activities.length];
      const e = bp.extensions[(v + 1) % bp.extensions.length];
      return [
        `一、问题驱动，唤醒参与（约6分钟）`,
        `课伊始，${t}结合${topic}${w}学生注意力迅速集中，举手发言踊跃，课堂氛围民主活跃。`,
        `【简评】教师亲和力强，能用高质量驱动性问题点燃学生探究热情。`,
        ``,
        `二、合作探究，思维碰撞（约14分钟）`,
        `教师不急于直接给出结论，而是${c}。通过师生对话与生生互问，引导学生在试错与辨析中自行得出关键结论。`,
        `【简评】充分体现“教师主导、学生主体”理念，有效避免单向灌输。`,
        ``,
        `三、互动展示，即时反馈（约15分钟）`,
        `练习阶段，教师${a}对于课堂上出现的典型疑惑，能巧妙转化成全班共研的契机。`,
        `【简评】对课堂动态生成捕捉敏锐，评价语言具体且富有激励性。`,
        ``,
        `四、自主盘点，迁移应用（约5分钟）`,
        `学生代表尝试总结本课收获，教师补充提炼并${e}`,
        `【简评】把梳理权交给学生，真正实现了知识内化与课堂留白。`,
      ].join('\n');
    },
    opinionBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const lit = bp.literacies[(v + 1) % bp.literacies.length];
      return `优点：整堂课气氛融洽而富有张力，${cfg.teacher}教态自然大方、语言富有感染力，能围绕${topic}充分调动学生主动思考与合作探究的积极性，提问面向全体且注重追问深度，在互动中切实落地${lit}。\n建议：小组讨论环节中个别性格内向同学参与度仍可再提升，建议明确组内分工（如记录员、汇报员）并增加随机抽查比例，让课堂关注面覆盖到每一位学生。综合评价：优秀。`;
    },
  },
  {
    label: '核心素养与学科思维视角',
    processBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const t = cfg.teacher || '授课教师';
      const w = bp.warmups[(v + 2) % bp.warmups.length];
      const c = bp.coreConcepts[(v + 2) % bp.coreConcepts.length];
      const a = bp.activities[(v + 2) % bp.activities.length];
      const e = bp.extensions[(v + 2) % bp.extensions.length];
      return [
        `一、真实语境，素养启蒙（约5分钟）`,
        `围绕${topic}，${t}${w}将学科知识与现实生活紧密联结，让学生体悟“学以致用”的意义。`,
        `【简评】立足大单元与生活化视角设计导入，立意高远而不空泛。`,
        ``,
        `二、深挖本质，建构思维（约16分钟）`,
        `在核心知识推进中，教师${c}。不仅关注操作步骤或表层结论，更着力引导学生在规律背后感悟学科思想方法。`,
        `【简评】注重思维可视化与方法迁移，体现了高阶思维培养意识。`,
        ``,
        `三、综合实践，创意生成（约14分钟）`,
        `紧接着，教师${a}学生在解决真实问题过程中展现出良好的综合素养与创新意识。`,
        `【简评】活动紧扣课标要求，实现知识传授与能力培养的有机融合。`,
        ``,
        `四、价值升华，长效延伸（约5分钟）`,
        `临近下课，${t}回扣开篇情境完成闭环，并${e}`,
        `【简评】不仅授人以鱼，更注重授人以渔，育人导向鲜明。`,
      ].join('\n');
    },
    opinionBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const lit = bp.literacies[(v + 2) % bp.literacies.length];
      return `优点：本课紧扣新课标精神，围绕${topic}精准落实${cfg.subject}核心素养（特别是${lit}）。教学内容处理具有系统性与前瞻性，不仅讲清了“怎么做”，更讲透了“为什么这么设计”，多媒体资源与板书辅助恰到好处，课堂效率极高。\n建议：在归纳方法模型后，可再补充一道贴近乡土或校园实际的开放式微任务作为课后延伸，进一步增强学生的持续探究兴趣与综合实践能力。综合评价：优秀。`;
    },
  },
  {
    label: '教学基本功与课堂节奏视角',
    processBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const t = cfg.teacher || '授课教师';
      const w = bp.warmups[v % bp.warmups.length];
      const c = bp.coreConcepts[(v + 2) % bp.coreConcepts.length];
      const a = bp.activities[(v + 1) % bp.activities.length];
      const e = bp.extensions[(v + 1) % bp.extensions.length];
      return [
        `一、精准导入，迅速入课（约4分钟）`,
        `${t}仪态端庄，普通话标准流利，针对${topic}${w}开篇节奏明快，毫无拖沓之感。`,
        `【简评】教师教学基本功扎实，指令清晰简洁，把控课堂开局能力强。`,
        ``,
        `二、稳扎稳打，讲练结合（约16分钟）`,
        `进入主干内容后，教师${c}。边讲边练、讲评穿插，板书设计与课件呈现相得益彰。`,
        `【简评】教学节奏张弛有度，重难点处刻意放慢语速并辅以停顿思考，极富教学智慧。`,
        ``,
        `四、分层推进，当堂达标（约15分钟）`,
        `练习反馈环节，教师${a}全体学生基本完成核心达标任务，课堂有效度高。`,
        `【简评】学情反馈及时，纠偏到位，真正落实“堂堂清”要求。`,
        ``,
        `五、简明收尾，布置分层（约5分钟）`,
        `${t}梳理核心要点并${e}`,
        `【简评】时间分配严丝合缝，收尾干脆利落，整节课呈现成熟教师的稳健风范。`,
      ].join('\n');
    },
    opinionBuilder: (cfg, bp, v) => {
      const topic = cleanTopicName(cfg.topic);
      const lit = bp.literacies[(v + 3) % bp.literacies.length];
      return `优点：${cfg.teacher}展现出深厚的教学基本功与娴熟的课堂驾驭能力，围绕${topic}授课思路清晰、语言精炼规范、板书布局美观。各环节耗时分配极其合理，注重即时检测与分层指导，有效促进了学生${lit}的稳步提升。\n建议：在课件信息量较为密集的片段，可适当留出几秒钟“静默笔记时间”，帮助基础稍弱的学生同步完成思维记录与消化。综合评价：优秀。`;
    },
  },
];

export function generateLocalSamples(
  config: OpenClassConfig,
  variationSeed = 0
): GeneratedSamples {
  const bp = resolveBlueprint(config.subject);
  const count = Math.max(1, Math.min(10, Number(config.observerCount) || 3));
  const names = parseObserverNames(config.observerNamesText);

  const observations: LessonObservationSample[] = [];
  for (let i = 0; i < count; i++) {
    const spec = PERSPECTIVES[(i + variationSeed) % PERSPECTIVES.length];
    observations.push({
      id: `obs-sample-${i}-${variationSeed}`,
      observerIndex: i,
      observerLabel: spec.label,
      teachingProcess: spec.processBuilder(config, bp, i + variationSeed),
      evaluationOpinion: spec.opinionBuilder(config, bp, i + variationSeed),
    });
  }

  const parsedDate = parseDateString(config.classDate);
  const topic = cleanTopicName(config.topic);
  const teacher = config.teacher || '授课教师';
  const subject = config.subject || '学科';

  const speaker1 = names[0] || '王老师';
  const speaker2 = names[1] || '李老师';
  const speaker3 = names[2] || '陈老师';

  const seminarContent = [
    `一、活动概况`,
    `${parsedDate.formattedCN}${config.period}第${config.lessonNo}节，${subject}教研组全体教师在${config.location}集中观摩了${teacher}执教的校内公开课${topic}；课后立即前往${config.seminarLocation}开展专题评课研讨活动。`,
    ``,
    `二、授课教师说课与教学反思`,
    `${teacher}阐述设计意图：本节课立足新课标对${subject}核心素养的要求，针对${topic}的重难点设计了“情境导入—探究建构—分层实践—迁移总结”四步教学主线。从课堂实施看，绝大多数学生能够紧跟教学节奏完成学习任务，但在高阶变式拓展环节的时间预留与个别学困生点对点指导方面仍有进一步优化空间。`,
    ``,
    `三、教研组成员评课发言`,
    `1.${speaker1}（教学设计维度）：本节课结构紧凑、主线鲜明，${bp.warmups[variationSeed % bp.warmups.length]}重难点突破方法得当，问题链设计层层递进，是一节高质量的示范课。`,
    `2.${speaker2}（课堂互动维度）：课堂上充分体现学生主体地位，教师提问富有启发性，能敏锐捕捉学生课堂生成并及时给予正向反馈；建议小组合作时可进一步细化分工，让每位学生都有表达与展示机会。`,
    `3.${speaker3}（核心素养维度）：教学立意贴合学科育人目标，注重${bp.literacies[0]}与${bp.literacies[1]}的真实落地，板书条理清晰、基本功扎实；后续可适当增加生活化拓展任务，强化知识迁移能力。`,
    ``,
    `四、教研组长总结`,
    `教研组长对本次公开课予以充分肯定，认为${teacher}备课充分、课堂实效性强，达到了以研促教、互学共进的预期目的。希望全组教师以此次公开课为契机，持续深耕课堂细节，共同提升${subject}教研组整体教学质量。`,
  ].join('\n');

  const seminar: SeminarRecordSample = {
    id: `seminar-sample-${variationSeed}`,
    content: seminarContent,
  };

  return {
    source: 'local',
    observations,
    seminar,
  };
}
