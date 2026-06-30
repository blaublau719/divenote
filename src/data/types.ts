// The shape of the single JSON document that holds all app data.
// Stored locally (no database). Persisted in the browser and exportable as a .json file.

export type Posture = 'sit' | 'stand' | 'lie'
export type Sound = 'waves' | 'rain' | 'none'
export type ApneaEndReason = 'firstContraction' | 'breathingUrge' | 'hypoxia' | 'other'
export type Discipline = 'DYN' | 'DNF' | 'CWT' | 'CNF' | 'FIM'

export interface ApneaSession {
  id: string
  /** ISO datetime when the hold finished */
  date: string
  posture: Posture
  sound: Sound
  /** total breath-hold duration in seconds */
  durationSec: number
  /** seconds into the hold when "contractions" began, or null if never tapped */
  contractionAtSec: number | null
  /** seconds into the hold when "struggle" began, or null if never tapped */
  struggleAtSec: number | null
  endReason: ApneaEndReason
  comment: string
}

export interface DiveSession {
  id: string
  /** ISO date (yyyy-mm-dd) the dive was performed */
  date: string
  discipline: Discipline
  /** depth in metres, one decimal place */
  depth: number
  comment: string
}

export interface AppData {
  apneaSessions: ApneaSession[]
  diveSessions: DiveSession[]
}

export const EMPTY_DATA: AppData = {
  apneaSessions: [],
  diveSessions: [],
}
