import { useMemo } from 'react'
import type { Sticker } from '../lib/stickers'
import { groupByMonth } from '../lib/stickers'
import { StickerGrid } from '../components/StickerGrid'

interface Props {
  stickers: Sticker[]
  onSelect: (s: Sticker) => void
}

export function CollectionsView({ stickers, onSelect }: Props) {
  const groups = useMemo(() => groupByMonth(stickers), [stickers])

  return (
    <div>
      {groups.map((g) => (
        <section key={g.key}>
          <div className="section-head">
            <span className="section-head__title">{g.label}</span>
            <span className="section-head__meta">
              {g.stickers.length}{' '}
              {g.stickers.length === 1 ? 'figurinha' : 'figurinhas'}
            </span>
          </div>
          <StickerGrid stickers={g.stickers} onSelect={onSelect} />
        </section>
      ))}
    </div>
  )
}
