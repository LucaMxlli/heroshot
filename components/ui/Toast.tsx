'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/hooks/useEditorStore'

export function Toast() {
  const toast = useEditorStore((state) => state.toast)
  const dismiss = useEditorStore((state) => state.dismissToast)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismiss, 3200)
    return () => window.clearTimeout(timer)
  }, [toast, dismiss])

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        key={toast.id}
        role="status"
        className="animate-fade-up rounded-xl bg-[var(--app-ink)] px-3.5 py-2 text-[13px] font-medium text-[var(--app-bg)] shadow-xl"
      >
        {toast.message}
      </div>
    </div>
  )
}
