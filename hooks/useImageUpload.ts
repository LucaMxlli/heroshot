'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/hooks/useEditorStore'
import { ACCEPTED_EXTENSIONS, registerImageFile } from '@/lib/screenTexture'
import type { ScreenSlot } from '@/types'

export function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = ACCEPTED_EXTENSIONS
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.addEventListener('change', () => {
      resolve(input.files?.[0] ?? null)
      input.remove()
    })
    input.addEventListener('cancel', () => {
      resolve(null)
      input.remove()
    })
    input.click()
  })
}

export function useImageUpload(slot: ScreenSlot = 'primary') {
  const pushHistory = useEditorStore((state) => state.pushHistory)
  const setPrimary = useEditorStore((state) => state.setScreen)
  const setCompanion = useEditorStore((state) => state.setCompanionScreen)
  const setScreen = slot === 'companion' ? setCompanion : setPrimary
  const setProcessing = useEditorStore((state) => state.setProcessing)
  const notify = useEditorStore((state) => state.notify)

  const acceptFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return
      setProcessing(true)
      try {
        const screen = await registerImageFile(file)
        pushHistory()
        setScreen(screen)
        notify(`${screen.name} placed on the display`)
      } catch (error) {
        notify(error instanceof Error ? error.message : 'That image could not be loaded.')
      } finally {
        setProcessing(false)
      }
    },
    [notify, pushHistory, setProcessing, setScreen],
  )

  const acceptFiles = useCallback(
    (files: FileList | File[] | null) => {
      const list = files ? Array.from(files) : []
      return acceptFile(list[0])
    },
    [acceptFile],
  )

  const openPicker = useCallback(async () => {
    const file = await pickImageFile()
    await acceptFile(file)
  }, [acceptFile])

  const clearScreen = useCallback(() => {
    pushHistory()
    setScreen(null)
    notify('Reverted to the demo screen')
  }, [notify, pushHistory, setScreen])

  return { acceptFile, acceptFiles, openPicker, clearScreen }
}
