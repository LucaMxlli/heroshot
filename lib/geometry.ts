import * as THREE from 'three'

export function roundedRectShape(width: number, height: number, radius: number) {
  const w = width / 2
  const h = height / 2
  const r = Math.max(0.0001, Math.min(radius, w, h))
  const shape = new THREE.Shape()
  shape.moveTo(-w + r, -h)
  shape.lineTo(w - r, -h)
  shape.absarc(w - r, -h + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(w, h - r)
  shape.absarc(w - r, h - r, r, 0, Math.PI / 2, false)
  shape.lineTo(-w + r, h)
  shape.absarc(-w + r, h - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(-w, -h + r)
  shape.absarc(-w + r, -h + r, r, Math.PI, Math.PI * 1.5, false)
  return shape
}

export function roundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  bevel = 0.06,
  curveSegments = 10,
) {
  const b = Math.max(0, Math.min(bevel, depth / 2 - 0.001, radius * 0.9))
  const shape = roundedRectShape(width, height, radius)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - b * 2,
    bevelEnabled: b > 0,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: 0,
    bevelSegments: 3,
    curveSegments,
    steps: 1,
  })
  geometry.translate(0, 0, -(depth - b * 2) / 2)
  geometry.computeVertexNormals()
  return geometry
}

export function roundedSlabGeometry(
  width: number,
  depth: number,
  thickness: number,
  radius: number,
  bevel = 0.06,
  curveSegments = 10,
) {
  const geometry = roundedBoxGeometry(width, depth, thickness, radius, bevel, curveSegments)
  geometry.rotateX(-Math.PI / 2)
  geometry.computeVertexNormals()
  return geometry
}

export function roundedPlaneGeometry(width: number, height: number, radius: number, curveSegments = 12) {
  const shape = roundedRectShape(width, height, radius)
  const geometry = new THREE.ShapeGeometry(shape, curveSegments)
  const position = geometry.attributes.position
  const uv = new Float32Array(position.count * 2)
  for (let i = 0; i < position.count; i += 1) {
    uv[i * 2] = position.getX(i) / width + 0.5
    uv[i * 2 + 1] = position.getY(i) / height + 0.5
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geometry.computeVertexNormals()
  return geometry
}

export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (!material) return
    const list = Array.isArray(material) ? material : [material]
    list.forEach((entry) => {
      Object.values(entry).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose()
      })
      entry.dispose()
    })
  })
}
