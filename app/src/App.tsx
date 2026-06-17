import { useCallback, useEffect, useState } from 'react'
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
        body = <TrendingView stickers={stickers} onSelect={setSelected} />
        break
      case 'colecoes':
        body = <CollectionsView stickers={stickers} onSelect={setSelected} />
        break
      case 'buscar':
        body = <SearchView stickers={stickers} onSelect={setSelected} />
        break
      default:
        body = <HomeView stickers={stickers} onSelect={setSelected} />
    }
  }

  return (
    <div className="app">
      <header className="header">
        <img className="header__logo" src="/favicon.svg" alt="" />
        <div>
          <div className="header__title">Figurinhas CLOC</div>
          <div className="header__sub">CLOC Brasil — Bate papo</div>
        </div>
        {!loading && !error && (
          <span className="header__count">{stickers.length} figurinhas</span>
        )}
      </header>

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
