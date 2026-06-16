import { useState } from 'react'
import type { Sticker } from '../lib/stickers'
import { stickerImageUrl } from '../lib/stickers'

interface Props {
  sticker: Sticker
  showCount?: boolean
  onClick: (s: Sticker) => void
}

export function StickerCard({ sticker, showCount, onClick }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      className="card"
      onClick={() => onClick(sticker)}
      aria-label="Abrir figurinha"
    >
      {!loaded && <span className="card__skeleton" />}
      <img
        className={`card__img${loaded ? ' card__img--loaded' : ''}`}
        src={stickerImageUrl(sticker.file)}
        alt="Figurinha CLOC"
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      {showCount && sticker.count > 0 && (
        <span className="card__badge">🔥 {sticker.count}</span>
      )}
    </button>
  )
}
