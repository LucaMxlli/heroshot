'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEditorStore } from '@/hooks/useEditorStore'
import { applyCameraFraming } from '@/lib/camera'
import { registerExportRenderer, registerSnapshotHandler } from '@/lib/exportBridge'
import { DEFAULT_DOCUMENT } from '@/lib/defaults'
import { damp } from '@/lib/utils'

export function ExportRig() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const size = useThree((state) => state.size)
  const distance = useRef(DEFAULT_DOCUMENT.scene.cameraDistance)

  useFrame((_, delta) => {
    const target = useEditorStore.getState().doc.scene.cameraDistance
    distance.current = damp(distance.current, target, 11, Math.min(delta, 0.05))
    applyCameraFraming(camera, distance.current, size.width / Math.max(size.height, 1))
  })

  useEffect(
    () =>
      registerSnapshotHandler(() => {
        distance.current = useEditorStore.getState().doc.scene.cameraDistance
        applyCameraFraming(camera, distance.current, size.width / Math.max(size.height, 1))
      }),
    [camera, size.width, size.height],
  )

  useEffect(
    () =>
      registerExportRenderer(async ({ width, height }) => {
        const canvas = gl.domElement
        const maxSize = gl.capabilities.maxTextureSize || 4096
        const targetWidth = Math.max(1, Math.min(Math.round(width), maxSize))
        const targetHeight = Math.max(1, Math.min(Math.round(height), maxSize))

        const previousRatio = gl.getPixelRatio()
        const previousSize = gl.getSize(new THREE.Vector2())
        const cameraDistance = useEditorStore.getState().doc.scene.cameraDistance

        gl.setPixelRatio(1)
        gl.setSize(targetWidth, targetHeight, false)
        applyCameraFraming(camera, cameraDistance, targetWidth / targetHeight)
        gl.render(scene, camera)

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/png'),
        )

        gl.setPixelRatio(previousRatio)
        gl.setSize(previousSize.x, previousSize.y, false)
        applyCameraFraming(
          camera,
          cameraDistance,
          previousSize.x / Math.max(previousSize.y, 1),
        )
        gl.render(scene, camera)

        if (!blob) throw new Error('The browser could not encode the image.')
        return blob
      }),
    [gl, scene, camera],
  )

  return null
}
