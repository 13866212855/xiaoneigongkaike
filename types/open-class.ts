export type DayPeriod = '上午' | '下午';

export interface OpenClassConfig {
  schoolFullName: string;
  noticeShortName: string;
  subject: string;
  teacher: string;
  topic: string;
  classDate: string; // YYYY-MM-DD
  period: DayPeriod;
  lessonNo: string;
  location: string;
  noticeDate: string; // YYYY-MM-DD
  seminarLocation: string;
  observerCount: number;
  observerNamesText: string; // comma-separated optional names
  includeBlank: boolean;
  includeSample: boolean;
}

export interface ProcessStep {
  stage: string;
  content: string;
  comment: string;
}

export interface LessonObservationSample {
  id: string;
  observerIndex: number;
  observerLabel: string; // e.g. "教学设计与结构视角"
  teachingProcess: string; // formatted multi-section text for editable A4 cell
  evaluationOpinion: string;
}

export interface SeminarRecordSample {
  id: string;
  content: string; // complete formatted text for seminar record cell
}

export interface GeneratedSamples {
  source: 'local' | 'ai';
  observations: LessonObservationSample[];
  seminar: SeminarRecordSample;
}

export type DocFilterTab = 'all' | 'notice' | 'seminar' | 'observation';
