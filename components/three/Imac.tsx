'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Screen } from '@/components/three/Screen'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useAdaptiveAspect } from '@/hooks/useAdaptiveAspect'
import { getImacMetrics } from '@/lib/adaptiveScreen'
import { roundedBoxGeometry, roundedPlaneGeometry, roundedSlabGeometry } from '@/lib/geometry'
import { getBrushedRoughnessTexture } from '@/lib/textures'
import { getFinish } from '@/lib/presets'
import {
  IMAC_ARM_DEPTH,
  IMAC_ARM_HEIGHT,
  IMAC_ARM_WIDTH,
  IMAC_BEZEL_SIDE,
  IMAC_CORNER_RADIUS,
  IMAC_FOOT_DEPTH,
  IMAC_FOOT_THICKNESS,
  IMAC_FOOT_WIDTH,
  IMAC_SCREEN_ASPECT,
  IMAC_SCREEN_WIDTH,
  IMAC_THICKNESS,
  IMAC_WIDTH,
} from '@/lib/laptopDimensions'

export const IMAC_MIN_ASPECT = 0.85
export const IMAC_MAX_ASPECT = 3.2

export function Imac() {
  const finishId = useEditorStore((state) => state.doc.scene.finish)
  const finish = getFinish(finishId)
  const screenAspect = useAdaptiveAspect(IMAC_SCREEN_ASPECT, IMAC_MIN_ASPECT, IMAC_MAX_ASPECT)
  const { screenHeight, panelHeight, screenOffsetY, pivotY } = useMemo(
    () => getImacMetrics(screenAspect),
    [screenAspect],
  )

  const geometries = useMemo(
    () => ({
      panel: roundedBoxGeometry(IMAC_WIDTH, panelHeight, IMAC_THICKNESS, IMAC_CORNER_RADIUS, 0.08, 18),
      face: roundedPlaneGeometry(IMAC_WIDTH - 0.05, panelHeight - 0.05, IMAC_CORNER_RADIUS - 0.025, 18),
      glass: roundedPlaneGeometry(
        IMAC_WIDTH - IMAC_BEZEL_SIDE * 0.55,
        screenHeight + 2.2,
        0.6,
        14,
      ),
      arm: roundedBoxGeometry(IMAC_ARM_WIDTH, IMAC_ARM_HEIGHT + 3.4, IMAC_ARM_DEPTH, 1.1, 0.1, 12),
      foot: roundedSlabGeometry(IMAC_FOOT_WIDTH, IMAC_FOOT_DEPTH, IMAC_FOOT_THICKNESS, 6.4, 0.14, 18),
      camera: new THREE.CircleGeometry(0.11, 20),
    }),
    [panelHeight, screenHeight],
  )

  useEffect(
    () => () => Object.values(geometries).forEach((geometry) => geometry.dispose()),
    [geometries],
  )

  const materials = useMemo(() => {
    const back = new THREE.Color(finish.body)
    const chin = back.clone().lerp(new THREE.Color('#ffffff'), 0.62)
    return {
      shell: new THREE.MeshStandardMaterial({
        color: back,
        metalness: finish.metalness,
        roughness: finish.roughness,
        roughnessMap: getBrushedRoughnessTexture(),
        envMapIntensity: 0.6,
      }),
      face: new THREE.MeshStandardMaterial({
        color: chin,
        metalness: 0.35,
        roughness: 0.5,
        envMapIntensity: 0.45,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#07080b'),
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.35,
        clearcoatRoughness: 0.32,
        envMapIntensity: 0.3,
      }),
      dot: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2a2d33'),
        roughness: 0.5,
        metalness: 0.3,
      }),
    }
  }, [finish])

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  )

  const panelCenterY = IMAC_FOOT_THICKNESS + IMAC_ARM_HEIGHT + panelHeight / 2
  const front = IMAC_THICKNESS / 2

  return (
    <group position={[0, pivotY, 0]}>
      <mesh
        geometry={geometries.foot}
        material={materials.shell}
        position={[0, IMAC_FOOT_THICKNESS / 2, -0.8]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometries.arm}
        material={materials.shell}
        position={[0, IMAC_FOOT_THICKNESS + (IMAC_ARM_HEIGHT + 3.4) / 2 - 1.5, -1.3]}
        castShadow
        receiveShadow
      />

      <group position={[0, panelCenterY, 0]}>
        <mesh geometry={geometries.panel} material={materials.shell} castShadow receiveShadow />
        <mesh geometry={geometries.face} material={materials.face} position={[0, 0, front + 0.004]} />
        <mesh
          geometry={geometries.glass}
          material={materials.glass}
          position={[0, screenOffsetY, front + 0.009]}
        />
        <group position={[0, screenOffsetY, front + 0.014]}>
          <Screen
            width={IMAC_SCREEN_WIDTH}
            height={screenHeight}
            radius={0.35}
          />
        </group>
        <mesh
          geometry={geometries.camera}
          material={materials.dot}
          position={[0, panelHeight / 2 - 0.68, front + 0.016]}
        />
      </group>
    </group>
  )
}
