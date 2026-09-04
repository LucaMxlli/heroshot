'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Screen } from '@/components/three/Screen'
import { useEditorStore } from '@/hooks/useEditorStore'
import type { ScreenSlot } from '@/types'
import { roundedBoxGeometry, roundedPlaneGeometry } from '@/lib/geometry'
import { getFinish } from '@/lib/presets'
import {
  PHONE_BEZEL,
  PHONE_CORNER_RADIUS,
  PHONE_HEIGHT,
  PHONE_SCREEN_HEIGHT,
  PHONE_SCREEN_WIDTH,
  PHONE_THICKNESS,
  PHONE_WIDTH,
} from '@/lib/laptopDimensions'

const BUMP_SIZE = 3.55
const BUMP_HEIGHT = 0.24
const LENS_RADIUS = 0.56
const LENS_SPREAD = 0.82

export function Phone({ slot = 'primary', forcePortrait = false }: { slot?: ScreenSlot; forcePortrait?: boolean } = {}) {
  const finishId = useEditorStore((state) => state.doc.scene.finish)
  const orientation = useEditorStore((state) => state.doc.device.orientation)
  const finish = getFinish(finishId)
  const landscape = !forcePortrait && orientation === 'landscape'

  const geometries = useMemo(
    () => ({
      island: roundedPlaneGeometry(2.74, 0.64, 0.32, 16),
      body: roundedBoxGeometry(PHONE_WIDTH, PHONE_HEIGHT, PHONE_THICKNESS, PHONE_CORNER_RADIUS, 0.16, 20),
      glass: roundedPlaneGeometry(PHONE_WIDTH - 0.03, PHONE_HEIGHT - 0.03, PHONE_CORNER_RADIUS - 0.015, 20),
      bump: roundedBoxGeometry(BUMP_SIZE, BUMP_SIZE, BUMP_HEIGHT, 1.12, 0.07, 16),
      lensRing: new THREE.CylinderGeometry(LENS_RADIUS, LENS_RADIUS * 0.94, 0.2, 32),
      lensGlass: new THREE.CylinderGeometry(LENS_RADIUS * 0.66, LENS_RADIUS * 0.66, 0.06, 32),
      lensIris: new THREE.CylinderGeometry(LENS_RADIUS * 0.3, LENS_RADIUS * 0.3, 0.02, 24),
      flash: new THREE.CylinderGeometry(0.26, 0.26, 0.1, 24),
      lidar: new THREE.CylinderGeometry(0.17, 0.17, 0.08, 20),
      micDot: new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12),
      volumeButton: roundedBoxGeometry(0.14, 1.32, 0.4, 0.06, 0.025, 6),
      actionButton: roundedBoxGeometry(0.14, 0.66, 0.4, 0.06, 0.025, 6),
      powerButton: roundedBoxGeometry(0.14, 1.9, 0.4, 0.06, 0.025, 6),
      antenna: roundedBoxGeometry(0.06, 0.06, PHONE_THICKNESS + 0.02, 0.02, 0.01, 4),
      usbc: roundedPlaneGeometry(0.94, 0.34, 0.17, 12),
      speakerHole: new THREE.CircleGeometry(0.07, 14),
    }),
    [],
  )

  useEffect(
    () => () => Object.values(geometries).forEach((geometry) => geometry.dispose()),
    [geometries],
  )

  const materials = useMemo(() => {
    const rail = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.body),
      metalness: 0.6,
      roughness: Math.max(0.3, finish.roughness - 0.16),
      envMapIntensity: 0.62,
    })
    return {
      rail,
      backGlass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(finish.body),
        metalness: 0.2,
        roughness: 0.62,
        clearcoat: 0.2,
        clearcoatRoughness: 0.6,
        envMapIntensity: 0.4,
      }),
      island: new THREE.MeshBasicMaterial({ color: new THREE.Color('#040405') }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#08090c'),
        roughness: 0.36,
        metalness: 0.1,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.35,
      }),
      lens: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#090b10'),
        roughness: 0.06,
        metalness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.6,
      }),
      iris: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1b2a45'),
        roughness: 0.2,
        metalness: 0.6,
      }),
      lensRing: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#43464d'),
        metalness: 1,
        roughness: 0.22,
      }),
      flash: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#efe2c4'),
        emissive: new THREE.Color('#5c5137'),
        roughness: 0.35,
        metalness: 0.1,
      }),
      lidar: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#151821'),
        roughness: 0.3,
        metalness: 0.4,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0f1116'),
        roughness: 0.9,
        metalness: 0.1,
      }),
      antenna: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8d9099'),
        roughness: 0.6,
        metalness: 0.3,
      }),
    }
  }, [finish])

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  )

  const front = PHONE_THICKNESS / 2
  const back = -PHONE_THICKNESS / 2
  const bumpX = -PHONE_WIDTH / 2 + BUMP_SIZE / 2 + 0.42
  const bumpY = PHONE_HEIGHT / 2 - BUMP_SIZE / 2 - 0.42
  const bottomY = -PHONE_HEIGHT / 2

  const lenses: Array<[number, number]> = [
    [-LENS_SPREAD, LENS_SPREAD],
    [-LENS_SPREAD, -LENS_SPREAD],
    [LENS_SPREAD, -LENS_SPREAD],
  ]

  return (
    <group rotation={[0, 0, landscape ? -Math.PI / 2 : 0]}>
      <mesh geometry={geometries.body} material={materials.rail} castShadow receiveShadow />
      <mesh
        geometry={geometries.glass}
        material={materials.backGlass}
        position={[0, 0, back - 0.004]}
        rotation={[0, Math.PI, 0]}
      />
      <mesh geometry={geometries.glass} material={materials.glass} position={[0, 0, front + 0.004]} />

      <group position={[0, 0, front + 0.01]}>
        <Screen
          slot={slot}
          width={landscape ? PHONE_SCREEN_HEIGHT : PHONE_SCREEN_WIDTH}
          height={landscape ? PHONE_SCREEN_WIDTH : PHONE_SCREEN_HEIGHT}
          radius={PHONE_CORNER_RADIUS - PHONE_BEZEL}
          rotationZ={landscape ? Math.PI / 2 : 0}
        />
      </group>

      <mesh
        geometry={geometries.island}
        material={materials.island}
        position={[0, PHONE_HEIGHT / 2 - 0.74, front + 0.015]}
      />

      <group position={[bumpX, bumpY, back - BUMP_HEIGHT / 2]}>
        <mesh geometry={geometries.bump} material={materials.rail} castShadow />
        {lenses.map(([x, y]) => (
          <group key={`${x}-${y}`} position={[x, y, -BUMP_HEIGHT / 2 - 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={geometries.lensRing} material={materials.lensRing} />
            <mesh geometry={geometries.lensGlass} material={materials.lens} position={[0, -0.08, 0]} />
            <mesh geometry={geometries.lensIris} material={materials.iris} position={[0, -0.11, 0]} />
          </group>
        ))}
        <mesh
          geometry={geometries.flash}
          material={materials.flash}
          position={[LENS_SPREAD + 0.06, LENS_SPREAD + 0.16, -BUMP_HEIGHT / 2 - 0.03]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={geometries.lidar}
          material={materials.lidar}
          position={[LENS_SPREAD + 0.06, LENS_SPREAD - 0.66, -BUMP_HEIGHT / 2 - 0.03]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={geometries.micDot}
          material={materials.lidar}
          position={[LENS_SPREAD - 0.5, LENS_SPREAD + 0.5, -BUMP_HEIGHT / 2 - 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      <mesh
        geometry={geometries.actionButton}
        material={materials.rail}
        position={[-PHONE_WIDTH / 2 - 0.025, 4.15, 0]}
      />
      <mesh
        geometry={geometries.volumeButton}
        material={materials.rail}
        position={[-PHONE_WIDTH / 2 - 0.025, 2.55, 0]}
      />
      <mesh
        geometry={geometries.volumeButton}
        material={materials.rail}
        position={[-PHONE_WIDTH / 2 - 0.025, 0.95, 0]}
      />
      <mesh
        geometry={geometries.powerButton}
        material={materials.rail}
        position={[PHONE_WIDTH / 2 + 0.025, 2.1, 0]}
      />

      {[
        [-PHONE_WIDTH / 2, 5.55],
        [-PHONE_WIDTH / 2, -5.55],
        [PHONE_WIDTH / 2, 5.55],
        [PHONE_WIDTH / 2, -5.55],
      ].map(([x, y]) => (
        <mesh key={`antenna-${x}-${y}`} geometry={geometries.antenna} material={materials.antenna} position={[x, y, 0]} />
      ))}

      <mesh
        geometry={geometries.usbc}
        material={materials.dark}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, bottomY + 0.005, 0]}
      />
      {[-3, -2, -1, 1, 2, 3].map((index) => (
        <mesh
          key={`speaker-${index}`}
          geometry={geometries.speakerHole}
          material={materials.dark}
          rotation={[Math.PI / 2, 0, 0]}
          position={[index * 0.26 + Math.sign(index) * 0.62, bottomY + 0.005, 0]}
        />
      ))}
    </group>
  )
}
