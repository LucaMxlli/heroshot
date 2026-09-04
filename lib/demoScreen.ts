import {
  ACCENT,
  FAINT,
  GREEN,
  ROSE,
  INK,
  LINE,
  MUTED,
  SIDEBAR,
  SURFACE,
  CANVAS_BG,
  areaChart,
  avatar,
  card,
  donut,
  iconGlyph,
  pill,
  roundRect,
  sparkline,
  text,
} from '@/lib/canvasKit'

function drawWallpaper(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const sky = ctx.createLinearGradient(0, 0, W, H)
  sky.addColorStop(0, '#1b1f4b')
  sky.addColorStop(0.45, '#4c2a83')
  sky.addColorStop(1, '#0d1030')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, H)

  const blobs: Array<[number, number, number, string]> = [
    [W * 0.22, H * 0.24, W * 0.34, 'rgba(99,102,241,0.5)'],
    [W * 0.78, H * 0.18, W * 0.28, 'rgba(236,72,153,0.36)'],
    [W * 0.62, H * 0.86, W * 0.4, 'rgba(14,165,233,0.32)'],
  ]
  blobs.forEach(([x, y, r, color]) => {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r)
    glow.addColorStop(0, color)
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
  })
}

function drawMenuBar(ctx: CanvasRenderingContext2D, W: number, height: number) {
  ctx.fillStyle = 'rgba(20,20,26,0.55)'
  ctx.fillRect(0, 0, W, height)

  const mid = height / 2 + 4.5
  const mark = ctx.createLinearGradient(18, 6, 32, 20)
  mark.addColorStop(0, '#a5b4fc')
  mark.addColorStop(1, '#f0abfc')
  ctx.fillStyle = mark
  roundRect(ctx, 18, height / 2 - 7, 14, 14, 4)
  ctx.fill()

  text(ctx, 'Northwind', 44, mid, 13, 'rgba(255,255,255,0.96)', 700)
  let x = 118
  ;['File', 'Edit', 'View', 'Insert', 'Window', 'Help'].forEach((item) => {
    text(ctx, item, x, mid, 13, 'rgba(255,255,255,0.82)', 500)
    x += ctx.measureText(item).width + 26
  })

  const right = W - 22
  text(ctx, 'Wed 4 Sep  9:41', right, mid, 13, 'rgba(255,255,255,0.9)', 500, 'right')

  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 1.6
  ctx.lineCap = 'round'
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath()
    ctx.arc(right - 128, height / 2 + 4, 3.5 + i * 3.4, -Math.PI * 0.78, -Math.PI * 0.22)
    ctx.stroke()
  }
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 1.2
  roundRect(ctx, right - 176, height / 2 - 5.5, 22, 11, 3.2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  roundRect(ctx, right - 174, height / 2 - 3.5, 16, 7, 2.2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  roundRect(ctx, right - 100, height / 2 - 6, 13, 5.5, 2.6)
  ctx.fill()
  roundRect(ctx, right - 100, height / 2 + 0.5, 13, 5.5, 2.6)
  ctx.fill()
}

function drawTrafficLights(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const colors = ['#ff5f57', '#febc2e', '#28c840']
  colors.forEach((color, index) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + index * 20, y, 6.5, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawDock(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const icons: Array<[string, string]> = [
    ['#3b82f6', '#1d4ed8'],
    ['#22c55e', '#15803d'],
    ['#f59e0b', '#d97706'],
    ['#ec4899', '#be185d'],
    ['#8b5cf6', '#6d28d9'],
    ['#06b6d4', '#0e7490'],
    ['#ef4444', '#b91c1c'],
    ['#64748b', '#334155'],
  ]
  const size = 54
  const gap = 12
  const padding = 12
  const innerWidth = icons.length * size + (icons.length - 1) * gap + 30
  const dockW = innerWidth + padding * 2
  const dockH = size + padding * 2
  const x = (W - dockW) / 2
  const y = H - dockH - 14

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 26
  ctx.shadowOffsetY = 8
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  roundRect(ctx, x, y, dockW, dockH, 22)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  roundRect(ctx, x + 0.5, y + 0.5, dockW - 1, dockH - 1, 22)
  ctx.stroke()

  icons.forEach(([from, to], index) => {
    const ix = x + padding + index * (size + gap)
    const iy = y + padding
    const gradient = ctx.createLinearGradient(ix, iy, ix, iy + size)
    gradient.addColorStop(0, from)
    gradient.addColorStop(1, to)
    ctx.fillStyle = gradient
    roundRect(ctx, ix, iy, size, size, 13)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    iconGlyph(ctx, ix + size / 2 - 12, iy + size / 2 - 12, 24, 'rgba(255,255,255,0.92)', index)
  })

  const dividerX = x + padding + icons.length * (size + gap) - gap + 15
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.moveTo(dividerX, y + 14)
  ctx.lineTo(dividerX, y + dockH - 14)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.arc(x + padding + 3 * (size + gap) + size / 2, y + dockH + 6, 2.4, 0, Math.PI * 2)
  ctx.fill()
}

function drawWorkspace(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = CANVAS_BG
  ctx.fillRect(0, 0, W, H)

  const sidebarW = 246
  ctx.fillStyle = SIDEBAR
  ctx.fillRect(0, 0, sidebarW, H)

  const logoGradient = ctx.createLinearGradient(28, 30, 62, 64)
  logoGradient.addColorStop(0, '#6366f1')
  logoGradient.addColorStop(1, '#a855f7')
  ctx.fillStyle = logoGradient
  roundRect(ctx, 28, 30, 34, 34, 10)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2.6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(37, 54)
  ctx.lineTo(37, 45)
  ctx.moveTo(45, 54)
  ctx.lineTo(45, 40)
  ctx.moveTo(53, 54)
  ctx.lineTo(53, 47)
  ctx.stroke()
  text(ctx, 'Northwind', 74, 53, 18, '#ffffff', 700)

  const navItems = ['Overview', 'Analytics', 'Customers', 'Invoices', 'Products', 'Automations']
  navItems.forEach((label, index) => {
    const y = 112 + index * 46
    const active = index === 0
    if (active) {
      ctx.fillStyle = 'rgba(255,255,255,0.09)'
      roundRect(ctx, 18, y - 22, sidebarW - 36, 38, 10)
      ctx.fill()
      ctx.fillStyle = ACCENT
      roundRect(ctx, 18, y - 14, 3, 22, 2)
      ctx.fill()
    }
    iconGlyph(ctx, 36, y - 12, 16, active ? '#ffffff' : 'rgba(255,255,255,0.42)', index)
    text(ctx, label, 68, y + 4, 14.5, active ? '#ffffff' : 'rgba(255,255,255,0.55)', active ? 600 : 500)
  })

  text(ctx, 'WORKSPACE', 36, 424, 11, 'rgba(255,255,255,0.32)', 700)
  const spaces: Array<[string, string]> = [
    ['#22d3ee', 'Product'],
    ['#f472b6', 'Growth'],
    ['#facc15', 'Finance'],
  ]
  spaces.forEach(([color, label], index) => {
    const y = 456 + index * 38
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(42, y - 4, 5, 0, Math.PI * 2)
    ctx.fill()
    text(ctx, label, 68, y, 14, 'rgba(255,255,255,0.55)', 500)
  })

  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  roundRect(ctx, 18, H - 84, sidebarW - 36, 60, 12)
  ctx.fill()
  avatar(ctx, 48, H - 54, 17, '#34d399', '#0ea5e9', 'AM')
  text(ctx, 'Amara Mensah', 76, H - 58, 13.5, '#ffffff', 600)
  text(ctx, 'Admin', 76, H - 41, 12, 'rgba(255,255,255,0.45)', 500)

  const contentX = sidebarW
  const contentW = W - sidebarW
  const topbarH = 78
  ctx.fillStyle = SURFACE
  ctx.fillRect(contentX, 0, contentW, topbarH)
  ctx.strokeStyle = LINE
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(contentX, topbarH + 0.5)
  ctx.lineTo(W, topbarH + 0.5)
  ctx.stroke()

  text(ctx, 'Overview', contentX + 36, 44, 24, INK, 700)
  text(ctx, 'Last 30 days', contentX + 36, 64, 13, FAINT, 500)

  ctx.fillStyle = '#f1f3f7'
  roundRect(ctx, W - 470, 22, 250, 36, 18)
  ctx.fill()
  ctx.strokeStyle = '#e3e7ee'
  ctx.stroke()
  ctx.strokeStyle = FAINT
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(W - 447, 39, 6, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(W - 442, 44)
  ctx.lineTo(W - 437, 49)
  ctx.stroke()
  text(ctx, 'Search or jump to', W - 425, 45, 13.5, FAINT, 500)
  text(ctx, '⌘K', W - 250, 45, 12, '#b6bdca', 600)

  ctx.fillStyle = ACCENT
  roundRect(ctx, W - 200, 22, 96, 36, 10)
  ctx.fill()
  text(ctx, 'Export', W - 152, 45, 13.5, '#ffffff', 600, 'center')
  avatar(ctx, W - 62, 40, 18, '#818cf8', '#6366f1', 'LK')

  const pad = 36
  const kpiY = topbarH + 30
  const kpiH = 128
  const gap = 20
  const kpiW = (contentW - pad * 2 - gap * 3) / 4
  const kpis: Array<[string, string, string, boolean, number[]]> = [
    ['Monthly revenue', '$248,391', '+18.2%', true, [12, 18, 15, 24, 22, 31, 28, 38]],
    ['Active customers', '4,912', '+6.4%', true, [20, 22, 21, 26, 29, 28, 33, 36]],
    ['Avg. order value', '$182.40', '+2.1%', true, [14, 16, 15, 17, 19, 18, 21, 23]],
    ['Churn rate', '1.8%', '-0.4%', false, [22, 20, 21, 18, 17, 15, 14, 12]],
  ]
  kpis.forEach(([label, value, delta, positive, series], index) => {
    const x = contentX + pad + index * (kpiW + gap)
    card(ctx, x, kpiY, kpiW, kpiH)
    text(ctx, label, x + 22, kpiY + 32, 13, MUTED, 500)
    text(ctx, value, x + 22, kpiY + 72, 28, INK, 700)
    pill(
      ctx,
      delta,
      x + 22,
      kpiY + 88,
      positive ? '#047857' : '#be123c',
      positive ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
      12,
    )
    sparkline(ctx, series, x + kpiW - 108, kpiY + 74, 86, 30, positive ? GREEN : ROSE)
  })

  const midY = kpiY + kpiH + 22
  const tableMinH = 190
  const midH = Math.max(220, Math.min(322, H - midY - 22 - tableMinH - 30))
  const chartW = contentW - pad * 2 - 372
  card(ctx, contentX + pad, midY, chartW, midH)
  text(ctx, 'Revenue', contentX + pad + 24, midY + 36, 16.5, INK, 700)
  text(ctx, 'Gross volume across all channels', contentX + pad + 24, midY + 58, 12.5, FAINT, 500)

  const legend: Array<[string, string]> = [
    [ACCENT, 'This year'],
    ['#c7d2fe', 'Last year'],
  ]
  let legendX = contentX + pad + chartW - 220
  legend.forEach(([color, label]) => {
    ctx.fillStyle = color
    roundRect(ctx, legendX, midY + 27, 10, 10, 3)
    ctx.fill()
    text(ctx, label, legendX + 17, midY + 36, 12.5, MUTED, 500)
    legendX += 105
  })

  const plotX = contentX + pad + 62
  const plotY = midY + 82
  const plotW = chartW - 92
  const plotH = 180
  ctx.strokeStyle = '#eef1f6'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i += 1) {
    const gy = plotY + (plotH / 4) * i
    ctx.beginPath()
    ctx.moveTo(plotX, gy + 0.5)
    ctx.lineTo(plotX + plotW, gy + 0.5)
    ctx.stroke()
    text(ctx, `${(200 - i * 50).toString()}k`, plotX - 14, gy + 4, 11.5, '#a9b1c1', 500, 'right')
  }

  const previous = [58, 64, 61, 72, 70, 79, 84, 82, 90, 96, 101, 108]
  const current = [72, 88, 81, 104, 118, 112, 136, 148, 141, 163, 178, 194]
  areaChart(ctx, plotX, plotY, plotW, plotH, previous, '#c7d2fe', 'rgba(199,210,254,0.35)', 'rgba(199,210,254,0)')
  areaChart(ctx, plotX, plotY, plotW, plotH, current, ACCENT, 'rgba(79,70,229,0.22)', 'rgba(79,70,229,0)')

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  months.forEach((month, index) => {
    const mx = plotX + (index / (months.length - 1)) * plotW
    text(ctx, month, mx, plotY + plotH + 26, 11.5, '#a9b1c1', 500, 'center')
  })

  const sideX = contentX + pad + chartW + 20
  const sideW = contentW - pad * 2 - chartW - 20
  card(ctx, sideX, midY, sideW, midH)
  text(ctx, 'Traffic sources', sideX + 24, midY + 36, 16.5, INK, 700)
  const segments = [
    { value: 42, color: ACCENT, label: 'Organic search' },
    { value: 26, color: '#8b5cf6', label: 'Direct' },
    { value: 18, color: '#22d3ee', label: 'Referral' },
    { value: 14, color: '#fbbf24', label: 'Paid social' },
  ]
  donut(ctx, sideX + sideW / 2, midY + 128, 62, 22, segments)
  text(ctx, '128k', sideX + sideW / 2, midY + 128, 26, INK, 700, 'center')
  text(ctx, 'sessions', sideX + sideW / 2, midY + 148, 12, FAINT, 500, 'center')
  segments.forEach((segment, index) => {
    const y = midY + 214 + index * 26
    ctx.fillStyle = segment.color
    roundRect(ctx, sideX + 24, y - 9, 10, 10, 3)
    ctx.fill()
    text(ctx, segment.label, sideX + 42, y, 12.5, MUTED, 500)
    text(ctx, `${segment.value}%`, sideX + sideW - 24, y, 12.5, INK, 600, 'right')
  })

  const tableY = midY + midH + 22
  const tableH = Math.max(tableMinH, H - tableY - 30)
  card(ctx, contentX + pad, tableY, contentW - pad * 2, tableH)
  text(ctx, 'Recent orders', contentX + pad + 24, tableY + 36, 16.5, INK, 700)
  text(ctx, 'View all', contentX + contentW - pad - 24, tableY + 36, 13, ACCENT, 600, 'right')

  const rows: Array<[string, string, string, string, string, string]> = [
    ['NW-4821', 'Amara Mensah', 'Pro annual', 'Paid', '$1,290.00', '#10b981'],
    ['NW-4820', 'Tobias Lang', 'Team monthly', 'Pending', '$418.00', '#f59e0b'],
    ['NW-4819', 'Sofia Marchetti', 'Pro monthly', 'Paid', '$129.00', '#10b981'],
    ['NW-4818', 'Ravi Deshmukh', 'Enterprise', 'Refunded', '$4,800.00', '#f43f5e'],
  ]
  const colX = [
    contentX + pad + 24,
    contentX + pad + 170,
    contentX + pad + 470,
    contentX + pad + 700,
    contentX + contentW - pad - 24,
  ]
  const headerY = tableY + 74
  text(ctx, 'ORDER', colX[0], headerY, 11, FAINT, 700)
  text(ctx, 'CUSTOMER', colX[1], headerY, 11, FAINT, 700)
  text(ctx, 'PLAN', colX[2], headerY, 11, FAINT, 700)
  text(ctx, 'STATUS', colX[3], headerY, 11, FAINT, 700)
  text(ctx, 'AMOUNT', colX[4], headerY, 11, FAINT, 700, 'right')

  const rowH = Math.max(30, Math.min(48, (tableH - 96) / rows.length))
  rows.forEach(([id, name, plan, status, amount, color], index) => {
    const y = headerY + 24 + index * rowH
    ctx.strokeStyle = '#f1f3f7'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(contentX + pad + 24, y - 12.5)
    ctx.lineTo(contentX + contentW - pad - 24, y - 12.5)
    ctx.stroke()
    const cy = y + rowH / 2 - 16
    text(ctx, id, colX[0], cy + 5, 13, MUTED, 500)
    avatar(ctx, colX[1] + 13, cy, 13, '#a5b4fc', '#6366f1', name.slice(0, 1))
    text(ctx, name, colX[1] + 34, cy + 5, 13.5, INK, 600)
    text(ctx, plan, colX[2], cy + 5, 13, MUTED, 500)
    pill(ctx, status, colX[3], cy - 11, color, `${color}1f`, 11.5)
    text(ctx, amount, colX[4], cy + 5, 13.5, INK, 600, 'right')
  })

}

export function drawDemoDashboard(canvas: HTMLCanvasElement, width: number, aspect: number) {
  const height = Math.round(width / aspect)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const S = width / 1600
  ctx.save()
  ctx.scale(S, S)
  const W = 1600
  const H = Math.round(height / S)

  drawWallpaper(ctx, W, H)

  const menuHeight = 40
  drawMenuBar(ctx, W, menuHeight)

  const windowX = 46
  const windowY = menuHeight + 14
  const windowW = W - windowX * 2
  const windowH = H - windowY - 108

  ctx.save()
  ctx.shadowColor = 'rgba(4,6,20,0.55)'
  ctx.shadowBlur = 46
  ctx.shadowOffsetY = 18
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, windowX, windowY, windowW, windowH, 15)
  ctx.fill()
  ctx.restore()

  ctx.save()
  roundRect(ctx, windowX, windowY, windowW, windowH, 15)
  ctx.clip()
  ctx.translate(windowX, windowY)
  drawWorkspace(ctx, windowW, windowH)
  ctx.restore()

  drawTrafficLights(ctx, windowX + 22, windowY + 22)
  drawDock(ctx, W, H)

  ctx.restore()
}
