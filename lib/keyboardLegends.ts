import * as THREE from 'three'
import type { KeyRect } from '@/lib/keyboardLayout'

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif'

function drawIcon(ctx: CanvasRenderingContext2D, name: string, cx: number, cy: number, size: number) {
  const s = size
  ctx.save()
  ctx.translate(cx, cy)
  ctx.strokeStyle = ctx.fillStyle
  ctx.lineWidth = Math.max(1, s * 0.09)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const sun = (radius: number, rays: number) => {
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(Math.cos(angle) * (radius + rays * 0.35), Math.sin(angle) * (radius + rays * 0.35))
      ctx.lineTo(Math.cos(angle) * (radius + rays), Math.sin(angle) * (radius + rays))
      ctx.stroke()
    }
  }

  const triangle = (offset: number, scale: number) => {
    ctx.beginPath()
    ctx.moveTo(offset - s * 0.16 * scale, -s * 0.22 * scale)
    ctx.lineTo(offset + s * 0.2 * scale, 0)
    ctx.lineTo(offset - s * 0.16 * scale, s * 0.22 * scale)
    ctx.closePath()
    ctx.fill()
  }

  const speaker = () => {
    ctx.beginPath()
    ctx.moveTo(-s * 0.3, -s * 0.12)
    ctx.lineTo(-s * 0.16, -s * 0.12)
    ctx.lineTo(-s * 0.02, -s * 0.28)
    ctx.lineTo(-s * 0.02, s * 0.28)
    ctx.lineTo(-s * 0.16, s * 0.12)
    ctx.lineTo(-s * 0.3, s * 0.12)
    ctx.closePath()
    ctx.fill()
  }

  switch (name) {
    case 'brightness-down':
      sun(s * 0.16, s * 0.12)
      break
    case 'brightness-up':
      sun(s * 0.16, s * 0.22)
      break
    case 'mission':
      for (let i = 0; i < 3; i += 1) {
        ctx.strokeRect(-s * 0.34 + i * s * 0.25, -s * 0.18, s * 0.18, s * 0.36)
      }
      break
    case 'search':
      ctx.beginPath()
      ctx.arc(-s * 0.05, -s * 0.05, s * 0.2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.1, s * 0.1)
      ctx.lineTo(s * 0.28, s * 0.28)
      ctx.stroke()
      break
    case 'mic':
      ctx.beginPath()
      ctx.roundRect(-s * 0.1, -s * 0.32, s * 0.2, s * 0.36, s * 0.1)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.22, 0.1 * Math.PI, 0.9 * Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, s * 0.22)
      ctx.lineTo(0, s * 0.34)
      ctx.stroke()
      break
    case 'moon':
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.26, Math.PI * 0.35, Math.PI * 1.55)
      ctx.arc(-s * 0.12, 0, s * 0.26, Math.PI * 1.4, Math.PI * 0.45, true)
      ctx.closePath()
      ctx.fill()
      break
    case 'rewind':
      ctx.save()
      ctx.scale(-1, 1)
      triangle(-s * 0.02, 1)
      triangle(s * 0.22, 1)
      ctx.restore()
      break
    case 'play':
      ctx.fillRect(-s * 0.24, -s * 0.22, s * 0.09, s * 0.44)
      triangle(s * 0.02, 1)
      break
    case 'forward':
      triangle(-s * 0.02, 1)
      triangle(s * 0.22, 1)
      break
    case 'mute':
      speaker()
      ctx.beginPath()
      ctx.moveTo(s * 0.1, -s * 0.16)
      ctx.lineTo(s * 0.32, s * 0.16)
      ctx.moveTo(s * 0.32, -s * 0.16)
      ctx.lineTo(s * 0.1, s * 0.16)
      ctx.stroke()
      break
    case 'volume-down':
      speaker()
      ctx.beginPath()
      ctx.arc(s * 0.02, 0, s * 0.2, -Math.PI * 0.32, Math.PI * 0.32)
      ctx.stroke()
      break
    case 'volume-up':
      speaker()
      for (let i = 1; i <= 2; i += 1) {
        ctx.beginPath()
        ctx.arc(s * 0.02, 0, s * 0.16 * i, -Math.PI * 0.32, Math.PI * 0.32)
        ctx.stroke()
      }
      break
    default:
      break
  }
  ctx.restore()
}

export function createKeyboardLegendTexture(keys: KeyRect[], width: number, depth: number) {
  const canvasWidth = 3072
  const canvasHeight = Math.round((canvasWidth * depth) / width)
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const scaleX = canvasWidth / width
  const scaleY = canvasHeight / depth
  const ink = 'rgba(238, 240, 245, 0.94)'

  keys.forEach((key) => {
    const cx = (key.x + width / 2) * scaleX
    const cy = (key.z + depth / 2) * scaleY
    const w = key.width * scaleX
    const h = key.depth * scaleY

    ctx.fillStyle = ink
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if (key.role === 'space') return

    if (key.role === 'touchid') {
      ctx.strokeStyle = 'rgba(210, 214, 222, 0.55)'
      ctx.lineWidth = Math.max(1.5, h * 0.05)
      ctx.beginPath()
      ctx.roundRect(cx - w * 0.22, cy - h * 0.28, w * 0.44, h * 0.56, w * 0.14)
      ctx.stroke()
      return
    }

    if (key.role === 'function') {
      drawIcon(ctx, key.icon ?? '', cx, cy + h * 0.05, h * 0.78)
      ctx.font = `600 ${h * 0.3}px ${FONT}`
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(238, 240, 245, 0.66)'
      ctx.fillText(key.label, cx + w * 0.42, cy - h * 0.3)
      return
    }

    if (key.role === 'arrow') {
      ctx.font = `500 ${h * 0.42}px ${FONT}`
      ctx.fillText(key.label, cx, cy + h * 0.02)
      return
    }

    if (key.role === 'modifier') {
      ctx.font = `500 ${Math.min(h * 0.3, w * 0.26)}px ${FONT}`
      ctx.textAlign = key.label === 'delete' || key.label === 'return' ? 'right' : 'left'
      const x = key.label === 'delete' || key.label === 'return' ? cx + w * 0.36 : cx - w * 0.36
      ctx.fillText(key.label, x, cy + h * 0.28)
      return
    }

    if (key.sub) {
      ctx.font = `500 ${h * 0.3}px ${FONT}`
      ctx.fillText(key.sub, cx, cy - h * 0.18)
      ctx.font = `500 ${h * 0.3}px ${FONT}`
      ctx.fillText(key.label, cx, cy + h * 0.22)
      return
    }

    ctx.font = `500 ${h * 0.36}px ${FONT}`
    ctx.fillText(key.label, cx, cy)
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
