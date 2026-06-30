import { useState } from 'react'
import TabBar, { type TabKey } from './components/TabBar'
import Apnea from './pages/Apnea'
import FreeDiving from './pages/FreeDiving'
import Statistic from './pages/Statistic'

export default function App() {
  const [tab, setTab] = useState<TabKey>('apnea')

  return (
    <div className="phone-frame">
      <div className="screen">
        <main className="screen-content">
          {tab === 'apnea' && <Apnea />}
          {tab === 'freediving' && <FreeDiving />}
          {tab === 'statistic' && <Statistic />}
        </main>
        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  )
}
