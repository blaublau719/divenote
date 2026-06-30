import { useState } from 'react'
import type { ApneaEndReason, Posture, Sound } from '../data/types'
import { addApneaSession } from '../data/storage'
import ApneaSetup from './apnea/ApneaSetup'
import ApneaTimer from './apnea/ApneaTimer'
import ApneaEnd from './apnea/ApneaEnd'

type Step = 'setup' | 'timer' | 'end'

interface Draft {
  posture: Posture
  sound: Sound
  durationSec: number
  contractionAtSec: number | null
  struggleAtSec: number | null
}

/** Apnea tab: a three-step flow (setup → timer → end) that records one hold. */
export default function Apnea() {
  const [step, setStep] = useState<Step>('setup')
  const [draft, setDraft] = useState<Draft | null>(null)

  function handleStart(posture: Posture, sound: Sound) {
    setDraft({
      posture,
      sound,
      durationSec: 0,
      contractionAtSec: null,
      struggleAtSec: null,
    })
    setStep('timer')
  }

  function handleFinish(
    durationSec: number,
    contractionAtSec: number | null,
    struggleAtSec: number | null,
  ) {
    setDraft((d) => (d ? { ...d, durationSec, contractionAtSec, struggleAtSec } : d))
    setStep('end')
  }

  function handleSave(endReason: ApneaEndReason, comment: string) {
    if (!draft) return
    addApneaSession({
      date: new Date().toISOString(),
      posture: draft.posture,
      sound: draft.sound,
      durationSec: draft.durationSec,
      contractionAtSec: draft.contractionAtSec,
      struggleAtSec: draft.struggleAtSec,
      endReason,
      comment,
    })
    setDraft(null)
    setStep('setup')
  }

  if (step === 'timer' && draft) {
    return <ApneaTimer sound={draft.sound} onFinish={handleFinish} />
  }
  if (step === 'end' && draft) {
    return <ApneaEnd durationSec={draft.durationSec} onSave={handleSave} />
  }
  return <ApneaSetup onStart={handleStart} />
}
