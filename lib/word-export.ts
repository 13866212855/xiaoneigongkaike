import {
  GeneratedSamples,
  OpenClassConfig,
} from '@/types/open-class';
import { parseDateString, parseObserverNames } from './date-utils';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function textToWordParagraphs(text: string, fontSizePt = 10.5, lineHeight = 1.45): string {
  if (!text.trim()) return '&nbsp;';
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trimEnd();
      if (!trimmed) {
        return `<p style="margin:0;padding:0;line-height:0.6;">&nbsp;</p>`;
      }
      return `<p style="margin:0 0 3pt 0;font-family:SimSun,'宋体',serif;font-size:${fontSizePt}pt;line-height:${lineHeight};">${escapeHtml(trimmed)}</p>`;
    })
    .join('');
}

export function exportDocumentsToWord(
  config: OpenClassConfig,
  samples: GeneratedSamples,
  domEditedMap?: {
    seminarSample?: string;
    obsProcesses?: Record<number, string>;
    obsOpinions?: Record<number, string>;
  }
) {
  const classDate = parseDateString(config.classDate);
  const noticeDate = parseDateString(config.noticeDate);
  const observerNames = parseObserverNames(config.observerNamesText);
  const observerCount = Math.max(1, Math.min(10, Number(config.observerCount) || 3));
  const periodChar = config.period === '下午' ? '下' : '上';
  const shortSchool = config.noticeShortName.trim() || config.schoolFullName;

  const pages: string[] = [];

  // 材料1：公开课开课通知
  const noticeHtml = `
    <div class="word-page">
      <div style="padding-top:14pt;">
        <p style="text-align:center;font-family:SimSun,'宋体',serif;font-size:22pt;font-weight:bold;margin:0;line-height:1.4;">
          ${escapeHtml(shortSchool)}公开课开课通知
        </p>
        <p style="margin:0;font-size:16pt;line-height:1.5;">&nbsp;</p>
        <p style="margin:0;font-size:16pt;line-height:1.5;">&nbsp;</p>
        <p style="text-align:left;font-family:SimSun,'宋体',serif;font-size:16pt;margin:0 0 8pt 0;line-height:1.8;">
          <span style="text-decoration:underline;">&nbsp;&nbsp;${escapeHtml(config.subject)}&nbsp;&nbsp;</span>教研组：
        </p>
        <p style="text-indent:2em;font-family:SimSun,'宋体',serif;font-size:16pt;line-height:2.0;text-align:justify;margin:0;">
          为了促进教学质量的提高，提升科任教师的教学业务水平，为科任教师提供相互学习交流的平台，决定于
          <u>&nbsp;${escapeHtml(classDate.year)}&nbsp;</u>年
          <u>&nbsp;${escapeHtml(classDate.month)}&nbsp;</u>月
          <u>&nbsp;${escapeHtml(classDate.day)}&nbsp;</u>日（星期<u>&nbsp;${escapeHtml(classDate.weekday)}&nbsp;</u>）<u>${periodChar}</u>午，第
          <u>&nbsp;${escapeHtml(config.lessonNo)}&nbsp;</u>节课，在
          <u>&nbsp;${escapeHtml(config.location)}&nbsp;</u>，由
          <u>&nbsp;${escapeHtml(config.teacher)}&nbsp;</u>教师进行公开课教学，课题为：<u>${escapeHtml(config.topic)}</u>。请相关组别教师按时参加，并做好记录；听课结束后教研组做好评课活动，形成教研活动文字材料。
        </p>
        <p style="margin:0;font-size:16pt;line-height:1.8;">&nbsp;</p>
        <p style="margin:0;font-size:16pt;line-height:1.8;">&nbsp;</p>
        <p style="margin:0;font-size:16pt;line-height:1.8;">&nbsp;</p>
        <p style="margin:0;font-size:16pt;line-height:1.8;">&nbsp;</p>
        <p style="text-align:right;font-family:SimSun,'宋体',serif;font-size:16pt;line-height:1.8;margin:0;">
          ${escapeHtml(config.schoolFullName)} 教务处
        </p>
        <p style="text-align:right;font-family:SimSun,'宋体',serif;font-size:16pt;line-height:1.8;margin:0;">
          <u>&nbsp;${escapeHtml(noticeDate.year)}&nbsp;</u>年
          <u>&nbsp;${escapeHtml(noticeDate.month)}&nbsp;</u>月
          <u>&nbsp;${escapeHtml(noticeDate.day)}&nbsp;</u>日
        </p>
      </div>
    </div>
  `;
  pages.push(noticeHtml);

  // 材料2：教研活动记录表 builder
  const buildSeminarPage = (isSample: boolean) => {
    const contentText = isSample
      ? domEditedMap?.seminarSample ?? samples.seminar.content
      : '';
    return `
      <div class="word-page">
        <p style="text-align:center;font-family:SimSun,'宋体',serif;font-size:22pt;font-weight:bold;margin:0 0 12pt 0;line-height:1.3;">
          ${escapeHtml(config.schoolFullName)}教研活动记录表
        </p>
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-family:SimSun,'宋体',serif;font-size:11.5pt;">
          <colgroup>
            <col style="width:18%;" />
            <col style="width:32%;" />
            <col style="width:18%;" />
            <col style="width:32%;" />
          </colgroup>
          <tr>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:center;font-weight:bold;">研讨主题</td>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:left;">${escapeHtml(config.topic)}公开课评课研讨</td>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:center;font-weight:bold;">教研组别</td>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:left;">${escapeHtml(config.subject)}教研组</td>
          </tr>
          <tr>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:center;font-weight:bold;">研讨时间</td>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:left;">${escapeHtml(classDate.formattedCN)}</td>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:center;font-weight:bold;">研讨地点</td>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:left;">${escapeHtml(config.seminarLocation)}</td>
          </tr>
          <tr>
            <td style="border:1px solid #000;padding:8pt 6pt;text-align:center;font-weight:bold;height:60pt;vertical-align:middle;">参加人员<br/>（签名）</td>
            <td colspan="3" style="border:1px solid #000;padding:8pt 6pt;height:60pt;vertical-align:middle;">&nbsp;</td>
          </tr>
          <tr>
            <td colspan="4" style="border:1px solid #000;padding:7pt 6pt;text-align:center;font-weight:bold;">研讨过程记录</td>
          </tr>
          <tr>
            <td colspan="4" style="border:1px solid #000;padding:10pt 12pt;height:400pt;vertical-align:top;">
              ${isSample ? textToWordParagraphs(contentText, 11, 1.5) : '&nbsp;'}
            </td>
          </tr>
        </table>
        <p style="text-align:right;font-family:SimSun,'宋体',serif;font-size:12pt;margin:10pt 0 0 0;">
          教研组长（签名）：_______________
        </p>
      </div>
    `;
  };

  if (config.includeBlank) pages.push(buildSeminarPage(false));
  if (config.includeSample) pages.push(buildSeminarPage(true));

  // 材料3：听课记录 builder
  const buildObservationPage = (idx: number, isSample: boolean) => {
    const sample = samples.observations[idx];
    const observerName = observerNames[idx] || '';
    const processText = isSample
      ? domEditedMap?.obsProcesses?.[idx] ?? sample?.teachingProcess ?? ''
      : '';
    const opinionText = isSample
      ? domEditedMap?.obsOpinions?.[idx] ?? sample?.evaluationOpinion ?? ''
      : '';

    return `
      <div class="word-page">
        <p style="text-align:center;font-family:SimSun,'宋体',serif;font-size:26pt;font-weight:bold;letter-spacing:8pt;margin:0 0 10pt 0;line-height:1.25;">
          听 课 记 录
        </p>
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-family:SimSun,'宋体',serif;font-size:11pt;">
          <colgroup>
            <col style="width:11%;" />
            <col style="width:24%;" />
            <col style="width:11%;" />
            <col style="width:20%;" />
            <col style="width:13%;" />
            <col style="width:21%;" />
          </colgroup>
          <tr>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">时间</td>
            <td style="border:1px solid #000;padding:6pt 6pt;text-align:center;">${escapeHtml(classDate.formattedCN)}</td>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">学校</td>
            <td colspan="3" style="border:1px solid #000;padding:6pt 6pt;text-align:left;">${escapeHtml(config.schoolFullName)}</td>
          </tr>
          <tr>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">班级</td>
            <td style="border:1px solid #000;padding:6pt 6pt;text-align:center;">${escapeHtml(config.location)}</td>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">科目</td>
            <td style="border:1px solid #000;padding:6pt 6pt;text-align:center;">${escapeHtml(config.subject)}</td>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">听课人</td>
            <td style="border:1px solid #000;padding:6pt 6pt;text-align:center;">${escapeHtml(observerName)}</td>
          </tr>
          <tr>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">课题</td>
            <td colspan="3" style="border:1px solid #000;padding:6pt 6pt;text-align:left;">${escapeHtml(config.topic)}</td>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;">授课人</td>
            <td style="border:1px solid #000;padding:6pt 6pt;text-align:center;">${escapeHtml(config.teacher)}</td>
          </tr>
          <tr>
            <td colspan="6" style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;letter-spacing:6pt;">
              教 学 过 程
            </td>
          </tr>
          <tr>
            <td colspan="6" style="border:1px solid #000;padding:8pt 10pt;height:360pt;vertical-align:top;">
              ${isSample ? textToWordParagraphs(processText, 10.5, 1.4) : '&nbsp;'}
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #000;padding:6pt 4pt;text-align:center;font-weight:bold;height:125pt;vertical-align:middle;line-height:1.5;">
              听<br/>课<br/>意<br/>见
            </td>
            <td colspan="5" style="border:1px solid #000;padding:8pt 10pt;height:125pt;vertical-align:top;">
              ${isSample ? textToWordParagraphs(opinionText, 10.5, 1.45) : '&nbsp;'}
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  if (config.includeBlank) {
    for (let i = 0; i < observerCount; i++) {
      pages.push(buildObservationPage(i, false));
    }
  }
  if (config.includeSample) {
    for (let i = 0; i < observerCount; i++) {
      pages.push(buildObservationPage(i, true));
    }
  }

  const joinedPages = pages.join(
    '\n<br clear="all" style="page-break-before:always;mso-special-character:line-break;" />\n'
  );

  const wordDocument = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(shortSchool)}公开课评职称全套材料</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: 210mm 297mm;
      margin: 18mm 20mm 18mm 20mm;
      mso-header-margin: 10mm;
      mso-footer-margin: 10mm;
      mso-paper-source: 0;
    }
    div.WordSection1 {
      page: WordSection1;
    }
    body {
      font-family: SimSun, "宋体", serif;
      color: #000000;
    }
  </style>
</head>
<body>
  <div class="WordSection1">
    ${joinedPages}
  </div>
</body>
</html>
  `.trim();

  const blob = new Blob(['\ufeff', wordDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileName = `${shortSchool}_${config.subject}_${config.teacher}_公开课材料(${pages.length}页).doc`.replace(
    /[\\/:*?"<>|]/g,
    '_'
  );
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
