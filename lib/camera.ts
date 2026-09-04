import type * as THREE from 'three'

export const CAMERA_FOV = 26
export const REFERENCE_ASPECT = 16 / 9

export function applyCameraFraming(
  camera: THREE.PerspectiveCamera,
  distance: number,
  aspect: number,
) {
  const fit = Math.max(1, REFERENCE_ASPECT / Math.max(aspect, 0.0001))
  const dolly = distance * fit
  camera.position.set(0, dolly * 0.135, dolly * 0.99)
  camera.lookAt(0, 0, 0)
  camera.aspect = aspect
  camera.fov = CAMERA_FOV
  camera.near = 0.5
  camera.far = 600
  camera.updateProjectionMatrix()
}
