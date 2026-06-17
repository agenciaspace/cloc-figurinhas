import { useEffect, useState } from 'react'

// Chrome/Android: evento que permite disparar o instalador via botão próprio
// (o banner automático foi descontinuado). iOS/Safari não tem isso — instrução manual.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOS, setShowIOS] = useState(false)
  const [hidden, setHidden] = useState(isStandalone)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('install-dismissed') === '1',
  )

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true)
      return
    }
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setHidden(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  // Mostra o banner se: dá pra instalar (Android) OU é iOS (instrução manual).
  const canShow = !hidden && !dismissed && (deferred !== null || isIOS())
  if (!canShow) return null

  const close = () => {
    setDismissed(true)
    sessionStorage.setItem('install-dismissed', '1')
  }

  const onInstall = async () => {
    if (deferred) {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      if (outcome === 'accepted') setHidden(true)
      setDeferred(null)
    } else if (isIOS()) {
      setShowIOS((v) => !v)
    }
  }

  return (
    <div className="install">
      <div className="install__row">
        <span className="install__icon">📲</span>
        <div className="install__text">
          <strong>Instalar app</strong>
          <span>Acesso rápido às figurinhas, direto da tela inicial.</span>
        </div>
        <button className="btn" onClick={onInstall}>
          {deferred ? 'Instalar' : 'Como?'}
        </button>
        <button className="install__close" onClick={close} aria-label="Fechar">
          ✕
        </button>
      </div>
      {showIOS && (
        <div className="install__ios">
          No iPhone: toque em <strong>Compartilhar</strong> (o ícone de
          quadrado com seta ↑) e depois em <strong>“Adicionar à Tela de
          Início”</strong>.
        </div>
      )}
    </div>
  )
}
