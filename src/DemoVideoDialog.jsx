import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MOBILE_MQ = '(max-width: 40rem)'
const SRC = {
  portrait: '/video/llisar-demo-9x16.mp4',
  landscape: '/video/llisar-demo-16x9.mp4',
}

function usePortraitDemo() {
  const [portrait, setPortrait] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const sync = () => setPortrait(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return portrait
}

export default function DemoVideoDialog({ open, onClose }) {
  const dialogRef = useRef(null)
  const videoRef = useRef(null)
  const closingRef = useRef(false)
  const titleId = useId()
  const portrait = usePortraitDemo()
  const src = portrait ? SRC.portrait : SRC.landscape

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    const onDialogClose = () => {
      if (closingRef.current) return
      onClose()
    }

    dialog.addEventListener('close', onDialogClose)

    if (open) {
      if (!dialog.open) {
        try {
          dialog.showModal()
        } catch {
          dialog.setAttribute('open', '')
        }
      }
    } else if (dialog.open) {
      closingRef.current = true
      dialog.close()
      closingRef.current = false
    }

    return () => {
      dialog.removeEventListener('close', onDialogClose)
      if (dialog.open) {
        closingRef.current = true
        dialog.close()
        closingRef.current = false
      }
    }
  }, [open, onClose])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !open) return undefined

    video.load()
    const play = video.play()
    if (play?.catch) play.catch(() => {})

    return () => {
      video.pause()
    }
  }, [open, src])

  if (typeof document === 'undefined') return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className="demo-dialog"
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`demo-dialog__panel${portrait ? ' demo-dialog__panel--portrait' : ' demo-dialog__panel--landscape'}`}
      >
        <div className="demo-dialog__bar">
          <h2 id={titleId} className="demo-dialog__title">
            Ejemplo Llisar
          </h2>
          <button
            type="button"
            className="demo-dialog__close"
            aria-label="Cerrar ejemplo"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="demo-dialog__stage">
          {open ? (
            <video
              ref={videoRef}
              className="demo-dialog__video"
              key={src}
              src={src}
              controls
              playsInline
              preload="auto"
              controlsList="nodownload"
            >
              Tu navegador no reproduce este video.
            </video>
          ) : null}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
