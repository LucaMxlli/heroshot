import { ACCENT, FAINT, INK, MUTED, SURFACE, avatar, iconGlyph, pill, roundRect, text } from '@/lib/canvasKit'

function statusBar(ctx: CanvasRenderingContext2D, width: number) {
  text(ctx, '9:41', 30, 34, 15, INK, 700)
  const right = width - 26
  ctx.fillStyle = INK
  for (let i = 0; i < 4; i += 1) {
    const h = 4 + i * 2.6
    roundRect(ctx, right - 74 + i * 6, 32 - h, 3.6, h, 1.4)
    ctx.fill()
  }
  ctx.save()
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath()
    ctx.arc(right - 40, 33, 4 + i * 4.5, -Math.PI * 0.78, -Math.PI * 0.22)
    ctx.stroke()
  }
  ctx.restore()
  ctx.strokeStyle = 'rgba(15,23,42,0.4)'
  ctx.lineWidth = 1.4
  roundRect(ctx, right - 24, 22, 22, 12, 4)
  ctx.stroke()
  ctx.fillStyle = INK
  roundRect(ctx, right - 22, 24, 15, 8, 2.6)
  ctx.fill()
}

function barChart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, values: number[]) {
  const max = Math.max(...values)
  const slot = w / values.length
  const barWidth = slot * 0.44
  values.forEach((value, index) => {
    const barHeight = (value / max) * h
    const bx = x + slot * index + (slot - barWidth) / 2
    const by = y + h - barHeight
    ctx.fillStyle = index === values.length - 2 ? ACCENT : '#e4e7f2'
    roundRect(ctx, bx, by, barWidth, barHeight, barWidth / 2)
    ctx.fill()
  })
}

export function drawDemoMobile(canvas: HTMLCanvasElement, width: number, aspect: number) {
  const height = Math.round(width / aspect)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const S = width / 390
  ctx.save()
  ctx.scale(S, S)
  const W = 390
  const H = Math.round(height / S)

  ctx.fillStyle = '#f6f7fb'
  ctx.fillRect(0, 0, W, H)
  statusBar(ctx, W)

  text(ctx, 'Good morning', 26, 92, 14, MUTED, 500)
  text(ctx, 'Amara', 26, 118, 26, INK, 700)
  avatar(ctx, W - 46, 100, 20, '#818cf8', '#6366f1', 'A')
  ctx.fillStyle = '#f43f5e'
  ctx.beginPath()
  ctx.arc(W - 32, 86, 5, 0, Math.PI * 2)
  ctx.fill()

  const cardX = 22
  const cardW = W - 44
  const gradient = ctx.createLinearGradient(cardX, 144, cardX + cardW, 292)
  gradient.addColorStop(0, '#4f46e5')
  gradient.addColorStop(1, '#7c3aed')
  ctx.save()
  ctx.shadowColor = 'rgba(79,70,229,0.32)'
  ctx.shadowBlur = 26
  ctx.shadowOffsetY = 10
  ctx.fillStyle = gradient
  roundRect(ctx, cardX, 144, cardW, 148, 24)
  ctx.fill()
  ctx.restore()

  text(ctx, 'Total balance', cardX + 24, 180, 13, 'rgba(255,255,255,0.72)', 500)
  text(ctx, '$18,420.65', cardX + 24, 218, 32, '#ffffff', 700)
  pill(ctx, '+12.4% this month', cardX + 24, 236, '#ffffff', 'rgba(255,255,255,0.18)', 11.5)
  text(ctx, '•••• 4821', cardX + cardW - 24, 274, 13, 'rgba(255,255,255,0.7)', 600, 'right')
  ctx.fillStyle = 'rgba(255,255,255,0.16)'
  ctx.beginPath()
  ctx.arc(cardX + cardW - 46, 180, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath()
  ctx.arc(cardX + cardW - 62, 180, 22, 0, Math.PI * 2)
  ctx.fill()

  const actions = ['Send', 'Request', 'Top up', 'More']
  actions.forEach((label, index) => {
    const cx = 46 + index * ((W - 92) / 3)
    ctx.fillStyle = SURFACE
    ctx.beginPath()
    ctx.arc(cx, 336, 25, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#eceff6'
    ctx.lineWidth = 1
    ctx.stroke()
    iconGlyph(ctx, cx - 9, 327, 18, ACCENT, index + 1)
    text(ctx, label, cx, 380, 12, MUTED, 600, 'center')
  })

  ctx.fillStyle = SURFACE
  ctx.strokeStyle = '#eceff6'
  ctx.lineWidth = 1
  roundRect(ctx, 22, 404, W - 44, 172, 22)
  ctx.fill()
  ctx.stroke()
  text(ctx, 'Spending', 44, 438, 16, INK, 700)
  text(ctx, 'This week', W - 44, 438, 12.5, FAINT, 500, 'right')
  text(ctx, '$1,284.20', 44, 470, 22, INK, 700)
  barChart(ctx, 44, 486, W - 88, 62, [38, 52, 30, 61, 44, 72, 26])
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  days.forEach((day, index) => {
    const slot = (W - 88) / 7
    text(ctx, day, 44 + slot * index + slot / 2, 566, 11, FAINT, 500, 'center')
  })

  text(ctx, 'Recent', 26, 618, 17, INK, 700)
  text(ctx, 'See all', W - 26, 618, 13, ACCENT, 600, 'right')

  const rows: Array<[string, string, string, string, string]> = [
    ['Northwind Pro', 'Subscription', '-$24.00', '#6366f1', 'N'],
    ['Kaffee Mitte', 'Food & drink', '-$8.40', '#f59e0b', 'K'],
    ['Payout', 'Stripe transfer', '+$1,940.00', '#10b981', 'S'],
  ]
  rows.forEach(([title, subtitle, amount, color, initial], index) => {
    const y = 648 + index * 62
    ctx.fillStyle = SURFACE
    ctx.strokeStyle = '#eceff6'
    roundRect(ctx, 22, y, W - 44, 54, 16)
    ctx.fill()
    ctx.stroke()
    avatar(ctx, 50, y + 27, 17, color, color, initial)
    text(ctx, title, 78, y + 24, 14, INK, 600)
    text(ctx, subtitle, 78, y + 41, 12, FAINT, 500)
    text(ctx, amount, W - 40, y + 33, 14, amount.startsWith('+') ? '#059669' : INK, 700, 'right')
  })

  const tabY = H - 74
  ctx.fillStyle = SURFACE
  ctx.fillRect(0, tabY, W, 74)
  ctx.strokeStyle = '#eceff6'
  ctx.beginPath()
  ctx.moveTo(0, tabY + 0.5)
  ctx.lineTo(W, tabY + 0.5)
  ctx.stroke()
  const tabs = ['Home', 'Cards', 'Stats', 'Profile']
  tabs.forEach((label, index) => {
    const cx = (W / 4) * index + W / 8
    const active = index === 0
    iconGlyph(ctx, cx - 10, tabY + 18, 20, active ? ACCENT : '#c2c8d6', index)
    text(ctx, label, cx, tabY + 54, 10.5, active ? ACCENT : '#b6bdca', 600, 'center')
  })
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, W / 2 - 62, H - 12, 124, 5, 3)
  ctx.fill()

  ctx.restore()
}
