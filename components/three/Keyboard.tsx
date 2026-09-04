'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { buildKeyboardLayout, groupKeysBySize } from '@/lib/keyboardLayout'
import { createKeyboardLegendTexture } from '@/lib/keyboardLegends'
import { roundedPlaneGeometry, roundedSlabGeometry } from '@/lib/geometry'
import type { LaptopSpec } from '@/lib/laptopVariants'

const KEY_HEIGHT = 0.22

interface KeyboardProps {
  keyColor: string
  spec: LaptopSpec
}

export function Keyboard({ keyColor, spec }: KeyboardProps) {
  const keys = useMemo(
    () => buildKeyboardLayout(spec.keyboardWidth, spec.keyboardDepth, 0.24, spec.touchBar),
    [spec],
  )

  const groups = useMemo(
    () =>
      groupKeysBySize(keys.filter((key) => key.role !== 'touchbar')).map((group) => ({
        ...group,
        geometry: roundedSlabGeometry(group.width, group.depth, KEY_HEIGHT, 0.1, 0.055, 6),
      })),
    [keys],
  )

  const legendGeometry = useMemo(
    () => roundedPlaneGeometry(spec.keyboardWidth, spec.keyboardDepth, 0.2, 4),
    [spec],
  )

  const legendTexture = useMemo(
    () =>
      typeof document === 'undefined'
        ? null
        : createKeyboardLegendTexture(keys, spec.keyboardWidth, spec.keyboardDepth),
    [keys, spec],
  )

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(keyColor),
        roughness: 0.48,
        metalness: 0.05,
      }),
    [keyColor],
  )

  const legendMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: legendTexture ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.92,
      }),
    [legendTexture],
  )

  useEffect(() => () => material.dispose(), [material])
  useEffect(() => () => legendMaterial.dispose(), [legendMaterial])
  useEffect(() => () => legendTexture?.dispose(), [legendTexture])
  useEffect(() => () => legendGeometry.dispose(), [legendGeometry])
  useEffect(() => () => groups.forEach((group) => group.geometry.dispose()), [groups])

  return (
    <group>
      {groups.map((group) => (
        <KeyGroup key={group.id} geometry={group.geometry} material={material} items={group.items} />
      ))}
      {legendTexture ? (
        <mesh
          geometry={legendGeometry}
          material={legendMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, KEY_HEIGHT / 2 + 0.006, 0]}
          renderOrder={2}
        />
      ) : null}
    </group>
  )
}

interface KeyGroupProps {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  items: Array<{ x: number; z: number }>
}

function KeyGroup({ geometry, material, items }: KeyGroupProps) {
  const ref = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const matrix = new THREE.Matrix4()
    items.forEach((item, index) => {
      matrix.makeTranslation(item.x, 0, item.z)
      mesh.setMatrixAt(index, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [items])

  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow receiveShadow />
}
