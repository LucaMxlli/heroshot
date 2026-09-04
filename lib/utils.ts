export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function damp(current: number, target: number, lambda: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta))
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function isHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

export function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
}

export function hexToRgb(hex: string): [number, number, number] {
  let value = hex.replace('#', '').trim()
  if (value.length === 3) value = value.split('').map((c) => c + c).join('')
  const int = parseInt(value, 16)
  if (Number.isNaN(int)) return [0, 0, 0]
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}
