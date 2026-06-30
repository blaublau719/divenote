import { useMemo, useState } from 'react'
import { loadData, deleteApneaSession, deleteDiveSession } from '../data/storage'
import type { ApneaSession, DiveSession } from '../data/types'
import { IconTrash } from '../components/icons'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtDur = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
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

  function removeApnea(id: string) {
    if (!window.confirm('Delete this apnea record?')) return
    setData(deleteApneaSession(id))
  }
  function removeDive(id: string) {
    if (!window.confirm('Delete this dive record?')) return
    setData(deleteDiveSession(id))
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

  const sel = selected ? byDay.get(selected) : undefined

  return (
    <div className="page">
      <header className="page-header">
        <h1>Statistic</h1>
        <p className="page-sub">Your training calendar</p>
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
              <button key={key} className={cls} onClick={() => setSelected(key)}>
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
            {sel.apnea.map((a) => (
              <div className="rec-card" key={a.id}>
                <div className="rec-head">
                  <span className="rec-tag tag-apnea">Apnea</span>
                  <div className="rec-head-right">
                    <span className="rec-headline">{fmtDur(a.durationSec)}</span>
                    <button className="rec-del" aria-label="Delete record" onClick={() => removeApnea(a.id)}>
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
            ))}
            {sel.dive.map((d) => (
              <div className="rec-card" key={d.id}>
                <div className="rec-head">
                  <span className="rec-tag tag-dive">{d.discipline}</span>
                  <div className="rec-head-right">
                    <span className="rec-headline">{d.depth.toFixed(1)} m</span>
                    <button className="rec-del" aria-label="Delete record" onClick={() => removeDive(d.id)}>
                      <IconTrash />
                    </button>
                  </div>
                </div>
                {d.comment && <p className="rec-note">{d.comment}</p>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
