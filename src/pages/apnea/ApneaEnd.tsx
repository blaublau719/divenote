import { useState } from 'react'
import type { ApneaEndReason } from '../../data/types'

const REASONS: { value: ApneaEndReason; label: string }[] = [
  { value: 'firstContraction', label: 'First contraction' },
  { value: 'breathingUrge', label: 'Breathing urge' },
  { value: 'hypoxia', label: 'Low oxygen' },
  { value: 'other', label: 'Other' },
]

interface Props {
  durationSec: number
  onSave: (endReason: ApneaEndReason, comment: string) => void
}

function format(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Step 3 — record why the hold ended and how it felt, then save. */
export default function ApneaEnd({ durationSec, onSave }: Props) {
  const [reason, setReason] = useState<ApneaEndReason | null>(null)
  const [comment, setComment] = useState('')

  return (
    <div className="apnea-end">
      <header className="page-header">
        <h1>Nice hold</h1>
        <p className="page-sub">You held for {format(durationSec)}</p>
      </header>

      <div className="field-group">
        <span className="field-label">Why did you stop?</span>
        <div className="reason-list">
          {REASONS.map((r) => (
            <button
              key={r.value}
              className={'reason-btn' + (reason === r.value ? ' is-selected' : '')}
              onClick={() => setReason(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group field-grow">
        <span className="field-label">How did it feel?</span>
        <textarea
          className="comment-input"
          placeholder="Notes on this hold…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        className="btn-primary"
        disabled={reason === null}
        onClick={() => reason && onSave(reason, comment.trim())}
      >
        Save
      </button>
    </div>
  )
}
