'use client';

import React, { useEffect, useRef } from 'react';
import { parseDateString } from '@/lib/date-utils';
import { OpenClassConfig } from '@/types/open-class';

interface EditableBlockProps {
  value: string;
  onChange?: (nextVal: string) => void;
  editable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

function EditableBlock({
  value,
  onChange,
  editable = false,
  className = '',
  style,
}: EditableBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  if (!editable) {
    return (
      <div className={className} style={style}>
        {value}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.innerText;
        if (onChange && text !== value) {
          onChange(text);
        }
      }}
      className={`doc-editable ${className}`}
      style={style}
    />
  );
}

interface NoticeSheetProps {
  config: OpenClassConfig;
}

export function NoticeSheet({ config }: NoticeSheetProps) {
  const classDate = parseDateString(config.classDate);
  const noticeDate = parseDateString(config.noticeDate);
  const shortSchool = config.noticeShortName.trim() || config.schoolFullName;
  const periodChar = config.period === '下午' ? '下' : '上';

  return (
    <div className="a4-sheet doc-simsun">
      <div style={{ paddingTop: '10mm' }}>
        {/* 标题：居中，二号宋体加粗，下方空两行 */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '22pt',
            fontWeight: 700,
            lineHeight: 1.4,
            margin: 0,
            color: '#000',
          }}
        >
          {shortSchool}公开课开课通知
        </h1>

        <div style={{ height: '32pt' }} aria-hidden="true" />

        {/* 抬头：左对齐，三号宋体，带下划线 */}
        <p
          style={{
            textAlign: 'left',
            fontSize: '16pt',
            lineHeight: 1.8,
            margin: '0 0 6pt 0',
          }}
        >
          <u
            style={{
              padding: '0 10px',
              textUnderlineOffset: '4px',
              textDecorationThickness: '1px',
            }}
          >
            {config.subject || '　　'}
          </u>
          教研组：
        </p>

        {/* 正文：首行缩进2字符，三号宋体，行距2倍 */}
        <p
          style={{
            textIndent: '2em',
            fontSize: '16pt',
            lineHeight: 2,
            textAlign: 'justify',
            margin: 0,
          }}
        >
          为了促进教学质量的提高，提升科任教师的教学业务水平，为科任教师提供相互学习交流的平台，决定于{' '}
          <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
            {classDate.year}
          </u>{' '}
          年{' '}
          <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
            {classDate.month}
          </u>{' '}
          月{' '}
          <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
            {classDate.day}
          </u>{' '}
          日（星期
          <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
            {classDate.weekday}
          </u>
          ）
          <u style={{ padding: '0 4px', textUnderlineOffset: '4px' }}>
            {periodChar}
          </u>
          午，第{' '}
          <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
            {config.lessonNo || ' '}
          </u>{' '}
          节课，在{' '}
          <u style={{ padding: '0 8px', textUnderlineOffset: '4px' }}>
            {config.location || '　　'}
          </u>
          ，由{' '}
          <u style={{ padding: '0 8px', textUnderlineOffset: '4px' }}>
            {config.teacher || '　　'}
          </u>{' '}
          教师进行公开课教学，课题为：
          <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
            {config.topic || '　　'}
          </u>
          。请相关组别教师按时参加，并做好记录；听课结束后教研组做好评课活动，形成教研活动文字材料。
        </p>

        {/* 正文下方空4行 */}
        <div style={{ height: '96pt' }} aria-hidden="true" />

        {/* 落款：右对齐，三号宋体 */}
        <div
          style={{
            textAlign: 'right',
            fontSize: '16pt',
            lineHeight: 1.9,
          }}
        >
          <p style={{ margin: 0 }}>{config.schoolFullName} 教务处</p>
          <p style={{ margin: 0 }}>
            <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
              {noticeDate.year}
            </u>{' '}
            年{' '}
            <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
              {noticeDate.month}
            </u>{' '}
            月{' '}
            <u style={{ padding: '0 6px', textUnderlineOffset: '4px' }}>
              {noticeDate.day}
            </u>{' '}
            日
          </p>
        </div>
      </div>
    </div>
  );
}

