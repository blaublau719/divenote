/**
 * Bespoke line-icon set — consistent 28×28 grid, 1.6 stroke, round joins,
 * inherits `currentColor`. No emoji (those read as template/AI).
 * Posture icons are abstract: a head dot + a body line in the given pose.
 */

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Posture icons — minimalist little-people line drawings (head, arms, legs).

export function IconStand({ className }: IconProps) {
  // front-facing standing figure
  return (
    <svg {...base} className={className}>
      <g transform="translate(14 14) scale(1.15) translate(-14 -14)">
        <circle cx="14" cy="5.6" r="2.5" />
        <path d="M14 8.1 V15" />
        <path d="M14 10.4 L10.3 12.7" />
        <path d="M14 10.4 L17.7 12.7" />
        <path d="M14 15 L10.8 21" />
        <path d="M14 15 L17.2 21" />
      </g>
    </svg>
  )
}

export function IconSit({ className }: IconProps) {
  // side view, sitting on a stool (leg clearly in front of the stool)
  return (
    <svg {...base} className={className}>
      <g transform="translate(14 14) scale(1.15) translate(-14 -14)">
        <circle cx="11" cy="5" r="2.3" />
        <path d="M11 7.3 V12.2" />
        <path d="M11 9.2 L13.6 11.3" />
        <path d="M11 12.2 H16" />
        <path d="M16 12.2 V18" />
        {/* stool, set back behind the leg */}
        <path d="M9 14 H14" />
        <path d="M10 14 V18.5" />
        <path d="M13 14 V18.5" />
      </g>
    </svg>
  )
}

export function IconLie({ className }: IconProps) {
  // side view, reclining on the ground
  return (
    <svg {...base} className={className}>
      <g transform="translate(14 14) scale(1.15) translate(-14 -14)">
        <circle cx="6" cy="12.4" r="2.4" />
        <path d="M8.4 12.7 H16" />
        <path d="M16 12.7 L19.5 12.7" />
        <path d="M19.5 12.7 L19.5 11.2" />
        <path d="M11 12.9 L11.9 15" />
        <path d="M3.5 16.6 H22" opacity="0.4" />
      </g>
    </svg>
  )
}

export function IconWaves({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 9 q3 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0" />
      <path d="M3 14 q3 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0" />
      <path d="M3 19 q3 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0" />
    </svg>
  )
}

export function IconRain({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.5 16 a3.6 3.6 0 0 1 -0.4 -7.2 a5 5 0 0 1 9.6 -0.6 a3.4 3.4 0 0 1 0.6 6.8 Z" />
      <path d="M9.5 19 L8.3 22" />
      <path d="M14 19 L12.8 22" />
      <path d="M18.5 19 L17.3 22" />
    </svg>
  )
}

/** "None" — a single calm, still ripple. Deliberately not a face/person. */
export function IconSilence({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 14 q5 2.4 10 0 t10 0" />
    </svg>
  )
}

/* ---- tab-bar icons (same line style) ---- */

/** Apnea tab — a cross-legged meditating figure: head, spine, arms resting on
 *  the knees, and crossed legs. Enlarged (~1.35×) to match the fins icon. */
export function IconMeditate({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={0.8} className={className}>
      <g transform="translate(14 14) scale(1.35) translate(-14 -10.35)">
        <circle cx="14" cy="5" r="2.3" />
        <path d="M14 7.3 V14" />
        <path d="M14 9.3 L8.5 15.3" />
        <path d="M14 9.3 L19.5 15.3" />
        <path d="M14 14 L8 16.5" />
        <path d="M14 14 L20 16.5" />
        <path d="M8 16.5 L14 18" />
        <path d="M20 16.5 L14 18" />
      </g>
    </svg>
  )
}

/** FreeDiving tab — the user-supplied diving-fins artwork, tinted to the tab
 *  color via a CSS mask (see `.fins-mask` in index.css). */
export function IconDive({ className }: IconProps) {
  return <span className={'fins-mask' + (className ? ' ' + className : '')} aria-hidden />
}

/** Info — circled "i". */
export function IconInfo({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="14" cy="14" r="9" />
      <path d="M14 12.8 V18.5" />
      <circle cx="14" cy="9.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Trash can — delete action. */
export function IconTrash({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 7.5 H23" />
      <path d="M10.5 7.5 V6 a1.5 1.5 0 0 1 1.5 -1.5 h4 a1.5 1.5 0 0 1 1.5 1.5 V7.5" />
      <path d="M7.6 7.5 L8.5 21.4 a2 2 0 0 0 2 1.9 h7 a2 2 0 0 0 2 -1.9 L20.4 7.5" />
      <path d="M12 11.5 V19" />
      <path d="M16 11.5 V19" />
    </svg>
  )
}

/** Statistic tab — a calendar with entry dots. Enlarged/weighted to match the
 *  other tab icons. */
export function IconCalendar({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={0.96} className={className}>
      <g transform="translate(14 14) scale(1.12) translate(-14 -13.75)">
        <rect x="4.5" y="6.5" width="19" height="16.5" rx="2.5" />
        <path d="M9 4.5 V8" />
        <path d="M19 4.5 V8" />
        <path d="M4.5 11 H23.5" />
        <g fill="currentColor" stroke="none">
          <circle cx="9" cy="15" r="1.1" />
          <circle cx="14" cy="15" r="1.1" />
          <circle cx="19" cy="15" r="1.1" />
          <circle cx="9" cy="19" r="1.1" />
          <circle cx="14" cy="19" r="1.1" />
        </g>
      </g>
    </svg>
  )
}
