import { useState } from 'react'
import type { Posture, Sound } from '../../data/types'
import {
  IconSit,
  IconStand,
  IconLie,
  IconWaves,
  IconRain,
  IconSilence,
} from '../../components/icons'

type IconCmp = (props: { className?: string }) => React.ReactElement

const POSTURES: { value: Posture; label: string; Icon: IconCmp }[] = [
  { value: 'sit', label: 'Sit', Icon: IconSit },
  { value: 'stand', label: 'Stand', Icon: IconStand },
  { value: 'lie', label: 'Lie', Icon: IconLie },
]

const SOUNDS: { value: Sound; label: string; Icon: IconCmp }[] = [
  { value: 'waves', label: 'Waves', Icon: IconWaves },
  { value: 'rain', label: 'Rain', Icon: IconRain },
  { value: 'none', label: 'None', Icon: IconSilence },
]

interface Props {
  onStart: (posture: Posture, sound: Sound) => void
}

/** Step 1 — pick posture + soundscape, then start. Fits one screen, no scroll. */
export default function ApneaSetup({ onStart }: Props) {
  const [posture, setPosture] = useState<Posture>('sit')
  const [sound, setSound] = useState<Sound>('waves')

  return (
    <div className="apnea-setup">
      <header className="page-header">
        <h1>Apnea</h1>
        <p className="page-sub">Set up your breath-hold</p>
      </header>

      <div className="setup-body">
        <div className="field-group">
          <span className="field-label">Posture</span>
          <div className="seg seg-3">
            {POSTURES.map(({ value, label, Icon }) => (
              <button
                key={value}
                className={'seg-btn' + (posture === value ? ' is-selected' : '')}
                onClick={() => setPosture(value)}
              >
                <Icon className="seg-icon" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <span className="field-label">Soundscape</span>
          <div className="seg seg-3">
            {SOUNDS.map(({ value, label, Icon }) => (
              <button
                key={value}
                className={'seg-btn' + (sound === value ? ' is-selected' : '')}
                onClick={() => setSound(value)}
              >
                <Icon className="seg-icon" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={() => onStart(posture, sound)}>
        Start Apnea
      </button>
    </div>
  )
}
