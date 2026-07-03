import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './index.css'

// Ask the browser to keep our local data across storage-pressure cleanups.
// No user prompt — the browser decides silently and returns true/false.
if (navigator.storage?.persist) {
  navigator.storage.persist().catch(() => {})
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
