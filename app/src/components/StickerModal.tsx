import { useEffect, useState } from 'react'
import type { Sticker } from '../lib/stickers'
import { stickerImageUrl, ZIP_URL } from '../lib/stickers'
import { DownloadIcon, PlusIcon } from './Icons'

interface Props {
  sticker: Sticker
  onClose: () => void
}

const ANDROID_URL =
  'https://play.google.com/store/apps/details?id=com.marsvard.stickermakerforwhatsapp'
const IOS_URL = 'https://apps.apple.com/app/sticker-maker-studio/id1208226469'

export function StickerModal({ sticker, onClose }: Props) {
  const [showHelp, setShowHelp] = useState(false)
  const url = stickerImageUrl(sticker.file)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHelp) setShowHelp(false)
        else onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, showHelp])

  return (
    <div
      className="backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sheet__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        {!showHelp ? (
          <>
            <div className="preview">
              <img src={url} alt="Figurinha CLOC" />
            </div>
            <div className="preview__meta">
              <span>🔥 {sticker.count}</span>
              <span>
                {sticker.count === 1 ? 'uso no grupo' : 'usos no grupo'}
              </span>
            </div>
            <div className="sheet__actions">
              <a
                className="btn"
                href={url}
                download={sticker.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
                Baixar
              </a>
              <button
                className="btn btn--ghost"
                onClick={() => setShowHelp(true)}
              >
                <PlusIcon />
                Adicionar no WhatsApp
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="sheet__title">Adicionar no WhatsApp</h2>
            <p className="sheet__p">
              As figurinhas já estão no formato certo —{' '}
              <strong>512×512 .webp</strong>. Infelizmente o WhatsApp{' '}
              <strong>não permite adicionar com 1 toque pela web</strong>. Baixe
              a figurinha e importe usando um app de figurinhas gratuito:
            </p>

            <div className="store-links">
              <a
                className="store-link"
                href={ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="store-link__icon">🤖</span>
                <span>
                  <span className="store-link__os">Android</span>
                  <br />
                  <span className="store-link__name">Sticker Maker</span>
                </span>
                <span className="store-link__arrow">→</span>
              </a>
              <a
                className="store-link"
                href={IOS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="store-link__icon">🍎</span>
                <span>
                  <span className="store-link__os">iPhone</span>
                  <br />
                  <span className="store-link__name">
                    Sticker Maker Studio
                  </span>
                </span>
                <span className="store-link__arrow">→</span>
              </a>
            </div>

            <hr className="hr" />

            <div className="sheet__actions">
              <a
                className="btn"
                href={url}
                download={sticker.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
                Baixar esta figurinha
              </a>
              <a className="btn btn--ghost" href={ZIP_URL}>
                <DownloadIcon />
                Baixar todas (.zip)
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
