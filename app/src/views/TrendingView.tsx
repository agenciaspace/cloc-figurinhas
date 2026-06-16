import { useMemo } from 'react'
import type { Sticker } from '../lib/stickers'
import { sortByTrending } from '../lib/stickers'
import { StickerGrid } from '../components/StickerGrid'

interface Props {
  stickers: Sticker[]
  onSelect: (s: Sticker) => void
}

export function TrendingView({ stickers, onSelect }: Props) {
  const sorted = useMemo(() => sortByTrending(stickers), [stickers])
  return <StickerGrid stickers={sorted} showCount onSelect={onSelect} />
}