interface SeminarRecordSheetProps {
  config: OpenClassConfig;
  isSample: boolean;
  sampleContent: string;
  onUpdateContent?: (nextText: string) => void;
}

export function SeminarRecordSheet({
  config,
  isSample,
  sampleContent,
  onUpdateContent,
}: SeminarRecordSheetProps) {
  const classDate = parseDateString(config.classDate);

  const cellBase: React.CSSProperties = {
    border: '1px solid #000000',
    padding: '7px 10px',
    fontSize: '11.5pt',
    lineHeight: 1.45,
    color: '#000000',
  };

  return (
    <div className="a4-sheet doc-simsun">
      {/* 标题：居中，二号宋体 */}
      <h2
        style={{
          textAlign: 'center',
          fontSize: '22pt',
          fontWeight: 700,
          lineHeight: 1.35,
          margin: '0 0 12pt 0',
          color: '#000',
        }}
      >
        {config.schoolFullName}教研活动记录表
      </h2>

      {/* 表格结构：宽100%，边框1px solid #000，总高度撑满剩余空间 */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          flex: 1,
        }}
      >
        <colgroup>
          <col style={{ width: '18%' }} />
          <col style={{ width: '32%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '32%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              研讨主题
            </td>
            <td style={{ ...cellBase, textAlign: 'left' }}>
              {config.topic}公开课评课研讨
            </td>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              教研组别
            </td>
            <td style={{ ...cellBase, textAlign: 'left' }}>
              {config.subject}教研组
            </td>
          </tr>
          <tr>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              研讨时间
            </td>
            <td style={{ ...cellBase, textAlign: 'left' }}>
              {classDate.formattedCN}
            </td>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              研讨地点
            </td>
            <td style={{ ...cellBase, textAlign: 'left' }}>
              {config.seminarLocation}
            </td>
          </tr>
          <tr>
            <td
              style={{
                ...cellBase,
                textAlign: 'center',
                fontWeight: 700,
                height: '80px',
                verticalAlign: 'middle',
              }}
            >
              参加人员
              <br />
              （签名）
            </td>
            <td
              colSpan={3}
              style={{
                ...cellBase,
                height: '80px',
                verticalAlign: 'middle',
              }}
            >
              {' '}
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              style={{
                ...cellBase,
                textAlign: 'center',
                fontWeight: 700,
                padding: '6px 10px',
              }}
            >
              研讨过程记录
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              style={{
                ...cellBase,
                height: '520px',
                verticalAlign: 'top',
                padding: '12px 14px',
              }}
            >
              {isSample ? (
                <EditableBlock
                  value={sampleContent}
                  onChange={onUpdateContent}
                  editable
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '11pt',
                    lineHeight: 1.62,
                    minHeight: '496px',
                  }}
                />
              ) : (
                <div style={{ minHeight: '496px' }} />
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 底部签名：表格外部右下方，右对齐 */}
      <div
        style={{
          textAlign: 'right',
          fontSize: '12pt',
          marginTop: '10pt',
          lineHeight: 1.5,
        }}
      >
        教研组长（签名）：_______________
      </div>
    </div>
  );
}

interface ObservationRecordSheetProps {
  config: OpenClassConfig;
  observerName?: string;
  isSample: boolean;
  teachingProcess: string;
  evaluationOpinion: string;
  onUpdateProcess?: (nextText: string) => void;
  onUpdateOpinion?: (nextText: string) => void;
}

