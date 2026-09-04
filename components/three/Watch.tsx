'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Screen } from '@/components/three/Screen'
import { useEditorStore } from '@/hooks/useEditorStore'
import type { ScreenSlot } from '@/types'
import { roundedBoxGeometry, roundedPlaneGeometry } from '@/lib/geometry'
import { getFinish } from '@/lib/presets'
import {
  WATCH_BAND_LENGTH,
  WATCH_BAND_THICKNESS,
  WATCH_BAND_WIDTH,
  WATCH_BEZEL,
  WATCH_CORNER_RADIUS,
  WATCH_HEIGHT,
  WATCH_SCREEN_HEIGHT,
  WATCH_SCREEN_WIDTH,
  WATCH_THICKNESS,
  WATCH_WIDTH,
} from '@/lib/laptopDimensions'

export function Watch({ slot = 'primary' }: { slot?: ScreenSlot } = {}) {
  const finishId = useEditorStore((state) => state.doc.scene.finish)
  const finish = getFinish(finishId)

  const geometries = useMemo(
    () => ({
      body: roundedBoxGeometry(WATCH_WIDTH, WATCH_HEIGHT, WATCH_THICKNESS, WATCH_CORNER_RADIUS, 0.14, 20),
      glass: roundedPlaneGeometry(WATCH_WIDTH - 0.04, WATCH_HEIGHT - 0.04, WATCH_CORNER_RADIUS - 0.02, 20),
      band: roundedBoxGeometry(WATCH_BAND_WIDTH, WATCH_BAND_LENGTH, WATCH_BAND_THICKNESS, 0.22, 0.08, 10),
      crown: new THREE.CylinderGeometry(0.24, 0.24, 0.3, 24),
      crownCap: new THREE.CylinderGeometry(0.14, 0.14, 0.06, 20),
      button: roundedBoxGeometry(0.16, 0.86, 0.3, 0.07, 0.03, 8),
      sensor: new THREE.CylinderGeometry(0.62, 0.62, 0.08, 28),
    }),
    [],
  )

  useEffect(
    () => () => Object.values(geometries).forEach((geometry) => geometry.dispose()),
    [geometries],
  )

  const materials = useMemo(
    () => ({
      case: new THREE.MeshStandardMaterial({
        color: new THREE.Color(finish.body),
        metalness: Math.min(1, finish.metalness + 0.25),
        roughness: Math.max(0.2, finish.roughness - 0.2),
        envMapIntensity: 0.85,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#05060a'),
        roughness: 0.16,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.55,
      }),
      band: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a1c21'),
        roughness: 0.82,
        metalness: 0.05,
      }),
      sensor: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0b1016'),
        roughness: 0.2,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    }),
    [finish],
  )

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  )

  const front = WATCH_THICKNESS / 2
  const bandOffset = WATCH_HEIGHT / 2 + WATCH_BAND_LENGTH / 2 - 0.25

  return (
    <group>
      <mesh geometry={geometries.body} material={materials.case} castShadow receiveShadow />
      <mesh geometry={geometries.glass} material={materials.glass} position={[0, 0, front + 0.004]} />
      <group position={[0, 0, front + 0.011]}>
        <Screen
          slot={slot}
          width={WATCH_SCREEN_WIDTH}
          height={WATCH_SCREEN_HEIGHT}
          radius={WATCH_CORNER_RADIUS - WATCH_BEZEL}
        />
      </group>

      <mesh
        geometry={geometries.crown}
        material={materials.case}
        rotation={[0, 0, Math.PI / 2]}
        position={[WATCH_WIDTH / 2 + 0.12, 0.42, 0]}
      />
      <mesh
        geometry={geometries.crownCap}
        material={materials.sensor}
        rotation={[0, 0, Math.PI / 2]}
        position={[WATCH_WIDTH / 2 + 0.28, 0.42, 0]}
      />
      <mesh
        geometry={geometries.button}
        material={materials.case}
        position={[WATCH_WIDTH / 2 + 0.05, -0.62, 0]}
      />

      <mesh
        geometry={geometries.sensor}
        material={materials.sensor}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -front - 0.03]}
      />

      <mesh
        geometry={geometries.band}
        material={materials.band}
        position={[0, bandOffset, -0.3]}
        rotation={[0.34, 0, 0]}
        castShadow
      />
      <mesh
        geometry={geometries.band}
        material={materials.band}
        position={[0, -bandOffset, -0.3]}
        rotation={[-0.34, 0, 0]}
        castShadow
      />
    </group>
  )
}
