'use client'

import { useEditorStore } from '@/hooks/useEditorStore'
import { clamp } from '@/lib/utils'

export function useAdaptiveAspect(nativeAspect: number, min: number, max: number) {
  const ratio = useEditorStore((state) => state.doc.scene.screenRatio)
  const width = useEditorStore((state) => state.doc.screen?.width ?? 0)
  const height = useEditorStore((state) => state.doc.screen?.height ?? 0)

  if (ratio !== 'image' || width <= 0 || height <= 0) return nativeAspect
  return clamp(width / height, min, max)
}