export function ObservationRecordSheet({
  config,
  observerName = '',
  isSample,
  teachingProcess,
  evaluationOpinion,
  onUpdateProcess,
  onUpdateOpinion,
}: ObservationRecordSheetProps) {
  const classDate = parseDateString(config.classDate);

  const cellBase: React.CSSProperties = {
    border: '1px solid #000000',
    padding: '5px 8px',
    fontSize: '11pt',
    lineHeight: 1.4,
    color: '#000000',
  };

  return (
    <div className="a4-sheet doc-simsun">
      {/* 标题：居中，一号宋体，字间距加宽 */}
      <h2
        style={{
          textAlign: 'center',
          fontSize: '26pt',
          fontWeight: 700,
          letterSpacing: '0.38em',
          paddingLeft: '0.38em',
          lineHeight: 1.25,
          margin: '0 0 10pt 0',
          color: '#000',
        }}
      >
        听 课 记 录
      </h2>

      {/* Excel 风格 6 列紧凑网格 */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          flex: 1,
        }}
      >
        <colgroup>
          <col style={{ width: '11%' }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '21%' }} />
        </colgroup>
        <tbody>
          {/* 第1行 */}
          <tr>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              时间
            </td>
            <td style={{ ...cellBase, textAlign: 'center' }}>
              {classDate.formattedCN}
            </td>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              学校
            </td>
            <td colSpan={3} style={{ ...cellBase, textAlign: 'left' }}>
              {config.schoolFullName}
            </td>
          </tr>

          {/* 第2行 */}
          <tr>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              班级
            </td>
            <td style={{ ...cellBase, textAlign: 'center' }}>
              {config.location}
            </td>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              科目
            </td>
            <td style={{ ...cellBase, textAlign: 'center' }}>
              {config.subject}
            </td>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              听课人
            </td>
            <td style={{ ...cellBase, textAlign: 'center' }}>
              {observerName}
            </td>
          </tr>

          {/* 第3行 */}
          <tr>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              课题
            </td>
            <td colSpan={3} style={{ ...cellBase, textAlign: 'left' }}>
              {config.topic}
            </td>
            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 700 }}>
              授课人
            </td>
            <td style={{ ...cellBase, textAlign: 'center' }}>
              {config.teacher}
            </td>
          </tr>

          {/* 第4行 */}
          <tr>
            <td
              colSpan={6}
              style={{
                ...cellBase,
                textAlign: 'center',
                fontWeight: 700,
                letterSpacing: '0.5em',
                paddingLeft: 'calc(8px + 0.5em)',
                paddingTop: '6px',
                paddingBottom: '6px',
              }}
            >
              教 学 过 程
            </td>
          </tr>

          {/* 第5行：教学过程大框（约460px） */}
          <tr>
            <td
              colSpan={6}
              style={{
                ...cellBase,
                height: '465px',
                verticalAlign: 'top',
                padding: '10px 12px',
              }}
            >
              {isSample ? (
                <EditableBlock
                  value={teachingProcess}
                  onChange={onUpdateProcess}
                  editable
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '10.5pt',
                    lineHeight: 1.5,
                    minHeight: '445px',
                  }}
                />
              ) : (
                <div style={{ minHeight: '445px' }} />
              )}
            </td>
          </tr>

          {/* 第6行：听课意见（左侧竖排居中 + 右侧5列合并） */}
          <tr>
            <td
              style={{
                ...cellBase,
                textAlign: 'center',
                fontWeight: 700,
                height: '165px',
                verticalAlign: 'middle',
                lineHeight: 1.65,
              }}
            >
              听
              <br />
              课
              <br />
              意
              <br />
              见
            </td>
            <td
              colSpan={5}
              style={{
                ...cellBase,
                height: '165px',
                verticalAlign: 'top',
                padding: '10px 12px',
              }}
            >
              {isSample ? (
                <EditableBlock
                  value={evaluationOpinion}
                  onChange={onUpdateOpinion}
                  editable
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '10.5pt',
                    lineHeight: 1.55,
                    minHeight: '145px',
                  }}
                />
              ) : (
                <div style={{ minHeight: '145px' }} />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
