import { pad } from '../data/format'

interface Props {
  min: string
  sec: string
  onChange: (min: string, sec: string) => void
  idPrefix?: string
  compact?: boolean
}

const digits = (s: string, max: number) => s.replace(/\D/g, '').slice(0, max)

/** Two small numeric fields — minutes and seconds — for a mm:ss value. */
export default function DurationInput({ min, sec, onChange, idPrefix = 'dur', compact }: Props) {
  return (
    <div className={'dur-input' + (compact ? ' is-compact' : '')}>
      <label className="dur-field">
        <input
          id={`${idPrefix}-min`}
          type="text"
          inputMode="numeric"
          placeholder="0"
          className="input-glass dur-num"
          value={min}
          onChange={(e) => onChange(digits(e.target.value, 3), sec)}
        />
        <span className="dur-unit">min</span>
      </label>
      <span className="dur-colon">:</span>
      <label className="dur-field">
        <input
          id={`${idPrefix}-sec`}
          type="text"
          inputMode="numeric"
          placeholder="00"
          className="input-glass dur-num"
          value={sec}
          onChange={(e) => onChange(min, digits(e.target.value, 2))}
          onBlur={() => {
            // clamp seconds to 0-59 and show two digits once the user leaves the field
            if (sec === '') return
            const n = Math.min(59, parseInt(sec, 10) || 0)
            onChange(min, pad(n))
          }}
        />
        <span className="dur-unit">sec</span>
      </label>
    </div>
  )
}
