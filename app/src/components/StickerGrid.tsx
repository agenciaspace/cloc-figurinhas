import type { Sticker } from '../lib/stickers'
import { StickerCard } from './StickerCard'

interface Props {
  stickers: Sticker[]
  showCount?: boolean
  onSelect: (s: Sticker) => void
}

export function StickerGrid({ stickers, showCount, onSelect }: Props) {
  return (
    <div className="grid">
      {stickers.map((s) => (
        <StickerCard
          key={s.file}
          sticker={s}
          showCount={showCount}
          onClick={onSelect}
        />
      ))}
    </div>
  )
}
