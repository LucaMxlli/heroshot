'use client'

import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Scene } from '@/components/three/Scene'
import { CAMERA_FOV } from '@/lib/camera'

export default function Viewport() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      }}
      camera={{ fov: CAMERA_FOV, near: 0.5, far: 600, position: [0, 6, 46] }}
      resize={{ debounce: 0, scroll: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.9
        gl.setClearAlpha(0)
      }}
      style={{ touchAction: 'none' }}
    >
      <Scene />
    </Canvas>
  )
}
