import { useEffect, useRef, useState } from 'react'
import type { Sound } from '../../data/types'

interface Props {
  sound: Sound
  /** Called on finish with the total elapsed seconds and the two marker times. */
  onFinish: (durationSec: number, contractionAtSec: number | null, struggleAtSec: number | null) => void
}

const SOUND_FILES: Record<Sound, string | null> = {
  waves: '/sounds/waves.mp3',
  rain: '/sounds/rain.mp3',
  none: null,
}

function format(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Step 2 — timer screen.
 * Arrives "armed": the ambient scene is showing and the user breathes up.
 * Tapping "Start Recording" begins the count, the soundscape, and the markers.
 */
export default function ApneaTimer({ sound, onFinish }: Props) {
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [contractionAt, setContractionAt] = useState<number | null>(null)
  const [struggleAt, setStruggleAt] = useState<number | null>(null)
  const startRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!recording) return

    // performance.now is monotonic; setInterval drift is corrected each tick.
    startRef.current = performance.now()
    const id = setInterval(() => {
      setElapsed(Math.floor((performance.now() - startRef.current) / 1000))
    }, 250)

    // White-noise playback. Files live in public/sounds/ (added in a later step);
    // play() is triggered by the Start tap, satisfying iOS autoplay rules.
    const file = SOUND_FILES[sound]
    if (file) {
      const audio = new Audio(file)
      audio.loop = true
      audio.volume = 0.6
      audio.play().catch(() => {
        /* file not present yet / autoplay blocked — silent */
      })
      audioRef.current = audio
    }

    return () => {
      clearInterval(id)
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [recording, sound])

  const bgClass =
    sound === 'waves' ? 'bg-waves' : sound === 'rain' ? 'bg-rain' : 'bg-calm'

  return (
    <div className={'timer-screen ' + bgClass}>
      <div className={'timer-display' + (recording ? '' : ' is-idle')}>
        {format(elapsed)}
      </div>

      {!recording ? (
        <>
          <p className="timer-hint">Breathe up. Start when you begin your hold.</p>
          <button className="btn-primary" onClick={() => setRecording(true)}>
            Start Recording
          </button>
        </>
      ) : (
        <>
          <div className="marker-row">
            <button
              className="marker-btn"
              disabled={contractionAt !== null}
              onClick={() => setContractionAt(elapsed)}
            >
              <span className="marker-title">Contractions</span>
              <span className="marker-sub">
                {contractionAt !== null ? format(contractionAt) : 'tap when they start'}
              </span>
            </button>
            <button
              className="marker-btn"
              disabled={struggleAt !== null}
              onClick={() => setStruggleAt(elapsed)}
            >
              <span className="marker-title">Struggle</span>
              <span className="marker-sub">
                {struggleAt !== null ? format(struggleAt) : 'tap when it begins'}
              </span>
            </button>
          </div>

          <button
            className="btn-finish"
            onClick={() => onFinish(elapsed, contractionAt, struggleAt)}
          >
            Finish
          </button>
        </>
      )}
    </div>
  )
}
