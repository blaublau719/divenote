import { useState } from 'react'
import type { ApneaEndReason, ApneaSession, Posture, Sound } from '../data/types'
import { splitDur, joinDur } from '../data/format'
import { IconCheck, IconClose } from './icons'
import DurationInput from './DurationInput'

const POSTURES: { value: Posture; label: string }[] = [
  { value: 'sit', label: 'Sit' },
  { value: 'stand', label: 'Stand' },
  { value: 'lie', label: 'Lie' },
]
const SOUNDS: { value: Sound; label: string }[] = [
  { value: 'waves', label: 'Waves' },
  { value: 'rain', label: 'Rain' },
  { value: 'none', label: 'None' },
]
const REASONS: { value: ApneaEndReason; label: string }[] = [
  { value: 'firstContraction', label: 'First contraction' },
  { value: 'breathingUrge', label: 'Breathing urge' },
  { value: 'hypoxia', label: 'Low oxygen' },
  { value: 'other', label: 'Other' },
]

interface Props {
  session: ApneaSession
  onSave: (patch: Partial<Omit<ApneaSession, 'id'>>) => void
  onCancel: () => void
}

/** In-place editor for one apnea record. */
export default function ApneaEditForm({ session, onSave, onCancel }: Props) {
  const [dur, setDur] = useState(() => splitDur(session.durationSec))
  const [contr, setContr] = useState(() => splitDur(session.contractionAtSec))
  const [strug, setStrug] = useState(() => splitDur(session.struggleAtSec))
  const [posture, setPosture] = useState<Posture>(session.posture)
  const [sound, setSound] = useState<Sound>(session.sound)
  const [reason, setReason] = useState<ApneaEndReason>(session.endReason)
  const [comment, setComment] = useState(session.comment)

  const durationSec = joinDur(dur.min, dur.sec)
  const valid = durationSec !== null && durationSec > 0

  function save() {
    if (durationSec === null) return
    onSave({
      durationSec,
      contractionAtSec: joinDur(contr.min, contr.sec),
      struggleAtSec: joinDur(strug.min, strug.sec),
      posture,
      sound,
      endReason: reason,
      comment: comment.trim(),
    })
  }

  return (
    <div className="rec-card rec-edit">
      <div className="rec-head">
        <span className="rec-tag tag-apnea">Apnea</span>
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
        <label className="edit-label" htmlFor={`edit-adur-${session.id}-min`}>Hold time</label>
        <DurationInput
          idPrefix={`edit-adur-${session.id}`}
          min={dur.min}
          sec={dur.sec}
          onChange={(min, sec) => setDur({ min, sec })}
          compact
        />
      </div>

      <div className="edit-field">
        <span className="edit-label">Posture</span>
        <div className="seg seg-3 seg-compact">
          {POSTURES.map((p) => (
            <button
              key={p.value}
              className={'seg-btn seg-btn-text' + (posture === p.value ? ' is-selected' : '')}
              onClick={() => setPosture(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="edit-field">
        <span className="edit-label">Soundscape</span>
        <div className="seg seg-3 seg-compact">
          {SOUNDS.map((s) => (
            <button
              key={s.value}
              className={'seg-btn seg-btn-text' + (sound === s.value ? ' is-selected' : '')}
              onClick={() => setSound(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="edit-field form-field-time">
          <label className="edit-label" htmlFor={`edit-contr-${session.id}-min`}>Contractions</label>
          <DurationInput
            idPrefix={`edit-contr-${session.id}`}
            min={contr.min}
            sec={contr.sec}
            onChange={(min, sec) => setContr({ min, sec })}
            compact
          />
        </div>
        <div className="edit-field form-field-time">
          <label className="edit-label" htmlFor={`edit-strug-${session.id}-min`}>Struggle</label>
          <DurationInput
            idPrefix={`edit-strug-${session.id}`}
            min={strug.min}
            sec={strug.sec}
            onChange={(min, sec) => setStrug({ min, sec })}
            compact
          />
        </div>
      </div>

      <div className="edit-field">
        <span className="edit-label">Stopped</span>
        <div className="seg seg-2 seg-compact">
          {REASONS.map((r) => (
            <button
              key={r.value}
              className={'seg-btn seg-btn-text' + (reason === r.value ? ' is-selected' : '')}
              onClick={() => setReason(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="edit-field">
        <label className="edit-label" htmlFor={`edit-anote-${session.id}`}>How did it feel?</label>
        <textarea
          id={`edit-anote-${session.id}`}
          className="comment-input comment-compact"
          placeholder="Notes on this hold…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </div>
  )
}
