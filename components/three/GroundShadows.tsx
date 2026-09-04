'use client'

import { useMemo } from 'react'
import { ContactShadows } from '@react-three/drei'
import { useEditorStore } from '@/hooks/useEditorStore'
import { getRadialFadeTexture } from '@/lib/textures'

interface GroundShadowsProps {
  groundY: number
}

export function GroundShadows({ groundY }: GroundShadowsProps) {
  const shadowMode = useEditorStore((state) => state.doc.scene.shadowMode)
  const shadowIntensity = useEditorStore((state) => state.doc.scene.shadowIntensity)
  const floor = useEditorStore((state) => state.doc.scene.floor)
  const background = useEditorStore((state) => state.doc.background)

  const floorColor = background.mode === 'gradient' ? background.gradientTo : background.color
  const floorVisible = floor && background.mode !== 'transparent'
  const fade = useMemo(() => (typeof document === 'undefined' ? null : getRadialFadeTexture()), [])

  return (
    <group position={[0, groundY, 0]}>
      {floorVisible && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[160, 160]} />
          <meshStandardMaterial
            color={floorColor}
            roughness={0.42}
            metalness={0.08}
            transparent
            alphaMap={fade ?? undefined}
            envMapIntensity={0.6}
          />
        </mesh>
      )}

      {shadowMode !== 'off' && (
        <ContactShadows
          key={shadowMode}
          opacity={Math.min(1, shadowIntensity * (shadowMode === 'strong' ? 1.35 : 1))}
          scale={shadowMode === 'strong' ? 62 : 74}
          blur={shadowMode === 'strong' ? 1.35 : 3.1}
          far={shadowMode === 'strong' ? 16 : 22}
          resolution={768}
          color="#0a0d14"
          frames={Infinity}
        />
      )}
    </group>
  )
}
