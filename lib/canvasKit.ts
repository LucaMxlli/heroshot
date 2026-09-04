export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif'

export const INK = '#0f172a'
export const MUTED = '#64748b'
export const FAINT = '#94a3b8'
export const LINE = '#e5e8ef'
export const SURFACE = '#ffffff'
export const CANVAS_BG = '#f6f7fa'
export const SIDEBAR = '#0f1420'
export const ACCENT = '#4f46e5'
export const GREEN = '#10b981'
export const AMBER = '#f59e0b'
export const ROSE = '#f43f5e'

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (!(w > 0) || !(h > 0)) {
    ctx.beginPath()
    return
  }
  const radius = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.arcTo(x + w, y, x + w, y + radius, radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
  ctx.lineTo(x + radius, y + h)
  ctx.arcTo(x, y + h, x, y + h - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
}

export function card(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 16) {
  if (!(w > 0) || !(h > 0)) return
  ctx.save()
  ctx.shadowColor = 'rgba(15, 23, 42, 0.06)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetY = 4
  ctx.fillStyle = SURFACE
  roundRect(ctx, x, y, w, h, r)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = LINE
  ctx.lineWidth = 1
  roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r)
  ctx.stroke()
}

export function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 500,
  align: CanvasTextAlign = 'left',
) {
  ctx.fillStyle = color
  ctx.font = `${weight} ${size}px ${FONT}`
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(value, x, y)
}

export function pill(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  color: string,
  bg: string,
  size = 13,
) {
  ctx.font = `600 ${size}px ${FONT}`
  const w = ctx.measureText(label).width + size * 1.8
  const h = size * 2
  ctx.fillStyle = bg
  roundRect(ctx, x, y, w, h, h / 2)
  ctx.fill()
  text(ctx, label, x + w / 2, y + h / 2 + size * 0.36, size, color, 600, 'center')
  return w
}

export function iconGlyph(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, seed: number) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = Math.max(1.4, size * 0.11)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const s = size
  switch (seed % 6) {
    case 0:
      ctx.strokeRect(x, y, s * 0.42, s * 0.42)
      ctx.strokeRect(x + s * 0.56, y, s * 0.42, s * 0.42)
      ctx.strokeRect(x, y + s * 0.56, s * 0.42, s * 0.42)
      ctx.strokeRect(x + s * 0.56, y + s * 0.56, s * 0.42, s * 0.42)
      break
    case 1:
      ctx.beginPath()
      ctx.moveTo(x, y + s)
      ctx.lineTo(x + s * 0.32, y + s * 0.42)
      ctx.lineTo(x + s * 0.62, y + s * 0.66)
      ctx.lineTo(x + s, y)
      ctx.stroke()
      break
    case 2:
      ctx.beginPath()
      ctx.arc(x + s * 0.4, y + s * 0.36, s * 0.28, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y + s)
      ctx.quadraticCurveTo(x + s * 0.4, y + s * 0.6, x + s * 0.86, y + s)
      ctx.stroke()
      break
    case 3:
      roundRect(ctx, x, y + s * 0.12, s, s * 0.76, s * 0.16)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y + s * 0.36)
      ctx.lineTo(x + s, y + s * 0.36)
      ctx.stroke()
      break
    case 4:
      ctx.beginPath()
      ctx.moveTo(x + s * 0.5, y)
      ctx.lineTo(x + s, y + s * 0.28)
      ctx.lineTo(x + s, y + s * 0.72)
      ctx.lineTo(x + s * 0.5, y + s)
      ctx.lineTo(x, y + s * 0.72)
      ctx.lineTo(x, y + s * 0.28)
      ctx.closePath()
      ctx.stroke()
      break
    default:
      ctx.beginPath()
      ctx.arc(x + s * 0.5, y + s * 0.5, s * 0.42, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + s * 0.5, y + s * 0.22)
      ctx.lineTo(x + s * 0.5, y + s * 0.52)
      ctx.lineTo(x + s * 0.74, y + s * 0.66)
      ctx.stroke()
  }
  ctx.restore()
}

export function sparkline(
  ctx: CanvasRenderingContext2D,
  values: number[],
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.2
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  values.forEach((value, index) => {
    const px = x + (index / (values.length - 1)) * w
    const py = y + h - ((value - min) / span) * h
    if (index === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()
  ctx.restore()
}

export function areaChart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  series: number[],
  color: string,
  fillTop: string,
  fillBottom: string,
) {
  const max = Math.max(...series) * 1.12
  const points = series.map((value, index) => ({
    x: x + (index / (series.length - 1)) * w,
    y: y + h - (value / max) * h,
  }))

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const current = points[i]
    const cx = (prev.x + current.x) / 2
    ctx.bezierCurveTo(cx, prev.y, cx, current.y, current.x, current.y)
  }
  const stroke = new Path2D()
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  const gradient = ctx.createLinearGradient(0, y, 0, y + h)
  gradient.addColorStop(0, fillTop)
  gradient.addColorStop(1, fillBottom)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.restore()

  ctx.save()
  stroke.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const current = points[i]
    const cx = (prev.x + current.x) / 2
    stroke.bezierCurveTo(cx, prev.y, cx, current.y, current.x, current.y)
  }
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.stroke(stroke)
  ctx.restore()

  const last = points[points.length - 1]
  ctx.fillStyle = SURFACE
  ctx.beginPath()
  ctx.arc(last.x, last.y, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(last.x, last.y, 4.5, 0, Math.PI * 2)
  ctx.fill()
}

export function donut(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  thickness: number,
  segments: Array<{ value: number; color: string }>,
) {
  const total = segments.reduce((sum, item) => sum + item.value, 0)
  let angle = -Math.PI / 2
  segments.forEach((segment) => {
    const sweep = (segment.value / total) * Math.PI * 2
    ctx.beginPath()
    ctx.strokeStyle = segment.color
    ctx.lineWidth = thickness
    ctx.lineCap = 'butt'
    ctx.arc(cx, cy, radius, angle + 0.02, angle + sweep - 0.02)
    ctx.stroke()
    angle += sweep
  })
}

export function avatar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, from: string, to: string, initials: string) {
  const gradient = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  gradient.addColorStop(0, from)
  gradient.addColorStop(1, to)
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  text(ctx, initials, cx, cy + r * 0.34, r * 0.86, '#ffffff', 700, 'center')
}

