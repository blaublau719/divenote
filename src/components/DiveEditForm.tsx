import { useState } from 'react'
import type { Discipline, DiveSession } from '../data/types'
import { parseDepth, sanitizeDepthInput, splitDur, joinDur } from '../data/format'
import { IconCheck, IconClose } from './icons'
import DurationInput from './DurationInput'

const DISCIPLINES: Discipline[] = ['DNF', 'DYN', 'FIM', 'CWT', 'CNF']

interface Props {
  session: DiveSession
  onSave: (patch: Partial<Omit<DiveSession, 'id'>>) => void
  onCancel: () => void
}

/** In-place editor for one dive record: discipline, dive time, depth, and notes. */
export default function DiveEditForm({ session, onSave, onCancel }: Props) {
  const initDur = splitDur(session.durationSec)
  const [date, setDate] = useState(session.date.slice(0, 10))
  const [discipline, setDiscipline] = useState<Discipline>(session.discipline)
  const [depth, setDepth] = useState(session.depth.toFixed(1))
  const [min, setMin] = useState(initDur.min)
  const [sec, setSec] = useState(initDur.sec)
  const [comment, setComment] = useState(session.comment)

  const depthNum = parseDepth(depth)
  const valid = depthNum !== null && !!date

  function save() {
    if (depthNum === null || !date) return
    onSave({
      date,
      discipline,
      depth: depthNum,
      durationSec: joinDur(min, sec),
      comment: comment.trim(),
    })
  }

  return (
    <div className="rec-card rec-edit">
      <div className="rec-head">
        <span className="rec-tag tag-dive">{discipline}</span>
        <div className="rec-head-right">
          <button className="rec-act" aria-label="Cancel" onClick={onCancel}>
            <IconClose />
          </button>
          <button className="rec-act rec-ok" aria-label="Save changes" disabled={!valid} onClick={save}>
            <IconCheck />
          </button>
        </div>
      </div>

      <div className="edit-field">
        <label className="edit-label" htmlFor={`edit-date-${session.id}`}>Date</label>
        <input
          id={`edit-date-${session.id}`}
          type="date"
          className="input-glass"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="edit-field">
        <span className="edit-label">Discipline</span>
        <div className="seg seg-5 seg-compact">
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

      <div className="form-row">
        <div className="edit-field form-field-depth">
          <label className="edit-label" htmlFor={`edit-depth-${session.id}`}>Depth (m)</label>
          <input
            id={`edit-depth-${session.id}`}
            type="text"
            inputMode="decimal"
            className="input-glass"
            value={depth}
            onChange={(e) => setDepth(sanitizeDepthInput(e.target.value))}
          />
        </div>
        <div className="edit-field form-field-time">
          <label className="edit-label" htmlFor={`edit-dur-${session.id}-min`}>Dive time</label>
          <DurationInput
            idPrefix={`edit-dur-${session.id}`}
            min={min}
            sec={sec}
            onChange={(m, s) => { setMin(m); setSec(s) }}
            compact
          />
        </div>
      </div>

      <div className="edit-field">
        <label className="edit-label" htmlFor={`edit-note-${session.id}`}>How did it feel?</label>
        <textarea
          id={`edit-note-${session.id}`}
          className="comment-input comment-compact"
          placeholder="Notes on this dive…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </div>
  )
}
