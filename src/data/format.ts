// Small shared helpers for numbers the user types or reads (depth, mm:ss).

export const pad = (n: number) => String(n).padStart(2, '0')

/** 83 → "01:23" */
export const fmtDur = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`

/**
 * Parse a depth typed by the user. Accepts "," as well as "." as the decimal
 * separator (iOS shows a comma key on many locales) and rounds to one decimal.
 * Returns null when the text is not a positive number.
 */
export function parseDepth(text: string): number | null {
  const t = text.trim().replace(',', '.')
  if (!/^\d*\.?\d*$/.test(t) || t === '' || t === '.') return null
  const n = parseFloat(t)
  if (Number.isNaN(n) || n <= 0) return null
  return Math.round(n * 10) / 10
}

/** Keep only digits and a single separator with at most one decimal digit while typing. */
export function sanitizeDepthInput(text: string): string {
  let t = text.replace(/[^\d.,]/g, '').replace(',', '.')
  const i = t.indexOf('.')
  if (i !== -1) t = t.slice(0, i + 1) + t.slice(i + 1).replace(/\./g, '').slice(0, 1)
  return t
}

/**
 * Average dive speed in m/s: the dive covers depth down and back up
 * (depth * 2) in durationSec. Null when no usable time is recorded.
 */
export function diveSpeed(depth: number, durationSec: number | null | undefined): number | null {
  if (durationSec == null || durationSec <= 0 || depth <= 0) return null
  return Math.round(((depth * 2) / durationSec) * 100) / 100
}

/** Local calendar day of a Date as "yyyy-mm-dd". */
export function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Move an ISO datetime to another local calendar day ("yyyy-mm-dd"),
 * keeping its time of day. Returns the original when the day text is invalid.
 */
export function moveIsoToDay(iso: string, day: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
  if (!m) return iso
  const d = new Date(iso)
  d.setFullYear(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return d.toISOString()
}

/** Split seconds into { min, sec } strings for two-field editing ("" when null). */
export function splitDur(sec: number | null | undefined): { min: string; sec: string } {
  if (sec == null) return { min: '', sec: '' }
  return { min: String(Math.floor(sec / 60)), sec: String(sec % 60) }
}

/** Join two-field min/sec text back into seconds; null when both are empty. */
export function joinDur(min: string, sec: string): number | null {
  if (min.trim() === '' && sec.trim() === '') return null
  const m = parseInt(min || '0', 10)
  const s = parseInt(sec || '0', 10)
  if (Number.isNaN(m) || Number.isNaN(s)) return null
  return m * 60 + s
}
