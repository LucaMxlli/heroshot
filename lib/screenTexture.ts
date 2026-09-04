import * as THREE from 'three'
import { drawDemoDashboard } from '@/lib/demoScreen'
import { drawDemoMobile } from '@/lib/demoMobile'
import { drawDemoWatch } from '@/lib/demoWatch'
import { createId } from '@/lib/utils'
import type { ScreenFit, ScreenSource } from '@/types'

type DecodedImage = HTMLImageElement | ImageBitmap

const imageRegistry = new Map<string, DecodedImage>()
const textureCache = new Map<string, THREE.CanvasTexture>()

export const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const ACCEPTED_EXTENSIONS = '.png,.jpg,.jpeg,.webp'
export const MAX_FILE_SIZE = 25 * 1024 * 1024

export function isAcceptedFile(file: File) {
  if (ACCEPTED_TYPES.includes(file.type)) return true
  return /\.(png|jpe?g|webp)$/i.test(file.name)
}

function loadHtmlImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The image could not be decoded.'))
    image.src = url
  })
}

export async function registerImageFile(file: File): Promise<ScreenSource> {
  if (!isAcceptedFile(file)) throw new Error('Unsupported format. Use PNG, JPG or WEBP.')
  if (file.size > MAX_FILE_SIZE) throw new Error('That file is larger than 25 MB.')

  let decoded: DecodedImage
  if (typeof createImageBitmap === 'function') {
    decoded = await createImageBitmap(file)
  } else {
    const url = URL.createObjectURL(file)
    try {
      decoded = await loadHtmlImage(url)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const id = createId()
  imageRegistry.set(id, decoded)
  return { id, name: file.name, width: decoded.width, height: decoded.height }
}

function averageEdgeColor(image: DecodedImage) {
  const probe = document.createElement('canvas')
  const size = 40
  probe.width = size
  probe.height = size
  const ctx = probe.getContext('2d', { willReadFrequently: true })
  if (!ctx) return '#0b0d12'
  ctx.drawImage(image as CanvasImageSource, 0, 0, size, size)
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, size, size).data
  } catch {
    return '#0b0d12'
  }
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const onEdge = x < 2 || y < 2 || x > size - 3 || y > size - 3
      if (!onEdge) continue
      const index = (y * size + x) * 4
      r += data[index]
      g += data[index + 1]
      b += data[index + 2]
      count += 1
    }
  }
  if (!count) return '#0b0d12'
  return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
}

function buildScreenCanvas(id: string | null, aspect: number, fit: ScreenFit) {
  const canvas = document.createElement('canvas')
  const image = id ? imageRegistry.get(id) : undefined

  if (!image) {
    if (aspect >= 0.7 && aspect < 1) drawDemoWatch(canvas, 792, aspect)
    else if (aspect < 0.7) drawDemoMobile(canvas, 1170, aspect)
    else drawDemoDashboard(canvas, 2304, aspect)
    return canvas
  }

  const width =
    aspect >= 0.7 && aspect < 1
      ? Math.round(Math.min(1200, Math.max(700, image.width)))
      : aspect < 0.7
        ? Math.round(Math.min(1600, Math.max(1000, image.width)))
        : Math.round(Math.min(2880, Math.max(1600, image.width)))
  const height = Math.round(width / aspect)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.fillStyle = averageEdgeColor(image)
  ctx.fillRect(0, 0, width, height)

  const imageAspect = image.width / image.height
  let drawWidth = width
  let drawHeight = width / imageAspect
  const overflows = drawHeight > height
  if (fit === 'contain' ? overflows : !overflows) {
    drawHeight = height
    drawWidth = height * imageAspect
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    image as CanvasImageSource,
    Math.round((width - drawWidth) / 2),
    Math.round((height - drawHeight) / 2),
    Math.round(drawWidth),
    Math.round(drawHeight),
  )
  return canvas
}

export function getScreenTexture(
  id: string | null,
  aspect: number,
  maxAnisotropy = 8,
  fit: ScreenFit = 'contain',
) {
  const key = `${id ?? 'demo'}@${aspect.toFixed(4)}@${fit}`
  const cached = textureCache.get(key)
  if (cached) {
    cached.anisotropy = maxAnisotropy
    cached.needsUpdate = true
    return cached
  }

  const canvas = buildScreenCanvas(id, aspect, fit)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = maxAnisotropy
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true

  if (textureCache.size > 8) {
    const oldestKey = textureCache.keys().next().value
    if (oldestKey) {
      textureCache.get(oldestKey)?.dispose()
      textureCache.delete(oldestKey)
    }
  }

  textureCache.set(key, texture)
  return texture
}

export function disposeScreenTextures() {
  textureCache.forEach((texture) => texture.dispose())
  textureCache.clear()
  imageRegistry.forEach((image) => {
    if ('close' in image) image.close()
  })
  imageRegistry.clear()
}

export function applyScreenTransform(
  texture: THREE.Texture,
  scaleX: number,
  scaleY: number,
  offsetX: number,
  offsetY: number,
) {
  const repeatX = 1 / Math.max(scaleX, 0.05)
  const repeatY = 1 / Math.max(scaleY, 0.05)
  texture.center.set(0.5, 0.5)
  texture.repeat.set(repeatX, repeatY)
  texture.offset.set((1 - repeatX) / 2 - offsetX * repeatX, (1 - repeatY) / 2 + offsetY * repeatY)
  texture.updateMatrix()
}
