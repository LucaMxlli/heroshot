'use client'

import { useEffect } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { BackSide } from 'three'
import { useEditorStore } from '@/hooks/useEditorStore'

export function StudioLighting() {
  const intensity = useEditorStore((state) => state.doc.scene.lightIntensity)
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    scene.environmentIntensity = intensity
  }, [scene, intensity])

  return (
    <>
      <ambientLight intensity={0.22 * intensity} />
      <directionalLight position={[9, 20, 14]} intensity={0.85 * intensity} />
      <directionalLight position={[-11, 7, -6]} intensity={0.42 * intensity} color="#cfd9ff" />

      <Environment resolution={256} frames={1}>
        <mesh scale={90}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#8b9099" side={BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={1.4} position={[0, 13, 13]} scale={[20, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.5} position={[0, 24, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[18, 14, 1]} />
        <Lightformer form="rect" intensity={1.7} position={[-18, 6, 6]} scale={[10, 16, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} position={[18, 4, 6]} scale={[10, 16, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.3} position={[-11, 9, -12]} scale={8} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.5} position={[0, -14, 4]} rotation={[-Math.PI / 2, 0, 0]} scale={[20, 14, 1]} />
      </Environment>
    </>
  )
}
