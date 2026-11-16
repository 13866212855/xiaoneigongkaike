export interface ParsedDateParts {
  year: string;
  month: string;
  day: string;
  weekday: string; // 一, 二, 三, 四, 五, 六, 日
  formattedDot: string; // e.g. 2026.11.18
  formattedCN: string; // e.g. 2026年11月18日
}

const WEEKDAY_CHARS = ['日', '一', '二', '三', '四', '五', '六'];

export function parseDateString(dateStr: string): ParsedDateParts {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return {
      year: '2026',
      month: '11',
      day: '18',
      weekday: '三',
      formattedDot: '2026.11.18',
      formattedCN: '2026年11月18日',
    };
  }
  const [yStr, mStr, dStr] = dateStr.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  const dt = new Date(y, m - 1, d);
  const weekday = WEEKDAY_CHARS[dt.getDay()] ?? '一';

  return {
    year: yStr,
    month: String(m),
    day: String(d),
    weekday,
    formattedDot: `${yStr}.${m}.${d}`,
    formattedCN: `${yStr}年${m}月${d}日`,
  };
}

export function subtractDays(dateStr: string, days: number): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  const [yStr, mStr, dStr] = dateStr.split('-');
  const dt = new Date(Number(yStr), Number(mStr) - 1, Number(dStr));
  dt.setDate(dt.getDate() - days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function deriveShortSchoolName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return '学校';
  // Strip common county/city/district prefixes such as "XX县" / "XX市" / "XX区"
  const match = trimmed.match(/^(?:.+?[省市区县镇乡])(.+)$/);
  if (match && match[1] && match[1].length >= 2) {
    return match[1];
  }
  return trimmed;
}

export function parseObserverNames(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[,，、;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
