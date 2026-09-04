'use client'

import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useEditorStore } from '@/hooks/useEditorStore'
import { getScreenTexture } from '@/lib/screenTexture'
import type { ScreenSlot } from '@/types'

export function useScreenTexture(aspect: number, slot: ScreenSlot = 'primary') {
  const screenId = useEditorStore((state) =>
    slot === 'companion' ? (state.doc.companionScreen?.id ?? null) : (state.doc.screen?.id ?? null),
  )
  const gl = useThree((state) => state.gl)
  const maxAnisotropy = gl.capabilities.getMaxAnisotropy()
  const fit = useEditorStore((state) => state.doc.scene.screenFit)

  return useMemo(
    () => getScreenTexture(screenId, aspect, Math.min(8, maxAnisotropy), fit),
    [screenId, aspect, maxAnisotropy, fit],
  )
}
