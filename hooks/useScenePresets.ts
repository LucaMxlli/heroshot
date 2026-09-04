'use client'

import { useCallback, useEffect } from 'react'
import { useEditorStore } from '@/hooks/useEditorStore'
import {
  buildPresetFile,
  downloadPreset,
  loadCustomPresets,
  parsePresetFile,
  pickJsonFile,
  saveCustomPresets,
  type PresetFile,
  type PresetPayload,
} from '@/lib/presetIO'

let hydrated = false

export function useScenePresets() {
  const presets = useEditorStore((state) => state.presets)
  const setPresets = useEditorStore((state) => state.setPresets)

  useEffect(() => {
    if (hydrated) return
    hydrated = true
    setPresets(loadCustomPresets())
  }, [setPresets])

  const currentPayload = useCallback((): PresetPayload => {
    const { doc } = useEditorStore.getState()
    return {
      device: doc.device,
      companion: doc.companion,
      transform: doc.transform,
      background: doc.background,
      scene: doc.scene,
    }
  }, [])

  const applyPreset = useCallback((preset: PresetFile) => {
    const store = useEditorStore.getState()
    store.pushHistory()
    store.setDevice(preset.payload.device)
    store.setCompanion(preset.payload.companion)
    store.setTransform(preset.payload.transform)
    store.setBackground(preset.payload.background)
    store.setScene(preset.payload.scene)
    store.notify(`Applied “${preset.name}”`)
  }, [])

  const saveCurrent = useCallback(() => {
    const store = useEditorStore.getState()
    const suggestion = `Scene ${presets.length + 1}`
    const name = window.prompt('Name this scene', suggestion)
    if (name === null) return
    const preset = buildPresetFile(name, currentPayload())
    const next = [preset, ...presets]
    setPresets(next)
    saveCustomPresets(next)
    store.notify(`Saved “${preset.name}”`)
  }, [presets, currentPayload])

  const removePreset = useCallback(
    (id: string) => {
      const next = presets.filter((entry) => entry.id !== id)
      setPresets(next)
      saveCustomPresets(next)
    },
    [presets],
  )

  const importPreset = useCallback(async () => {
    const store = useEditorStore.getState()
    const file = await pickJsonFile()
    if (!file) return
    try {
      const preset = parsePresetFile(await file.text())
      const next = [preset, ...presets]
      setPresets(next)
      saveCustomPresets(next)
      applyPreset(preset)
    } catch (error) {
      store.notify(error instanceof Error ? error.message : 'That preset could not be read.')
    }
  }, [presets, applyPreset])

  const exportCurrent = useCallback(
    (name = 'Current scene') => {
      downloadPreset(buildPresetFile(name, currentPayload()))
      useEditorStore.getState().notify('Preset exported as JSON')
    },
    [currentPayload],
  )

  return { presets, applyPreset, saveCurrent, removePreset, importPreset, exportCurrent, downloadPreset }
}
