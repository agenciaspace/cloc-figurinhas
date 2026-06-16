export const STICKER_BASE = 'https://agenciaspace.github.io/cloc-figurinhas'

export const METADATA_URL = `${STICKER_BASE}/metadata.json`
export const ZIP_URL = `${STICKER_BASE}/figurinhas-cloc.zip`

export interface Sticker {
  /** "<sha>.webp" */
  file: string
  /** usage count in the group */
  count: number
  /** unix seconds, first seen (0 = unknown) */
  first: number
  /** unix seconds, last seen */
  last: number
  /**
   * Optional keyword tags. Not present in metadata.json yet — designed so that
   * search "just works" once the field is added upstream.
   */
  tags?: string[]
}

export function stickerImageUrl(file: string): string {
  return `${STICKER_BASE}/stickers/${file}`
}

export async function fetchStickers(signal?: AbortSignal): Promise<Sticker[]> {
  const res = await fetch(METADATA_URL, { signal })
  if (!res.ok) {
    throw new Error(`Falha ao carregar (HTTP ${res.status})`)
  }
  const data = (await res.json()) as Sticker[]
  if (!Array.isArray(data)) {
    throw new Error('Formato de dados inesperado')
  }
  return data
}

/** Newest first by `first`; items with first==0 go last. */
export function sortByNewest(stickers: Sticker[]): Sticker[] {
  return [...stickers].sort((a, b) => {
    if (a.first === 0 && b.first === 0) return 0
    if (a.first === 0) return 1
    if (b.first === 0) return -1
    return b.first - a.first
  })
}

/** Most used first by `count`. */
export function sortByTrending(stickers: Sticker[]): Sticker[] {
  return [...stickers].sort((a, b) => b.count - a.count)
}

const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/** Human label for a month key like "2026-06" or "Sem data". */
export function monthLabel(key: string): string {
  if (key === NO_DATE_KEY) return 'Sem data'
  const [year, month] = key.split('-')
  return `${MONTHS_PT[Number(month) - 1]} ${year}`
}

export const NO_DATE_KEY = 'sem-data'

/** Sortable key for grouping: "YYYY-MM" or NO_DATE_KEY. */
export function monthKey(first: number): string {
  if (!first) return NO_DATE_KEY
  const d = new Date(first * 1000)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${m}`
}

export interface MonthGroup {
  key: string
  label: string
  stickers: Sticker[]
}

/** Group stickers by month of `first`, newest month first, "Sem data" last. */
export function groupByMonth(stickers: Sticker[]): MonthGroup[] {
  const map = new Map<string, Sticker[]>()
  for (const s of stickers) {
    const key = monthKey(s.first)
    const arr = map.get(key)
    if (arr) arr.push(s)
    else map.set(key, [s])
  }

  const keys = [...map.keys()].sort((a, b) => {
    if (a === NO_DATE_KEY) return 1
    if (b === NO_DATE_KEY) return -1
    return a < b ? 1 : a > b ? -1 : 0
  })

  return keys.map((key) => ({
    key,
    label: monthLabel(key),
    stickers: sortByNewest(map.get(key)!),
  }))
}
