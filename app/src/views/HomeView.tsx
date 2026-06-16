import { useMemo } from 'react'
import type { Sticker } from '../lib/stickers'
import { sortByNewest } from '../lib/stickers'
import { StickerGrid } from '../components/StickerGrid'

interface Props {
  stickers: Sticker[]
  onSelect: (s: Sticker) => void
}

export function HomeView({ stickers, onSelect }: Props) {
  const sorted = useMemo(() => sortByNewest(stickers), [stickers])
  return <StickerGrid stickers={sorted} onSelect={onSelect} />
}
