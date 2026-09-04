'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useEditorStore } from '@/hooks/useEditorStore'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uFrom;
  uniform vec3 uTo;
  uniform float uAngle;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    float s = sin(uAngle);
    float c = cos(uAngle);
    vec2 dir = vec2(s, c);
    vec2 p = (vUv - 0.5) * uResolution;
    float len = abs(uResolution.x * s) + abs(uResolution.y * c);
    float t = clamp(dot(p, dir) / max(len, 0.0001) + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(mix(uFrom, uTo, t), 1.0);
    #include <colorspace_fragment>
  }
`

export function BackgroundQuad() {
  const background = useEditorStore((state) => state.doc.background)
  const mesh = useRef<THREE.Mesh>(null)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uFrom: { value: new THREE.Color('#ffffff') },
          uTo: { value: new THREE.Color('#ffffff') },
          uAngle: { value: 0 },
          uResolution: { value: new THREE.Vector2(1920, 1080) },
        },
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    if (background.mode === 'solid') {
      material.uniforms.uFrom.value.set(background.color)
      material.uniforms.uTo.value.set(background.color)
      material.uniforms.uAngle.value = 0
    } else {
      material.uniforms.uFrom.value.set(background.gradientFrom)
      material.uniforms.uTo.value.set(background.gradientTo)
      material.uniforms.uAngle.value = (background.gradientAngle * Math.PI) / 180
    }
  }, [material, background])

  if (background.mode === 'transparent') return null

  return (
    <mesh
      ref={mesh}
      material={material}
      renderOrder={-1000}
      frustumCulled={false}
      onBeforeRender={(renderer) => {
        const size = renderer.getDrawingBufferSize(new THREE.Vector2())
        material.uniforms.uResolution.value.set(size.x, size.y)
      }}
    >
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}
