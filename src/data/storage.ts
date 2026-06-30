import { EMPTY_DATA, type AppData, type ApneaSession, type DiveSession } from './types'

const STORAGE_KEY = 'freedive.appData.v1'

/** Load the whole JSON document from local storage. */
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(EMPTY_DATA)
    const parsed = JSON.parse(raw) as AppData
    return {
      apneaSessions: parsed.apneaSessions ?? [],
      diveSessions: parsed.diveSessions ?? [],
    }
  } catch {
    return structuredClone(EMPTY_DATA)
  }
}

/** Persist the whole JSON document. */
export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function uid(): string {
  // crypto.randomUUID is available in modern Safari/Chrome
  return crypto.randomUUID()
}

export function addApneaSession(session: Omit<ApneaSession, 'id'>): AppData {
  const data = loadData()
  data.apneaSessions.push({ ...session, id: uid() })
  saveData(data)
  return data
}

export function addDiveSession(session: Omit<DiveSession, 'id'>): AppData {
  const data = loadData()
  data.diveSessions.push({ ...session, id: uid() })
  saveData(data)
  return data
}

export function deleteApneaSession(id: string): AppData {
  const data = loadData()
  data.apneaSessions = data.apneaSessions.filter((s) => s.id !== id)
  saveData(data)
  return data
}

export function deleteDiveSession(id: string): AppData {
  const data = loadData()
  data.diveSessions = data.diveSessions.filter((s) => s.id !== id)
  saveData(data)
  return data
}

/** Export everything as a pretty-printed JSON string (for backup). */
export function exportJson(): string {
  return JSON.stringify(loadData(), null, 2)
}

/** Replace all data from an imported JSON string. */
export function importJson(text: string): AppData {
  const parsed = JSON.parse(text) as AppData
  const data: AppData = {
    apneaSessions: parsed.apneaSessions ?? [],
    diveSessions: parsed.diveSessions ?? [],
  }
  saveData(data)
  return data
}
