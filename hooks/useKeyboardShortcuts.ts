'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/hooks/useEditorStore'
import { getDeviceDistance, LIMITS } from '@/lib/defaults'
import { VIEW_PRESETS } from '@/lib/presets'
import { clamp } from '@/lib/utils'

interface ShortcutHandlers {
  onExport: () => void
  onUpload: () => void
  onShortcuts: () => void
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export function useKeyboardShortcuts({ onExport, onUpload, onShortcuts }: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const store = useEditorStore.getState()
      const meta = event.metaKey || event.ctrlKey

      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) store.redo()
        else store.undo()
        return
      }

      if (meta && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        store.redo()
        return
      }

      if (meta && event.key.toLowerCase() === 'e') {
        event.preventDefault()
        onExport()
        return
      }

      if (isTypingTarget(event.target) || meta) return

      const key = event.key

      if (key >= '1' && key <= '8') {
        const preset = VIEW_PRESETS[Number(key) - 1]
        if (preset) {
          event.preventDefault()
          store.applyPreset(preset.transform, preset.cameraDistance)
        }
        return
      }

      switch (key.toLowerCase()) {
        case 'u':
          event.preventDefault()
          onUpload()
          break
        case 'r':
          event.preventDefault()
          store.resetView()
          break
        case 'b':
          event.preventDefault()
          store.toggleSidebar()
          break
        case 'f':
          event.preventDefault()
          store.pushHistory()
          store.setScene({ floor: !store.doc.scene.floor })
          break
        case 'd': {
          event.preventDefault()
          const order = ['laptop', 'phone', 'display', 'imac', 'watch'] as const
          const next = order[(order.indexOf(store.doc.device.kind) + 1) % order.length]
          store.pushHistory()
          store.setDevice({ kind: next })
          store.setScene({ cameraDistance: getDeviceDistance({ ...store.doc.device, kind: next }) })
          break
        }
        case '?':
          onShortcuts()
          break
        default:
          break
      }

      const step = event.shiftKey ? 10 : 2
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        event.preventDefault()
        store.pushHistory()
        const delta = key === 'ArrowRight' ? step : -step
        store.setTransform({
          rotationY: clamp(store.doc.transform.rotationY + delta, LIMITS.rotationY.min, LIMITS.rotationY.max),
        })
      }
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault()
        store.pushHistory()
        const delta = key === 'ArrowDown' ? -step : step
        store.setTransform({
          rotationX: clamp(store.doc.transform.rotationX + delta, LIMITS.rotationX.min, LIMITS.rotationX.max),
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onExport, onShortcuts, onUpload])
}
