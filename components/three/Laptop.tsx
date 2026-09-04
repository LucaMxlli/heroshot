'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Keyboard } from '@/components/three/Keyboard'
import { Screen } from '@/components/three/Screen'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useAdaptiveAspect } from '@/hooks/useAdaptiveAspect'
import { getLaptopMetrics } from '@/lib/adaptiveScreen'
import {
  roundedBoxGeometry,
  roundedPlaneGeometry,
  roundedRectShape,
  roundedSlabGeometry,
} from '@/lib/geometry'
import { getBrushedRoughnessTexture, getSpeakerGrilleTexture } from '@/lib/textures'
import { getFinish } from '@/lib/presets'
import { registerSnapshotHandler } from '@/lib/exportBridge'
import { damp } from '@/lib/utils'
import {
  BASE_DEPTH,
  FRONT_SCOOP_DEPTH,
  FRONT_SCOOP_WIDTH,
  PORTS,
  VENT_PITCH,
  VENT_SLOT_COUNT,
  VENT_SLOT_HEIGHT,
  VENT_SLOT_WIDTH,
  VENT_START_Z,
  BASE_THICKNESS,
  BASE_WIDTH,
  CORNER_RADIUS,
  HINGE_INSET,
  KEYBOARD_DEPTH,
  KEYBOARD_WIDTH,
  LID_THICKNESS,
  LID_WIDTH,
  SCREEN_ASPECT,
  SCREEN_WIDTH,
  TRACKPAD_DEPTH,
  TRACKPAD_WIDTH,
} from '@/lib/laptopDimensions'

const DEG = Math.PI / 180
export const LAPTOP_MIN_ASPECT = 1.05
export const LAPTOP_MAX_ASPECT = 2.6
const BASE_TOP = BASE_THICKNESS / 2
const KEYBOARD_CENTER_Z = -BASE_DEPTH / 2 + 1.45 + KEYBOARD_DEPTH / 2
const TRACKPAD_CENTER_Z = BASE_DEPTH / 2 - 1.95 - TRACKPAD_DEPTH / 2

