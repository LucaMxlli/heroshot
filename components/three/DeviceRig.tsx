'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { useEditorStore } from '@/hooks/useEditorStore'
import { registerSnapshotHandler } from '@/lib/exportBridge'
import { damp } from '@/lib/utils'

const DEG = Math.PI / 180
const LAMBDA = 13

export function DeviceRig({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null)

  const apply = (immediate: boolean, delta = 0) => {
    const group = root.current
    if (!group) return
    const { transform } = useEditorStore.getState().doc
    const rx = transform.rotationX * DEG
    const ry = transform.rotationY * DEG
    const rz = transform.rotationZ * DEG

    if (immediate) {
      group.rotation.set(rx, ry, rz)
      group.position.set(transform.positionX, transform.positionY, 0)
      group.scale.setScalar(transform.scale)
      return
    }

    group.rotation.x = damp(group.rotation.x, rx, LAMBDA, delta)
    group.rotation.y = damp(group.rotation.y, ry, LAMBDA, delta)
    group.rotation.z = damp(group.rotation.z, rz, LAMBDA, delta)
    group.position.x = damp(group.position.x, transform.positionX, LAMBDA, delta)
    group.position.y = damp(group.position.y, transform.positionY, LAMBDA, delta)
    group.scale.setScalar(damp(group.scale.x, transform.scale, LAMBDA, delta))
  }

  useEffect(() => {
    apply(true)
    return registerSnapshotHandler(() => apply(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => apply(false, Math.min(delta, 0.05)))

  return <group ref={root}>{children}</group>
}
