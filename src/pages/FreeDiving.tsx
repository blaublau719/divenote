import { useState } from 'react'
import type { Discipline } from '../data/types'
import { addDiveSession } from '../data/storage'
import { IconInfo } from '../components/icons'

const DISCIPLINES: Discipline[] = ['DYN', 'DNF', 'CWT', 'CNF', 'FIM']

// AIDA competitive disciplines
const DISCIPLINE_INFO: Record<Discipline, { name: string; desc: string }> = {
  DYN: { name: 'Dynamic With Fins', desc: 'Horizontal distance underwater using fins (monofin or bi-fins).' },
  DNF: { name: 'Dynamic No Fins', desc: 'Horizontal distance underwater without fins.' },
  CWT: { name: 'Constant Weight', desc: 'Down to depth and back with fins, without pulling the line; weight stays constant.' },
  CNF: { name: 'Constant Weight No Fins', desc: 'Down to depth and back without fins and without pulling the line; weight constant.' },
  FIM: { name: 'Free Immersion', desc: 'Down to depth and back by pulling on the line, no fins; weight constant.' },
}

function todayLocal(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** FreeDiving tab — log one dive: date, discipline, depth, and how it felt. */
export default function FreeDiving() {
  const [date, setDate] = useState(todayLocal())
  const [discipline, setDiscipline] = useState<Discipline>('CWT')
  const [depth, setDepth] = useState('')
  const [comment, setComment] = useState('')
  const [saved, setSaved] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const depthNum = parseFloat(depth)
  const valid = !!date && !Number.isNaN(depthNum) && depthNum > 0

  function handleSave() {
    if (!valid) return
    addDiveSession({
      date,
      discipline,
      depth: Math.round(depthNum * 10) / 10, // keep one decimal
      comment: comment.trim(),
    })
    setDepth('')
    setComment('')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Freediving</h1>
        <p className="page-sub">Log a dive</p>
      </header>

      <div className="dive-form">
        <div className="form-field">
          <label className="field-label" htmlFor="dive-date">Date</label>
          <input
            id="dive-date"
            type="date"
            className="input-glass"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <div className="field-label-row">
            <span className="field-label">Discipline</span>
            <button
              className={'info-btn' + (showInfo ? ' is-open' : '')}
              onClick={() => setShowInfo((v) => !v)}
              aria-label="What do these mean?"
            >
              <IconInfo />
            </button>
          </div>

          {showInfo && (
            <div className="info-card">
              {DISCIPLINES.map((d) => (
                <div className="info-row" key={d}>
                  <span className="info-code">{d}</span>
                  <div className="info-text">
                    <span className="info-name">{DISCIPLINE_INFO[d].name}</span>
                    <span className="info-desc">{DISCIPLINE_INFO[d].desc}</span>
                  </div>
                </div>
              ))}
              <p className="info-foot">AIDA competitive disciplines</p>
            </div>
          )}

          <div className="seg seg-5">
            {DISCIPLINES.map((d) => (
              <button
                key={d}
                className={'seg-btn seg-btn-text' + (discipline === d ? ' is-selected' : '')}
                onClick={() => setDiscipline(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="dive-depth">Depth (m)</label>
          <input
            id="dive-depth"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="0.0"
            className="input-glass"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="dive-note">How did it feel?</label>
          <textarea
            id="dive-note"
            className="comment-input"
            placeholder="Notes on this dive…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button className="btn-primary" disabled={!valid} onClick={handleSave}>
          {saved ? 'Saved ✓' : 'Save dive'}
        </button>
      </div>
    </div>
  )
}
