import * as THREE from 'three'

let grilleTexture: THREE.CanvasTexture | null = null
let brushedTexture: THREE.CanvasTexture | null = null
let radialFadeTexture: THREE.CanvasTexture | null = null
let glareTexture: THREE.CanvasTexture | null = null

export function getSpeakerGrilleTexture() {
  if (grilleTexture) return grilleTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#ffffff'
    const step = 16
    for (let y = step / 2; y < size; y += step) {
      const offset = (Math.round(y / step) % 2) * (step / 2)
      for (let x = step / 2 + offset; x < size; x += step) {
        ctx.beginPath()
        ctx.arc(x, y, 3.1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  grilleTexture = new THREE.CanvasTexture(canvas)
  grilleTexture.wrapS = THREE.RepeatWrapping
  grilleTexture.wrapT = THREE.RepeatWrapping
  grilleTexture.repeat.set(2, 8)
  return grilleTexture
}

export function getBrushedRoughnessTexture() {
  if (brushedTexture) return brushedTexture
  const width = 512
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const image = ctx.createImageData(width, height)
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4
        const streak = Math.sin(x * 0.9 + Math.sin(y * 0.05) * 3) * 4
        const grain = (Math.random() - 0.5) * 10
        const value = 240 + streak + grain
        image.data[index] = value
        image.data[index + 1] = value
        image.data[index + 2] = value
        image.data[index + 3] = 255
      }
    }
    ctx.putImageData(image, 0, 0)
  }
  brushedTexture = new THREE.CanvasTexture(canvas)
  brushedTexture.wrapS = THREE.RepeatWrapping
  brushedTexture.wrapT = THREE.RepeatWrapping
  brushedTexture.repeat.set(4, 4)
  return brushedTexture
}

export function getRadialFadeTexture() {
  if (radialFadeTexture) return radialFadeTexture
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  radialFadeTexture = new THREE.CanvasTexture(canvas)
  return radialFadeTexture
}

export function getScreenGlareTexture() {
  if (glareTexture) return glareTexture
  const width = 512
  const height = 320
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(width * 0.34, height * 0.5)
    ctx.rotate(-0.62)
    const band = ctx.createLinearGradient(-width * 0.5, 0, width * 0.5, 0)
    band.addColorStop(0, 'rgba(255,255,255,0)')
    band.addColorStop(0.38, 'rgba(255,255,255,0.5)')
    band.addColorStop(0.52, 'rgba(255,255,255,0.72)')
    band.addColorStop(0.66, 'rgba(255,255,255,0.32)')
    band.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = band
    ctx.fillRect(-width * 0.5, -height * 0.42, width, height * 0.5)
    ctx.restore()

    const fade = ctx.createLinearGradient(0, 0, 0, height)
    fade.addColorStop(0, 'rgba(255,255,255,1)')
    fade.addColorStop(0.75, 'rgba(255,255,255,0.15)')
    fade.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = fade
    ctx.fillRect(0, 0, width, height)
  }
  glareTexture = new THREE.CanvasTexture(canvas)
  glareTexture.colorSpace = THREE.SRGBColorSpace
  return glareTexture
}

export function disposeProceduralTextures() {
  grilleTexture?.dispose()
  brushedTexture?.dispose()
  radialFadeTexture?.dispose()
  glareTexture?.dispose()
  grilleTexture = null
  brushedTexture = null
  radialFadeTexture = null
  glareTexture = null
}
