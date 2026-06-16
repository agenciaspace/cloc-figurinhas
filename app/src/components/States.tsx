interface ErrorProps {
  message: string
  onRetry: () => void
}

export function Loading() {
  return (
    <div className="state">
      <span className="spinner" />
      <span className="state__text">Carregando figurinhas…</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: ErrorProps) {
  return (
    <div className="state">
      <span className="state__emoji">😕</span>
      <span className="state__title">Não foi possível carregar</span>
      <span className="state__text">{message}</span>
      <button className="btn" onClick={onRetry}>
        Tentar de novo
      </button>
    </div>
  )
}

interface EmptyProps {
  emoji: string
  title: string
  text?: string
}

export function EmptyState({ emoji, title, text }: EmptyProps) {
  return (
    <div className="state">
      <span className="state__emoji">{emoji}</span>
      <span className="state__title">{title}</span>
      {text && <span className="state__text">{text}</span>}
    </div>
  )
}
