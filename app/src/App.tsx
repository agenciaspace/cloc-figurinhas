import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Sticker } from './lib/stickers'
import { fetchStickers } from './lib/stickers'
import { HomeView } from './views/HomeView'
import { TrendingView } from './views/TrendingView'
import { CollectionsView } from './views/CollectionsView'
import { SearchView } from './views/SearchView'
import { StickerModal } from './components/StickerModal'
import { InstallPrompt } from './components/InstallPrompt'
import { Loading, ErrorState } from './components/States'
import { HomeIcon, FireIcon, PackIcon, SearchIcon } from './components/Icons'

type Tab = 'inicio' | 'alta' | 'colecoes' | 'buscar'

const TABS: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { id: 'inicio', label: 'Início', Icon: HomeIcon },
  { id: 'alta', label: 'Em alta', Icon: FireIcon },
  { id: 'colecoes', label: 'Coleções', Icon: PackIcon },
  { id: 'buscar', label: 'Buscar', Icon: SearchIcon },
]

const VALID: Tab[] = ['inicio', 'alta', 'colecoes', 'buscar']

function tabFromHash(): Tab {
  const h = window.location.hash.replace(/^#\/?/, '') as Tab
  return VALID.includes(h) ? h : 'inicio'
}

export default function App() {
  const [tab, setTab] = useState<Tab>(tabFromHash)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Sticker | null>(null)
  const [origin, setOrigin] = useState<string | null>(null)

  // Distinct origin facets across the library (public group names + the
  // anonymous "Conversas privadas" bucket), busiest first.
  const allOrigins = useMemo(() => {
    const count = new Map<string, number>()
    for (const s of stickers)
      for (const o of s.origins || []) count.set(o, (count.get(o) || 0) + 1)
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([o]) => o)
  }, [stickers])

  // Apply the active origin filter before handing stickers to any view.
  const shown = useMemo(
    () =>
      origin ? stickers.filter((s) => (s.origins || []).includes(origin)) : stickers,
    [stickers, origin],
  )

  const load = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetchStickers(controller.signal)
      .then((data) => setStickers(data))
      .catch((e: unknown) => {
        if ((e as Error).name === 'AbortError') return
        setError((e as Error).message || 'Erro desconhecido')
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => load(), [load])

  useEffect(() => {
    const onHash = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const goTab = (id: Tab) => {
    window.location.hash = `/${id}`
    setTab(id)
    window.scrollTo({ top: 0 })
  }

  let body: React.ReactNode
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorState message={error} onRetry={load} />
  } else {
    switch (tab) {
      case 'alta':
        body = <TrendingView stickers={shown} onSelect={setSelected} />
        break
      case 'colecoes':
        body = <CollectionsView stickers={shown} onSelect={setSelected} />
        break
      case 'buscar':
        body = <SearchView stickers={shown} onSelect={setSelected} />
        break
      default:
        body = <HomeView stickers={shown} onSelect={setSelected} />
    }
  }

  return (
    <div className="app">
      <header className="header">
        <img className="header__logo" src="/favicon.svg" alt="" />
        <div>
          <div className="header__title">Figurinhas</div>
          <div className="header__sub">Coletadas das conversas no WhatsApp</div>
        </div>
        {!loading && !error && (
          <span className="header__count">
            {shown.length}
            {origin ? ` de ${stickers.length}` : ''} figurinhas
          </span>
        )}
      </header>

      {!loading && !error && allOrigins.length > 1 && (
        <div className="origins" role="tablist" aria-label="Filtrar por origem">
          <button
            className={`ochip${origin === null ? ' ochip--active' : ''}`}
            onClick={() => setOrigin(null)}
          >
            Todas
          </button>
          {allOrigins.map((o) => (
            <button
              key={o}
              className={`ochip${origin === o ? ' ochip--active' : ''}`}
              onClick={() => setOrigin((cur) => (cur === o ? null : o))}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      <InstallPrompt />

      <main className="main">{body}</main>

      <nav className="tabbar">
        <div className="tabbar__inner">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`tab${tab === id ? ' tab--active' : ''}`}
              onClick={() => goTab(id)}
              aria-current={tab === id ? 'page' : undefined}
            >
              <Icon filled={tab === id} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {selected && (
        <StickerModal
          sticker={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
