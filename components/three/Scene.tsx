'use client'

import { Suspense, useMemo } from 'react'
import { BackgroundQuad } from '@/components/three/BackgroundQuad'
import { Companion } from '@/components/three/Companion'
import { DeviceRig } from '@/components/three/DeviceRig'
import { Display, DISPLAY_MAX_ASPECT, DISPLAY_MIN_ASPECT } from '@/components/three/Display'
import { ExportRig } from '@/components/three/ExportRig'
import { GroundShadows } from '@/components/three/GroundShadows'
import { Imac, IMAC_MAX_ASPECT, IMAC_MIN_ASPECT } from '@/components/three/Imac'
import { Laptop, LAPTOP_MAX_ASPECT, LAPTOP_MIN_ASPECT } from '@/components/three/Laptop'
import { Phone } from '@/components/three/Phone'
import { StudioLighting } from '@/components/three/StudioLighting'
import { Watch } from '@/components/three/Watch'
import { useAdaptiveAspect } from '@/hooks/useAdaptiveAspect'
import { useEditorStore } from '@/hooks/useEditorStore'
import { markMainDrag, setMainHovered } from '@/lib/dragTarget'
import { getDisplayMetrics, getImacMetrics, getLaptopMetrics } from '@/lib/adaptiveScreen'
import { getLaptopSpec } from '@/lib/laptopVariants'
import {
  DISPLAY_SCREEN_ASPECT,
  IMAC_SCREEN_ASPECT,
  PHONE_HEIGHT,
  PHONE_WIDTH,
  WATCH_TOTAL_HEIGHT,
} from '@/lib/laptopDimensions'

export function Scene() {
  const kind = useEditorStore((state) => state.doc.device.kind)
  const orientation = useEditorStore((state) => state.doc.device.orientation)
  const screenOnly = useEditorStore((state) => state.doc.device.screenOnly)

  const laptopSpec = getLaptopSpec(useEditorStore((state) => state.doc.device.laptopModel))
  const laptopAspect = useAdaptiveAspect(laptopSpec.screenAspect, LAPTOP_MIN_ASPECT, LAPTOP_MAX_ASPECT)
  const displayAspect = useAdaptiveAspect(DISPLAY_SCREEN_ASPECT, DISPLAY_MIN_ASPECT, DISPLAY_MAX_ASPECT)
  const imacAspect = useAdaptiveAspect(IMAC_SCREEN_ASPECT, IMAC_MIN_ASPECT, IMAC_MAX_ASPECT)

  const groundY = useMemo(() => {
    if (kind === 'laptop') {
      const metrics = getLaptopMetrics(laptopSpec, laptopAspect, screenOnly)
      if (screenOnly) return -metrics.lidHeight / 2 - 0.14
      return metrics.pivotY - laptopSpec.baseThickness / 2 - 0.14
    }
    if (kind === 'display') return getDisplayMetrics(displayAspect).pivotY - 0.1
    if (kind === 'imac') return getImacMetrics(imacAspect).pivotY - 0.1
    if (kind === 'watch') return -WATCH_TOTAL_HEIGHT / 2 - 0.1
    return -(orientation === 'landscape' ? PHONE_WIDTH : PHONE_HEIGHT) / 2 - 0.1
  }, [kind, orientation, screenOnly, laptopSpec, laptopAspect, displayAspect, imacAspect])

  return (
    <>
      <BackgroundQuad />
      <StudioLighting />
      <Suspense fallback={null}>
        <DeviceRig>
          <group
            onPointerDown={(event) => {
              event.stopPropagation()
              markMainDrag()
            }}
            onPointerOver={(event) => {
              event.stopPropagation()
              setMainHovered(true)
            }}
            onPointerOut={() => setMainHovered(false)}
          >
            {kind === 'laptop' ? <Laptop /> : null}
            {kind === 'phone' ? <Phone /> : null}
            {kind === 'display' ? <Display /> : null}
            {kind === 'imac' ? <Imac /> : null}
            {kind === 'watch' ? <Watch /> : null}
          </group>
          <Companion />
        </DeviceRig>
      </Suspense>
      <GroundShadows groundY={groundY} />
      <ExportRig />
    </>
  )
}
