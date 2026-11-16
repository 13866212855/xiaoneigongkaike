import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { parseDateString, parseObserverNames } from '@/lib/date-utils';
import { OpenClassConfig } from '@/types/open-class';

// Unified apihub LLM defaults (server-side only)
const DEFAULT_APIHUB_BASE_URL = 'https://apihub.agnes-ai.com/v1';
const DEFAULT_APIHUB_API_KEY =
  'sk-GUdpKQNIwwJSZQ5mYyrMnuCJBOwSbB73c2N6NcnNfk5LoKyq';
const DEFAULT_APIHUB_MODEL = 'agnes-3.0-flash';

interface GeneratedPayload {
  observations?: Array<{
    observerLabel: string;
    teachingProcess: string;
    evaluationOpinion: string;
  }>;
  seminarContent?: string;
}

function parseJsonResponse(rawText: string): GeneratedPayload {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned) as GeneratedPayload;
}

async function generateWithApihub(prompt: string): Promise<GeneratedPayload> {
  const baseUrl = (
    process.env.LLM_API_BASE || DEFAULT_APIHUB_BASE_URL
  ).replace(/\/+$/, '');
  const apiKey = process.env.LLM_API_KEY || DEFAULT_APIHUB_API_KEY;
  const model = process.env.LLM_MODEL || DEFAULT_APIHUB_MODEL;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            '你是资深中小学高级教师兼教研组长。请严格按用户要求的 JSON 结构输出纯 JSON 对象，不要包含额外解释或 Markdown 代码块以外的字符。',
        },
        {
          role: 'user',
          content: `${prompt}\n\n请严格返回以下 JSON 格式：\n{\n  "observations": [\n    {\n      "observerLabel": "观察侧重视角简短标题",\n      "teachingProcess": "课堂教学过程实录及各环节简评",\n      "evaluationOpinion": "听课意见（优点、建议及综合评价）"\n    }\n  ],\n  "seminarContent": "教研活动记录表的完整研讨过程记录"\n}`,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`APIHub 请求失败 (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? '{}';
  return parseJsonResponse(content);
}

async function generateWithGemini(prompt: string): Promise<GeneratedPayload> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          observations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                observerLabel: {
                  type: Type.STRING,
                  description: '本份听课记录的观察侧重视角简短标题',
                },
                teachingProcess: {
                  type: Type.STRING,
                  description: '课堂教学过程实录及各环节简评',
                },
                evaluationOpinion: {
                  type: Type.STRING,
                  description: '听课意见（优点、建议及综合评价）',
                },
              },
              required: [
                'observerLabel',
                'teachingProcess',
                'evaluationOpinion',
              ],
            },
          },
          seminarContent: {
            type: Type.STRING,
            description: '教研活动记录表的完整研讨过程记录',
          },
        },
        required: ['observations', 'seminarContent'],
      },
    },
  });

  return parseJsonResponse(response.text ?? '{}');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      config: OpenClassConfig;
      variationSeed?: number;
    };

    const config = body?.config;
    if (!config || !config.subject || !config.topic) {
      return NextResponse.json(
        { error: '缺少必要参数（科目或公开课课题）' },
        { status: 400 }
      );
    }

    const observerCount = Math.max(
      1,
      Math.min(10, Number(config.observerCount) || 3)
    );
    const names = parseObserverNames(config.observerNamesText);
    const parsedClassDate = parseDateString(config.classDate);
    const seed = body.variationSeed ?? Date.now();

    const observerNameHint =
      names.length > 0
        ? `听课及评课教师姓名参考：${names.join('、')}。`
        : `听课教师姓名在表格中留空（评课记录中可用“张/王/李/陈老师”等常规称呼）。`;

    const prompt = `
你是一位拥有20年教龄的中学高级教师兼教研组长，正在协助学校整理“教师评高级职称——校内公开课档案材料”。
请根据以下公开课真实信息，生成极具现场感、符合中小学常规教学规范且彼此内容高度差异化的“抄写样例”：

- 学校：${config.schoolFullName}
- 教研组别/科目：${config.subject}
- 授课教师：${config.teacher}
- 公开课课题：${config.topic}
- 开课时间：${parsedClassDate.formattedCN}（星期${parsedClassDate.weekday}）${config.period}第${config.lessonNo}节
- 开课地点：${config.location}
- 评课地点：${config.seminarLocation}
- 需生成的差异化《听课记录》份数：${observerCount} 份
- ${observerNameHint}
- 变体编号（用于切换表述角度）：${seed}

严格要求：
1. 生成恰好 ${observerCount} 份《听课记录》样例（observations 数组长度必须等于 ${observerCount}）。
2. 这 ${observerCount} 份听课记录的内容**绝对不能雷同**：
   - 每份需采用不同的听课观察视角（例如：第1份侧重“教学设计与重难点突破”，第2份侧重“学生主体与课堂互动生成”，第3份侧重“核心素养与思维方法落地”，第4份及以后侧重“课堂节奏把控与分层指导/板书基本功”等），行文句式、用词习惯、关注细节、简评切入点均需明显区分，模拟不同教师独立听课的手写风格。
   - 每份的 teachingProcess 需严格包含清晰分节（如：一、情境导入…… 二、新知探究…… 三、典例/任务实践…… 四、巩固提升…… 五、课堂小结……），每节后附带【简评】，字数控制在 280～360 字左右，刚好适中填满 A4 听课记录表正文框不溢出。
   - 每份的 evaluationOpinion 需包含“优点：…… 建议：…… 综合评价：优秀。”，字数控制在 120～160 字左右，切合该课题真实学科特点。
3. 生成 1 份《教研活动记录表》的研讨过程记录（seminarContent）：
   - 需包含“一、活动概况”、“二、授课教师说课与教学反思”、“三、教研组成员评课发言”（分点列出 2～3 位不同老师从不同维度的具体发言）、“四、教研组长总结”。
   - 总字数控制在 380～460 字左右，行文规范、详实得体，适合 A4 单页教研记录表排版。
4. 纯文本输出，不要使用 Markdown 星号（**）或井号（#）符号，直接用中文标点与换行分段。
`.trim();

    let parsed: GeneratedPayload;
    if (process.env.GEMINI_API_KEY) {
      try {
        parsed = await generateWithGemini(prompt);
      } catch {
        parsed = await generateWithApihub(prompt);
      }
    } else {
      parsed = await generateWithApihub(prompt);
    }

    if (
      !parsed.observations ||
      !Array.isArray(parsed.observations) ||
      parsed.observations.length === 0 ||
      !parsed.seminarContent
    ) {
      throw new Error('模型返回结构不完整');
    }

    const observations = parsed.observations
      .slice(0, observerCount)
      .map((item, idx) => ({
        id: `obs-ai-${idx}-${Date.now()}`,
        observerIndex: idx,
        observerLabel: item.observerLabel || `差异化视角 ${idx + 1}`,
        teachingProcess: item.teachingProcess,
        evaluationOpinion: item.evaluationOpinion,
      }));

    return NextResponse.json({
      source: 'ai',
      observations,
      seminar: {
        id: `seminar-ai-${Date.now()}`,
        content: parsed.seminarContent,
      },
    });
  } catch (err) {
    console.error('Error generating differentiated samples:', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : '生成样例失败',
      },
      { status: 500 }
    );
  }
}
