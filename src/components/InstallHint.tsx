import { useEffect, useState } from 'react'

const DISMISS_KEY = 'freedive.installHintDismissed'

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

/**
 * Subtle, dismissible nudge to install the PWA. Home-screen (installed) apps
 * keep their local data far more reliably than a browser tab — notably, iOS
 * exempts them from its ~7-day storage cleanup. Renders nothing once the app
 * already runs standalone or the user has dismissed the hint.
 */
export default function InstallHint() {
  const [visible, setVisible] = useState(false)
  // Android/Chrome fire `beforeinstallprompt`; capturing it lets us offer a
  // one-tap install. iOS has no such event, so we show text instructions.
  const [deferred, setDeferred] = useState<{ prompt: () => void; userChoice: Promise<unknown> } | null>(null)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return
    setVisible(true)

    function onPrompt(e: Event) {
      e.preventDefault()
      setDeferred(e as unknown as { prompt: () => void; userChoice: Promise<unknown> })
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!visible) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  async function install() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    dismiss()
  }

  return (
    <div className="install-hint">
      <p className="install-hint-text">
        Add Divenote to your home screen to keep your records safe and use it offline.
        {isIos() && !deferred ? ' Tap the Share button, then “Add to Home Screen”.' : ''}
      </p>
      {deferred && (
        <button className="install-hint-add" onClick={install} type="button">
          Add
        </button>
      )}
      <button className="install-hint-close" onClick={dismiss} aria-label="Dismiss" type="button">
        ×
      </button>
    </div>
  )
}
