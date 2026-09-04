'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { buildKeyboardLayout, groupKeysBySize } from '@/lib/keyboardLayout'
import { createKeyboardLegendTexture } from '@/lib/keyboardLegends'
import { roundedPlaneGeometry, roundedSlabGeometry } from '@/lib/geometry'
import { KEYBOARD_DEPTH, KEYBOARD_WIDTH } from '@/lib/laptopDimensions'

const KEY_HEIGHT = 0.19

interface KeyboardProps {
  keyColor: string
}

export function Keyboard({ keyColor }: KeyboardProps) {
  const keys = useMemo(() => buildKeyboardLayout(KEYBOARD_WIDTH, KEYBOARD_DEPTH), [])

  const groups = useMemo(
    () =>
      groupKeysBySize(keys).map((group) => ({
        ...group,
        geometry: roundedSlabGeometry(group.width, group.depth, KEY_HEIGHT, 0.085, 0.045, 5),
      })),
    [keys],
  )

  const legendGeometry = useMemo(
    () => roundedPlaneGeometry(KEYBOARD_WIDTH, KEYBOARD_DEPTH, 0.2, 4),
    [],
  )

  const legendTexture = useMemo(
    () => (typeof document === 'undefined' ? null : createKeyboardLegendTexture(keys, KEYBOARD_WIDTH, KEYBOARD_DEPTH)),
    [keys],
  )

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(keyColor),
        roughness: 0.55,
        metalness: 0.08,
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
