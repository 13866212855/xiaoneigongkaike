'use client';

import React, { useMemo, useState } from 'react';
import {
  FileText,
  Printer,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { parseObserverNames, subtractDays } from '@/lib/date-utils';
import { generateLocalSamples } from '@/lib/sample-generator';
import { exportDocumentsToWord } from '@/lib/word-export';
import {
  DocFilterTab,
  GeneratedSamples,
  OpenClassConfig,
} from '@/types/open-class';
import {
  NoticeSheet,
  ObservationRecordSheet,
  SeminarRecordSheet,
} from './A4Documents';
import { ConfigSidebar } from './ConfigSidebar';

const DEFAULT_CLASS_DATE = '2026-11-18';

const INITIAL_CONFIG: OpenClassConfig = {
  schoolFullName: '颍上县耿棚中学',
  noticeShortName: '耿棚中学',
  subject: '信息技术',
  teacher: '张老师',
  topic: '《Python循环结构的应用》',
  classDate: DEFAULT_CLASS_DATE,
  period: '上午',
  lessonNo: '2',
  location: '八年级(1)班 / 多媒体教室',
  noticeDate: subtractDays(DEFAULT_CLASS_DATE, 2),
  seminarLocation: '教研组办公室',
  observerCount: 3,
  observerNamesText: '',
  includeBlank: true,
  includeSample: true,
};

interface SheetEntry {
  key: string;
  category: Exclude<DocFilterTab, 'all'>;
  label: string;
  element: React.ReactNode;
}

export function OpenClassWorkspace() {
  const [config, setConfig] = useState<OpenClassConfig>(INITIAL_CONFIG);
  const [variationSeed, setVariationSeed] = useState<number>(0);
  const [aiSamples, setAiSamples] = useState<GeneratedSamples | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<DocFilterTab>('all');
  const [zoom, setZoom] = useState<number>(0.8);

  // User manual edits keyed cleanly by index/section so contenteditable survives edits
  const [editedSeminar, setEditedSeminar] = useState<string | null>(null);
  const [editedProcesses, setEditedProcesses] = useState<Record<number, string>>({});
  const [editedOpinions, setEditedOpinions] = useState<Record<number, string>>({});

  // Compute active samples: if AI samples exist and count matches, use them; otherwise instant local smart templates
  const baseSamples = useMemo(() => {
    const local = generateLocalSamples(config, variationSeed);
    if (aiSamples && aiSamples.observations.length === config.observerCount) {
      return aiSamples;
    }
    if (aiSamples && aiSamples.observations.length > 0) {
      // Merge AI samples up to available count and pad with local if count increased
      const mergedObs = Array.from({ length: config.observerCount }, (_, idx) => {
        return aiSamples.observations[idx] ?? local.observations[idx];
      });
      return {
        source: aiSamples.source,
        observations: mergedObs,
        seminar: aiSamples.seminar,
      } satisfies GeneratedSamples;
    }
    return local;
  }, [config, variationSeed, aiSamples]);

  const handleConfigChange = (
    updater: (prev: OpenClassConfig) => OpenClassConfig
  ) => {
    setConfig((prev) => {
      const next = updater(prev);
      // If core topic/subject changed, clear stale AI override & manual edits so template stays coherent
      if (
        next.subject !== prev.subject ||
        next.topic !== prev.topic ||
        next.teacher !== prev.teacher
      ) {
        setAiSamples(null);
        setEditedSeminar(null);
        setEditedProcesses({});
        setEditedOpinions({});
      }
      return next;
    });
  };

  const handleRegenerateSamples = async () => {
    setIsGenerating(true);
    setStatusNotice(null);
    const nextSeed = variationSeed + 1;

    try {
      const res = await fetch('/api/generate-samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          variationSeed: nextSeed,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || '服务端生成未就绪');
      }

      const data = (await res.json()) as GeneratedSamples;
      setAiSamples(data);
      setVariationSeed(nextSeed);
      setEditedSeminar(null);
      setEditedProcesses({});
      setEditedOpinions({});
      setStatusNotice({
        type: 'success',
        message: `已重新生成 ${config.observerCount} 套差异化听课实录与教研记录样例`,
      });
    } catch {
      // Graceful fallback to next local differentiated template set
      setAiSamples(null);
      setVariationSeed(nextSeed);
      setEditedSeminar(null);
      setEditedProcesses({});
      setEditedOpinions({});
      setStatusNotice({
        type: 'info',
        message: `已切换至第 ${nextSeed + 1} 组差异化教研模板话术`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    exportDocumentsToWord(config, baseSamples, {
      seminarSample: editedSeminar ?? undefined,
      obsProcesses: editedProcesses,
      obsOpinions: editedOpinions,
    });
  };

  const observerNames = useMemo(
    () => parseObserverNames(config.observerNamesText),
    [config.observerNamesText]
  );
  const observerCount = Math.max(1, Math.min(10, Number(config.observerCount) || 3));

  const allSheets: SheetEntry[] = useMemo(() => {
    const list: SheetEntry[] = [];

    // 1. 公开课开课通知 (1页)
    list.push({
      key: 'notice-1',
      category: 'notice',
      label: '公开课开课通知',
      element: <NoticeSheet config={config} />,
    });

    // 2. 教研活动记录表 (空白表 + 样例表)
    if (config.includeBlank) {
      list.push({
        key: 'seminar-blank',
        category: 'seminar',
        label: '教研活动记录表（空白表）',
        element: (
          <SeminarRecordSheet
            config={config}
            isSample={false}
            sampleContent=""
          />
        ),
      });
    }
    if (config.includeSample) {
      const content = editedSeminar ?? baseSamples.seminar.content;
      list.push({
        key: `seminar-sample-${variationSeed}`,
        category: 'seminar',
        label: '教研活动记录表（填写样例 · 可直接编辑）',
        element: (
          <SeminarRecordSheet
            config={config}
            isSample
            sampleContent={content}
            onUpdateContent={(val) => setEditedSeminar(val)}
          />
        ),
      });
    }

    // 3. 听课记录 (N份空白表 + N份差异化样例)
    if (config.includeBlank) {
      for (let i = 0; i < observerCount; i++) {
        const observerName = observerNames[i] || '';
        list.push({
          key: `obs-blank-${i}`,
          category: 'observation',
          label: `听课记录（空白表 ${i + 1}/${observerCount}${
            observerName ? ` · ${observerName}` : ''
          }）`,
          element: (
            <ObservationRecordSheet
              config={config}
              observerName={observerName}
              isSample={false}
              teachingProcess=""
              evaluationOpinion=""
            />
          ),
        });
      }
    }

    if (config.includeSample) {
      for (let i = 0; i < observerCount; i++) {
        const obs = baseSamples.observations[i];
        const observerName = observerNames[i] || '';
        const processVal = editedProcesses[i] ?? obs?.teachingProcess ?? '';
        const opinionVal = editedOpinions[i] ?? obs?.evaluationOpinion ?? '';
        list.push({
          key: `obs-sample-${i}-${variationSeed}-${baseSamples.source}`,
          category: 'observation',
          label: `听课记录（抄写样例 ${i + 1}/${observerCount} · ${
            obs?.observerLabel || '差异化视角'
          }${observerName ? ` · ${observerName}` : ''}）`,
          element: (
            <ObservationRecordSheet
              config={config}
              observerName={observerName}
              isSample
              teachingProcess={processVal}
              evaluationOpinion={opinionVal}
              onUpdateProcess={(val) =>
                setEditedProcesses((prev) => ({ ...prev, [i]: val }))
              }
              onUpdateOpinion={(val) =>
                setEditedOpinions((prev) => ({ ...prev, [i]: val }))
              }
            />
          ),
        });
      }
    }

    return list;
  }, [
    config,
    baseSamples,
    observerCount,
    observerNames,
    variationSeed,
    editedSeminar,
    editedProcesses,
    editedOpinions,
  ]);

  const noticePages = 1;
  const seminarPages = (config.includeBlank ? 1 : 0) + (config.includeSample ? 1 : 0);
  const observationPages =
    ((config.includeBlank ? 1 : 0) + (config.includeSample ? 1 : 0)) * observerCount;

  // A4 dimensions in px at 96dpi for smooth scaled container wrapper
  const A4_WIDTH_PX = 793.7; // 210mm
  const A4_HEIGHT_PX = 1122.5; // 297mm

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Bar (3-zone contract, hidden when printing) */}
      <header className="no-print h-14 px-4 lg:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 lg:gap-8 sticky top-0 z-30">
        {/* Zone 1: Brand Title */}
        <div className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          公开课材料工作台
        </div>

        {/* Zone 2: Interactive Category Filter Links */}
        <nav
          aria-label="材料分类视图"
          className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
        >
          {(
            [
              { id: 'all', label: `全部材料 (${allSheets.length})` },
              { id: 'notice', label: '开课通知 (1)' },
              { id: 'seminar', label: `教研记录 (${seminarPages})` },
              { id: 'observation', label: `听课记录 (${observationPages})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Operations */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRegenerateSamples}
            disabled={isGenerating || !config.includeSample}
            className="h-9 px-3 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`}
            />
            <span>{isGenerating ? '正在生成...' : '重新生成差异化样例'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportWord}
            className="h-9 px-3 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>导出Word文档 (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-9 px-3.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>一键A4打印全部材料</span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row print-reset-container">
        <ConfigSidebar
          config={config}
          onChange={handleConfigChange}
          totalPages={allSheets.length}
          noticePages={noticePages}
          seminarPages={seminarPages}
          observationPages={observationPages}
        />

        {/* Right Preview Viewport */}
        <main className="flex-1 lg:h-[calc(100vh-56px)] lg:overflow-y-auto bg-slate-200/75 print-reset-container">
          {/* Preview Utility Bar */}
          <div className="no-print sticky top-0 z-20 px-5 py-2.5 bg-slate-200/90 backdrop-blur-sm border-b border-slate-300/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span>A4 实时排版预览</span>
              <span aria-hidden="true">·</span>
              <span>点击样例正文可直接编辑修改</span>
              {statusNotice && (
                <>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      statusNotice.type === 'error'
                        ? 'text-red-700'
                        : 'text-slate-900'
                    }`}
                  >
                    {statusNotice.type === 'error' ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {statusNotice.message}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Mobile Tab Switcher */}
              <select
                aria-label="筛选材料类型"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as DocFilterTab)}
                className="md:hidden h-7 px-2 text-xs bg-white border border-slate-300 rounded text-slate-800"
              >
                <option value="all">全部 ({allSheets.length})</option>
                <option value="notice">开课通知 (1)</option>
                <option value="seminar">教研记录 ({seminarPages})</option>
                <option value="observation">听课记录 ({observationPages})</option>
              </select>

              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(1))))}
                aria-label="缩小预览"
                className="h-7 w-7 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-11 text-center text-xs font-mono-tabular text-slate-700">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.1, Number((z + 0.1).toFixed(1))))}
                aria-label="放大预览"
                className="h-7 w-7 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* A4 Paper Stack */}
          <div className="py-8 px-4 flex flex-col items-center gap-8 print-reset-container">
            {allSheets.map((sheet, index) => {
              const isVisible =
                activeTab === 'all' || sheet.category === activeTab;
              return (
                <motion.div
                  key={sheet.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`${
                    isVisible ? 'flex' : 'hidden'
                  } flex-col items-center print-sheet-wrapper`}
                >
                  {/* Clean unboxed page caption (screen only) */}
                  <div
                    className="no-print mb-2 flex items-center justify-between text-xs text-slate-600"
                    style={{ width: `${A4_WIDTH_PX * zoom}px` }}
                  >
                    <span className="font-medium text-slate-800">
                      第 <span className="font-mono-tabular">{index + 1}</span> 页 ·{' '}
                      {sheet.label}
                    </span>
                    <span className="font-mono-tabular text-slate-500">
                      210 × 297 mm
                    </span>
                  </div>

                  {/* Scaled wrapper matching exact transformed footprint */}
                  <div
                    className="print-box-reset"
                    style={{
                      width: `${A4_WIDTH_PX * zoom}px`,
                      height: `${A4_HEIGHT_PX * zoom}px`,
                    }}
                  >
                    <div
                      className="shadow-md border border-slate-300/80 print-scale-reset origin-top-left"
                      style={{
                        width: '210mm',
                        height: '297mm',
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      {sheet.element}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
