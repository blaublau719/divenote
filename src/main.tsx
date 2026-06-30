import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// iOS standalone PWA mis-measures CSS viewport units (vh/dvh) at launch, leaving
// a strip at the bottom until you scroll. window.innerHeight IS reliable, so we
// write it to --app-height and drive the app's height from that.
function setAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
}
setAppHeight()
window.addEventListener('resize', setAppHeight)
window.addEventListener('orientationchange', setAppHeight)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
