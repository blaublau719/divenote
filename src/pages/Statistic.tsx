import { useMemo, useRef, useState } from 'react'
import {
  loadData,
  deleteApneaSession,
  deleteDiveSession,
  updateApneaSession,
  updateDiveSession,
  exportJson,
  importJson,
} from '../data/storage'
import type { ApneaSession, DiveSession } from '../data/types'
import { pad, fmtDur, diveSpeed } from '../data/format'
import { IconTrash, IconExport, IconImport, IconPencil } from '../components/icons'
import ApneaEditForm from '../components/ApneaEditForm'
import DiveEditForm from '../components/DiveEditForm'

const localKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const POSTURE: Record<string, string> = { sit: 'Sit', stand: 'Stand', lie: 'Lie' }
const SOUND: Record<string, string> = { waves: 'Waves', rain: 'Rain', none: 'None' }
const END_REASON: Record<string, string> = {
  firstContraction: 'First contraction',
  breathingUrge: 'Breathing urge',
  hypoxia: 'Low oxygen',
  other: 'Other',
}

type DayRecords = { apnea: ApneaSession[]; dive: DiveSession[] }

/** Statistic tab — a month calendar marking apnea (green) / dive (blue) days. */
export default function Statistic() {
  const [data, setData] = useState(() => loadData())
  const today = useMemo(() => new Date(), [])
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [selected, setSelected] = useState<string | null>(localKey(today))
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `divenote-backup-${localKey(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // reset so the same file can be re-imported later
    if (!file) return
    try {
      const text = await file.text()
      setData(importJson(text))
      window.alert('Backup imported.')
    } catch {
      window.alert('Could not read this file. Make sure it is a Divenote backup.')
    }
  }

  function removeApnea(id: string) {
    if (!window.confirm('Delete this apnea record?')) return
    setData(deleteApneaSession(id))
  }
  function removeDive(id: string) {
    if (!window.confirm('Delete this dive record?')) return
    setData(deleteDiveSession(id))
  }
  function saveApnea(id: string, patch: Partial<Omit<ApneaSession, 'id'>>) {
    setData(updateApneaSession(id, patch))
    setEditingId(null)
  }
  function saveDive(id: string, patch: Partial<Omit<DiveSession, 'id'>>) {
    setData(updateDiveSession(id, patch))
    setEditingId(null)
  }

  // group every session under its local day key
  const byDay = useMemo(() => {
    const map = new Map<string, DayRecords>()
    const get = (k: string) => {
      let v = map.get(k)
      if (!v) { v = { apnea: [], dive: [] }; map.set(k, v) }
      return v
    }
    for (const a of data.apneaSessions) get(localKey(new Date(a.date))).apnea.push(a)
    for (const d of data.diveSessions) get(d.date.slice(0, 10)).dive.push(d)
    return map
  }, [data])

  const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const todayKey = localKey(today)

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  function selectDay(key: string) {
    setSelected(key)
    setEditingId(null)
  }

  const sel = selected ? byDay.get(selected) : undefined

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Statistic</h1>
          <p className="page-sub">Your training calendar</p>
        </div>
        <div className="header-actions">
          <button
            className="header-action"
            onClick={handleExport}
            aria-label="Export backup"
            title="Export backup"
          >
            <IconExport />
          </button>
          <button
            className="header-action"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Import backup"
            title="Import backup"
          >
            <IconImport />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            hidden
          />
        </div>
      </header>

      <div className="card cal">
        <div className="cal-nav">
          <button className="cal-arrow" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
          <span className="cal-title">{MONTHS[view.m]} {view.y}</span>
          <button className="cal-arrow" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
        </div>

        <div className="cal-grid">
          {WEEKDAYS.map((w) => (
            <span key={w} className="cal-weekday">{w}</span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={`e${i}`} className="cal-day is-empty" />
            const key = `${view.y}-${pad(view.m + 1)}-${pad(day)}`
            const rec = byDay.get(key)
            const hasA = !!rec?.apnea.length
            const hasD = !!rec?.dive.length
            // single type sits in the top row (near the date); both fill both rows
            const topClass = hasA ? 'seg-apnea' : hasD ? 'seg-dive' : 'is-off'
            const botClass = hasA && hasD ? 'seg-dive' : 'is-off'
            const cls =
              'cal-day' +
              (key === todayKey ? ' is-today' : '') +
              (key === selected ? ' is-selected' : '')
            return (
              <button key={key} className={cls} onClick={() => selectDay(key)}>
                <span className="cal-num">{day}</span>
                <span className="cal-bar">
                  <span className={'bar-seg ' + topClass} />
                  <span className={'bar-seg ' + botClass} />
                </span>
              </button>
            )
          })}
        </div>

        <div className="cal-legend">
          <span><span className="dot dot-apnea" /> Apnea</span>
          <span><span className="dot dot-dive" /> Dive</span>
        </div>
      </div>

      <div className="day-detail">
        {!sel || (!sel.apnea.length && !sel.dive.length) ? (
          <p className="detail-empty">
            {selected ? 'No training logged on this day.' : 'Select a day to see its records.'}
          </p>
        ) : (
          <>
            {sel.apnea.map((a) =>
              editingId === a.id ? (
                <ApneaEditForm
                  key={a.id}
                  session={a}
                  onSave={(patch) => saveApnea(a.id, patch)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="rec-card" key={a.id}>
                  <div className="rec-head">
                    <span className="rec-tag tag-apnea">Apnea</span>
                    <div className="rec-head-right">
                      <span className="rec-headline">{fmtDur(a.durationSec)}</span>
                      <button className="rec-act" aria-label="Edit record" onClick={() => setEditingId(a.id)}>
                        <IconPencil />
                      </button>
                      <button className="rec-act rec-del" aria-label="Delete record" onClick={() => removeApnea(a.id)}>
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                  <div className="rec-row"><span>Posture</span><span>{POSTURE[a.posture]}</span></div>
                  <div className="rec-row"><span>Soundscape</span><span>{SOUND[a.sound]}</span></div>
                  <div className="rec-row">
                    <span>Contractions</span>
                    <span>{a.contractionAtSec != null ? fmtDur(a.contractionAtSec) : '—'}</span>
                  </div>
                  <div className="rec-row">
                    <span>Struggle</span>
                    <span>{a.struggleAtSec != null ? fmtDur(a.struggleAtSec) : '—'}</span>
                  </div>
                  <div className="rec-row"><span>Stopped</span><span>{END_REASON[a.endReason]}</span></div>
                  {a.comment && <p className="rec-note">{a.comment}</p>}
                </div>
              ),
            )}
            {sel.dive.map((d) =>
              editingId === d.id ? (
                <DiveEditForm
                  key={d.id}
                  session={d}
                  onSave={(patch) => saveDive(d.id, patch)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="rec-card" key={d.id}>
                  <div className="rec-head">
                    <span className="rec-tag tag-dive">{d.discipline}</span>
                    <div className="rec-head-right">
                      <span className="rec-headline">{d.depth.toFixed(1)} m</span>
                      <button className="rec-act" aria-label="Edit record" onClick={() => setEditingId(d.id)}>
                        <IconPencil />
                      </button>
                      <button className="rec-act rec-del" aria-label="Delete record" onClick={() => removeDive(d.id)}>
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                  <div className="rec-row">
                    <span>Dive time</span>
                    <span>{d.durationSec != null ? fmtDur(d.durationSec) : '—'}</span>
                  </div>
                  {(() => {
                    const v = diveSpeed(d.depth, d.durationSec)
                    return v != null ? (
                      <div className="rec-row"><span>Speed</span><span>{v.toFixed(2)} m/s</span></div>
                    ) : null
                  })()}
                  {d.comment && <p className="rec-note">{d.comment}</p>}
                </div>
              ),
            )}
          </>
        )}
      </div>
    </div>
  )
}
