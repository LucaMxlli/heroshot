'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useScreenTexture } from '@/hooks/useScreenTexture'
import { applyScreenTransform } from '@/lib/screenTexture'
import { useEditorStore } from '@/hooks/useEditorStore'
import { roundedPlaneGeometry } from '@/lib/geometry'
import { getScreenGlareTexture } from '@/lib/textures'
import type { ScreenSlot } from '@/types'

interface ScreenProps {
  slot?: ScreenSlot
  width: number
  height: number
  radius: number
  rotationZ?: number
  emissiveIntensity?: number
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function Screen({
  slot = 'primary',
  width,
  height,
  radius,
  rotationZ = 0,
  emissiveIntensity = 1,
}: ScreenProps) {
  const aspect = width / height
  const texture = useScreenTexture(aspect, slot)
  const gloss = useEditorStore((state) => state.doc.scene.screenGloss)
  const brightness = useEditorStore((state) => state.doc.scene.screenBrightness)
  const imageScaleX = useEditorStore((state) => state.doc.scene.imageScaleX)
  const imageScaleY = useEditorStore((state) => state.doc.scene.imageScaleY)
  const imageOffsetX = useEditorStore((state) => state.doc.scene.imageOffsetX)
  const imageOffsetY = useEditorStore((state) => state.doc.scene.imageOffsetY)

  const geometry = useMemo(
    () => roundedPlaneGeometry(width, height, radius, 10),
    [width, height, radius],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        emissiveMap: texture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: emissiveIntensity * brightness,
        color: new THREE.Color('#000000'),
        toneMapped: false,
        roughness: lerp(0.62, 0.05, gloss),
        metalness: 0,
        specularIntensity: gloss,
        clearcoat: gloss,
        clearcoatRoughness: lerp(0.7, 0.02, gloss),
        envMapIntensity: gloss * 0.7,
      }),
    [texture, emissiveIntensity, gloss, brightness],
  )
  useEffect(() => {
    applyScreenTransform(texture, imageScaleX, imageScaleY, imageOffsetX, imageOffsetY)
  }, [texture, imageScaleX, imageScaleY, imageOffsetX, imageOffsetY])

  const glare = useMemo(
    () => (typeof document === 'undefined' ? null : getScreenGlareTexture()),
    [],
  )

  const glareMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: glare ?? undefined,
        transparent: true,
        opacity: gloss * 0.26,
        depthWrite: false,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
      }),
    [glare, gloss],
  )

  useEffect(() => () => glareMaterial.dispose(), [glareMaterial])

  useEffect(() => () => material.dispose(), [material])

  return (
    <group rotation={[0, 0, rotationZ]}>
      <mesh geometry={geometry} material={material} />
      {gloss > 0.02 && glare ? (
        <mesh geometry={geometry} material={glareMaterial} position={[0, 0, 0.004]} renderOrder={3} />
      ) : null}
    </group>
  )
}
