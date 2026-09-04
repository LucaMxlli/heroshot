'use client'

import { useCallback, useEffect, useState } from 'react'
import { CanvasStage } from '@/components/editor/CanvasStage'
import { ExportDialog } from '@/components/editor/ExportDialog'
import { ShortcutsDialog } from '@/components/editor/ShortcutsDialog'
import { Sidebar } from '@/components/editor/Sidebar'
import { TopBar } from '@/components/editor/TopBar'
import { Toast } from '@/components/ui/Toast'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { loadDocument, saveDocument } from '@/lib/persistence'
import { disposeScreenTextures } from '@/lib/screenTexture'
import { disposeProceduralTextures } from '@/lib/textures'
import { cx } from '@/lib/utils'

export function Editor() {
  const [exportOpen, setExportOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen)
  const { openPicker } = useImageUpload()

  const onExport = useCallback(() => setExportOpen(true), [])
  const onShortcuts = useCallback(() => setShortcutsOpen((value) => !value), [])
  const onUpload = useCallback(() => void openPicker(), [openPicker])

  useKeyboardShortcuts({ onExport, onUpload, onShortcuts })

  useEffect(() => {
    const stored = loadDocument()
    if (stored) useEditorStore.getState().hydrate(stored)

    let timer = 0
    const unsubscribe = useEditorStore.subscribe((state, previous) => {
      if (state.doc === previous.doc) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => saveDocument(useEditorStore.getState().doc), 400)
    })

    return () => {
      window.clearTimeout(timer)
      unsubscribe()
    }
  }, [])

  useEffect(
    () => () => {
      disposeScreenTextures()
      disposeProceduralTextures()
    },
    [],
  )

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[var(--app-bg)]">
      <TopBar onExport={onExport} onShortcuts={onShortcuts} />

      <div className="flex min-h-0 flex-1">
        <div
          className={cx(
            'flex min-h-0 transition-[width] duration-200 ease-out',
            sidebarOpen ? 'w-full md:w-[312px]' : 'w-0 overflow-hidden',
            sidebarOpen ? 'absolute inset-x-0 bottom-0 top-14 z-30 md:static' : '',
          )}
        >
          <Sidebar />
        </div>
        <CanvasStage />
      </div>

      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <Toast />
    </div>
  )
}
