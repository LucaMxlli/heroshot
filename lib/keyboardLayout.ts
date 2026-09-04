export type KeyRole = 'normal' | 'modifier' | 'function' | 'touchid' | 'space' | 'arrow'

export interface KeyDef {
  label: string
  sub?: string
  units: number
  role?: KeyRole
  icon?: string
}

export interface KeyRect {
  x: number
  z: number
  width: number
  depth: number
  label: string
  sub?: string
  role: KeyRole
  icon?: string
  fontScale: number
}

const F = (label: string, icon: string): KeyDef => ({ label, units: 1, role: 'function', icon })
const K = (label: string, sub?: string): KeyDef => ({ label, sub, units: 1, role: 'normal' })
const M = (label: string, units: number): KeyDef => ({ label, units, role: 'modifier' })

const ROWS: KeyDef[][] = [
  [
    { label: 'esc', units: 1.25, role: 'modifier' },
    F('F1', 'brightness-down'),
    F('F2', 'brightness-up'),
    F('F3', 'mission'),
    F('F4', 'search'),
    F('F5', 'mic'),
    F('F6', 'moon'),
    F('F7', 'rewind'),
    F('F8', 'play'),
    F('F9', 'forward'),
    F('F10', 'mute'),
    F('F11', 'volume-down'),
    F('F12', 'volume-up'),
    { label: '', units: 0.75, role: 'touchid' },
  ],
  [
    K('`', '~'),
    K('1', '!'),
    K('2', '@'),
    K('3', '#'),
    K('4', '$'),
    K('5', '%'),
    K('6', '^'),
    K('7', '&'),
    K('8', '*'),
    K('9', '('),
    K('0', ')'),
    K('-', '_'),
    K('=', '+'),
    M('delete', 1),
  ],
  [
    M('tab', 1.5),
    K('Q'),
    K('W'),
    K('E'),
    K('R'),
    K('T'),
    K('Y'),
    K('U'),
    K('I'),
    K('O'),
    K('P'),
    K('['),
    K(']'),
    { label: '\\', units: 0.5, role: 'normal' },
  ],
  [
    M('caps', 1.75),
    K('A'),
    K('S'),
    K('D'),
    K('F'),
    K('G'),
    K('H'),
    K('J'),
    K('K'),
    K('L'),
    K(';'),
    K("'"),
    M('return', 1.25),
  ],
  [
    M('shift', 2.25),
    K('Z'),
    K('X'),
    K('C'),
    K('V'),
    K('B'),
    K('N'),
    K('M'),
    K(','),
    K('.'),
    K('/'),
    M('shift', 1.75),
  ],
  [
    M('fn', 1),
    M('control', 1),
    M('option', 1.25),
    M('command', 1.25),
    { label: '', units: 4.75, role: 'space' },
    M('command', 1.25),
    M('option', 1),
  ],
]

const TOTAL_UNITS = 14
const FUNCTION_ROW_SCALE = 0.6

export function buildKeyboardLayout(width: number, depth: number, gap = 0.24): KeyRect[] {
  const unit = width / TOTAL_UNITS
  const rowUnitTotal = FUNCTION_ROW_SCALE + (ROWS.length - 1)
  const rowPitch = depth / rowUnitTotal
  const keys: KeyRect[] = []

  let cursorZ = -depth / 2

  ROWS.forEach((row, rowIndex) => {
    const rowScale = rowIndex === 0 ? FUNCTION_ROW_SCALE : 1
    const rowHeight = rowPitch * rowScale
    const keyDepth = rowHeight - gap
    const centerZ = cursorZ + rowHeight / 2

    let cursorX = -width / 2
    row.forEach((definition) => {
      const slot = definition.units * unit
      keys.push({
        x: cursorX + slot / 2,
        z: centerZ,
        width: slot - gap,
        depth: keyDepth,
        label: definition.label,
        sub: definition.sub,
        role: definition.role ?? 'normal',
        icon: definition.icon,
        fontScale: rowIndex === 0 ? 0.5 : 1,
      })
      cursorX += slot
    })

    if (rowIndex === ROWS.length - 1) {
      const remaining = width / 2 - cursorX
      const columnWidth = remaining / 3
      const arrowWidth = columnWidth - gap
      const halfDepth = (keyDepth - gap) / 2
      const base = { role: 'arrow' as KeyRole, fontScale: 1 }

      keys.push({ ...base, x: cursorX + columnWidth / 2, z: centerZ, width: arrowWidth, depth: keyDepth, label: '◀' })
      keys.push({
        ...base,
        x: cursorX + columnWidth * 1.5,
        z: centerZ - (halfDepth + gap) / 2,
        width: arrowWidth,
        depth: halfDepth,
        label: '▲',
      })
      keys.push({
        ...base,
        x: cursorX + columnWidth * 1.5,
        z: centerZ + (halfDepth + gap) / 2,
        width: arrowWidth,
        depth: halfDepth,
        label: '▼',
      })
      keys.push({ ...base, x: cursorX + columnWidth * 2.5, z: centerZ, width: arrowWidth, depth: keyDepth, label: '▶' })
    }

    cursorZ += rowHeight
  })

  return keys
}

export function groupKeysBySize(keys: KeyRect[]) {
  const groups = new Map<string, { width: number; depth: number; items: KeyRect[] }>()
  keys.forEach((key) => {
    const id = `${key.width.toFixed(3)}x${key.depth.toFixed(3)}`
    const existing = groups.get(id)
    if (existing) existing.items.push(key)
    else groups.set(id, { width: key.width, depth: key.depth, items: [key] })
  })
  return [...groups.entries()].map(([id, value]) => ({ id, ...value }))
}

export function findTouchIdKey(keys: KeyRect[]) {
  return keys.find((key) => key.role === 'touchid') ?? null
}
