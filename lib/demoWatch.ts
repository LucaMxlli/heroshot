const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif'

function ring(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  thickness: number,
  progress: number,
  color: string,
) {
  ctx.lineCap = 'round'
  ctx.lineWidth = thickness
  ctx.strokeStyle = 'rgba(255,255,255,0.13)'
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress)
  ctx.stroke()
}

export function drawDemoWatch(canvas: HTMLCanvasElement, width: number, aspect: number) {
  const height = Math.round(width / aspect)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const S = width / 396
  ctx.save()
  ctx.scale(S, S)
  const W = 396
  const H = Math.round(height / S)

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, H)

  const glow = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.75)
  glow.addColorStop(0, 'rgba(59,130,246,0.16)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = '#f97316'
  ctx.font = `600 26px ${FONT}`
  ctx.textAlign = 'left'
  ctx.fillText('Mon 4', 28, 52)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'right'
  ctx.font = `600 30px ${FONT}`
  ctx.fillText('9:41', W - 28, 52)

  const cx = W * 0.5
  const cy = H * 0.44
  ring(ctx, cx, cy, 92, 26, 0.82, '#fa2b56')
  ring(ctx, cx, cy, 62, 26, 0.66, '#a3e635')
  ring(ctx, cx, cy, 32, 26, 0.94, '#22d3ee')

  const stats: Array<[string, string, string]> = [
    ['MOVE', '482/580 KCAL', '#fa2b56'],
    ['EXERCISE', '20/30 MIN', '#a3e635'],
    ['STAND', '11/12 HR', '#22d3ee'],
  ]
  stats.forEach(([label, value, color], index) => {
    const y = H - 132 + index * 42
    ctx.textAlign = 'left'
    ctx.fillStyle = color
    ctx.font = `700 17px ${FONT}`
    ctx.fillText(label, 30, y)
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 19px ${FONT}`
    ctx.textAlign = 'right'
    ctx.fillText(value, W - 30, y)
  })

  ctx.restore()
}
