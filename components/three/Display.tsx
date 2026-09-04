'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Screen } from '@/components/three/Screen'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useAdaptiveAspect } from '@/hooks/useAdaptiveAspect'
import { getDisplayMetrics } from '@/lib/adaptiveScreen'
import { roundedBoxGeometry, roundedPlaneGeometry, roundedSlabGeometry } from '@/lib/geometry'
import { getBrushedRoughnessTexture } from '@/lib/textures'
import { getFinish } from '@/lib/presets'
import {
  DISPLAY_ARM_DEPTH,
  DISPLAY_ARM_HEIGHT,
  DISPLAY_ARM_WIDTH,
  DISPLAY_BEZEL,
  DISPLAY_CORNER_RADIUS,
  DISPLAY_FOOT_DEPTH,
  DISPLAY_FOOT_THICKNESS,
  DISPLAY_FOOT_WIDTH,
  DISPLAY_SCREEN_ASPECT,
  DISPLAY_SCREEN_WIDTH,
  DISPLAY_THICKNESS,
  DISPLAY_WIDTH,
} from '@/lib/laptopDimensions'

export const DISPLAY_MIN_ASPECT = 0.85
export const DISPLAY_MAX_ASPECT = 3.2

export function Display() {
  const finishId = useEditorStore((state) => state.doc.scene.finish)
  const finish = getFinish(finishId)
  const screenAspect = useAdaptiveAspect(DISPLAY_SCREEN_ASPECT, DISPLAY_MIN_ASPECT, DISPLAY_MAX_ASPECT)
  const { screenHeight, panelHeight, pivotY } = useMemo(
    () => getDisplayMetrics(screenAspect),
    [screenAspect],
  )

  const geometries = useMemo(
    () => ({
      panel: roundedBoxGeometry(
        DISPLAY_WIDTH,
        panelHeight,
        DISPLAY_THICKNESS,
        DISPLAY_CORNER_RADIUS,
        0.09,
        18,
      ),
      glass: roundedPlaneGeometry(
        DISPLAY_WIDTH - 0.06,
        panelHeight - 0.06,
        DISPLAY_CORNER_RADIUS - 0.03,
        18,
      ),
      arm: roundedBoxGeometry(DISPLAY_ARM_WIDTH, DISPLAY_ARM_HEIGHT + 3, DISPLAY_ARM_DEPTH, 1.4, 0.12, 12),
      foot: roundedSlabGeometry(
        DISPLAY_FOOT_WIDTH,
        DISPLAY_FOOT_DEPTH,
        DISPLAY_FOOT_THICKNESS,
        5.4,
        0.16,
        18,
      ),
      camera: new THREE.CircleGeometry(0.09, 20),
    }),
    [panelHeight],
  )

  useEffect(
    () => () => Object.values(geometries).forEach((geometry) => geometry.dispose()),
    [geometries],
  )

  const materials = useMemo(() => {
    const aluminium = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.body),
      metalness: finish.metalness,
      roughness: finish.roughness,
      roughnessMap: getBrushedRoughnessTexture(),
      envMapIntensity: 0.62,
    })
    return {
      aluminium,
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#08090c'),
        roughness: 0.42,
        metalness: 0.1,
        clearcoat: 0.35,
        clearcoatRoughness: 0.34,
        envMapIntensity: 0.32,
      }),
      dot: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#25282e'),
        roughness: 0.5,
        metalness: 0.3,
      }),
    }
  }, [finish])

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  )

  const panelCenterY = DISPLAY_FOOT_THICKNESS + DISPLAY_ARM_HEIGHT + panelHeight / 2
  const front = DISPLAY_THICKNESS / 2

  return (
    <group position={[0, pivotY, 0]}>
      <mesh
        geometry={geometries.foot}
        material={materials.aluminium}
        position={[0, DISPLAY_FOOT_THICKNESS / 2, -1.2]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometries.arm}
        material={materials.aluminium}
        position={[0, DISPLAY_FOOT_THICKNESS + (DISPLAY_ARM_HEIGHT + 3) / 2 - 1.2, -1.9]}
        castShadow
        receiveShadow
      />

      <group position={[0, panelCenterY, 0]}>
        <mesh geometry={geometries.panel} material={materials.aluminium} castShadow receiveShadow />
        <mesh geometry={geometries.glass} material={materials.glass} position={[0, 0, front + 0.005]} />
        <group position={[0, 0, front + 0.012]}>
          <Screen
            width={DISPLAY_SCREEN_WIDTH}
            height={screenHeight}
            radius={DISPLAY_CORNER_RADIUS - DISPLAY_BEZEL}
          />
        </group>
        <mesh
          geometry={geometries.camera}
          material={materials.dot}
          position={[0, panelHeight / 2 - 0.62, front + 0.014]}
        />
      </group>
    </group>
  )
}