export function Laptop() {
  const hinge = useRef<THREE.Group>(null)
  const finishId = useEditorStore((state) => state.doc.scene.finish)
  const finish = getFinish(finishId)
  const screenAspect = useAdaptiveAspect(SCREEN_ASPECT, LAPTOP_MIN_ASPECT, LAPTOP_MAX_ASPECT)
  const { screenHeight, lidHeight, screenOffsetY, pivotY } = useMemo(
    () => getLaptopMetrics(screenAspect),
    [screenAspect],
  )

  const geometries = useMemo(
    () => ({
      base: roundedSlabGeometry(BASE_WIDTH, BASE_DEPTH, BASE_THICKNESS, CORNER_RADIUS, 0.13, 20),
      lid: roundedBoxGeometry(LID_WIDTH, lidHeight, LID_THICKNESS, CORNER_RADIUS, 0.1, 18),
      glass: roundedPlaneGeometry(LID_WIDTH - 0.06, lidHeight - 0.06, CORNER_RADIUS - 0.03, 14),
      well: roundedSlabGeometry(KEYBOARD_WIDTH + 0.42, KEYBOARD_DEPTH + 0.36, 0.06, 0.34, 0.02, 10),
      trackpadSeam: roundedSlabGeometry(TRACKPAD_WIDTH + 0.09, TRACKPAD_DEPTH + 0.09, 0.04, 0.62, 0.014, 10),
      trackpad: roundedSlabGeometry(TRACKPAD_WIDTH, TRACKPAD_DEPTH, 0.05, 0.58, 0.016, 10),
      grille: roundedPlaneGeometry(2.35, KEYBOARD_DEPTH - 0.4, 0.25, 8),
      foot: new THREE.CylinderGeometry(0.42, 0.46, 0.13, 20),
      hingeBar: new THREE.CylinderGeometry(0.3, 0.3, BASE_WIDTH - 2.4, 24),
      camera: new THREE.CircleGeometry(0.062, 20),
      vent: roundedPlaneGeometry(VENT_SLOT_WIDTH, VENT_SLOT_HEIGHT, VENT_SLOT_WIDTH / 2, 6),
      scoop: roundedPlaneGeometry(FRONT_SCOOP_WIDTH, FRONT_SCOOP_DEPTH, FRONT_SCOOP_DEPTH / 2, 12),
    }),
    [lidHeight],
  )

  useEffect(
    () => () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose())
    },
    [geometries],
  )

  const materials = useMemo(() => {
    const roughnessMap = getBrushedRoughnessTexture()
    const aluminium = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.body),
      metalness: finish.metalness,
      roughness: finish.roughness,
      roughnessMap,
      envMapIntensity: 0.62,
    })
    return {
      aluminium,
      well: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0a0b0e'),
        roughness: 0.9,
        metalness: 0.1,
      }),
      trackpad: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(finish.body),
        metalness: 0.45,
        roughness: 0.42,
        clearcoat: 0.2,
        clearcoatRoughness: 0.45,
        envMapIntensity: 0.5,
      }),
      seam: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3c3f45'),
        roughness: 0.92,
        metalness: 0.15,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0a0b0e'),
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.4,
        clearcoatRoughness: 0.32,
        envMapIntensity: 0.35,
      }),
      grille: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#101216'),
        roughness: 0.85,
        metalness: 0.1,
        alphaMap: getSpeakerGrilleTexture(),
        transparent: true,
        depthWrite: false,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0c0d10'),
        roughness: 0.72,
        metalness: 0.3,
      }),
      port: new THREE.MeshBasicMaterial({ color: new THREE.Color('#000000') }),
      portRim: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e6e9ee'),
        roughness: 0.25,
        metalness: 0.9,
        envMapIntensity: 1.4,
      }),
      scoop: new THREE.MeshStandardMaterial({
        color: new THREE.Color(finish.body).multiplyScalar(0.72),
        roughness: finish.roughness + 0.12,
        metalness: finish.metalness,
        envMapIntensity: 0.4,
      }),
    }
  }, [finish])

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose())
    },
    [materials],
  )

  const applyLid = (immediate: boolean, delta = 0) => {
    const lid = hinge.current
    if (!lid) return
    const target = (90 - useEditorStore.getState().doc.transform.lidAngle) * DEG
    lid.rotation.x = immediate ? target : damp(lid.rotation.x, target, 13, delta)
  }

  useEffect(() => {
    applyLid(true)
    return registerSnapshotHandler(() => applyLid(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => applyLid(false, Math.min(delta, 0.05)))

  return (
    <group position={[0, pivotY, 0]}>
        <mesh geometry={geometries.base} material={materials.aluminium} castShadow receiveShadow />

        <mesh
          geometry={geometries.hingeBar}
          material={materials.dark}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, BASE_TOP - 0.24, -BASE_DEPTH / 2 + HINGE_INSET]}
        />
        <mesh
          geometry={geometries.scoop}
          material={materials.scoop}
          position={[0, 0.02, BASE_DEPTH / 2 + 0.03]}
        />

        {[-1, 1].map((side) =>
          Array.from({ length: VENT_SLOT_COUNT }).map((_, index) => (
            <mesh
              key={`vent-${side}-${index}`}
              geometry={geometries.vent}
              material={materials.port}
              rotation={[0, (side * Math.PI) / 2, 0]}
              position={[side * (BASE_WIDTH / 2 + 0.028), 0, VENT_START_Z + index * VENT_PITCH]}
            />
          )),
        )}

        {PORTS.map((port, index) => (
          <group
            key={`port-${index}`}
            rotation={[0, (port.side * Math.PI) / 2, 0]}
            position={[port.side * (BASE_WIDTH / 2 + 0.035), 0, port.z]}
          >
            <mesh material={materials.portRim}>
              <shapeGeometry
                args={[roundedRectShape(port.width + 0.05, port.height + 0.05, port.radius + 0.025)]}
              />
            </mesh>
            <mesh material={materials.port} position={[0, 0, 0.006]}>
              <shapeGeometry args={[roundedRectShape(port.width, port.height, port.radius)]} />
            </mesh>
          </group>
        ))}

        <mesh
          geometry={geometries.well}
          material={materials.well}
          position={[0, BASE_TOP + 0.004, KEYBOARD_CENTER_Z]}
          receiveShadow
        />

        <group position={[0, BASE_TOP + 0.035, KEYBOARD_CENTER_Z]}>
          <Keyboard keyColor={finish.key} />
        </group>

        {[-1, 1].map((side) => (
          <mesh
            key={side}
            geometry={geometries.grille}
            material={materials.grille}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[side * (KEYBOARD_WIDTH / 2 + 1.55), BASE_TOP + 0.005, KEYBOARD_CENTER_Z]}
          />
        ))}

        <mesh
          geometry={geometries.trackpadSeam}
          material={materials.seam}
          position={[0, BASE_TOP + 0.002, TRACKPAD_CENTER_Z]}
        />
        <mesh
          geometry={geometries.trackpad}
          material={materials.trackpad}
          position={[0, BASE_TOP + 0.012, TRACKPAD_CENTER_Z]}
          receiveShadow
        />

        {[
          [-BASE_WIDTH / 2 + 2.6, -BASE_DEPTH / 2 + 2.2],
          [BASE_WIDTH / 2 - 2.6, -BASE_DEPTH / 2 + 2.2],
          [-BASE_WIDTH / 2 + 2.6, BASE_DEPTH / 2 - 2.2],
          [BASE_WIDTH / 2 - 2.6, BASE_DEPTH / 2 - 2.2],
        ].map(([x, z]) => (
          <mesh
            key={`${x}-${z}`}
            geometry={geometries.foot}
            material={materials.dark}
            position={[x, -BASE_THICKNESS / 2 - 0.05, z]}
          />
        ))}

        <group ref={hinge} position={[0, BASE_TOP - 0.08, -BASE_DEPTH / 2 + HINGE_INSET]}>
          <group position={[0, lidHeight / 2, -LID_THICKNESS / 2]}>
            <mesh geometry={geometries.lid} material={materials.aluminium} castShadow receiveShadow />
            <mesh
              geometry={geometries.glass}
              material={materials.glass}
              position={[0, 0, LID_THICKNESS / 2 + 0.005]}
            />
            <group position={[0, screenOffsetY, LID_THICKNESS / 2 + 0.014]}>
              <Screen width={SCREEN_WIDTH} height={screenHeight} radius={0.22} />
            </group>
            <mesh
              geometry={geometries.camera}
              material={materials.seam}
              position={[
                0,
                screenOffsetY + screenHeight / 2 + 0.28,
                LID_THICKNESS / 2 + 0.023,
              ]}
            />
          </group>
      </group>
    </group>
  )
}
