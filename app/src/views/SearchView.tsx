import { useMemo, useState } from 'react'
import type { Sticker } from '../lib/stickers'
import { groupByMonth } from '../lib/stickers'
import { StickerGrid } from '../components/StickerGrid'
import { SearchIcon } from '../components/Icons'
import { EmptyState } from '../components/States'

interface Props {
  stickers: Sticker[]
  onSelect: (s: Sticker) => void
}

export function SearchView({ stickers, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [month, setMonth] = useState<string | null>(null)

  const groups = useMemo(() => groupByMonth(stickers), [stickers])

  const q = query.trim().toLowerCase()

  // Tag-based search. The `tags` field does not exist in metadata.json yet —
  // this is future-proofed so it "just works" once tags are added upstream.
  const tagResults = useMemo(() => {
    if (!q) return []
    return stickers.filter((s) => (s.tags || []).some((t) => t.includes(q)))
  }, [stickers, q])

  // Fallback: filter by collection / month chip.
  const monthResults = useMemo(() => {
    if (!month) return []
    return groups.find((g) => g.key === month)?.stickers ?? []
  }, [groups, month])

  const hasTags = stickers.some((s) => s.tags && s.tags.length > 0)

  let content: React.ReactNode

  if (q) {
    content =
      tagResults.length > 0 ? (
        <StickerGrid stickers={tagResults} onSelect={onSelect} />
      ) : (
        <EmptyState
          emoji="🔎"
          title="Nada encontrado"
          text={
            hasTags
              ? `Nenhuma figurinha para “${query}”.`
              : 'Busca por palavras-chave em breve 🔎 — por enquanto, filtre por coleção abaixo.'
          }
        />
      )
  } else if (month) {
    content = <StickerGrid stickers={monthResults} onSelect={onSelect} />
  } else {
    content = (
      <EmptyState
        emoji="🔎"
        title="Busca por palavras-chave em breve 🔎"
        text="Enquanto isso, escolha uma coleção abaixo para filtrar as figurinhas por mês."
      />
    )
  }

  return (
    <div>
      <div className="search">
        <label className="search__box">
          <SearchIcon />
          <input
            className="search__input"
            type="search"
            inputMode="search"
            placeholder="Buscar figurinhas…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value) setMonth(null)
            }}
            aria-label="Buscar figurinhas"
          />
        </label>

        {!q && (
          <>
            <div className="chips__label">Coleções</div>
            <div className="chips">
              {groups.map((g) => (
                <button
                  key={g.key}
                  className={`chip${month === g.key ? ' chip--active' : ''}`}
                  onClick={() => setMonth(month === g.key ? null : g.key)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {content}
    </div>
  )
}
