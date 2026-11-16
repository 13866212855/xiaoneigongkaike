'use client';

import React from 'react';
import { DayPeriod, OpenClassConfig } from '@/types/open-class';
import { parseDateString, subtractDays } from '@/lib/date-utils';

interface ConfigSidebarProps {
  config: OpenClassConfig;
  onChange: (updater: (prev: OpenClassConfig) => OpenClassConfig) => void;
  totalPages: number;
  noticePages: number;
  seminarPages: number;
  observationPages: number;
}

export function ConfigSidebar({
  config,
  onChange,
  totalPages,
  noticePages,
  seminarPages,
  observationPages,
}: ConfigSidebarProps) {
  const parsedClassDate = parseDateString(config.classDate);
  const parsedNoticeDate = parseDateString(config.noticeDate);

  const handleField = <K extends keyof OpenClassConfig>(
    key: K,
    value: OpenClassConfig[K]
  ) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  const handleClassDateChange = (nextDate: string) => {
    onChange((prev) => {
      const prevAutoNotice = subtractDays(prev.classDate, 2);
      const shouldSyncNotice = prev.noticeDate === prevAutoNotice;
      return {
        ...prev,
        classDate: nextDate,
        noticeDate: shouldSyncNotice ? subtractDays(nextDate, 2) : prev.noticeDate,
      };
    });
  };

  return (
    <aside className="no-print w-full lg:w-[368px] xl:w-[388px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col lg:h-[calc(100vh-56px)] lg:overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Section 1: 基本教学信息 */}
        <section className="space-y-3.5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              01. 公开课基本信息
            </h2>
            <span className="text-xs text-slate-500">同步至全套表头</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label
                htmlFor="schoolFullName"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                学校全称
              </label>
              <input
                id="schoolFullName"
                type="text"
                value={config.schoolFullName}
                onChange={(e) => handleField('schoolFullName', e.target.value)}
                placeholder="例如：颍上县耿棚中学"
                className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="noticeShortName"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  通知标题简称
                </label>
                <input
                  id="noticeShortName"
                  type="text"
                  value={config.noticeShortName}
                  onChange={(e) => handleField('noticeShortName', e.target.value)}
                  placeholder="例如：耿棚中学"
                  className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  教研组别 / 科目
                </label>
                <input
                  id="subject"
                  type="text"
                  value={config.subject}
                  onChange={(e) => handleField('subject', e.target.value)}
                  placeholder="例如：信息技术"
                  className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label
                  htmlFor="teacher"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  授课教师
                </label>
                <input
                  id="teacher"
                  type="text"
                  value={config.teacher}
                  onChange={(e) => handleField('teacher', e.target.value)}
                  placeholder="例如：张老师"
                  className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="topic"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  公开课课题
                </label>
                <input
                  id="topic"
                  type="text"
                  value={config.topic}
                  onChange={(e) => handleField('topic', e.target.value)}
                  placeholder="例如：《Python循环结构的应用》"
                  className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200/80" />

        {/* Section 2: 时间与地点安排 */}
        <section className="space-y-3.5">
          <h2 className="text-sm font-semibold text-slate-900">
            02. 开课与研讨安排
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="classDate"
                  className="text-xs font-medium text-slate-700"
                >
                  开课日期
                </label>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  星期{parsedClassDate.weekday}
                </span>
              </div>
              <input
                id="classDate"
                type="date"
                value={config.classDate}
                onChange={(e) => handleClassDateChange(e.target.value)}
                className="w-full h-9 px-3 text-sm font-mono-tabular bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="period"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  开课时间段
                </label>
                <select
                  id="period"
                  value={config.period}
                  onChange={(e) =>
                    handleField('period', e.target.value as DayPeriod)
                  }
                  className="w-full h-9 px-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                >
                  <option value="上午">上午</option>
                  <option value="下午">下午</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="lessonNo"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  节次（第几节）
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-slate-500 pointer-events-none">
                    第
                  </span>
                  <input
                    id="lessonNo"
                    type="text"
                    value={config.lessonNo}
                    onChange={(e) => handleField('lessonNo', e.target.value)}
                    className="w-full h-9 pl-7 pr-7 text-sm text-center font-mono-tabular bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                  />
                  <span className="absolute right-3 text-xs text-slate-500 pointer-events-none">
                    节
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                开课地点（班级 / 教室）
              </label>
              <input
                id="location"
                type="text"
                value={config.location}
                onChange={(e) => handleField('location', e.target.value)}
                placeholder="例如：八年级(1)班 / 多媒体教室"
                className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="noticeDate"
                    className="text-xs font-medium text-slate-700"
                  >
                    通知落款日期
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleField('noticeDate', subtractDays(config.classDate, 2))
                    }
                    className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2 whitespace-nowrap shrink-0"
                    title="重置为开课前2天"
                  >
                    提前2天
                  </button>
                </div>
                <input
                  id="noticeDate"
                  type="date"
                  value={config.noticeDate}
                  onChange={(e) => handleField('noticeDate', e.target.value)}
                  aria-label={`通知落款日期 ${parsedNoticeDate.formattedCN}`}
                  className="w-full h-9 px-2.5 text-sm font-mono-tabular bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="seminarLocation"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  研讨（评课）地点
                </label>
                <input
                  id="seminarLocation"
                  type="text"
                  value={config.seminarLocation}
                  onChange={(e) => handleField('seminarLocation', e.target.value)}
                  placeholder="例如：教研组办公室"
                  className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200/80" />

        {/* Section 3: 听课份数与打印模式 */}
        <section className="space-y-3.5">
          <h2 className="text-sm font-semibold text-slate-900">
            03. 听课份数与打印模式
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label
                  htmlFor="observerCount"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  听课人数 (N)
                </label>
                <input
                  id="observerCount"
                  type="number"
                  min={1}
                  max={10}
                  value={config.observerCount}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(10, Number(e.target.value) || 1));
                    handleField('observerCount', val);
                  }}
                  className="w-full h-9 px-3 text-sm font-mono-tabular bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="observerNamesText"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  听课教师姓名（选填）
                </label>
                <input
                  id="observerNamesText"
                  type="text"
                  value={config.observerNamesText}
                  onChange={(e) => handleField('observerNamesText', e.target.value)}
                  placeholder="逗号分隔，留空则供手写"
                  className="w-full h-9 px-3 text-sm bg-slate-50/70 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.includeBlank}
                  onChange={(e) => handleField('includeBlank', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs leading-relaxed text-slate-800">
                  <span className="font-medium text-slate-900">
                    包含待填写的【空白表】
                  </span>
                  <span className="block text-slate-500">
                    已填好表头基础信息，过程与意见栏留空供教师手写
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.includeSample}
                  onChange={(e) => handleField('includeSample', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs leading-relaxed text-slate-800">
                  <span className="font-medium text-slate-900">
                    包含供老师抄写的【填写样例】
                  </span>
                  <span className="block text-slate-500">
                    自动生成 {config.observerCount} 套差异化听课实录与完整教研记录，点击预览区文字可直接修改
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200/80" />

        {/* Section 4: A4页数清单 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>开课通知</span>
            <span className="font-mono-tabular text-slate-800">{noticePages} 页</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>教研活动记录表</span>
            <span className="font-mono-tabular text-slate-800">{seminarPages} 页</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>听课记录表</span>
            <span className="font-mono-tabular text-slate-800">{observationPages} 页</span>
          </div>
          <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-slate-900">
            <span>合计打印 / 导出</span>
            <span className="font-mono-tabular">共 {totalPages} 页 A4</span>
          </div>
        </section>
      </div>
    </aside>
  );
}
