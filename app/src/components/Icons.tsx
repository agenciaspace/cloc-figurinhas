interface IconProps {
  filled?: boolean
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function HomeIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...(filled ? { fill: 'currentColor' } : stroke)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  )
}

export function FireIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...(filled ? { fill: 'currentColor' } : stroke)}>
      <path d="M12 2c1 3-1 5-2 6.5C8.5 10.5 8 12 8 13.5 8 17 9.8 19 12 19s4-2 4-5.5c0-2-1-3.5-2-5 .5 1.5 0 3-1 4-.3-3-1-5-1-10.5Z" />
    </svg>
  )
}

export function PackIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...(filled ? { fill: 'currentColor' } : stroke)}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  )
}

export function SearchIcon({ filled: _filled }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
