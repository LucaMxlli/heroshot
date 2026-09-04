'use client'

import { useEffect, type ReactNode } from 'react'
import { CloseIcon } from '@/components/ui/Icons'
import { IconButton } from '@/components/ui/Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: number
}

export function Modal({ open, title, description, onClose, children, footer, width = 460 }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxWidth: width }}
        className="animate-fade-up relative w-full overflow-hidden rounded-2xl border border-[var(--app-border-strong)] bg-[var(--app-panel)] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-[12.5px] text-[var(--app-ink-soft)]">{description}</p>
            ) : null}
          </div>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="px-5 pb-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-[var(--app-border)] bg-[var(--app-muted)] px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
