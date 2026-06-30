import { IconMeditate, IconDive, IconCalendar } from './icons'

export type TabKey = 'apnea' | 'freediving' | 'statistic'

type IconCmp = (props: { className?: string }) => React.ReactElement

const TABS: { key: TabKey; label: string; Icon: IconCmp }[] = [
  { key: 'apnea', label: 'Apnea', Icon: IconMeditate },
  { key: 'freediving', label: 'Freediving', Icon: IconDive },
  { key: 'statistic', label: 'Statistic', Icon: IconCalendar },
]

export default function TabBar({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (key: TabKey) => void
}) {
  return (
    <nav className="tab-bar">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={'tab-item' + (active === key ? ' is-active' : '')}
          onClick={() => onChange(key)}
          type="button"
        >
          <span className="tab-icon">
            <Icon />
          </span>
          <span className="tab-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
