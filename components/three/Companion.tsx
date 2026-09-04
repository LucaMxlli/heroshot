'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Phone } from '@/components/three/Phone'
import { Watch } from '@/components/three/Watch'
import { useEditorStore } from '@/hooks/useEditorStore'
import {
  markCompanionDrag,
  registerCompanionHitTest,
  setCompanionHovered,
} from '@/lib/dragTarget'

export function Companion() {
  const companion = useEditorStore((state) => state.doc.companion)
  const group = useRef<THREE.Group>(null)
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    if (companion.kind === 'none') return undefined
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    return registerCompanionHitTest((clientX, clientY) => {
      const node = group.current
      if (!node) return false
      const rect = gl.domElement.getBoundingClientRect()
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObject(node, true).length > 0
    })
  }, [camera, gl, companion.kind])

  if (companion.kind === 'none') return null

  return (
    <group
      ref={group}
      onPointerDown={(event) => {
        event.stopPropagation()
        markCompanionDrag()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setCompanionHovered(true)
      }}
      onPointerOut={() => setCompanionHovered(false)}
      position={[companion.offsetX, companion.offsetY, companion.offsetZ]}
      rotation={[
        (companion.rotationX * Math.PI) / 180,
        (companion.rotationY * Math.PI) / 180,
        (companion.rotationZ * Math.PI) / 180,
      ]}
      scale={companion.scale}
    >
      {companion.kind === 'phone' ? <Phone slot="companion" forcePortrait /> : <Watch slot="companion" />}
    </group>
  )
}
